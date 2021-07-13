<template>
  <div class="has-tooltip" :class="hasTooltipCss">
    <slot></slot>
    <span class="tooltip" :class="tooltipCss">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Tooltip',
  props: {
    text: {
      type: String,
      default: '',
    },
    placement: {
      type: String,
      default: 'top',
    },
  },
  setup(props) {
    let hasTooltipCss = ref('');
    let tooltipCss = ref('');
    const getPlacement = () => {
      switch (props.placement) {
        case 'right':
          hasTooltipCss.value = 'items-center';
          tooltipCss.value = 'ml-8';
          break;
        case 'left':
          hasTooltipCss.value = 'items-center';
          tooltipCss.value = '-ml-29';
          break;
        case 'bottom':
          hasTooltipCss.value = 'justify-center';
          tooltipCss.value = 'mt-12';
          break;
        case 'bottom-left':
          hasTooltipCss.value = '';
          tooltipCss.value = 'mt-10 -ml-22';
          break;
        case 'top-right':
          hasTooltipCss.value = '';
          tooltipCss.value = '-mt-8';
          break;
        default:
          //top
          hasTooltipCss.value = 'justify-center';
          tooltipCss.value = '-mt-8';
          break;
      }
    };
    onMounted(() => getPlacement());
    return { hasTooltipCss, tooltipCss };
  },
});
</script>

<style scoped>
.has-tooltip {
  @apply inline-flex;
}
.tooltip {
  @apply invisible absolute py-1 px-2 rounded bg-black opacity-90 text-white text-sm whitespace-nowrap;
}
.has-tooltip:hover .tooltip {
  @apply visible z-50;
}
</style>
