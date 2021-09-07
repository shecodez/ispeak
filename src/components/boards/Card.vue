<template>
  <div class="relative">
    <n-card size="small" hoverable @click="goToEdit">
      <slot>
        <b>{{ card.text }}</b>
      </slot>
      <template #footer>
        <n-space align="center" justify="space-between">
          <n-tag v-if="card.label" size="small" round :color="labelColor">
            {{ card.label }}
          </n-tag>
          <AvatarGroup v-if="card.assigned_to" :items="card.assigned_to" />
        </n-space>
      </template>
    </n-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import tinycolor from 'tinycolor2';

import { Card, NTagColor } from '@/data/types/mock';
import { useCards } from '@/use/db';

export default defineComponent({
  name: 'Card',
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
    position: {
      type: Number,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const router = useRouter();
    const { data } = useCards;

    const labelColor = computed(() => {
      const c = {} as NTagColor;
      c.color = tinycolor(props.card.color).setAlpha(0.2);
      c.borderColor = props.card.color;
      c.textColor = tinycolor(props.card.color).darken(50).toString();

      return c;
    });

    function goToEdit() {
      router.push({ name: 'Board.List.EditCard', params: { listId: props.card.list_id!, cardId: props.card.id! } });
    }

    return { t, ...toRefs(data), labelColor, goToEdit };
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
