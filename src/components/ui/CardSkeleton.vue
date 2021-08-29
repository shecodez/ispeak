<template>
  <div class="relative shadow-lg rounded-md p-4 max-w-sm w-full mx-auto" :class="[bgColor, css]">
    <slot>
      <div class="animate-pulse flex flex-col gap-2">
        <div class="h-4 rounded w-3/4" :class="`bg-${color}-200`" />
        <div class="flex items-center justify-between gap-2">
          <div class="h-3 rounded w-2/6" :class="`bg-${color}-200`" />
          <div class="`rounded-full h-6 w-6`" :class="`bg-${color}-200`" />
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardSkeleton',
  props: {
    bgColor: {
      type: String,
      default: 'bg-gray-50',
    },
    color: {
      type: String,
      default: 'gray',
    },
    css: {
      type: String,
      default: '',
    },
  },
});
</script>
