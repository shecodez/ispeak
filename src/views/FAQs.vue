<template>
  <FixedFrame>
    <div class="-ml-16">
      <UnderConstruction wip="FAQs" />
    </div>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import FixedFrame from '@/layouts/FixedFrame.vue';
import UnderConstruction from '@/components/shared/UnderConstruction.vue';

export default defineComponent({
  name: 'FAQs',
  components: { FixedFrame, UnderConstruction },
  setup() {},
});
</script>
