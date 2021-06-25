<template>
  <nav class="dark:bg-gray-700 w-full flex relative justify-between items-center mx-auto px-8 h-14">
    <div class="text-2xl font-bold">
      <router-link to="/">🎙️ iSpeak</router-link>
    </div>

    <ul class="flex items-center space-x-4">
      <li v-for="navli in navbarItems" :key="navli.text" v-show="!navli.reqAuth || (navli.reqAuth && user)">
        <button v-if="navli.isBtn">{{ navli.text }}</button>
        <router-link v-else :to="navli.route">{{ navli.text }}</router-link>
        <span class="sr-only">{{ navli.tooltip }}</span>
      </li>
      <li>
        <button v-if="user">
          <img class="rounded-full" src="https://place-hold.it/32x32" alt="User Avatar" />
        </button>
        <router-link v-else to="/login">🔑 Login</router-link>
      </li>
      <li v-if="!user">
        <button>⚙️<span class="sr-only">Settings</span></button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Navbar',
  setup() {
    const user = false;

    const navbarItems = [
      { isBtn: true, tooltip: 'Search Sagas', text: '🔍' },
      { route: '/new', tooltip: 'Create Kanban', text: '🍱 Kanban', reqAuth: true },
      { route: '/sagas', tooltip: 'Sagas', text: '🎬 Sagas' },
      { isBtn: true, tooltip: 'Notifications', text: '🔔', reqAuth: true },
    ];

    return { user, navbarItems };
  },
});
</script>
