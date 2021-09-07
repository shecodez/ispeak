<template>
  <header class="py-4 px-6 flex items-center justify-between">
    <router-link to="/">
      <div class="brand flex text-2xl font-bold gap-3">
        <i-fa-solid-sticky-note class="text-yellow-500" />
        <span class="hidden md:block">iKanban!</span>
      </div>
    </router-link>
    <div class="flex gap-4 items-center text-gray-500">
      <Search css="btn" />
      <ul class="hidden md:flex items-center gap-6 font-semibold capitalize">
        <template v-for="item in navItems" :key="item.id">
          <li v-if="!item.reqAuth || (user && item.reqAuth)">
            <router-link :to="item.route">{{ item.label }}</router-link>
          </li>
        </template>
      </ul>
      <div class="hidden md:block text-3xl">&middot;</div>
      <Avatar v-if="user" src="" />
      <div v-else class="flex gap-2">
        <router-link to="/auth/login" class="btn capitalize flex items-center gap-2">
          <i-mdi-key class="p-0.5 rounded bg-gray-300" />
          {{ t('login') }}
        </router-link>
        <router-link to="/auth/signup" class="btn bg-gray-300 capitalize">{{ t('sign_up') }}</router-link>
      </div>
      <div class="p-3 md:p-0">
        <SwitchLocale />
      </div>
    </div>

    <button class="md:hidden">Menu</button>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuth } from '@/use/auth';
import SwitchLocale from '@/components/shared/SwitchLocale.vue';
import Avatar from '@/components/shared/Avatar.vue';
import Search from '@/components/search/SearchDialog.vue';

export default defineComponent({
  name: 'Header',
  components: { SwitchLocale, Avatar, Search },
  setup() {
    const { t } = useI18n();
    const { auth } = useAuth;
    const user = computed(() => auth.userSession?.user);

    const navItems = [
      { id: 'about', label: t('about'), route: '/about' },
      { id: 'storyboards', label: t('story_boards'), route: '/story/boards' },
      { id: 'boards', label: t('boards'), route: '/boards', reqAuth: true },
      { id: 'blog', label: t('blog'), route: '/blog' },
      //{ id: 'shop', label: t('shop'), route: "/shop" },
      { id: 'contact', label: t('contact'), route: '/contact' },
    ];

    return { t, user, navItems };
  },
});
</script>

<style scoped>
a.router-link-active {
  @apply text-black dark:text-white;
}
</style>
