<template>
  <header><Navbar /></header>
  <main class="flex-1">
    <router-view></router-view>
  </main>
  <footer class="text-center">Made with ❤️ shecodez</footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "./components/Navbar.vue";

export default defineComponent({
  components: { Navbar },
  name: "App",
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
  background-color: #212121;
  color: #f1f1f1;
}
</style>
