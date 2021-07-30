<template>
  <FixedFrame>
    <div class="-ml-16 mt-16 text-center">
      <h1 class="text-4xl font-bold mb-2">About Us</h1>
      <p>
        {{ appName }} is a easy to use, flexible, fun way to organize and manage boards for stories, scripts, tasks,
        projects, and the list goes on. Get started for free today!
      </p>
    </div>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import FixedFrame from '@/components/layouts/FixedFrame.vue';

export default defineComponent({
  name: 'About',
  components: { FixedFrame },
  setup() {
    const appName = import.meta.env.VITE_APP_NAME;

    return { appName };
  },
});
</script>
