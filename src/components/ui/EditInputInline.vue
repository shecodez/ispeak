<template>
  <div class="flex items-center space-x-2 text-xl">
    <input ref="input" v-if="isEdit" type="text" v-model="inputText" @keydown.enter="$emit('on-update', inputText)" />
    <h1 v-else class="whitespace-nowrap">{{ text }}</h1>

    <TooltipButton iconBtn :tooltip="tooltipText" :text="isEdit ? '❌' : '✏️'" @click="toggleEdit" />
    <TooltipButton v-if="isEdit" iconBtn :tooltip="t('save')" text="💾" @click="$emit('on-update', inputText)" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import TooltipButton from '@/components/ui/TooltipButton.vue';
import { useToggle } from '@vueuse/core';

export default defineComponent({
  name: 'EditInputInline',
  components: { TooltipButton },
  props: {
    text: {
      type: String,
      default: 'untitled',
    },
    tooltip: {
      type: String,
      default: 'edit',
    },
  },
  setup(props) {
    const { t } = useI18n();

    const input = ref(); // el
    watch(
      () => input.value,
      (input) => {
        if (input) input.focus();
      }
    );
    const inputText = ref(props.text);

    const isEdit = ref(false);
    const toggleEdit = useToggle(isEdit);
    const closeEdit = () => (isEdit.value = false);

    const tooltipText = computed(() => (isEdit.value ? t('cancel') : props.tooltip));

    return { input, inputText, isEdit, toggleEdit, closeEdit, tooltipText, t };
  },
});
</script>

<style scoped>
input {
  @apply text-xl py-1 bg-transparent border-0 border-b-2 border-indigo-500 focus:outline-none focus:shadow-none;
}
</style>
