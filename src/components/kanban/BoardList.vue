<template>
  <ul class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
    <li v-for="board in boards" :key="board.id">
      <Board :board="board" />
    </li>
    <li class="border-4 border-dashed h-80 flex items-center justify-center rounded">
      <button @click="openBoardDialog" class="px-3 py-2 rounded bg-green-500 font-semibold">
        {{ t('add_board') }}
      </button>
    </li>
  </ul>

  <NewBoardDialog :showDialog="showBoardDialog" :closeDialogFn="closeBoardDialog" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Board from './Board.vue';
import NewBoardDialog from './dialogs/NewBoardDialog.vue';
import Modal from '@/components/ui/Modal.vue';
import Tooltip from '@/components/ui/Tooltip.vue';

export default defineComponent({
  name: 'BoardList',
  components: { Board, Tooltip, Modal, NewBoardDialog },
  props: {
    boards: {
      type: Array,
      default: [],
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

    return { showBoardDialog, openBoardDialog, closeBoardDialog, t };
  },
});
</script>
