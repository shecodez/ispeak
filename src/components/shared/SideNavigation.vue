<template>
  <nav class="h-full w-16 max-w-16 fixed">
    <div class="w-full h-16 primary-green rounded-tr-3xl">
      <button @click="addBoard" class="f-center">
        <i-gg-spinner v-if="isLoading" class="text-2xl animate-spin" />
        <Tooltip v-else :text="t('add_board')" placement="right">➕</Tooltip>
        <span class="sr-only">Add Board</span>
      </button>
    </div>

    <ul class="h-full flex flex-col items-center text-2xl bg-gray-300 dark:bg-gray-700">
      <li v-for="navli in navListItems" :key="navli.text" v-show="!navli.reqAuth || (navli.reqAuth && isLoggedIn)">
        <button v-if="navli.isBtn" @click="navli.action">
          <Tooltip :text="t(navli.tooltip)" placement="right">
            {{ navli.text }}
          </Tooltip>
        </button>
        <router-link v-else :to="navli.route" class="h-full f-center">
          <Tooltip :text="t(navli.tooltip)" placement="right">
            <component v-if="navli.component" :is="navli.component" />
            <span v-else>{{ navli.text }}</span>
          </Tooltip>
        </router-link>
        <span class="sr-only">{{ navli.tooltip }}</span>
      </li>
      <li>
        <template v-if="isLoggedIn">
          <router-link to="/@me" class="flex flex-col h-full f-center">
            <div class="w-12 h-12">
              <!-- <img v-if="user?.avatar_url" class="rounded-full overflow-hidden" :src="user?.avatar_url" alt="Avatar" /> -->
              <div class="rounded-full w-full h-full bg-gray-500 f-center">U</div>
            </div>
          </router-link>
        </template>
        <router-link v-else to="/login" class="flex flex-col h-full f-center">
          <i-grommet-icons-google />
          <span class="text-sm font-bold">{{ t('login') }}</span>
        </router-link>
      </li>
      <li v-if="isLoggedIn">
        <button @click="logout" class="text-red-500">
          <Tooltip :text="t('logout')" placement="right">
            <i-ant-design-logout-outlined />
          </Tooltip>
          <span class="sr-only">logout</span>
        </button>
      </li>
    </ul>
  </nav>
  <HelpDialog :showDialog="showHelpDialog" :closeDialogFn="closeHelpDialog" />
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
// @ts-ignore
import FaSolidTags from 'virtual:vite-icons/fa-solid/tags';

import { useAuth } from '@/use/auth';
import { useBoards } from '@/use/db';
//import { useAuthState } from '@/libs/firebase';
//import useApi from '@/use/api';
import Tooltip from '@/components/ui/Tooltip.vue';
import HelpDialog from '@/components/help/HelpDialog.vue';

export default defineComponent({
  name: 'Sidenav',
  components: { FaSolidTags, Tooltip, HelpDialog },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const toast = useToast();
    const { data: state, add } = useBoards;
    const { auth, logout } = useAuth;
    const isLoggedIn = computed(() => !!auth.userSession?.user);

    //const { user, isLoggedIn, logout } = useAuthState();
    //const { isLoading, post } = useApi('/kanbans');

    const showHelpDialog = ref(false);
    const openHelpDialog = () => {
      showHelpDialog.value = true;
    };
    const closeHelpDialog = () => {
      showHelpDialog.value = false;
    };

    const navListItems = [
      { route: '/story/boards', tooltip: 'stories', text: '🎬' },
      { route: '/tags', tooltip: 'tags', component: FaSolidTags },
      { route: '/boards', tooltip: 'boards', text: '📋', reqAuth: true },
      { isBtn: true, tooltip: 'help', text: '🤔', action: openHelpDialog },
    ];

    const addBoard = async () => {
      if (isLoggedIn.value) {
        const data = await add({ title: t('untitled'), position: state.boards.length });
        router.push(`/boards/${data?.id}`);
      } else {
        toast(t('you_must_be_logged_in'), { timeout: 5000 });
      }
    };

    return {
      navListItems,
      user: auth.userSession?.user,
      ...toRefs(state),
      isLoggedIn,
      logout,
      showHelpDialog,
      openHelpDialog,
      closeHelpDialog,
      addBoard,
      t,
    };
  },
});
</script>

<style scoped>
li {
  @apply w-full h-16;
}

button,
.btn {
  @apply h-full w-full;
}

.f-center {
  @apply flex items-center justify-center;
}

a.router-link-active {
  @apply bg-gray-400 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50;
}
</style>
