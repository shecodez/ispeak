<template>
  <footer class="mt-auto flex items-center justify-between py-2 px-4 shadow-lg">
    <div>&copy; &nbsp;{{ new Date().getFullYear() }}</div>
    <h5 class="uppercase text-xs tracking-widest">
      <!-- {{ t('built_with_love') }} <a href="http://www.shecodez.com" target="_blank">@shecodez</a> -->
      ~ 💗 <a href="http://www.shecodez.com" target="_blank">@shecodez</a> | NJN
    </h5>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Footer',
  setup() {
    const { t } = useI18n();

    return { t };
  },
});
</script>

<style scoped>
a {
  @apply font-bold hover:underline;
}
</style>
