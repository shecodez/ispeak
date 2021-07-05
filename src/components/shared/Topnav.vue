<template>
  <nav class="w-full h-16 grid grid-cols-3 relative">
    <button class="flex w-16 h-full items-center justify-center text-2xl">🔍</button>

    <div class="flex flex-auto h-16 items-center justify-center text-2xl font-bold">
      <router-link to="/">🎙️ iSpeak!</router-link>
      <span class="beta">BETA</span>
    </div>

    <ul class="flex ml-auto items-center text-2xl">
      <li><router-link class="bg-indigo-400 rounded-bl-3xl" to="/gems">💎</router-link></li>
      <li v-for="navli in navListItems" :key="navli.tooltip">
        <button class="bg-gray-300 dark:bg-gray-700" @click="navli.action">
          <span v-if="navli.text">{{ navli.text }}</span>
          <component v-else :is="navli.component" />
          <span class="sr-only">{{ navli.tooltip }}</span>
        </button>
      </li>
      <li>
        <button class="bg-gray-300 dark:bg-gray-700" @click="toggleMenu">
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

import { useAuthState } from '../../firebase/auth';
import ToggleDark from '../ToggleDark.vue';
import SwitchLocale from '../SwitchLocale.vue';

export default defineComponent({
  name: 'Topnav',
  components: { ToggleDark, SwitchLocale },
  setup() {
    const { isLoggedIn } = useAuthState();

    const showMenu = ref(false);

    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const goToUserLiked = () => {
      if (!isLoggedIn) {
        // TODO: Toast login CTA
        console.log("You must login to view likes. <a href='/login'>login</a>");
      } else {
        // else goto /:username/liked
        console.log('Go to user liked');
      }
    };

    const navListItems = [
      { tooltip: 'toggle theme', component: ToggleDark },
      { tooltip: 'liked', text: '💗', action: goToUserLiked },
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
.beta {
  @apply bg-cyan-400 text-white text-xs ml-2 px-1 rounded;
}
</style>
