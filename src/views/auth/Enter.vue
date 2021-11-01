<template>
  <Layout title="Enter">
    <div class="wrapper h-screen w-screen f-center">
      <div v-if="sent" class="container">
        <div class="sent-notification f-center gap-4 text-2xl font-semibold">
          <i-mdi-check-circle-outline />
          <h2>{{ t('sent_link_check_email_message') }}</h2>
        </div>
      </div>
      <div v-else class="container">
        <h1 class="mb-2 text-4xl font-bold capitalize">{{ t('enter') }}</h1>
        <AlertMessage v-if="error" type="error" :message="error" />
        <form @submit.prevent="submitForm" @keydown.enter.prevent class="flex flex-col gap-2">
          <div class="form-group">
            <label>{{ t('email_address') }}</label>
            <input type="email" v-focus v-model="email" :placeholder="t('email_placeholder')" required />
          </div>
          <button type="submit" class="btn f-center space-x-2 text-sm hover:underline" :disabled="isLoading">
            <i-mdi-email-send-outline />
            <span>{{ isLoading ? t('loading') : t('send_me_a_magic_link') }}</span>
          </button>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTitle } from '@vueuse/core';

import { useAuth } from '@/use/auth';
import Layout from '@/layouts/AuthLayout.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';

export default defineComponent({
  name: 'Enter',
  components: { Layout, AlertMessage },
  setup() {
    const { t } = useI18n();
    useTitle(`${t('enter')} · 🎬 ${import.meta.env.VITE_APP_NAME}`);

    const { auth, login } = useAuth;

    const state = reactive({
      email: '',
      sent: false,
    });

    async function submitForm() {
      await login({ email: state.email });
      state.sent = true;
    }

    return { t, ...toRefs(auth), ...toRefs(state), submitForm };
  },
});
</script>

<style scoped>
.container {
  @apply flex flex-col min-w-96 max-w-11/12 md:max-w-1/2 xl:max-w-1/3 p-16 rounded border;
}
</style>
