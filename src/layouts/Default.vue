<template>
  <n-layout has-sider position="absolute">
    <n-layout-sider
      collapse-mode="width"
      :collapsed-width="0"
      :width="80"
      show-trigger="bar"
      bordered
      content-style="padding: 12px;"
    >
      <Sidebar />
    </n-layout-sider>

    <div class="relative w-full overflow-y-hidden h-screen max-h-screen">
      <div style="display: flex; flex-direction: column; height: 100%">
        <n-layout-header style="padding: 24px">
          <slot name="header"></slot>
        </n-layout-header>

        <n-layout-content content-style="flex: 1; padding: 0 24px">
          <slot />
        </n-layout-content>

        <!-- <n-layout-footer>footer</n-layout-footer> -->
      </div>
    </div>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Sidebar from '@/components/boards/Sidebar.vue';

export default defineComponent({
  name: 'DefaultLayout',
  props: ['showHeader', 'showFooter', 'showSidebar', 'bgImgUrl'],
  components: { Sidebar },
  setup() {},
});
</script>

<style scoped>
.n-layout-header,
.n-layout-content {
  background-color: #f4f6f8;
}
</style>
