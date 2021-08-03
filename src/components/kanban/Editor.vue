<template>
  <!-- grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 -->
  <draggable
    class="p-1 w-full h-full inline-flex thin-scrollbar"
    :class="isHorizontal ? 'overflow-y-hidden' : 'flex-col overflow-x-hidden'"
    :list="kanban?.boards"
    group="boards"
    @change="log"
    itemKey="id"
    handle=".handle"
    :animation="200"
  >
    <template #item="{ element, index }">
      <div class="board-container" :class="isHorizontal ? 'w-board max-h-11/12' : ''">
        <div
          class="board m-2 p-2 rounded border-t-4 overflow-hidden max-h-full flex flex-col"
          :class="element.isPublished ? (element.isEpic ? 'border-indigo-500' : 'border-green-500') : 'border-gray-500'"
        >
          <div class="board-header m-2 flex items-center justify-between">
            <div class="my-2">
              <h3 class="text-xl font-bold">{{ element.title }}</h3>
              <p>
                <span class="text-xs text-gray-400 mr-1">{{ index }}-{{ element.id }}</span>
                <Tooltip :text="t('preview')">🎬</Tooltip>
              </p>
            </div>

            <div class="handle text-2xl cursor-move">
              <Tooltip :text="t('move_board')">📌</Tooltip>
            </div>
          </div>

          <draggable
            class="note-container thin-scrollbar flex flex-col space-y-2 overflow-x-hidden overflow-y-auto"
            :list="element.notes"
            group="notes"
            @change="log"
            itemKey="id"
            :animation="200"
            ghost-class="ghost"
          >
            <template #item="{ element }">
              <div class="relative">
                <div
                  @click="openEditNoteDialog(element)"
                  class="sticky-note mx-2 cursor-pointer"
                  :style="`background-color: ${element.noteColor}; color: ${element.textColor}`"
                >
                  <div class="relative overflow-hidden">
                    <div class="note-text p-2 flex flex-col">
                      <b class="text-xs">{{ element.assignedTo }}</b>
                      <p>{{ element.text }}</p>
                      <i class="text-xs font-sans" :class="element.id === showHintId ? '' : 'hidden'">
                        {{ element.hint }}
                      </i>
                    </div>
                  </div>
                </div>
                <button
                  v-if="element.hint"
                  class="text-xs absolute top-1 right-4 z-10 text-black"
                  @click="setShowHintId(element.id)"
                >
                  {{ element.id === showHintId ? 'hide hint' : 'show hint' }}
                </button>
              </div>
            </template>
          </draggable>

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
      <div class="add-board-container" :class="isHorizontal ? 'w-board' : ''">
        <div class="border-4 border-dashed h-80 m-2 rounded f-center">
          <button @click="openBoardDialog" class="btn primary-green">{{ t('add_board') }}</button>
        </div>
      </div>
    </template>
  </draggable>

  <NewBoardDialog :showDialog="showBoardDialog" :onClose="closeBoardDialog" />
  <EditBoardDialog :edit="editBoard" :showDialog="showEditBoardDialog" :onClose="closeEditBoardDialog" />

  <NewNoteDialog :members="kanban.members" :showDialog="showNoteDialog" :onClose="closeNoteDialog" />
  <EditNoteDialog
    :edit="editNote"
    :members="kanban.members"
    :showDialog="showEditNoteDialog"
    :onClose="closeEditNoteDialog"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import draggable from 'vuedraggable';
import { useI18n } from 'vue-i18n';

import { Kanban } from '@/data/interfaces';
import NewBoardDialog from './dialogs/NewBoardDialog.vue';
import NewNoteDialog from './dialogs/NewNoteDialog.vue';
import EditNoteDialog from './dialogs/EditNoteDialog.vue';
import EditBoardDialog from './dialogs/EditBoardDialog.vue';
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
    kanban: {
      type: Object as PropType<Kanban>,
    },
    isHorizontal: {
      type: Boolean,
      default: true,
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

    const showHintId = ref();
    const setShowHintId = (id: number) => {
      if (showHintId.value === id) {
        return (showHintId.value = undefined);
      }
      showHintId.value = id;
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
      showHintId,
      setShowHintId,
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
.w-board {
  @apply w-full md:w-1/2 lg:w-1/3 xl:w-1/5;
}
.board-container,
.add-board-container {
  flex: 0 0 auto;
}
</style>
