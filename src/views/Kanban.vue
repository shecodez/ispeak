<template>
  <div class="m-3 flex flex-wrap md:justify-between">
    <div class="flex items-center space-x-2">
      <button class="text-2xl hover:transform hover:scale-110">
        <Tooltip :text="t('my_kanbans')" placement="top-right">🍱</Tooltip>
        <span class="sr-only">My Kanbans</span>
      </button>
      <h1 class="text-xl whitespace-nowrap">{{ t('untitled') }}</h1>
      <Tooltip :text="t('edit_title')">
        <button class="btn hover:bg-yellow-300">✏️<span class="sr-only">Edit Title</span></button>
      </Tooltip>
    </div>

    <div class="flex flex-wrap items-center justify-end md:justify-between">
      <div class="flex items-center m-3 md:m-0">
        <template v-for="i in 3" :key="i">
          <div class="overlapping-icon-group">
            {{ i }}
          </div>
        </template>
        <span class="text-sm mx-2">+5 more</span>
      </div>
      <Menu :list="publishList">
        <template v-slot:activator>
          <button class="btn bg-green-300 whitespace-nowrap">{{ t('publish') }} ✔️</button>
        </template>
      </Menu>
      <button class="pl-2 text-2xl hover:transform hover:scale-110" @click="openKanbanSettingsDialog">
        <Tooltip :text="t('kanban_settings')" placement="bottom-left">⚙️</Tooltip>
        <span class="sr-only">Kanban Settings</span>
      </button>
    </div>
  </div>

  <div class="mx-3 flex flex-col flex-1">
    <BoardList :boards="boards" />
  </div>

  <div class="mx-3 my-2 md:my-0 flex space-y-2 md:space-y-0 flex-wrap justify-center md:justify-between items-center">
    <Pagination :onPage="7" :totalItems="36" />
    <Tooltip :text="t('delete_kanban')" placement="left">
      <button @click="openDeleteKanbanDialog" class="btn bg-red-500">
        🗑️<span class="sr-only">Delete Kanban/D&D Board</span>
      </button>
    </Tooltip>
  </div>

  <KanbanSettingsDialog :showDialog="showKanbanSettingsDialog" :onClose="closeKanbanSettingsDialog" />

  <ConfirmDeleteDialog
    :showDialog="showDeleteKanbanDialog"
    :onClose="closeDeleteKanbanDialog"
    :onDelete="deleteKanban"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BoardList from '@/components/kanban/BoardList.vue';
import Tooltip from '@/components/Tooltip.vue';
import Pagination from '@/components/shared/Pagination.vue';
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog.vue';
import KanbanSettingsDialog from '../components/kanban/dialogs/KanbanSettingsDialog.vue';
import Menu from '../components/shared/Menu.vue';

export default defineComponent({
  name: 'Kanban',
  components: { BoardList, Tooltip, Pagination, ConfirmDeleteDialog, KanbanSettingsDialog, Menu },
  setup() {
    const { t } = useI18n();
    const boards = [
      {
        id: 'f9NF1oDUt68PZaPVKauN',
        priority: 0,
        title: "Niico's Board",
        notes: [
          { id: 1, text: 'Have faith, relax, and give it your all', color: '#fcd34d' },
          { id: 2, text: 'Here is a brand new task', color: '#6ee7b7' },
        ],
        isPublished: true,
        uid: 'l334',
      },
      {
        id: 'teSyEI3jveltdztYIAdq',
        priority: 1,
        title: 'Second Board',
        notes: [
          {
            id: 3,
            text: 'Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth. ~Marcus Airelius',
            color: '#93c5fd',
          },
          { id: 4, text: 'I think it works', color: '#fca5a5' },
        ],
        isPublished: false,
        uid: 'l334',
      },
    ];

    const publishList = computed(() => {
      return boards.map((b) => ({ id: b.id, title: b.title, isChecked: b.isPublished }));
    });

    const showKanbanSettingsDialog = ref(false);
    const openKanbanSettingsDialog = () => {
      showKanbanSettingsDialog.value = true;
    };
    const closeKanbanSettingsDialog = () => {
      showKanbanSettingsDialog.value = false;
    };

    const showDeleteKanbanDialog = ref(false);
    const openDeleteKanbanDialog = () => {
      showDeleteKanbanDialog.value = true;
    };
    const closeDeleteKanbanDialog = () => {
      showDeleteKanbanDialog.value = false;
    };
    const deleteKanban = () => {
      console.log('Delete Kanaban');
      closeKanbanSettingsDialog();
      // router.next('/kanbans')
    };

    return {
      t,
      boards,
      publishList,
      showKanbanSettingsDialog,
      openKanbanSettingsDialog,
      closeKanbanSettingsDialog,
      showDeleteKanbanDialog,
      openDeleteKanbanDialog,
      closeDeleteKanbanDialog,
      deleteKanban,
    };
  },
});
</script>

<style scoped>
.overlapping-icon-group {
  @apply w-10 h-10 border bg-blue-400 rounded-full flex items-center justify-center hover:transform hover:scale-110 -ml-2;
}
</style>
