<template>
  <FixedFrame showBottomFrame :isHorizontal="isRow">
    <aside class="toolbar flex items-center justify-between py-2 px-4">
      <button @click="isRow = !isRow" class="bg-yellow-400 rounded-full px-3 py-2">Toggle Layout</button>
      <div>{{ isRow ? 'horizontal' : 'vertical' }}</div>
    </aside>

    <Editor :kanban="kanban" :isHorizontal="isRow" />
    <!-- <Pagination /> -->
    <template v-slot:bottom>
      <button class="bg-red-500 rounded-tl-3xl h-full w-16">🧪</button>
    </template>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import FixedFrame from '@/components/layouts/FixedFrame.vue';
import Editor from '@/components/kanban/Editor.vue';
import Pagination from '@/components/ui/Pagination.vue';

export default defineComponent({
  name: 'Test',
  components: { FixedFrame, Editor, Pagination },
  setup() {
    const isRow = ref(true);

    return { isRow };
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
              { id: 1, text: 'Have faith, relax, and give it your all', noteColor: '#fcd34d', textColor: '#333' },
              { id: 2, text: 'Here is a brand new task', noteColor: '#6ee7b7', textColor: '#333' },
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
                noteColor: '#93c5fd',
                textColor: '#333',
              },
              { id: 4, text: 'I think it works', noteColor: '#fca5a5', textColor: '#333' },
              {
                id: 5,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. Elit ullamcorper dignissim cras tincidunt. ',
                noteColor: '#fcd34d',
                textColor: '#333',
              },
              {
                id: 6,
                text: 'Ultricies lacus sed turpis tincidunt id aliquet risus. Donec pretium vulputate sapien nec sagittis aliquam. Tristique senectus et netus et malesuada. Facilisi cras fermentum odio eu. Porttitor rhoncus dolor purus non enim praesent elementum facilisis leo. Lorem ipsum dolor sit amet consectetur adipiscing elit.',
                noteColor: '#6ee7b7',
                textColor: '#333',
              },
            ],
            isPublished: false,
            uid: 'l334',
          },
          {
            id: '34sdg',
            title: 'Epic Board',
            notes: [
              {
                id: 'esgse',
                text: 'Have faith, relax, and give it your all',
                noteColor: '#fdffa4',
                textColor: '#333',
                boardId: '34sdg',
              },
              {
                id: 'fescd',
                text: 'Here is a brand new task',
                noteColor: '#b6ffe0',
                textColor: '#333',
                boardId: '34sdg',
              },
            ],
            isPublished: true,
            isEpic: true,
            uid: '1334',
            kanbanId: 'j404sx',
          },
          {
            id: 'dj99d',
            title: 'Epic Draft',
            notes: [
              {
                id: 'dsebb',
                text: 'Have faith, relax, and give it your all',
                noteColor: '#fdffa4',
                textColor: '#333',
                boardId: 'dj99d',
              },
              {
                id: 'de33d',
                text: 'Here is a brand new task',
                noteColor: '#b6ffe0',
                textColor: '#333',
                boardId: 'dj99d',
              },
            ],
            isPublished: false,
            isEpic: true,
            uid: '1334',
            kanbanId: 'j404sx',
          },
          {
            id: 'kd0f9',
            title: 'Epic Draft',
            notes: [
              {
                id: 'j99uh',
                text: 'Have faith, relax, and give it your all',
                noteColor: '#93c5fd',
                textColor: '#333',
                boardId: 'kd0f9',
              },
            ],
            isPublished: false,
            isEpic: false,
            uid: '1334',
            kanbanId: 'j404sx',
          },
        ],
      },
    };
  },
});
</script>
