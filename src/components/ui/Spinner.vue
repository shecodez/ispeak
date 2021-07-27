<template>
  <div class="absolute inset-0 f-center bg-black opacity-50">
    <i-gg-spinner class="text-7xl animate-spin" />
    <slot>
      <p v-if="message" class="m-2">{{ message }}</p>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Spinner',
  props: {
    message: {
      type: String,
    },
  },
  setup() {},
});
</script>
