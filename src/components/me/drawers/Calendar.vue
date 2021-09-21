<template>
  <aside class="flex flex-col gap-4 h-full">
    <UnderConstruction :wip="t('calendar')" />
    <!-- <button @click="addEvent" class="btn primary-blue">
      <div class="f-center gap-2 text-xs uppercase text-white py-1">
        <i-mdi-plus-circle-outline />
        <span class="">{{ t('add_event') }}</span>
      </div>
    </button> -->
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import UnderConstruction from '@/components/shared/UnderConstruction.vue';

export default defineComponent({
  name: 'CalendarDrawer',
  components: { UnderConstruction },
  setup() {
    const { t } = useI18n();

    return { t };
  },
});
</script>
