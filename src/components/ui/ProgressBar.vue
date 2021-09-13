<template>
  <label for="progress" class="sr-only">{{ label }}:</label>
  <progress id="progress" max="100" :value="value" class="fixed top-0 h-1 w-full">{{ `${value}%` }}</progress>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProgressBar',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: 'progress',
    },
  },
  setup() {},
});
</script>

<style scoped>
/* background: */
progress::-webkit-progress-bar {
  @apply bg-transparent w-full;
}
progress {
  @apply bg-transparent;
}

/* value: */
progress::-webkit-progress-value {
  @apply bg-yellow-500;
}
progress::-moz-progress-bar {
  @apply bg-yellow-500;
}
progress {
  @apply text-yellow-500;
}
</style>
