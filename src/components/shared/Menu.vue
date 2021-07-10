<template>
  <div ref="menu" class="flex flex-col relative">
    <div class="inline-flex" ref="button" @click="toggleMenu">
      <slot name="activator">
        <button class="btn border">Open Menu</button>
      </slot>
    </div>

    <div v-show="isOpen" class="absolute top-12 right-0 bg-gray-600 bg-opacity-30 rounded shadow-lg">
      <ul class="w-48 max-w-56">
        <li v-for="item in list" :key="item.id" class="px-2 hover:bg-gray-700">
          <div class="flex items-center justify-between p-2">
            <span>{{ item.title }}</span>
            <input type="checkbox" :checked="item.isChecked" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

export default defineComponent({
  name: 'Menu',
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  setup: () => {
    const isOpen = ref(false);

    const toggleMenu = () => {
      isOpen.value = !isOpen.value;
    };

    const menu = ref();
    onClickOutside(menu, () => {
      isOpen.value = false;
    });

    return { isOpen, menu, toggleMenu };
  },
});
</script>
