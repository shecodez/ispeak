<template>
  <Tooltip :text="tooltip" :placement="tooltipPos">
    <slot>
      <button @click="$emit('on-click')" :class="buttonCss">
        {{ text }}
      </button>
    </slot>
    <span v-if="iconBtn" class="sr-only">{{ tooltip }}</span>
  </Tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TooltipButton',
  props: {
    tooltip: {
      type: String,
    },
    tooltipPos: {
      type: String,
      default: 'top',
    },
    buttonCss: {
      type: String,
      default: '',
    },
    text: {
      type: String,
    },
    iconBtn: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
