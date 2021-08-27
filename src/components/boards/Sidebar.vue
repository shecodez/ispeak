<template>
  <n-list>
    <template #header>
      <n-button text style="font-size: 2rem; color: gold">
        <n-icon><i-note /></n-icon>
      </n-button>
    </template>
    <template #footer>
      <n-tooltip trigger="hover" :show-arrow="false" placement="right">
        <template #trigger>
          <n-button text color="#bebdc2">
            <n-icon><i-settings /></n-icon>
          </n-button>
        </template>
        {{ t('settings') }}
      </n-tooltip>
    </template>
    <template v-for="item in list" :key="item.label">
      <n-list-item>
        <n-badge dot :show="!!item.notifications" :value="item.notifications" color="#ffd700">
          <n-tooltip trigger="hover" :show-arrow="false" placement="right">
            <template #trigger>
              <n-button text :color="item.active ? '#ffd700' : '#bebdc2'">
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
    <n-list-item>
      <n-avatar round src="https://avatars.githubusercontent.com/u/14142384?v=4" />
    </n-list-item>
  </n-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { StickyNote as INote, Archive, FolderOpen, ChartPie, Bell, Cog as ISettings } from '@vicons/fa';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Sidebar',
  components: { INote, Archive, FolderOpen, ChartPie, Bell, ISettings },
  setup() {
    const { t } = useI18n();
    const list = [
      { component: Archive, label: t('boards') },
      { component: FolderOpen, label: t('board'), active: true }, // TODO: get current board title also if board is not active user Closed Folder Icon?
      { component: ChartPie, label: t('analytics') },
      { component: Bell, label: t('notifications'), notifications: 3 },
    ];
    return { t, list };
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
