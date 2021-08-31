<template>
  <Layout>
    <main class="flex items-center justify-center h-full -ml-16">
      <div v-if="user" class="text-center">
        <p class="mb-2">
          {{ t('logged_in_as', { email: user?.email }) }}
        </p>
        <button @click.prevent="logout" class="btn primary-red">{{ t('logout') }}</button>
      </div>

      <div v-else class="container max-w-lg mx-auto">
        <div class="text-center">
          <h1 class="text-2xl font-bold my-4">{{ t('hi') }} 🥰</h1>

          <button @click.prevent="signInWithGoogle()" class="btn border shadow">
            <span class="flex items-center space-x-1">
              {{ t('sign_up_with') }} <i-logos-google class="google-icon" />
            </span>
          </button>
          <div class="my-4 text-sm uppercase">{{ t('or') }}</div>
        </div>

        <div class="p-6 border shadow-lg rounded">
          <div class="text-center">
            <template v-if="formAct === 'signup'">
              <h3>{{ t('create_an_account') }}</h3>
              <button type="button" @click="setFormAct('login')">{{ t('returning_user') }}</button>
            </template>

            <template v-if="formAct === 'login'">
              <h3>{{ t('hey_welcome_back') }}</h3>
              <button type="button" @click="setFormAct('signup')">{{ t('new_user') }}</button>
            </template>

            <template v-if="formAct === 'reset'">
              <h3>{{ t('reset_password') }}</h3>
              <button type="button" @click="setFormAct('login')">{{ t('back') }}</button>
            </template>
          </div>

          <AlertMessage v-if="error" type="error" :message="error" />

          <form ref="form" @submit.prevent="submitForm" @keydown.enter.prevent>
            <!-- <div v-if="form === 'signup'" class="form-group">
              <label>{{ t('username') }}</label>
              <input type="text" v-model="username" />
              <span class="err" v-if="v$.username.$error">
                {{ v$.username.$errors[0].$message }}
              </span>
            </div> -->

            <div class="form-group">
              <label>{{ t('email') }}</label>
              <input type="email" v-model="email" />
              <span class="err" v-if="v$.email.$error">
                {{ v$.email.$errors[0].$message }}
              </span>
            </div>

            <div v-if="formAct !== 'reset'" class="form-group">
              <label>{{ t('password') }}</label>
              <input type="password" v-model="password" />
              <span class="err" v-if="v$.password.$error">
                {{ v$.password.$errors[0].$message }}
              </span>
            </div>

            <div class="text-center mt-6">
              <button class="btn primary-blue" v-if="formAct === 'reset'" type="submit" :disabled="isLoading">
                {{ t('send_reset_email') }}
              </button>

              <button
                class="btn primary-blue"
                v-if="formAct !== 'reset'"
                type="submit"
                :disabled="!isValid || isLoading"
              >
                {{ t('submit') }}
              </button>

              <div class="btn-link mt-2" v-if="formAct === 'login'" @click="setFormAct('reset')">
                {{ t('forgot_password') }}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  </Layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useTitle } from '@vueuse/core';
import useValidate from '@vuelidate/core';
import { required, email, requiredIf } from '@vuelidate/validators';

import { useAuth } from '@/use/auth';
import { Credentials } from '@/data/types/mock';
import Layout from '@/layouts/AuthLayout.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';

export enum AuthType {
  login = 'login',
  register = 'register',
  reset = 'reset',
}

export default defineComponent({
  name: 'Auth',
  components: { Layout, AlertMessage },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const { auth, login, register, sendPasswordReset, signInWithGoogle, logout } = useAuth;

    const user = computed(() => auth.userSession?.user);

    const state = reactive({
      formAct: route.fullPath.split('/')[2] || 'login',
      isValid: true,
    });

    const setFormAct = (type: 'login' | 'signup' | 'reset') => {
      state.formAct = type;
      router.push({ path: `/auth/${type}` });
    };

    const title = computed(() => `${t(state.formAct)} · 🎬 ${import.meta.env.VITE_APP_NAME}`);
    useTitle(title);

    const credentials = reactive<Credentials>({
      //username: '',
      email: '',
      password: '',
    });

    const rules = computed(() => {
      return {
        email: { required, email },
        password: { required: requiredIf(() => state.formAct === 'signup') },
      };
    });

    const v$ = useValidate(rules, credentials);

    async function submitForm() {
      v$.value.$validate();
      if (v$.value.$error) return;

      const { email, password } = credentials;
      switch (state.formAct) {
        case 'signup':
          await register({ email, password });
          break;
        case 'reset':
          await sendPasswordReset(email!);
          break;
        case 'login':
        default:
          await login({ email, password });
          break;
      }
    }

    return {
      t,
      ...toRefs(auth),
      user,
      ...toRefs(state),
      setFormAct,
      ...toRefs(credentials),
      v$,
      submitForm,
      signInWithGoogle,
      logout,
    };
  },
});
</script>

<style scoped>
.google-icon {
  width: 4.2em;
  height: 1.2em;
}

h3 {
  @apply mb-2 font-semibold text-xl;
}

button[type='button'],
.btn-link {
  @apply py-2 font-semibold text-sm px-3 rounded cursor-pointer hover:underline;
}

.form-group {
  margin: 1em 0;
}

.err {
  @apply text-xs text-red-400;
}
</style>
