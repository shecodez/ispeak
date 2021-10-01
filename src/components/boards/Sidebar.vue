<template>
  <n-list style="display: flex; flex-direction: column; height: 100%">
    <template #header>
      <n-button text style="font-size: 2rem; color: gold">
        <n-icon>
          <router-link to="/"> <i-fa-sticky-note /></router-link>
        </n-icon>
      </n-button>
    </template>
    <template #footer>
      <n-tooltip trigger="hover" :show-arrow="false" placement="right">
        <template #trigger>
          <n-button @click="openDrawer('settings')" text color="#bebdc2">
            <n-icon><i-fa-cog /></n-icon>
          </n-button>
        </template>
        {{ t('settings') }}
      </n-tooltip>
    </template>
    <n-space vertical style="flex: 1">
      <template v-for="item in nav" :key="item.id">
        <n-list-item>
          <n-badge dot :show="!!item.notifications" :value="item.notifications" color="#ffd700">
            <n-tooltip trigger="hover" :show-arrow="false" placement="right">
              <template #trigger>
                <n-button @click="openDrawer(item.id)" text :color="isActive(item.id) ? '#ffd700' : '#bebdc2'">
                  <n-icon v-if="item.component">
                    <component :is="item.component" />
                  </n-icon>
                </n-button>
              </template>
              {{ item.label }}
            </n-tooltip>
          </n-badge>
        </n-list-item>
      </template>
      <div v-if="isLoggedIn" @click="openDrawer('profile')" class="f-center cursor-pointer py-2">
        <Avatar v-model:path="profile.avatar_url" :username="profile.username" size="w-11 h-11" />
      </div>
      <n-list-item v-if="isLoggedIn">
        <n-tooltip trigger="hover" :show-arrow="false" placement="right">
          <template #trigger>
            <n-button @click="logout" type="error" text>
              <n-icon><i-ant-design-logout-outlined /></n-icon>
            </n-button>
          </template>
          {{ t('logout') }}
        </n-tooltip>
      </n-list-item>
    </n-space>
  </n-list>

  <n-drawer v-model:show="drawer" :width="320" placement="left" :on-update:show="handleClose">
    <n-drawer-content :title="t('menu').toUpperCase()" closable body-style="background-color: #eee">
      <Calendar v-if="showCalendar" />
      <BoardList :label="t('my_boards')" v-if="showBoards" :boards="boards" />
      <Analytics v-if="showAnalytics" />
      <NotificationList v-if="showNotifications" />
      <Me v-if="showProfile" :profile="profile" />
      <Settings v-if="showSettings" />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import BiCalendar2EventFill from 'virtual:vite-icons/bi/calendar2-event-fill';
import FaCog from 'virtual:vite-icons/fa/cog';
import FaSolidBell from 'virtual:vite-icons/fa-solid/bell';
import FaSolidChartPie from 'virtual:vite-icons/fa-solid/chartPie';
import FaSolidFolderOpen from 'virtual:vite-icons/fa-solid/folder-open';
import FaStickyNote from 'virtual:vite-icons/fa/sticky-note';

import { Board } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/use/auth';
import { db } from '@/use/db';
import Analytics from '@/components/boards/drawers/Analytics.vue';
import BoardList from '@/components/boards/drawers/BoardList.vue';
import Calendar from '@/components/me/drawers/Calendar.vue';
import NotificationList from '@/components/me/drawers/NotificationList.vue';
import Settings from '@/components/me/drawers/Settings.vue';
import Me from '@/components/me/Me.vue';
import Avatar from '@/components/shared/Avatar.vue';

export default defineComponent({
  name: 'Sidebar',
  components: {
    FaStickyNote,
    FaSolidFolderOpen,
    FaSolidChartPie,
    FaSolidBell,
    FaCog,
    BoardList,
    Me,
    NotificationList,
    Settings,
    Analytics,
    Calendar,
    Avatar,
  },
  setup() {
    const { t } = useI18n();
    const { auth, logout } = useAuth;
    const { state: store, getMe } = db.profiles;
    const {
      data: { boards },
      allMyBoards,
    } = db.boards;

    onMounted(async () => {
      if (!store.profile) await getMe();
      // if (!boards.length) await allMyBoards(); doesn't work/infinite loop
    });

    const state = reactive({
      drawer: false,
      title: '',
      showCalendar: false,
      showBoards: false,
      showAnalytics: false,
      showNotifications: false,
      showSettings: false,
      showProfile: false,
      isLoggedIn: computed(() => !!auth.userSession?.user),
      isLoading: false,
      boards: [] as Board[],
      count: 0,
      error: null,
    });
    async function fetchUserBoards() {
      try {
        state.isLoading = true;
        const { data, error, count } = await supabase
          .from('boards')
          .select('id, title, user_id')
          .order('updated_at', { ascending: false })
          .eq('user_id', supabase.auth.user()?.id);
        if (error) throw error;
        if (data === null) return (state.boards = []);

        state.boards = data;
        state.count = Number(count);
      } catch (e) {
        state.error = e.error_description || e.message;
      } finally {
        state.isLoading = false;
      }
    }
    onMounted(async () => await fetchUserBoards());

    // async function fetchProfile() {
    //   try {
    //     state.isLoading = true;
    //     const { data, error } = await supabase.from('profiles').select('*').eq('id', supabase.auth.user()?.id).single();
    //     if (error) throw error;

    //     state.profile = data;
    //   } catch (e) {
    //     state.error = e.error_description || e.message;
    //   } finally {
    //     state.isLoading = false;
    //   }
    // }
    // onMounted(async () => await fetchProfile());

    const nav = [
      { id: 'calendar', component: BiCalendar2EventFill, label: t('calendar') },
      { id: 'boards', component: FaSolidFolderOpen, label: t('boards') },
      { id: 'analytics', component: FaSolidChartPie, label: t('analytics') },
      { id: 'notifications', component: FaSolidBell, label: t('notifications'), notifications: 3 },
    ];

    function openDrawer(type: string) {
      state.title = type;
      switch (type) {
        case 'calendar':
          state.showCalendar = true;
          break;
        case 'boards':
          state.showBoards = true;
          break;
        case 'analytics':
          state.showAnalytics = true;
          break;
        case 'notifications':
          state.showNotifications = true;
          break;
        case 'settings':
          state.showSettings = true;
          break;
        case 'profile':
          state.showProfile = true;
          break;
        default:
          break;
      }
      state.drawer = true;
    }

    function handleClose(show: boolean) {
      if (!show) {
        state.drawer = false;

        state.showAnalytics = false;
        state.showBoards = false;
        state.showCalendar = false;
        state.showNotifications = false;
        state.showSettings = false;
        state.showProfile = false;

        state.title = '';
      }
    }

    function isActive(id: string) {
      const routeUrl = useRoute().fullPath;
      return routeUrl.toUpperCase().includes(id.toUpperCase());
    }

    return {
      t,
      boards,
      ...toRefs(store),
      ...toRefs(state),
      nav,
      logout,
      openDrawer,
      isActive,
      handleClose,
    };
  },
});
</script>

<style scoped>
.n-list {
  text-align: center;
}
.n-list-item {
  border: none !important;
}
.n-button {
  font-size: 1.5rem;
}
</style>
