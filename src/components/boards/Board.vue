<template>
  <AlertMessage v-if="error" type="error" :message="error" />

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
        <router-link :to="{ name: 'Board.NewList', params: { id: board?.id } }" class="flex items-center gap-1">
          <i-mdi-plus />
          <b class="text-xs">{{ t('add_list') }}</b>
        </router-link>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTitle } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import draggable from 'vuedraggable';

import { useBoards, useLists } from '@/use/db';
import { Board, List as iList } from '@/data/types/mock';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import ConfirmDeleteDialog from '@/components/ui/ConfirmDeleteDialog.vue';
import List from '@/components/boards/List.vue';
import InPlaceEdit from '@/components/boards/InPlaceEdit.vue';

export default defineComponent({
  name: 'Board',
  components: {
    draggable,
    AlertMessage,
    ConfirmDeleteDialog,
    List,
    InPlaceEdit,
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const { data, getById, update, sort, del } = useBoards;
    const { add, update: updateList } = useLists;

    onMounted(async () => await getById(Number(route.params.id)));
    watch(
      () => route.params.id,
      (id) => {
        if (id) getById(Number(id));
      }
      //{ immediate: true }
    );

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
      // console.log('Board', board);
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
      del,
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
