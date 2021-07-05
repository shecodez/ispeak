<template>
  <div class="m-3 flex justify-between">
    <div class="flex items-center space-x-2">
      <h1 class="text-xl">Untitled Kanban</h1>
      <button class="btn hover:bg-yellow-300">✏️</button>
    </div>

    <div class="flex space-x-1">
      <button class="btn bg-light-blue-300">Cast ✨</button>
      <button class="btn bg-teal-300">Publish ✔️</button>
      <button class="btn bg-amber-300">⚙️<span class="sr-only">Settings</span></button>
    </div>
  </div>

  <div class="mx-3 flex flex-col flex-1">
    <BoardList :boards="boards" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import BoardList from '../components/kanban/BoardList.vue';

export default defineComponent({
  name: 'Kanban',
  components: { BoardList },
  setup() {
    const boards = [
      {
        id: 'f9NF1oDUt68PZaPVKauN',
        title: "Niico's Board",
        notes: [
          { id: 1, text: 'Have faith, relax, and give it your all', color: 'yellow' },
          { id: 2, text: 'Here is a brand new task', color: 'green' },
        ],
      },
      {
        id: 'teSyEI3jveltdztYIAdq',
        title: 'Second Board',
        notes: [
          {
            id: 3,
            text: 'Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth. ~Marcus Airelius',
            color: 'blue',
          },
          { id: 4, text: 'I think it works', color: 'red' },
        ],
      },
    ];

    return { boards };
  },
});
</script>
