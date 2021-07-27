<template>
  <Header />
  <main class="flex-1 flex flex-col md:overflow-hidden p-3">
    <Banner :showBanner="showBanner" text="Example banner text" />
    <router-view></router-view>
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
@import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');

html,
body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @apply flex flex-col h-full md:max-h-screen md:overflow-hidden;
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

.fixed-bottom-btn {
  @apply fixed bottom-0 right-0 rounded-tl-3xl w-16 h-16 flex items-center justify-center;
}

.flex-toolbar-h {
  @apply flex flex-wrap items-center md:justify-between;
}

.form-group {
  @apply my-2;
}
.form-group label {
  @apply block text-xs font-semibold;
}
.form-group input,
.form-group textarea {
  @apply bg-transparent w-full border rounded p-2;
}

.thin-scrollbar {
  /* scrollbar-thumb-rounded  */
  @apply scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-track-gray-700;
}

.sticky-note {
  @apply rounded-br-2xl shadow;
  font-family: 'Reenie Beanie', cursive;
  font-size: 1.4rem;
}
/* .note-text::before, */
.sticky-note .note-text::after {
  content: '';
  position: absolute;
  z-index: 1;
  right: -5px;
  bottom: -5px;
  width: 20px;
  height: 20px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.5);
}
</style>
