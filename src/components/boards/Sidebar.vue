<template>
  <n-list style="display: flex; flex-direction: column; height: 100%">
    <template #header>
      <n-button text style="font-size: 2rem; color: gold">
        <n-icon>
          <router-link to="/"> <i-note /></router-link>
        </n-icon>
      </n-button>
    </template>
    <template #footer>
      <n-tooltip trigger="hover" :show-arrow="false" placement="right">
        <template #trigger>
          <n-button @click="openDrawer('settings')" text color="#bebdc2">
            <n-icon><i-settings /></n-icon>
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
      <div v-if="isLoggedIn" class="f-center py-2">
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
      <div v-if="showArchived">Archived</div>
      <BoardList v-if="showBoards" :boards="boards" />
      <div v-if="showAnalytics">Analytics</div>
      <div v-if="showNotifications">Notifications</div>
      <div v-if="showSettings">Settings</div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { StickyNote as INote, Archive, FolderOpen, ChartPie, Bell, Cog as ISettings } from '@vicons/fa';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useAuth } from '@/use/auth';
import { useBoards } from '@/use/db';
import BoardList from '@/components/boards/drawers/BoardList.vue';

export default defineComponent({
  name: 'Sidebar',
  components: { INote, Archive, FolderOpen, ChartPie, Bell, ISettings, BoardList },
  setup() {
    const { t } = useI18n();
    const { data, all } = useBoards;
    const { auth, logout } = useAuth;
    const isLoggedIn = computed(() => !!auth.userSession?.user);

    onMounted(async () => await all());

    const currentRouteName = computed(() => useRoute().name);

    const nav = [
      { id: 'archived', component: Archive, label: t('archived') },
      { id: 'boards', component: FolderOpen, label: t('boards') },
      { id: 'analytics', component: ChartPie, label: t('analytics') },
      { id: 'notifications', component: Bell, label: t('notifications'), notifications: 3 },
    ];

    const state = reactive({
      drawer: false,
      title: '',
      showArchived: false,
      showBoards: false,
      showAnalytics: false,
      showNotifications: false,
      showSettings: false,
    });

    function openDrawer(type: string) {
      state.title = type;
      switch (type) {
        case 'archived':
          state.showArchived = true;
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
        default:
          break;
      }
      state.drawer = true;
    }

    function handleClose(show: boolean) {
      if (!show) {
        state.drawer = false;

        state.showArchived = false;
        state.showBoards = false;
        state.showAnalytics = false;
        state.showNotifications = false;
        state.showSettings = false;
        state.title = '';
      }
    }

    function isActive(id: string) {
      const routeName = currentRouteName.value?.toString().toUpperCase();
      return id.toUpperCase().includes(routeName!);
    }

    return {
      t,
      nav,
      isLoggedIn,
      logout,
      ...toRefs(data),
      currentRouteName,
      ...toRefs(state),
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
