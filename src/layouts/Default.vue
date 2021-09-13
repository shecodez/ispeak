<template>
  <div class="flex flex-col min-h-screen max-h-screen">
    <Header />
    <div id="scrollzone" class="flex-1 flex flex-col" style="overflow-y: auto">
      <slot />
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useTitle } from '@vueuse/core';

import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';

export default defineComponent({
  name: 'DefaultLayout',
  components: { Header, Footer },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const appName = import.meta.env.VITE_APP_NAME;
    const tabTitle = computed(() => `${props.title} · 🗒️ ${appName}`);
    useTitle(tabTitle);
  },
});
</script>
