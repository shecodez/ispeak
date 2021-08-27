<template>
  <div :if="message" class="p-4 flex rounded" :class="`${type}-alert ${css}`">
    <i-ic-twotone-error class="flex-shrink-0 text-lg my-0.5" />
    <slot>
      <p class="mx-2">{{ message }}</p>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Tooltip from '@/components/ui/Tooltip.vue';

export default defineComponent({
  name: 'AlertMessage',
  components: { Tooltip },
  props: {
    type: {
      type: String,
      default: 'default',
    },
    message: {
      type: [Object, String],
      required: true,
    },
    css: {
      type: String,
      default: '',
    },
  },
  setup() {},
});
</script>

<style scoped>
.default-alert {
  @apply border-l-4 border-gray-500 bg-gray-400 bg-opacity-30 text-gray-500;
}

.error-alert {
  @apply border-l-4 border-red-500 bg-red-400 bg-opacity-30 text-red-500;
}
</style>
