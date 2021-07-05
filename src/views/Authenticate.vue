<template>
  <div class="flex items-center justify-center h-full -ml-16">
    <div v-if="user" class="text-center">
      <!-- <img class="m-auto mb-3 rounded-full max-w-24 max-h-24" :src="user.photoURL" alt="display photo" /> -->
      <p class="mb-2">
        {{ t('logged_in_as', { email: user?.email }) }}
      </p>
      <button @click="logout()" class="bg-red-500">{{ t('logout') }}</button>
    </div>

    <div v-else class="container max-w-lg mx-auto">
      <div class="text-center">
        <h1 class="text-2xl font-bold my-4">{{ t('hi') }} 🥰</h1>

        <button @click="google()">
          <span class="flex items-center space-x-1"
            >{{ t('sign_in_with') }} <i-logos-google class="google-icon"
          /></span>
        </button>
        <div class="my-4 text-sm uppercase">{{ t('or') }}</div>
      </div>

      <div class="p-6 bg-gray-600 bg-opacity-30 shadow-lg rounded">
        <AuthForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuthState, useSignIn } from '../firebase/auth';
import AuthForm from '../components/auth/AuthForm.vue';

export default defineComponent({
  name: 'Authenticate',
  components: { AuthForm },
  setup() {
    const { google } = useSignIn();
    const { user, logout } = useAuthState();
    const { t } = useI18n();

    return { google, user, logout, t };
  },
});
</script>

<style scoped>
.google-icon {
  width: 4.2em;
  height: 1.2em;
}

button {
  @apply py-2 font-semibold px-3 border rounded shadow;
}
</style>
