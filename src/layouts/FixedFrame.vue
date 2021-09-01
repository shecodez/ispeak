<template>
  <div v-if="showTopFrame" class="top frame top-0 rounded-bl-3xl">
    <slot name="top"><TopNavigation /></slot>
  </div>

  <div v-if="showRightFrame" class="right frame right-0 rounded-tl-3xl">
    <slot name="right"><div :class="`bg-yellow-${colorWeight}`" /></slot>
  </div>

  <!-- :class="isHiddenOverflowY ? 'bottom-2' : ' right-2'" -->
  <div v-if="showBottomFrame" class="bottom frame bottom-0 right-0">
    <slot name="bottom"><div class="bg-red-500" /></slot>
  </div>

  <div v-if="showLeftFrame" class="left frame left-0 rounded-tr-3xl">
    <slot name="left"><SideNavigation /></slot>
  </div>

  <main class="w-full h-full flex flex-col overflow-hidden" :class="getPaddingCss">
    <slot></slot>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import SideNavigation from '@/components/shared/SideNavigation.vue';
import TopNavigation from '@/components/shared/TopNavigation.vue';

export default defineComponent({
  name: 'FixedFrame',
  components: { TopNavigation, SideNavigation },
  props: {
    showTopFrame: {
      type: Boolean,
      default: true,
    },
    showRightFrame: {
      type: Boolean,
      default: false,
    },
    showBottomFrame: {
      type: Boolean,
      default: false,
    },
    showLeftFrame: {
      type: Boolean,
      default: true,
    },
    isHiddenOverflowY: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const colorWeight = ref('400');

    const getPaddingCss = computed(() => {
      let padding = [];

      if (props.showTopFrame) padding.push('pt-16');
      if (props.showRightFrame) padding.push('pr-16');
      //if (props.showBottomFrame) padding.push('pb-16');
      if (props.showLeftFrame) padding.push('pl-16');

      return padding.join(' ');
    });

    return { colorWeight, getPaddingCss };
  },
});
</script>

<style scoped>
.frame {
  @apply fixed;
}
.frame > div {
  @apply h-full w-full;
}
.top.frame,
.bottom.frame {
  @apply w-full max-w-screen h-16 flex justify-end;
}
.left.frame,
.right.frame {
  @apply w-16 h-screen top-16 flex flex-col;
}
</style>
