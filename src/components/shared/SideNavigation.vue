<template>
  <nav class="h-full w-16 max-w-16 fixed">
    <div class="w-full h-16 bg-green-500 rounded-tr-3xl">
      <button @click="addKanban" class="f-center">
        <i-gg-spinner v-if="isLoading" class="text-2xl animate-spin" />
        <Tooltip v-else :text="t('add_kanban')" placement="right">➕</Tooltip>
        <span class="sr-only">New Kanban</span>
      </button>
    </div>

    <ul class="h-full flex flex-col items-center text-2xl bg-gray-300 dark:bg-gray-700">
      <li v-for="navli in navListItems" :key="navli.text" v-show="!navli.reqAuth || (navli.reqAuth && isLoggedIn)">
        <button v-if="navli.isBtn">
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
              <img v-if="user" class="rounded-full overflow-hidden" :src="user?.photoURL" alt="Display Photo" />
              <div v-else class="rounded-full w-full h-full bg-blue-300 f-center">U</div>
            </div>
          </router-link>
        </template>
        <router-link v-else to="/login" class="flex flex-col h-full f-center">
          <i-grommet-icons-google />
          <span class="text-sm font-bold">{{ t('login') }}</span>
        </router-link>
      </li>
      <li v-if="isLoggedIn">
        <button @click="logout()" class="text-red-500">
          <Tooltip :text="t('logout')" placement="right">
            <i-ant-design-logout-outlined />
          </Tooltip>
          <span class="sr-only">logout</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import FaSolidTags from 'virtual:vite-icons/fa-solid/tags';

import { useAuthState } from '@/firebase';
import useApi from '@/use/api';
import Tooltip from '@/components/ui/Tooltip.vue';

export default defineComponent({
  name: 'Sidenav',
  components: { FaSolidTags, Tooltip },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const router = useRouter();
    const { user, isLoggedIn, logout } = useAuthState();
    const { isLoading, post } = useApi('/kanbans');

    const navListItems = [
      { route: '/sagas', tooltip: 'sagas', text: '🎬' },
      { route: '/tags', tooltip: 'tags', component: FaSolidTags },
      { isBtn: true, tooltip: 'saved', text: '💾', reqAuth: true },
      { route: '/kanbans', tooltip: 'my_kanbans', text: '🍱', reqAuth: true },
    ];

    const addKanban = async () => {
      if (isLoggedIn.value) {
        const id = Date.now();
        const payload = { id, title: t('untitled'), description: '', boards: [], members: [], tags: [] };

        try {
          await post(payload);
          //toast.success('New Kanban created!', { timeout: 4000 });
          router.push(`/kanbans/${id}`);
        } catch (err) {
          console.log(err);
        }
      } else {
        toast(t('you_must_be_logged_in'), { timeout: 5000 });
      }
    };

    return { navListItems, user, isLoggedIn, logout, isLoading, addKanban, t };
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
