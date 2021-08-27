<template>
  <div class="sticky-note" :style="`background-color: ${card.bg_color}; color: ${card.text_color}`">
    <div class="relative overflow-hidden">
      <div class="note-text p-4 pb-3 flex flex-col">
        <b class="text-xs">{{ card.assigned_to }}</b>
        <p>{{ card.text }}</p>
        <i class="text-xs font-sans" :class="showHint ? '' : 'hidden'">
          {{ card.hint }}
        </i>
      </div>
    </div>
  </div>
  <button v-if="card.hint" class="text-xs absolute top-1 right-2 z-10 text-black" @click="toggleHint">
    {{ showHint ? 'hide hint' : 'show hint' }}
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Card } from '@/data/types/mock';

export default defineComponent({
  name: 'CardReadOnly',
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();

    const showHint = ref(false);
    function toggleHint() {
      showHint.value = !showHint.value;
    }

    return { t, showHint, toggleHint };
  },
});
</script>
