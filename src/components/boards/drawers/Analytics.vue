<template>
  <aside class="flex flex-col gap-4 h-full">
    <UnderConstruction :wip="t('analytics')" />
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import UnderConstruction from '@/components/shared/UnderConstruction.vue';

export default defineComponent({
  name: 'Analytics',
  components: { UnderConstruction },
  setup() {
    const { t } = useI18n();

    return { t };
  },
});
</script>
