<template>
  <ul class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
    <li v-for="board in boards" :key="board.id">
      <div class="bg-gray-600 bg-opacity-30 rounded p-2">
        <Board :board="board" />
      </div>
    </li>
    <li class="border-4 border-dashed h-80 flex items-center justify-center rounded">
      <button @click="openBoardDialog" class="px-3 py-2 rounded bg-green-300 font-semibold">
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
import Tooltip from '../Tooltip.vue';
import Modal from '../shared/Modal.vue';
import NewBoardDialog from './dialogs/NewBoardDialog.vue';

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
