<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {},
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');

html,
body,
#app {
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* @apply flex flex-col h-full md:max-h-screen md:overflow-hidden; */
}

.dark {
  @apply bg-gray-900 text-white;
}
.primary-red {
  @apply bg-red-500 hover:bg-red-400;
}
.primary-green {
  @apply bg-green-400 hover:bg-green-500;
}
.primary-blue {
  @apply bg-blue-400 hover:bg-blue-500;
}

.btn {
  @apply px-3 py-2 font-semibold rounded;
}

.f-center {
  @apply flex items-center justify-center;
}

.toolbar {
  @apply flex flex-wrap items-center justify-between;
}

.form-group {
  @apply my-2;
}
.form-group label {
  @apply block text-xs font-semibold;
}
.form-group input,
.form-group textarea {
  @apply bg-transparent w-full border p-2;
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
