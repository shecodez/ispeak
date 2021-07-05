<template>
  <div class="flex items-center justify-between m-2">
    <div class="my-2">
      <div class="flex space-x-1">
        <h3 class="text-xl font-bold">{{ board.title }}</h3>
        <button>🎬<span class="sr-only">Preview Board</span></button>
      </div>
      <p class="text-xs text-indigo-500 dark:text-indigo-300">{{ board.id }}</p>
    </div>
    <button class="text-2xl cursor-move">📌</button>
  </div>

  <ul>
    <li v-for="note in board.notes" :key="note.id">
      <div class="note p-4 my-1 rounded cursor-pointer" :class="`bg-${note.color}-300`">
        <p>{{ note.text }}</p>
      </div>
    </li>
  </ul>

  <div class="flex my-2">
    <button class="btn hover:bg-green-300">➕</button>
    <button class="btn hover:bg-yellow-300">✏️</button>
    <button class="btn hover:bg-red-500 ml-auto">🗑️</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Board',
  props: {
    board: {
      type: Object,
      default: {},
    },
  },
});
</script>
