<template>
  <nav class="w-full h-16 flex lg:grid lg:grid-cols-3 relative">
    <button class="flex w-16 h-full items-center justify-center text-2xl">🔍</button>

    <div class="hidden md:flex flex-auto h-16 items-center justify-center text-2xl font-bold">
      <router-link to="/">🎙️ iSpeak!</router-link>
      <span class="bg-cyan-400 text-xs ml-2 px-1 rounded">BETA</span>
    </div>

    <ul class="flex h-16 ml-auto items-center text-2xl">
      <li><router-link class="bg-blue-500 rounded-bl-3xl" to="/shop">💎</router-link></li>
      <li v-for="navli in navListItems" :key="navli.tooltip">
        <button class="bg-gray-300 dark:bg-gray-700" @click="navli.action">
          <span v-if="navli.text">{{ navli.text }}</span>
          <component v-else :is="navli.component" />
          <span class="sr-only">{{ navli.tooltip }}</span>
        </button>
      </li>
      <li>
        <button class="bg-gray-300 dark:bg-gray-700 f-center" @click="toggleMenu">
          <span v-if="showMenu">❌</span>
          <i-ph-dots-three-outline-vertical-duotone v-else />
          <span class="sr-only">toggle menu</span>
        </button>

        <div v-if="showMenu" class="absolute -bottom-18 right-3 p-4 rounded bg-teal-400">
          TODO: replace with main dropdown menu
        </div>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import ToggleDark from '@/components/shared/ToggleDark.vue';
import SwitchLocale from '@/components/shared/SwitchLocale.vue';
import NotificationMenu from '@/components/shared/NotificationMenu.vue';

export default defineComponent({
  name: 'Topnav',
  components: { ToggleDark, SwitchLocale, NotificationMenu },
  setup() {
    const showMenu = ref(false);

    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const navListItems = [
      { tooltip: 'toggle theme', component: ToggleDark },
      { tooltip: 'notifications', component: NotificationMenu },
      { tooltip: 'change locale', component: SwitchLocale },
    ];

    return { navListItems, showMenu, toggleMenu };
  },
});
</script>

<style scoped>
li {
  @apply w-16 h-full;
}
li > a {
  @apply h-full w-full block flex items-center justify-center;
}
li > button {
  @apply h-full w-full;
}
</style>
