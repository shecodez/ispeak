<template>
  <div class="-ml-16 text-center">
    <h1 class="text-4xl my-3">Not Found</h1>
    <p>That page was not found</p>
    <router-link to="/">Home</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Tooltip from '@/components/ui/Tooltip.vue';

export default defineComponent({
  name: 'NotFound',
  components: { Tooltip },
  setup() {},
});
</script>
