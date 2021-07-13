<template>
  <h1 class="text-4xl m-3">@me</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: '@me',
  setup() {
    const { t } = useI18n();

    return { t };
  },
});
</script>
