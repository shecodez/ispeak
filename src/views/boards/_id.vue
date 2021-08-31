<template>
  <Layout>
    <template v-slot:header>
      <BoardHeader :board="board" />
    </template>

    <draggable
      class="w-full h-full flex"
      :class="isHiddenOverflowY ? 'overflow-y-hidden' : 'flex-col overflow-x-hidden'"
      :list="board?.lists"
      group="lists"
      @change="log"
      itemKey="id"
      handle=".handle"
      :animation="200"
    >
      <template #item="{ element, index }">
        <List :list="element" :isHiddenOverflowY="isHiddenOverflowY" :position="index" />
      </template>
      <template #footer>
        <div class="list-container">
          <AddList :addList="addList" />
        </div>
      </template>
    </draggable>

    <n-tooltip trigger="hover" :show-arrow="false">
      <template #trigger>
        <n-button circle size="large" color="#ffd700" class="fab">
          <template #icon>
            <n-icon><i-activity /></n-icon>
          </template>
        </n-button>
      </template>
      {{ t('activity') }}
    </n-tooltip>
  </Layout>

  <BoardFormDialog
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
import { List as IActivity } from '@vicons/fa';

import { useBoards, useLists } from '@/use/db';
import { Board, List as iList } from '@/data/types/mock';
import Layout from '@/layouts/Default.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Badge from '@/components/ui/Badge.vue';
import ConfirmDeleteDialog from '@/components/ui/ConfirmDeleteDialog.vue';
import IconGroup from '@/components/ui/IconGroup.vue';
import AddList from '@/components/boards/AddList.vue';
import List from '@/components/boards/List.vue';
import InPlaceEdit from '@/components/boards/InPlaceEdit.vue';
import BoardFormDialog from '@/components/boards/dialogs/BoardFormDialog.vue';
import BoardHeader from '@/components/boards/BoardHeader.vue';

export default defineComponent({
  name: 'Board',
  components: {
    draggable,
    Layout,
    AlertMessage,
    IconGroup,
    Badge,
    ConfirmDeleteDialog,
    AddList,
    List,
    InPlaceEdit,
    BoardFormDialog,
    IActivity,
    BoardHeader,
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
.fab {
  position: fixed;
  bottom: 1em;
  right: 1.4em;
  @apply shadow;
}
</style>
