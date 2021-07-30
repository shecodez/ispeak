<template>
  <FixedFrame>
    <div class="-ml-16">
      <UnderConstruction />
    </div>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import FixedFrame from '@/components/layouts/FixedFrame.vue';
import UnderConstruction from '@/components/shared/UnderConstruction.vue';

export default defineComponent({
  name: 'Shop',
  components: { FixedFrame, UnderConstruction },
  setup() {},
});
</script>
