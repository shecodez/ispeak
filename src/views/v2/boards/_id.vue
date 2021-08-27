<template>
  <FixedFrame showBottomFrame :isHiddenOverflowY="isHiddenOverflowY">
    <Spinner v-if="isLoading" />
    <aside v-if="board" class="toolbar p-3 pb-1">
      <div class="flex items-center gap-2">
        <button class="scale-up-btn">⭐</button>
        <V2InPlaceEdit :value="board.title" @submit="updateTitle" showButtons css="text-xl font-bold" />
      </div>

      <div class="flex items-center gap-2">
        <button class="btn border">{{ board.is_public ? '🌎 Public' : '🔒 Private' }}</button>
        <!-- <IconGroup :items="currentBoard.members" />   -->
        <!-- <select v-if="board.lists?.length" class="text-black">
          <template v-for="list in board.lists" :key="list.id">
            <option :value="list.id">
              <b>{{ list.title }}</b>
              <Badge :color="list.publish_date ? 'green' : ''">
                {{ list.publish_date ? ' - published' : ' - draft' }}
              </Badge>
            </option>
          </template>
        </select> -->
        <button class="scale-up-btn" @click="isEditing = true">⚙️</button>
      </div>
    </aside>

    <AlertMessage v-if="error" type="error" :message="error" />
    <template v-else>
      <draggable
        class="thin-scrollbar px-3 w-full h-full flex"
        :class="isHiddenOverflowY ? 'overflow-y-hidden' : 'flex-col overflow-x-hidden'"
        :list="board?.lists"
        group="lists"
        @change="log"
        itemKey="id"
        handle=".handle"
        :animation="200"
      >
        <template #item="{ element, index }">
          <V2List :list="element" :isHiddenOverflowY="isHiddenOverflowY" :position="index" />
        </template>
        <template #footer>
          <div class="add-list f-center list-container">
            <V2AddList :addList="addList" />
          </div>
        </template>
      </draggable>
    </template>

    <template v-slot:bottom>
      <button class="primary-red rounded-tl-3xl h-full w-16" @click="isDeleting = true">
        <Tooltip :text="t('delete_board')" placement="left">🗑️</Tooltip>
        <span class="sr-only">Delete Board/D&D Delete List/View Delete Activity</span>
      </button>
    </template>
  </FixedFrame>

  <V2BoardFormDialog
    action="Update Board"
    :showDialog="isEditing"
    :edit="board"
    :onSubmit="updateBoard"
    :onClose="close"
    :onDelete="deleteBoard"
  />

  <ConfirmDeleteDialog :showDialog="isDeleting" :onClose="close" :onDelete="deleteBoard" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTitle } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import draggable from 'vuedraggable';

import { useBoards, useLists } from '@/use/db';
import { Board, List as iList } from '@/data/types/mock';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import FixedFrame from '@/components/layouts/FixedFrame.vue';
import Badge from '@/components/ui/Badge.vue';
import ConfirmDeleteDialog from '@/components/ui/ConfirmDeleteDialog.vue';
import IconGroup from '@/components/ui/IconGroup.vue';
import V2InPlaceEdit from '@/components/v2/boards/InPlaceEdit.vue';
import V2AddList from '@/components/v2/boards/AddList.vue';
import V2List from '@/components/v2/boards/List.vue';
import V2BoardFormDialog from '@/components/v2/boards/dialogs/BoardFormDialog.vue';

export default defineComponent({
  name: 'v2Board',
  components: {
    draggable,
    FixedFrame,
    AlertMessage,
    IconGroup,
    Badge,
    ConfirmDeleteDialog,
    V2AddList,
    V2List,
    V2InPlaceEdit,
    V2BoardFormDialog,
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const { data, getById, update, sort, del } = useBoards;
    const { add, update: updateList } = useLists;

    onMounted(async () => await getById(Number(route.params.id)));

    const board = computed(() => data.currentBoard);

    const state = reactive({
      isDeleting: false,
      isEditing: false,
      isHiddenOverflowY: true,
    });

    const title = computed(() => `${data.currentBoard?.title} · 🎬 ${import.meta.env.VITE_APP_NAME}`);
    useTitle(title);

    async function updateBoard(board: Board) {
      await update({ ...data.currentBoard, ...board });
      console.log('Board', board);
      // board.lists?.map(async (list) => {
      //   const listInState = data.currentBoard?.lists?.find((l) => l.id === list.id);
      //   if (list !== listInState) {
      //     await updateList(list);
      //   }
      // });
    }

    async function updateTitle(title: string) {
      await update({ ...data.currentBoard!, title });
    }

    async function deleteBoard() {
      const board = data.currentBoard;
      if (board) {
        await del(board);
        router.push('/boards');
      }
    }

    const addList = async (list: iList) => {
      const board = data.currentBoard;
      await add(board!, {
        ...list,
        position: board?.lists?.length || 0,
      });
    };

    function close() {
      state.isDeleting = false;
      state.isEditing = false;
    }

    async function log(e: any) {
      //const { element, oldIndex, newIndex } = e.moved;
      await sort(data.currentBoard!);
    }

    return {
      t,
      ...toRefs(data),
      ...toRefs(state),
      board,
      updateBoard,
      updateTitle,
      deleteBoard,
      addList,
      close,
      log,
    };
  },
});
</script>

<style scoped>
.add-list {
  @apply m-2 border-4 border-dashed rounded h-80;
}
</style>
