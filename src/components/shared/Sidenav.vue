<template>
  <nav class="h-full w-16 max-w-16 fixed z-10">
    <div class="w-full h-16 bg-green-300 rounded-tr-3xl f-center">
      <router-link to="/kanban"> ➕<span class="sr-only">Create Kanban</span> </router-link>
    </div>

    <ul class="h-full flex flex-col items-center text-2xl bg-gray-300 dark:bg-gray-700">
      <li v-for="navli in navListItems" :key="navli.text" v-show="!navli.reqAuth || (navli.reqAuth && isLoggedIn)">
        <button v-if="navli.isBtn">
          {{ navli.text }}
          <span class="sr-only">{{ navli.tooltip }}</span>
        </button>
        <router-link v-else :to="navli.route" class="h-full f-center">
          <component v-if="navli.component" :is="navli.component" />
          <span v-else>{{ navli.text }}</span>
          <span class="sr-only">{{ navli.tooltip }}</span>
        </router-link>
      </li>
      <li>
        <button v-if="isLoggedIn" class="f-center">
          <div class="w-12 h-12">
            <img v-if="user" class="rounded-full overflow-hidden" :src="user?.photoURL" alt="Display Photo" />
            <div v-else class="rounded-full w-full h-full bg-blue-300 f-center">U</div>
          </div>
        </button>
        <router-link v-else to="/login" class="flex flex-col h-full f-center">
          <i-grommet-icons-google />
          <span class="text-sm font-bold">{{ t('login') }}</span>
        </router-link>
      </li>
      <li v-if="isLoggedIn">
        <button @click="logout()" class="text-red-500"><i-ant-design-logout-outlined /></button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import FaSolidTags from 'virtual:vite-icons/fa-solid/tags';

import { useAuthState } from '../../firebase/auth';

export default defineComponent({
  name: 'Sidenav',
  components: { FaSolidTags },
  setup() {
    const { user, isLoggedIn, logout } = useAuthState();
    const { t } = useI18n();

    const navListItems = [
      { route: '/sagas/hot', tooltip: 'hot', text: '🔥' },
      { route: '/tags', tooltip: 'tags', component: FaSolidTags },
      { isBtn: true, tooltip: 'bookmarked', text: '💾', reqAuth: true },
      { isBtn: true, tooltip: 'notifications', text: '🔔', reqAuth: true },
    ];

    return { navListItems, user, isLoggedIn, logout, t };
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
</style>
