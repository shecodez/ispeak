<template>
  <header>
    <Topnav />
    <Sidenav />
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Topnav from '@/components/shared/Topnav.vue';
import Sidenav from '@/components/shared/Sidenav.vue';

export default defineComponent({
  name: 'Header',
  components: { Topnav, Sidenav },
  setup() {},
});
</script>
