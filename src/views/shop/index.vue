<template>
  <div class="ml-16">
    <h1 class="text-4xl">Shop</h1>
    <p>{{ lorem }}</p>
  </div>

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
  setup() {
    const lorem =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. Elit ullamcorper dignissim cras tincidunt. Egestas fringilla phasellus faucibus scelerisque eleifend. Turpis cursus in hac habitasse platea dictumst. Sit amet dictum sit amet justo donec enim. Volutpat diam ut venenatis tellus in metus vulputate eu. Sed velit dignissim sodales ut. Vivamus arcu felis bibendum ut tristique et egestas quis ipsum. Ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin. Morbi tristique senectus et netus et. Malesuada proin libero nunc consequat interdum varius sit amet mattis. Enim sed faucibus turpis in eu mi bibendum neque egestas. Ornare massa eget egestas purus viverra accumsan in. In iaculis nunc sed augue lacus viverra vitae congue.';

    return { lorem };
  },
});
</script>
