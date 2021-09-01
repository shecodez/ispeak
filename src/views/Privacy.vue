<template>
  <FixedFrame>
    <div class="-ml-16 mt-16 text-center">
      <h1 class="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p>
        {{ appName }}
      </p>
    </div>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import FixedFrame from '@/layouts/FixedFrame.vue';

export default defineComponent({
  name: 'Privacy',
  components: { FixedFrame },
  setup() {
    const appName = import.meta.env.VITE_APP_NAME;

    // TODO: add privacy policy

    return { appName };
  },
});
</script>
