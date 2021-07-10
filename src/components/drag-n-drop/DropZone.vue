<template>
  <div
    class="drop-zone flex flex-col p-2 space-y-2 bg-gray-800 overflow-x-hidden overflow-y-auto"
    @drop="onDrop($event, listId)"
    @dragover.prevent
    @dragenter.prevent
  >
    <slot name="trigger" :startDrag="startDrag" :endDrag="endDrag" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import Draggable from './Draggable.vue';

export default defineComponent({
  name: 'DropZone',
  props: {
    items: {
      type: Array,
      default: [],
    },
    listId: {
      type: Number,
      required: true,
    },
  },
  components: { Draggable },
  setup(props) {
    const draggedEl = ref<any>(null);

    const startDrag = (evt: any, id: string | number) => {
      //evt.dataTransfer.dropEffect = 'move';
      //evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('itemID', id);
      evt.target.style.opacity = 0.5;
      draggedEl.value = evt.target;
      console.log('START DRAG');
    };

    const endDrag = (e: any) => {
      e.target.style.opacity = 1;
      console.log('END DRAG');
    };

    const onDrop = (evt: any, listId: string | number) => {
      const itemID = evt.dataTransfer.getData('itemID');
      const item = props.items.find((item) => item.id == itemID);
      item.list = listId;
      console.log('ON DROP');
    };

    return { startDrag, endDrag, onDrop };
  },
});
</script>

<style scoped></style>
