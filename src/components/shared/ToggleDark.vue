<template>
  <div class="opacity-80 hover:opacity-100 f-center" @click="toggleDark()">
    <i-mdi-brightness-7 v-if="isDark" />
    <i-mdi-weather-night v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDark, useToggle } from '@vueuse/core';

export default defineComponent({
  name: 'ToggleDark',
  setup: () => {
    const isDark = useDark();
    const toggleDark = useToggle(isDark);

    return {
      isDark,
      toggleDark,
    };
  },
});
</script>
