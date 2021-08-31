<template>
  <header class="py-5 px-10 flex justify-between">
    <div class="brand flex text-2xl font-bold gap-3">
      <i-fa-solid-sticky-note class="text-yellow-500" />
      <router-link to="/">iKanban!</router-link>
    </div>
    <div class="flex gap-4 items-center text-gray-500">
      <button class="btn">🔍</button>
      <ul class="flex items-center gap-8 font-semibold">
        <li>
          <router-link to="/about">{{ t('about') }}</router-link>
        </li>
        <li>
          <router-link to="/blog">{{ t('blog') }}</router-link>
        </li>
        <li>
          <router-link to="/shop">{{ t('shop') }}</router-link>
        </li>
        <li>
          <router-link to="/contact">{{ t('contact') }}</router-link>
        </li>
      </ul>
      <div class="text-3xl">&middot;</div>
      <Avatar v-if="user" :src="user.avatar_url" />
      <div v-else class="flex gap-2">
        <router-link to="/auth/login" class="btn capitalize flex items-center gap-2">
          <i-mdi-key class="p-0.5 rounded bg-gray-300" />
          {{ t('login') }}
        </router-link>
        <router-link to="/auth/signup" class="btn bg-gray-300 capitalize">{{ t('sign_up') }}</router-link>
      </div>
      <SwitchLocale />
    </div>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuth } from '@/use/auth';
import SwitchLocale from '@/components/shared/SwitchLocale.vue';
import Avatar from '@/components/shared/Avatar.vue';

export default defineComponent({
  name: 'Header',
  components: { SwitchLocale, Avatar },
  setup() {
    const { t } = useI18n();
    const { auth } = useAuth;

    const user = computed(() => auth.userSession?.user);

    return { t, user };
  },
});
</script>

<style scoped>
a.router-link-active {
  @apply text-black dark:text-white;
}
</style>
