<template>
  <div class="flex flex-col min-h-screen max-h-screen">
    <Header />
    <div class="flex-1 flex flex-col" style="overflow-y: auto">
      <main><slot /></main>
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
    useTitle(`${props.title} · 🎬 ${appName}`);
  },
});
</script>
