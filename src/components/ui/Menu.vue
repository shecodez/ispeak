<template>
  <div ref="menu" class="relative flex flex-col items-center">
    <div class="inline-flex" ref="button" @click="toggleMenu">
      <slot name="activator">
        <button class="btn border">Open Menu</button>
      </slot>
    </div>

    <div v-show="showMenu" class="absolute top-12 right-0 bg-gray-300 dark:bg-gray-700 rounded shadow-lg z-40">
      <ul :class="[w, h]">
        <slot>
          <li v-for="item in list" :key="item.id" class="px-2 hover:bg-gray-400 dark:hover:bg-gray-700">
            <div class="flex items-center justify-between p-2 text-base">
              <span>{{ item.title }}</span>
              <input type="checkbox" :checked="item.isChecked" />
            </div>
          </li>
        </slot>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { onClickOutside, useToggle } from '@vueuse/core';

interface MenuListItem {
  id: string | number;
  title: string;
  isChecked: boolean;
}

export default defineComponent({
  name: 'Menu',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    list: {
      type: [] as PropType<MenuListItem[]>,
      default: [],
    },
    w: {
      type: String,
      default: 'min-w-36 max-w-48',
    },
    h: {
      type: String,
      default: 'max-h-1/2',
    },
  },
  setup: (props) => {
    const menu = ref();
    const showMenu = ref(false);
    watch(
      () => props.isOpen,
      (isOpen) => {
        showMenu.value = isOpen;
      }
    );
    const toggleMenu = () => useToggle(showMenu);
    const closeMenu = () => {
      showMenu.value = false;
    };
    onClickOutside(menu, () => {
      showMenu.value = false;
    });
    return { menu, showMenu, toggleMenu, closeMenu };
  },
});
</script>
