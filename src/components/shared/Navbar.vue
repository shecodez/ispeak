<template>
  <nav class="shadow w-full flex relative justify-between items-center mx-auto px-6 h-14">
    <div class="text-xl font-bold tracking-tight">
      <router-link to="/">🎙️ iSpeak!</router-link>
    </div>

    <ul class="flex items-center space-x-1 text-sm font-semibold">
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
    const user = true;

    const navbarItems = [
      { isBtn: true, tooltip: 'Search Sagas', text: '🔍' },
      { route: '/kanban', tooltip: 'Create Kanban', text: '🍱 Kanban', reqAuth: true },
      { route: '/sagas', tooltip: 'Sagas', text: '🎬 Sagas' },
      { isBtn: true, tooltip: 'Notifications', text: '🔔', reqAuth: true },
    ];

    return { user, navbarItems };
  },
});
</script>

<style scoped>
li {
  padding: 0.4em 0.6em;
  border-radius: 4px;
}
li:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
