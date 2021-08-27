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
}

.n-page-header {
  flex-wrap: wrap;
}

.dark {
  @apply bg-gray-900 text-white;
}

.primary-red {
  @apply bg-red-500 hover:bg-red-400 shadow;
}

.primary-green {
  @apply bg-green-500 hover:bg-green-400 shadow;
}

.primary-blue {
  @apply bg-blue-500 hover:bg-blue-400 shadow;
}

.btn {
  @apply px-3 py-2 font-semibold rounded;
}

.scale-up-btn {
  @apply text-2xl hover:transform hover:scale-110;
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
  @apply block text-xs font-semibold mb-0.5;
}

.form-group input,
.form-group textarea {
  @apply bg-transparent w-full border p-2;
}

.form-group input[readonly] {
  @apply border-gray-400 text-gray-400 cursor-not-allowed;
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
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}

.list-container {
  @apply w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/5 flex-shrink-0 mr-4 g;
}
.list-container:not(:first-child) {
  @apply ml-4;
}

.grabbable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}
</style>
