<template>
  <button v-if="isLoggedIn" @click="logout" class="btn primary-red" :class="css">
    <div class="f-center gap-2 text-xs uppercase text-white py-1">
      <i-ant-design-logout-outlined />
      <span v-if="!iconOnly" class="uppercase">{{ t('logout') }}</span>
    </div>
    <span class="sr-only">logout</span>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuth } from '@/use/auth';

export default defineComponent({
  name: 'LogoutButton',
  props: {
    iconOnly: {
      type: Boolean,
      default: false,
    },
    css: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { t } = useI18n();
    const { auth, logout } = useAuth;

    const isLoggedIn = computed(() => !!auth.userSession?.user);

    return { t, isLoggedIn, logout };
  },
});
</script>
