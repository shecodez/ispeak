<template>
  <ul class="flex-1 grid grid-cols-5 gap-4">
    <li v-for="board in boards" :key="board.id">
      <div class="bg-gray-600 bg-opacity-30 rounded p-2">
        <Board :board="board" />
      </div>
    </li>
    <li class="border-4 border-dashed h-80 flex items-center justify-center">
      <button class="px-3 py-2 rounded bg-green-300 font-semibold">New Board</button>
    </li>
  </ul>

  <div class="flex justify-between items-center">
    <Pagination :onPage="7" :totalItems="36" />
    <button class="btn bg-red-500">🗑️</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Board from './Board.vue';
import Pagination from '../shared/Pagination.vue';

export default defineComponent({
  name: 'BoardList',
  components: { Board, Pagination },
  props: {
    boards: {
      type: Array,
      default: [],
    },
  },
});
</script>
