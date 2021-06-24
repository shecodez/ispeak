<template>
  <form>
    <label><i-mdi-translate /></label>
    <select v-model="locale" class="w-24 px-2 py-1 rounded">
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>
  </form>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  name: "SwitchLocale",
  setup() {
    const { locale } = useI18n();

    return { locale };
  },
};
</script>

<style scoped>
select {
  background-color: transparent;
}
.dark option {
  background-color: #212121;
}
</style>
