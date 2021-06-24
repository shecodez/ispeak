<template>
  <ToggleDark />
  <SwitchLocale />
  <h1>{{ t("hello") }}</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

import SwitchLocale from "./components/SwitchLocale.vue";
import ToggleDark from "./components/ToggleDark.vue";

export default defineComponent({
  name: "App",
  components: { ToggleDark, SwitchLocale },
  setup() {
    const { locale, t } = useI18n();

    return { locale, t };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
.dark {
  background-color: #212121;
  color: #f1f1f1;
}
</style>
