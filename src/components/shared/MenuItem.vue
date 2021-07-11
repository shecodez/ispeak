<template>
  <li @click="onClick()" class="px-2 hover:bg-gray-400 dark:hover:bg-gray-700" :class="activeCss">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuItem',
  props: {
    onClick: {
      type: Function,
      default: () => {},
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  setup: (props) => {
    const activeCss = computed(() => (props.isActive ? 'bg-gray-400 dark:bg-gray-600' : ''));

    return { activeCss };
  },
});
</script>
