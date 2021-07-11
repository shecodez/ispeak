<template>
  <footer class="text-center text-sm">{{ t('made_with_love') }} <a href="http://www.shecodez.com">shecodez</a></footer>
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
  @apply font-semibold hover:underline;
}
</style>
