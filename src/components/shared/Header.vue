<template>
  <header>
    <TopNav />
    <SideNav />
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TopNav from '@/components/shared/TopNavigation.vue';
import SideNav from '@/components/shared/SideNavigation.vue';

export default defineComponent({
  name: 'Header',
  components: { TopNav, SideNav },
  setup() {},
});
</script>
