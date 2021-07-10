<template>
  <div class="flex items-center justify-between m-2">
    <div class="my-2">
      <div class="flex space-x-1">
        <h3 class="text-xl font-bold">{{ board.title }}</h3>
        <button>
          <Tooltip :text="t('preview')">🎬</Tooltip>
          <span class="sr-only">Preview</span>
        </button>
      </div>
      <p class="text-xs text-indigo-500 dark:text-indigo-300">{{ board.id }}</p>
    </div>
    <Tooltip :text="t('move_board')">
      <button class="text-2xl cursor-move">📌<span class="sr-only">Move Board</span></button>
    </Tooltip>
  </div>

  <ul>
    <li v-for="note in board.notes" :key="note.id">
      <div
        @click="openEditNoteDialog(note)"
        class="note p-4 my-1 rounded cursor-pointer"
        :style="`background-color: ${note.color};`"
      >
        <p>{{ note.text }}</p>
      </div>
    </li>
  </ul>

  <div class="flex my-2">
    <Tooltip :text="t('add_note')">
      <button @click="openNoteDialog" class="btn hover:bg-green-300">➕<span class="sr-only">add note</span></button>
    </Tooltip>
    <Tooltip :text="t('edit_board')">
      <button @click="openEditBoardDialog(board)" class="btn hover:bg-yellow-300">
        ✏️<span class="sr-only">Edit Board</span>
      </button>
    </Tooltip>

    <div class="ml-auto">
      <Tooltip :text="t('delete_board')">
        <!-- <button class="btn hover:bg-red-500">🗑️<span class="sr-only">Delete Board / D&D delete Note</span></button> -->
        <InlineDeleteButton :onDelete="handleDeleteBoard" />
      </Tooltip>
    </div>
  </div>

  <NewNoteDialog :showDialog="showNoteDialog" :closeDialogFn="closeNoteDialog" />
  <EditNoteDialog :note="editNote" :showDialog="showEditNoteDialog" :closeDialogFn="closeEditNoteDialog" />

  <EditBoardDialog :board="editBoard" :showDialog="showEditBoardDialog" :closeDialogFn="closeEditBoardDialog" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Tooltip from '../Tooltip.vue';
import NewNoteDialog from './dialogs/NewNoteDialog.vue';
import InlineDeleteButton from '../shared/ConfirmDeleteInline.vue';
import EditNoteDialog, { EditNote } from './dialogs/EditNoteDialog.vue';
import EditBoardDialog, { EditBoard } from './dialogs/EditBoardDialog.vue';

export default defineComponent({
  name: 'Board',
  components: { Tooltip, NewNoteDialog, InlineDeleteButton, EditNoteDialog, EditBoardDialog },
  props: {
    board: {
      type: Object,
      default: {},
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

    const editNote = ref<EditNote | null>(null);
    const showEditNoteDialog = ref(false);
    const openEditNoteDialog = (note: EditNote) => {
      editNote.value = note;
      showEditNoteDialog.value = true;
    };
    const closeEditNoteDialog = () => {
      showEditNoteDialog.value = false;
      editNote.value = null;
    };

    const editBoard = ref<EditBoard | null>(null);
    const showEditBoardDialog = ref(false);
    const openEditBoardDialog = (board: EditBoard) => {
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
