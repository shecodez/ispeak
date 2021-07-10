<template>
  <div class="flex space-x-3 my-3">
    <div class="w-3/4 flex flex-col space-y-1">
      <div class="flex bg-black">
        <div class="w-20 h-20 flex items-center justify-center text-2xl bg-green-300">S</div>
        <div
          class="flex-1 flex items-center pl-2 space-x-2 bg-gray-800 overflow-x-auto overflow-y-hidden"
          @dragover.prevent
          @dragenter="onDragEnter($event)"
          @dragleave="onDragLeave($event)"
          @drop="onDrop($event)"
        >
          <div
            class="drop-indicator w-18 h-18 flex items-center justify-center border border-dashed"
            style="visibility: hidden"
          >
            <i-mdi-plus-circle-outline />
          </div>
        </div>
      </div>
      <div class="flex bg-black">
        <div class="flex w-20 h-20 items-center justify-center text-2xl bg-blue-300">A</div>
        <div
          class="flex-1 flex items-center pl-2 space-x-2 bg-gray-800 overflow-x-auto overflow-y-hidden"
          @dragover.prevent
          @dragenter="onDragEnter($event)"
          @dragleave="onDragLeave($event)"
          @drop="onDrop($event)"
        >
          <div
            class="drop-indicator w-18 h-18 flex items-center justify-center border border-dashed"
            style="visibility: hidden"
          >
            <i-mdi-plus-circle-outline />
          </div>
        </div>
      </div>
      <div class="flex bg-black">
        <div class="flex w-20 h-20 items-center justify-center text-2xl bg-yellow-300">B</div>
        <div
          class="flex-1 flex items-center pl-2 space-x-2 bg-gray-800 overflow-x-auto overflow-y-hidden"
          @dragover.prevent
          @dragenter="onDragEnter($event)"
          @dragleave="onDragLeave($event)"
          @drop="onDrop($event)"
        >
          <div
            class="drop-indicator w-18 h-18 flex items-center justify-center border border-dashed"
            style="visibility: hidden"
          >
            <i-mdi-plus-circle-outline />
          </div>
        </div>
      </div>
    </div>

    <div class="w-1/4">
      <div class="grid grid-cols-4 gap-2 pb-16" @dragover.prevent @drop="onDrop($event)">
        <template v-for="i in 20" :key="i">
          <div
            class="w-16 h-16 bg-pink-800 flex items-center justify-center text-2xl"
            draggable="true"
            @dragstart="startDrag($event, i)"
            @dragend="endDrag($event)"
          >
            {{ i }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TierList',
  setup() {
    const draggedEl = ref<any>(null);

    const startDrag = (e: any, idx: string | number) => {
      e.dataTransfer.setData('text/plain', idx);
      e.target.style.opacity = 0.5;
      draggedEl.value = e.target;
    };

    const endDrag = (e: any) => {
      e.target.style.opacity = 1;
    };

    const onDrop = (e: any) => {
      const dropIndicator = e.target.querySelector('.drop-indicator');
      if (dropIndicator) {
        dropIndicator.style.visibility = 'hidden';
        dropIndicator.style.position = 'absolute';
      }
      draggedEl.value.style.opacity = 1;
      //draggedEl.value.parentNode.removeChild(draggedEl.value);
      e.target.appendChild(draggedEl.value);
      if (dropIndicator) {
        e.target.appendChild(dropIndicator);
      }
    };

    const onDragEnter = (e: any) => {
      const dropIndicator = e.target.querySelector('.drop-indicator');
      if (dropIndicator) {
        dropIndicator.style.visibility = 'visible';
        dropIndicator.style.position = 'relative';
      }
    };

    const onDragLeave = (e: any) => {
      const dropIndicator = e.target.querySelector('.drop-indicator');
      if (dropIndicator) {
        dropIndicator.style.visibility = 'hidden';
        dropIndicator.style.position = 'absolute';
      }
    };

    return { startDrag, onDrop, endDrag, onDragEnter, onDragLeave };
  },
});
</script>
