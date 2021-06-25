<template>
  <ToggleDark />
  <SwitchLocale />
  <h1>{{ t("hello") }}</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

import SwitchLocale from "@/components/SwitchLocale.vue";
import ToggleDark from "@/components/ToggleDark.vue";

export default defineComponent({
  name: "Home",
  components: { ToggleDark, SwitchLocale },
  setup() {
    const { locale, t } = useI18n();

    return { locale, t };
  },
});
</script>
