<template>
  <div class="kanban-details-header mb-3 flex-toolbar-h">
    <div class="flex items-center space-x-2">
      <span class="text-2xl hover:transform hover:scale-110">⭐</span>
      <!-- <router-link to="/kanbans" class="text-2xl hover:transform hover:scale-110">
        <Tooltip :text="t('my_kanbans')" placement="top-right">🍱</Tooltip>
        <span class="sr-only">My Kanbans</span>
      </router-link> -->
      <EditInputInline ref="titleInput" :text="kanban.title" :tooltip="t('edit_title')" @on-update="updateTitle" />
    </div>

    <div class="flex flex-wrap items-center justify-between md:space-x-2">
      <div class="flex items-center m-3 md:m-0">
        <template v-for="i in 3" :key="i">
          <div class="overlapping-icon-group">
            {{ i }}
          </div>
        </template>
        <span class="text-sm mx-2 italic text-gray-500">+5 more</span>
      </div>
      <Menu :list="publishList" w="w-48 max-w-56">
        <template v-slot:activator>
          <button class="btn bg-green-500 whitespace-nowrap">{{ t('publish') }} ✔️</button>
        </template>
      </Menu>
      <button class="text-2xl hover:transform hover:scale-110" @click="openKanbanSettingsDialog">
        <Tooltip :text="t('kanban_settings')" placement="bottom-left">⚙️</Tooltip>
        <span class="sr-only">Kanban Settings</span>
      </button>
    </div>
  </div>

  <div class="kanban-details-main flex-1 flex overflow-hidden">
    <Editor kanbanId="1" />
  </div>

  <div class="kanban-details-footer mt-3 flex justify-center md:justify-between">
    <Pagination :onPage="7" :totalItems="36" />
  </div>

  <button @click="openDeleteKanbanDialog" class="fixed-bottom-btn bg-red-500">
    <Tooltip :text="t('delete_kanban')" placement="left">🗑️</Tooltip>
    <span class="sr-only">Delete Kanban/D&D Board</span>
  </button>

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

import EditInputInline from '@/components/ui/EditInputInline.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import Pagination from '@/components/ui/Pagination.vue';
import ConfirmDeleteDialog from '@/components/ui/ConfirmDeleteDialog.vue';
import KanbanSettingsDialog from '@/components/kanban/dialogs/KanbanSettingsDialog.vue';
import Menu from '@/components/ui/Menu.vue';
import Editor from '@/components/kanban/Editor.vue';

export default defineComponent({
  name: 'Kanban',
  components: { EditInputInline, Tooltip, Pagination, ConfirmDeleteDialog, KanbanSettingsDialog, Menu, Editor },
  setup() {
    const { t } = useI18n();
    const kanban = {
      title: 'Untitled Kanban',
      boards: [
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
      ],
    };

    const publishList = computed(() => {
      return kanban.boards.map((b) => ({ id: b.id, title: b.title, isChecked: b.isPublished }));
    });

    const titleInput = ref();
    const updateTitle = (title: string) => {
      console.log('Update Kanban Title:', title);
      titleInput.value.closeEdit();
    };

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
      kanban,
      publishList,
      titleInput,
      updateTitle,
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
  @apply w-10 h-10 border bg-gray-500 rounded-full flex items-center justify-center hover:transform hover:scale-110 -ml-2;
}
.kanban-details-header,
.kanban-details-main,
.kanban-details-footer {
  @apply ml-16;
}
</style>
