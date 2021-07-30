<template>
  <button @click="logout()" class="btn f-center space-x-1" :class="color">
    <i-ant-design-logout-outlined />
    <span v-if="iconOnly" class="sr-only">logout</span>
    <span v-else class="capitalize">{{ t('logout') }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuthState } from '@/firebase';

export default defineComponent({
  name: 'LogoutButton',
  props: {
    iconOnly: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'bg-red-500',
    },
  },
  setup() {
    const { t } = useI18n();
    const { logout } = useAuthState();

    return { logout, t };
  },
});
</script>
