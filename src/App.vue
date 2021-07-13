<template>
  <Header />
  <main class="flex-1 ml-16 flex flex-col">
    <Banner :showBanner="showBanner" text="Example banner text" />
    <router-view />
  </main>
  <Footer />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';

export default defineComponent({
  name: 'App',
  components: { Header, Footer },
  setup() {
    const showBanner = ref(false);

    return { showBanner };
  },
});
</script>

<style>
html,
body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dark {
  @apply bg-gray-900 text-white;
}

.btn {
  @apply px-3 py-2 font-semibold rounded;
}

.f-center {
  @apply flex items-center justify-center;
}
</style>
