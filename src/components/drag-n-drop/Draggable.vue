<template>
  <div
    class="drag-el flex w-full min-h-16 bg-pink-800"
    draggable="true"
    @dragstart="startDrag($event, itemId)"
    @dragend="endDrag($event)"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Draggable',
  props: {
    startDrag: {
      type: Function,
      required: true,
    },
    endDrag: {
      type: Function,
      required: true,
    },
    itemId: {
      type: [Number, String],
      required: true,
    },
  },
  setup() {},
});
</script>

<style scoped></style>
