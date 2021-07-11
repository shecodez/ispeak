<template>
  <div class="mx-3">
    <h1 class="text-4xl my-3">{{ t('my_kanbans') }}</h1>

    <DraggableNextDemo />
  </div>

  <button @click="openDeleteKanbanDialog" class="fixed bottom-0 right-0 rounded-tl-3xl w-16 h-16 f-center bg-red-500">
    <Tooltip :text="t('delete_kanban')" placement="left">🗑️</Tooltip>
    <span class="sr-only">Delete Kanban/D&D Board</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import Tooltip from '@/components/Tooltip.vue';
import DraggableNextDemo from '../components/DraggableNextDemo.vue';

export default defineComponent({
  name: 'Kanbans',
  components: { Tooltip, DraggableNextDemo },
  setup() {
    const { t } = useI18n();

    return { t };
  },
});
</script>
