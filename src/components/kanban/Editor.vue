<template>
  <draggable
    class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    :list="kanban.boards"
    group="boards"
    @change="log"
    itemKey="id"
    handle=".handle"
  >
    <template #item="{ element, index }">
      <div class="board-container">
        <div
          class="board bg-gray-600 bg-opacity-30 rounded p-2 border-t-4"
          :class="element.isPublished ? ' border-green-500' : 'border-gray-500'"
        >
          <div class="board-header m-2 flex items-center justify-between">
            <div class="my-2">
              <div class="flex space-x-1">
                <h3 class="text-xl font-bold">{{ element.title }}</h3>
                <TooltipButton iconBtn :tooltip="t('preview')" text="🎬" />
              </div>
              <p class="text-xs text-gray-500">{{ index }}-{{ element.id }}</p>
            </div>

            <div class="handle text-2xl cursor-move">
              <Tooltip :text="t('move_board')">📌</Tooltip>
            </div>
          </div>

          <draggable class="note-container pb-2" :list="element.notes" group="notes" @change="log" itemKey="id">
            <template #item="{ element, index }">
              <div
                @click="openEditNoteDialog(element)"
                class="note p-4 m-2 rounded cursor-pointer"
                :style="`background-color: ${element.color}`"
              >
                <p>{{ element.text }} {{ index }}</p>
              </div>
            </template>
          </draggable>

          <div class="board-footer mb-2 flex items-center">
            <TooltipButton
              iconBtn
              :tooltip="t('add_note')"
              buttonCss="btn hover:bg-green-500"
              text="➕"
              @on-click="openNoteDialog"
            />
            <TooltipButton
              iconBtn
              :tooltip="t('edit_board')"
              buttonCss="btn hover:bg-yellow-500"
              text="✏️"
              @on-click="openEditBoardDialog(element)"
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
    </template>
    <template #footer>
      <div class="border-4 border-dashed h-80 flex items-center justify-center rounded">
        <button @click="openBoardDialog" class="btn bg-green-400">{{ t('add_board') }}</button>
      </div>
    </template>
  </draggable>

  <NewBoardDialog :showDialog="showBoardDialog" :closeDialogFn="closeBoardDialog" />
  <EditBoardDialog :board="editBoard" :showDialog="showEditBoardDialog" :closeDialogFn="closeEditBoardDialog" />

  <NewNoteDialog :showDialog="showNoteDialog" :closeDialogFn="closeNoteDialog" />
  <EditNoteDialog :note="editNote" :showDialog="showEditNoteDialog" :closeDialogFn="closeEditNoteDialog" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';
import { useI18n } from 'vue-i18n';

import NewBoardDialog from './dialogs/NewBoardDialog.vue';
import NewNoteDialog from './dialogs/NewNoteDialog.vue';
import EditNoteDialog, { EditNote } from './dialogs/EditNoteDialog.vue';
import EditBoardDialog, { EditBoard } from './dialogs/EditBoardDialog.vue';
import InlineDeleteButton from '@/components/ui/ConfirmDeleteInline.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import TooltipButton from '@/components/ui/TooltipButton.vue';

export default defineComponent({
  name: 'KanbanEditor',
  components: {
    draggable,
    NewBoardDialog,
    NewNoteDialog,
    InlineDeleteButton,
    EditNoteDialog,
    EditBoardDialog,
    Tooltip,
    TooltipButton,
  },
  props: {
    kanbanId: {
      type: [String, Number],
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();

    const showBoardDialog = ref(false);
    const openBoardDialog = () => {
      showBoardDialog.value = true;
    };
    const closeBoardDialog = () => {
      showBoardDialog.value = false;
    };
    const handleDeleteBoard = () => {};

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

    const log = (evt: any) => {
      console.log(evt);
    };

    return {
      showBoardDialog,
      openBoardDialog,
      closeBoardDialog,
      editBoard,
      showEditBoardDialog,
      openEditBoardDialog,
      closeEditBoardDialog,
      handleDeleteBoard,
      showNoteDialog,
      openNoteDialog,
      closeNoteDialog,
      editNote,
      showEditNoteDialog,
      openEditNoteDialog,
      closeEditNoteDialog,
      log,
      t,
    };
  },
  data() {
    return {
      kanban: {
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
      },
    };
  },
});
</script>

<style scoped>
.ghost-card {
  @apply opacity-50 border border-blue-500 bg-gray-200;
}
</style>
