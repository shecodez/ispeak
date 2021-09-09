<template>
  <div class="sticky-note" :style="`background-color: ${card.color}; color: ${card.text_color}`">
    <div class="relative overflow-hidden">
      <div class="note-text p-4 pb-3 flex flex-col">
        <b class="text-xs">{{ card.assigned_to }}</b>
        <p>{{ card.text }}</p>
        <i class="text-xs font-sans" :class="showDetails ? '' : 'hidden'">
          {{ card.details }}
        </i>
      </div>
    </div>
  </div>
  <button v-if="card.details" class="text-xs absolute top-1 right-2 z-10 text-black" @click="toggleDetails">
    {{ showDetails ? 'hide details' : 'show details' }}
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Card } from '@/data/types/mock';

export default defineComponent({
  name: 'V2CardReadOnly',
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();

    const showDetails = ref(false);
    function toggleDetails() {
      showDetails.value = !showDetails.value;
    }

    return { t, showDetails, toggleDetails };
  },
});
</script>
