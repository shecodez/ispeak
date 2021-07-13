<template>
  <h1 class="text-4xl m-3">Shop</h1>

  <button @click="openCartDialog" class="fixed bottom-0 right-0 rounded-tl-3xl w-16 h-16 f-center bg-yellow-500">
    <Tooltip text="cart" placement="left">🛒</Tooltip>
    <span class="sr-only">Cart</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Tooltip from '@/components/ui/Tooltip.vue';

export default defineComponent({
  name: 'Shop',
  components: { Tooltip },
  setup() {},
});
</script>
