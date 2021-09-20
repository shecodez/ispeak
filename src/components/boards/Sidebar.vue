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
      <div v-if="isLoggedIn" @click="openDrawer('profile')" class="f-center py-2">
        <n-avatar round src="https://avatars.githubusercontent.com/u/14142384?v=4" />
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
    <n-drawer-content :title="title.toUpperCase()" closable body-style="background-color: #eee">
      <div v-if="showCalendar">Calendar</div>
      <BoardList v-if="showBoards" :boards="boards" />
      <div v-if="showAnalytics">Calendar</div>
      <div v-if="showNotifications">Notifications</div>
      <Profile v-if="showProfile" :profile="profile" />
      <div v-if="showSettings">Settings</div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs } from 'vue';
import FaStickyNote from 'virtual:vite-icons/fa/sticky-note';
import BiCalendar2EventFill from 'virtual:vite-icons/bi/calendar2-event-fill';
import FaSolidFolderOpen from 'virtual:vite-icons/fa-solid/folder-open';
import FaSolidChartPie from 'virtual:vite-icons/fa-solid/chartPie';
import FaSolidBell from 'virtual:vite-icons/fa-solid/bell';
import FaCog from 'virtual:vite-icons/fa/cog';

import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { Board, Profile as iProfile } from '@/data/types/mock';
import { useAuth } from '@/use/auth';
import { supabase } from '@/lib/supabase';
import BoardList from '@/components/boards/drawers/BoardList.vue';
import Profile from '@/components/users/Profile.vue';

export default defineComponent({
  name: 'Sidebar',
  components: { FaStickyNote, FaSolidFolderOpen, FaSolidChartPie, FaSolidBell, FaCog, BoardList, Profile },
  setup() {
    const { t } = useI18n();
    const { auth, logout } = useAuth;

    const state = reactive({
      drawer: false,
      title: '',
      showCalendar: false,
      showBoards: false,
      showAnalytics: false,
      showNotifications: false,
      showSettings: false,
      showProfile: false,
      isLoading: false,
      error: null,
      boards: [] as Board[],
      profile: {} as iProfile,
      count: 0,
      isLoggedIn: computed(() => !!auth.userSession?.user),
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

    const currentRouteName = computed(() => useRoute().name);

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

        state.showCalendar = false;
        state.showBoards = false;
        state.showAnalytics = false;
        state.showNotifications = false;
        state.showSettings = false;
        state.title = '';
      }
    }

    function isActive(id: string) {
      const routeUrl = useRoute().fullPath;
      return routeUrl.toUpperCase().includes(id.toUpperCase());
    }

    return {
      t,
      ...toRefs(state),
      nav,
      logout,
      currentRouteName,
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
