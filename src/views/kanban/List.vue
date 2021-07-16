<template>
  <div class="kanban-list ml-16">
    <div class="kanban-list-header mb-3 flex-toolbar-h">
      <h1 class="text-2xl">{{ t('my_kanbans') }}</h1>
      <button class="btn bg-green-500">➕ {{ t('add_kanban') }}</button>
    </div>

    <div v-if="!kanbans.length">No Kanbans yet...</div>
    <div v-else v-for="kanban in kanbans" :key="kanban.id">
      {{ kanban.title }}
    </div>
  </div>

  <button @click="openDeleteKanbanDialog" class="fixed bottom-0 right-0 rounded-tl-3xl w-16 h-16 f-center bg-red-500">
    <Tooltip :text="t('delete_kanban')" placement="left">🗑️</Tooltip>
    <span class="sr-only">Delete Kanban/D&D Board</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Tooltip from '@/components/ui/Tooltip.vue';

export default defineComponent({
  name: 'KanbanList',
  components: { Tooltip },
  setup() {
    const { t } = useI18n();

    const kanbans = ref([]);

    return { kanbans, t };
  },
});
</script>
