<template>
  <aside class="flex flex-col gap-4 h-full">
    <div class="flex-1 flex flex-col gap-2">
      <ToggleDark />
      <SwitchLocale />
    </div>

    <button v-if="isLoggedIn" @click="logout" class="btn primary-red mt-auto">
      <div class="f-center gap-2 text-white">
        <i-ant-design-logout-outlined />
        <span class="">{{ t('logout') }}</span>
      </div>
    </button>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuth } from '@/use/auth';
import ToggleDark from '@/components/shared/ToggleDark.vue';
import SwitchLocale from '@/components/shared/SwitchLocale.vue';

export default defineComponent({
  name: 'SettingsDrawer',
  components: { ToggleDark, SwitchLocale },
  setup() {
    const { t } = useI18n();
    const { auth, logout } = useAuth;

    const state = reactive({
      isLoggedIn: computed(() => !!auth.userSession?.user),
    });

    return { t, ...toRefs(state), logout };
  },
});
</script>
