<template>
  <draggable
    class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    :list="kanban.boards"
    group="boards"
    @change="log"
    itemKey="id"
    handle=".handle"
    :animation="200"
  >
    <template #item="{ element, index }">
      <div class="board-container overflow-hidden">
        <div
          class="board rounded p-2 border-t-4 overflow-hidden max-h-screen md:max-h-full flex flex-col"
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

          <draggable
            class="note-container flex flex-col space-y-2 overflow-y-auto md:overflow-x-hidden"
            :list="element.notes"
            group="notes"
            @change="log"
            itemKey="id"
            :animation="200"
            ghost-class="ghost"
          >
            <template #item="{ element }">
              <div
                @click="openEditNoteDialog(element)"
                class="note p-4 mx-2 rounded cursor-pointer"
                :style="`background-color: ${element.color}`"
              >
                <p>{{ element.text }}</p>
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

    // computed(() => {
    //   kanban: {
    //     get() { return store.state.kanban },
    //     set(value) { store.commit('UPDATE_KANBAN', value)}
    //   }
    // })

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
              {
                id: 5,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. Elit ullamcorper dignissim cras tincidunt. ',
                color: '#fcd34d',
              },
              {
                id: 6,
                text: 'Ultricies lacus sed turpis tincidunt id aliquet risus. Donec pretium vulputate sapien nec sagittis aliquam. Tristique senectus et netus et malesuada. Facilisi cras fermentum odio eu. Porttitor rhoncus dolor purus non enim praesent elementum facilisis leo. Lorem ipsum dolor sit amet consectetur adipiscing elit.',
                color: '#6ee7b7',
              },
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
.board {
  @apply bg-gray-600 bg-opacity-30;
}
.ghost {
  @apply opacity-50 border-dashed border border-cyan-300;
}
.drag {
  @apply opacity-100;
}
.note-container {
  @apply scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-track-gray-700;
}
</style>
