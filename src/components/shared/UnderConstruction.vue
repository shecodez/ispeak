<template>
  <img class="mx-auto w-3xl" src="src/assets/under-construction.png" alt="Under Construction" />
  <h2 class="text-2xl font-bold text-center">{{ t('under_construction_message') }}</h2>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'UnderConstruction',
  setup() {
    const { t } = useI18n();

    return { t };
  },
});
</script>
