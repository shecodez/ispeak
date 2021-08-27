<template>
  <div class="relative">
    <AlertMessage v-if="error" type="error" :message="error" css="m-2" />

    <button v-if="card.details" class="text-xs absolute top-1 right-4 z-10 text-black" @click="toggleDetails">
      {{ showDetails ? 'hide details' : 'show details' }}
    </button>

    <div
      @click="isEditing = true"
      class="sticky-note mx-2 cursor-pointer"
      :style="`background-color: ${card.color}; color: ${card.text_color}`"
    >
      <div class="relative overflow-hidden">
        <div class="note-text p-2 flex flex-col">
          <b class="text-xs">{{ card.assigned_to }}</b>
          <p>{{ card.text }}</p>
          <i class="text-xs font-sans" :class="showDetails ? '' : 'hidden'">
            {{ card.details }}
          </i>
        </div>
      </div>
    </div>

    <CardFormDialog
      action="Update Card"
      :showDialog="isEditing"
      :edit="card"
      :onSubmit="updateCard"
      :onClose="close"
      :onDelete="deleteCard"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToggle } from '@vueuse/core';

import { Card } from '@/data/types/mock';
import { useCards } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import CardFormDialog from '@/components/v2/boards/dialogs/CardFormDialog.vue';

export default defineComponent({
  name: 'v2Card',
  components: { AlertMessage, CardFormDialog },
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
    position: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    const { data, update, del } = useCards;
    const isEditing = ref(false);

    const showDetails = ref();
    const toggleDetails = useToggle(showDetails);

    async function updateCard(card: Card) {
      await update({ ...props.card, ...card });
    }

    async function deleteCard() {
      await del(props.card);
      emit('delete'); // re-position cards
    }

    function close() {
      isEditing.value = false;
    }

    return { t, showDetails, toggleDetails, ...toRefs(data), isEditing, updateCard, deleteCard, close };
  },
});
</script>
