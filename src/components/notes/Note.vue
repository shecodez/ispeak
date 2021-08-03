<template>
  <div class="sticky-note" :style="`background-color: ${note.noteColor}; color: ${note.textColor}`">
    <div class="relative overflow-hidden">
      <div class="note-text p-2 flex flex-col">
        <b class="text-xs">{{ note.assignedTo }}</b>
        <p>{{ note.text }}</p>
        <i class="text-xs font-sans" :class="note.id === showHintId ? '' : 'hidden'">
          {{ note.hint }}
        </i>
      </div>
    </div>
  </div>
  <button v-if="note.hint" class="text-xs absolute top-1 right-2 z-10 text-black" @click="setShowHintId(note.id)">
    {{ note.id === showHintId ? 'hide hint' : 'show hint' }}
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Note } from '@/data/interfaces';

export default defineComponent({
  name: 'Note',
  props: {
    note: {
      type: Object as PropType<Note>,
    },
  },
  setup() {
    const { t } = useI18n();

    const showHintId = ref();
    const setShowHintId = (id: number) => {
      if (showHintId.value === id) {
        return (showHintId.value = undefined);
      }
      showHintId.value = id;
    };

    return { showHintId, setShowHintId, t };
  },
});
</script>
