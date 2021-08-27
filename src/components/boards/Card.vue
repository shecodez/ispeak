<template>
  <div class="relative">
    <n-card size="small" hoverable @click="isEditing = true">
      <b>{{ card.text }}</b>
      <template #footer>
        <n-space align="center" justify="space-between">
          <n-tag v-if="card.label" size="small" round :color="labelColor">
            {{ card.label }}
          </n-tag>
          <AvatarGroup v-if="card.assigned_to" :items="card.assigned_to" />
        </n-space>
      </template>
    </n-card>

    <AlertMessage v-if="error" type="error" :message="error" css="m-2" />

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
import { computed, defineComponent, PropType, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import tinycolor from 'tinycolor2';

import { Card } from '@/data/types/mock';
import { useCards } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import CardFormDialog from '@/components/boards/dialogs/CardFormDialog.vue';

type NTagColor = {
  color?: string;
  borderColor?: string;
  textColor?: string;
};

export default defineComponent({
  name: 'Card',
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

    const labelColor = computed(() => {
      const c = {} as NTagColor;
      c.color = tinycolor(props.card.color).setAlpha(0.2);
      c.borderColor = props.card.color;
      c.textColor = tinycolor(props.card.color).darken(50).toString();

      return c;
    });

    async function updateCard(card: Card) {
      await update({ ...props.card, ...card });
    }

    async function deleteCard() {
      await del(props.card);
      emit('delete'); // TODO: re-position cards?
    }

    function close() {
      isEditing.value = false;
    }

    return { t, ...toRefs(data), labelColor, isEditing, updateCard, deleteCard, close };
  },
});
</script>

<style scoped>
.n-card {
  cursor: pointer;
  border-radius: 0.375rem;
  box-shadow: 0 10px 6px -6px rgba(0, 0, 0, 0.25);
  margin-bottom: 0.5em;
}
</style>
