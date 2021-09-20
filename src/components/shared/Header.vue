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
      <button v-if="user" @click="profileDrawer = true">
        <Avatar src="" />
      </button>
      <div v-else class="flex gap-2">
        <router-link :to="{ name: 'AuthLogin' }" class="btn capitalize flex items-center gap-2">
          <i-mdi-key class="p-0.5 rounded bg-gray-300" />
          {{ t('login') }}
        </router-link>
        <router-link :to="{ name: 'AuthSignup' }" class="btn hidden md:block bg-gray-300 capitalize">
          {{ t('sign_up') }}
        </router-link>
      </div>
      <div class="p-3 md:p-0">
        <SwitchLocale />
      </div>
    </div>

    <button @click="menuDrawer = true" class="md:hidden font-bold uppercase">{{ t('menu') }}</button>
  </header>

  <n-drawer v-model:show="menuDrawer" :width="320" placement="right">
    <n-drawer-content :title="t('menu')" closable>
      <ul class="flex flex-col gap-6 font-semibold capitalize">
        <template v-for="item in navItems" :key="item.id">
          <li v-if="!item.reqAuth || (user && item.reqAuth)" class="hover:bg-gray-700 hover:bg-opacity-30">
            <router-link :to="item.route">{{ item.label }}</router-link>
          </li>
        </template>
      </ul>
      <router-link :to="{ name: 'AuthSignup' }" class="btn my-6 inline-block bg-gray-300 capitalize">
        {{ t('sign_up') }}
      </router-link>
    </n-drawer-content>
  </n-drawer>

  <n-drawer v-model:show="profileDrawer" :width="320" placement="right">
    <n-drawer-content :title="t('profile')" closable body-style="background-color: #eee">
      <Profile :profile="profile" />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import { Profile as iProfile } from '@/data/types/mock';
import { useAuth } from '@/use/auth';
import { supabase } from '@/lib/supabase';
import SwitchLocale from '@/components/shared/SwitchLocale.vue';
import Avatar from '@/components/shared/Avatar.vue';
import Search from '@/components/search/SearchDialog.vue';
import Profile from '@/components/users/Profile.vue';

export default defineComponent({
  name: 'Header',
  components: { SwitchLocale, Avatar, Search, Profile },
  setup() {
    const { t } = useI18n();
    const { auth } = useAuth;
    const user = computed(() => auth.userSession?.user);

    const state = reactive({
      menuDrawer: false,
      profileDrawer: false,
      profile: {} as iProfile,
      isLoading: false,
      error: null,
      navItems: computed(() => [
        { id: 'about', label: t('about'), route: '/about' },
        { id: 'storyboards', label: t('explore'), route: '/story/boards' },
        { id: 'boards', label: t('boards'), route: '/boards', reqAuth: true },
        { id: 'blog', label: t('blog'), route: '/blog' },
        //{ id: 'shop', label: t('shop'), route: "/shop" },
        { id: 'contact', label: t('contact'), route: '/contact' },
      ]),
    });

    async function fetchProfile() {
      try {
        state.isLoading = true;
        const { data, error } = await supabase.from('profiles').select('*').eq('id', supabase.auth.user()?.id).single();
        if (error) throw error;

        state.profile = data;
      } catch (e) {
        state.error = e.error_description || e.message;
      } finally {
        state.isLoading = false;
      }
    }
    onMounted(async () => await fetchProfile());

    return { t, user, ...toRefs(state) };
  },
});
</script>

<style scoped>
a.router-link-active {
  @apply text-black dark:text-white;
}
</style>
