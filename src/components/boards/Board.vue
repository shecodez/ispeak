<template>
  <div class="board-container" :class="isHorizontal ? 'w-board max-h-11/12' : ''">
    <div
      class="board m-2 p-2 rounded border-t-4 overflow-hidden max-h-full flex flex-col"
      :class="board.isPublished ? (board.isEpic ? 'border-indigo-500' : 'border-green-500') : 'border-gray-500'"
    >
      <div class="board-header m-2 flex items-center justify-between">
        <div class="my-2">
          <h3 class="text-xl font-bold">{{ board.title }}</h3>
          <p>
            <span class="text-xs text-gray-400 mr-1">{{ index }}-{{ board.id }}</span>
            <Tooltip :text="t('preview')">🎬</Tooltip>
          </p>
        </div>

        <div class="handle text-2xl cursor-move">
          <Tooltip :text="t('move_board')">📌</Tooltip>
        </div>
      </div>

      <slot />

      <div class="board-footer mt-1 mb-2 flex items-center">
        <TooltipButton
          iconBtn
          :tooltip="t('add_note')"
          buttonCss="btn hover:bg-green-400"
          text="➕"
          @on-click="openNoteDialog"
        />
        <TooltipButton
          iconBtn
          :tooltip="t('edit_board')"
          buttonCss="btn hover:bg-yellow-400"
          text="✏️"
          @on-click="openEditBoardDialog(board)"
        />
        <div class="ml-auto">
          <Tooltip :text="t('delete_board')">
            <!-- TODO: Delete Board / D&D delete Note -->
            <InlineDeleteButton :onDelete="handleDeleteBoard" />
          </Tooltip>
        </div>
      </div>
    </div>
  </div>

  <NewNoteDialog :showDialog="showNoteDialog" :closeDialogFn="closeNoteDialog" />
  <EditNoteDialog :note="editNote" :showDialog="showEditNoteDialog" :closeDialogFn="closeEditNoteDialog" />

  <EditBoardDialog :board="editBoard" :showDialog="showEditBoardDialog" :closeDialogFn="closeEditBoardDialog" />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Board, Note } from '@/data/interfaces';
import NewNoteDialog from '../kanban/dialogs/NewNoteDialog.vue';
import EditNoteDialog from '../kanban/dialogs/EditNoteDialog.vue';
import EditBoardDialog from '../kanban/dialogs/EditBoardDialog.vue';
import InlineDeleteButton from '@/components/ui/ConfirmDeleteInline.vue';
import Tooltip from '@/components/ui/Tooltip.vue';

export default defineComponent({
  name: 'Board',
  components: { Tooltip, NewNoteDialog, InlineDeleteButton, EditNoteDialog, EditBoardDialog },
  props: {
    board: {
      type: Object as PropType<Board>,
    },
  },
  setup() {
    const { t } = useI18n();

    const showNoteDialog = ref(false);
    const openNoteDialog = () => {
      showNoteDialog.value = true;
    };
    const closeNoteDialog = () => {
      showNoteDialog.value = false;
    };

    const editNote = ref<Note | null>(null);
    const showEditNoteDialog = ref(false);
    const openEditNoteDialog = (note: Note) => {
      editNote.value = note;
      showEditNoteDialog.value = true;
    };
    const closeEditNoteDialog = () => {
      showEditNoteDialog.value = false;
      editNote.value = null;
    };

    const editBoard = ref<Board | null>(null);
    const showEditBoardDialog = ref(false);
    const openEditBoardDialog = (board: Board) => {
      editBoard.value = board;
      showEditBoardDialog.value = true;
    };
    const closeEditBoardDialog = () => {
      showEditBoardDialog.value = false;
      editBoard.value = null;
    };

    const handleDeleteBoard = () => {};

    return {
      showNoteDialog,
      openNoteDialog,
      closeNoteDialog,
      editNote,
      showEditNoteDialog,
      openEditNoteDialog,
      closeEditNoteDialog,
      editBoard,
      showEditBoardDialog,
      openEditBoardDialog,
      closeEditBoardDialog,
      handleDeleteBoard,
      t,
    };
  },
});
</script>
