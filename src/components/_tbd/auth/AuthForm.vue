<template>
  <form class="row flex flex-center" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <h1 class="header">Supabase + Vue 3</h1>
      <p class="description">Sign in via magic link with your email below</p>
      <div>
        <input class="inputField" type="email" placeholder="Your email" v-model="email" />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="isLoading ? 'Loading' : 'Send magic link'"
          :disabled="isLoading"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import db from '@/supabase/db';

export default defineComponent({
  name: 'AuthForm',
  setup() {
    const { t } = useI18n();

    const isLoading = ref(false);
    const email = ref('');

    const handleLogin = async () => {
      try {
        isLoading.value = true;
        const { error } = await db.signIn(email.value);
        if (error) throw error;
        alert('Sent you a link, check your email');
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      t,
      isLoading,
      email,
      handleLogin,
    };
  },
});
</script>
