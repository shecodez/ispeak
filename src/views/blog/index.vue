<template>
  <FixedFrame>
    <div class="-ml-16">
      <UnderConstruction :wip="t('the_blog')" />
    </div>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import FixedFrame from '@/components/layouts/FixedFrame.vue';
import UnderConstruction from '@/components/shared/UnderConstruction.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Blog',
  components: { FixedFrame, UnderConstruction },
  setup() {
    const { t } = useI18n();

    return { t };
  },
});
</script>
