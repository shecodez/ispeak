<template>
  <SearchDialog />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import SearchDialog from '@/components/search/SearchDialog.vue';

export default defineComponent({
  name: 'Test',
  components: { SearchDialog },
  setup() {},
});
</script>
