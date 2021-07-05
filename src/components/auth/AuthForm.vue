<template>
  <div class="text-center">
    <template v-if="formType === 'register'">
      <h3>{{ t('create_an_account') }}</h3>
      <button @click="setFormType('login')">{{ t('returning_user') }}</button>
    </template>

    <template v-if="formType === 'login'">
      <h3>{{ t('hey_welcome_back') }}</h3>
      <button @click="setFormType('register')">{{ t('new_user') }}</button>
    </template>

    <template v-if="formType === 'reset'">
      <h3>{{ t('reset_password') }}</h3>
      <button @click="setFormType('login')">{{ t('back') }}</button>
    </template>
  </div>

  <form ref="form" @submit.prevent="authenticate">
    <div v-if="formType === 'register'" class="form-group">
      <label>{{ t('username') }}</label>
      <input type="text" v-model="name" />
      <span class="err" v-if="v$.name.$error">
        {{ v$.name.$errors[0].$message }}
      </span>
    </div>

    <div class="form-group">
      <label>{{ t('email') }}</label>
      <input type="email" v-model="email" />
      <span class="err" v-if="v$.email.$error">
        {{ v$.email.$errors[0].$message }}
      </span>
    </div>

    <div v-if="formType !== 'reset'" class="form-group">
      <label>{{ t('password') }}</label>
      <input type="password" v-model="password" />
      <span class="err" v-if="v$.password.$error">
        {{ v$.password.$errors[0].$message }}
      </span>
    </div>

    <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

    <div class="text-center mt-6">
      <button v-if="formType === 'reset'" type="submit" :disabled="isLoading">{{ t('send_reset_email') }}</button>

      <button v-if="formType !== 'reset'" type="submit" :disabled="!isValid || isLoading">{{ t('submit') }}</button>

      <div class="forgot" v-if="formType === 'login' && formType !== 'reset'" @click="setFormType('reset')">
        {{ t('forgot_password') }}
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import useValidate from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
// import { sameAs } for passwordConfirm

export default defineComponent({
  name: 'AuthForm',
  setup() {
    const auth = getAuth();
    const { t } = useI18n();

    const user = reactive({
      name: '',
      email: '',
      password: '',
    });

    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(3) },
        email: { required, email },
        password: { required },
        //confirm: { required, sameAs: sameAs(user.password) }
      };
    });

    const v$ = useValidate(rules, user);

    const authForm = reactive({
      formType: 'register', // 'login' | 'register' | 'reset'
      isLoading: false,
      isValid: true,
      errorMessage: '',
    });

    const setFormType = (type: 'login' | 'register' | 'reset') => {
      authForm.formType = type;
    };

    const authenticate = async () => {
      v$.value.$validate();
      if (v$.value.$error) return;

      authForm.isLoading = true;

      const email = user.email;
      const password = user.password;

      try {
        if (authForm.formType === 'login') {
          await signInWithEmailAndPassword(auth, email, password);
        }
        if (authForm.formType === 'register') {
          await createUserWithEmailAndPassword(auth, email, password);
        }
        if (authForm.formType === 'reset') {
          await sendPasswordResetEmail(auth, email);
          //TODO: Toast = 'Check your email';
        }
      } catch (error) {
        switch (error.code) {
          case 'auth/invalid-email':
            authForm.errorMessage = 'Invalid email';
            break;
          case 'auth/user-not-found':
            authForm.errorMessage = 'No account with that email was found';
            break;
          case 'auth/weak-password':
            authForm.errorMessage = 'Password should be at least 6 characters';
            break;
          case 'auth/wrong-password':
            authForm.errorMessage = 'Incorrect password';
            break;
          default:
            authForm.errorMessage = 'Email or password was incorrect';
            break;
        }
      } finally {
        authForm.isLoading = false;
      }
    };

    return { ...toRefs(user), v$, ...toRefs(authForm), setFormType, authenticate, t };
  },
});
</script>

<style scoped>
button {
  @apply py-2 font-semibold text-sm px-3 border rounded;
}
button[type='submit'] {
  @apply border-0 bg-blue-600 text-white shadow;
}
button:disabled,
button[disabled] {
  @apply bg-gray-300 text-gray-500 cursor-not-allowed;
}

h3 {
  @apply mb-2 font-semibold;
}

.forgot {
  @apply py-2 font-semibold text-sm px-3 rounded cursor-pointer;
}

.form-group {
  margin: 1em 0;
}
input {
  @apply block w-full rounded bg-gray-300 dark:bg-gray-600;
}
label {
  @apply text-xs font-semibold;
}
.err {
  @apply text-xs text-red-400;
}
</style>
