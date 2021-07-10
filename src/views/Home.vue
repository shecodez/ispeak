<template>
  <div class="w-4/5 mx-auto">
    <pre>{{ items }}</pre>
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-blue-700">
        <div class="m-2 flex items-center">
          <h2 class="text-2xl">List 1</h2>
          <button class="p-2 border ml-auto">MOVE</button>
        </div>
        <DropZone :items="items" :listId="1">
          <template v-slot:trigger="{ startDrag, endDrag }">
            <Draggable
              v-for="item in listOne"
              :key="item.id"
              :startDrag="startDrag"
              :endDrag="endDrag"
              :itemId="item.id"
            >
              {{ item.title }}
            </Draggable>
          </template>
        </DropZone>
      </div>

      <div class="bg-blue-700">
        <div class="m-2 flex items-center">
          <h2 class="text-2xl">List 2</h2>
          <button class="p-2 border ml-auto">MOVE</button>
        </div>
        <DropZone :items="items" :listId="2">
          <template v-slot:trigger="{ startDrag, endDrag }">
            <Draggable
              v-for="item in listTwo"
              :key="item.id"
              :startDrag="startDrag"
              :endDrag="endDrag"
              :itemId="item.id"
            >
              {{ item.title }}
            </Draggable>
          </template>
        </DropZone>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import DropZone from '../components/drag-n-drop/DropZone.vue';
import Draggable from '../components/drag-n-drop/Draggable.vue';

export default defineComponent({
  name: 'Home',
  components: { DropZone, Draggable },
  setup() {
    const { locale, t } = useI18n();

    const items = ref([
      {
        id: '0',
        title: 'Item A',
        list: '1',
      },
      {
        id: '1',
        title: 'Item B',
        list: '1',
      },
      {
        id: '2',
        title: 'Item C',
        list: '2',
      },
    ]);

    const listOne = computed(() => items.value.filter((i) => i.list == '1'));
    const listTwo = computed(() => items.value.filter((i) => i.list == '2'));

    return { locale, t, items, listOne, listTwo };
  },
});
</script>
