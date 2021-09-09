<template>
  <div :class="isHiddenOverflowY ? 'list-container max-h-11/12' : ''">
    <div
      class="b-list relative overflow-hidden max-h-full"
      :class="list.publish_date ? (list.gems ? 'border-indigo-500' : 'border-green-500') : 'border-gray-500'"
    >
      <div class="l-header m-2">
        <!-- TODO: edit gems and publish_date inPlaceEdit -->
        <button v-if="list.gems" class="f-center gem-badge">{{ list.gems }}💎</button>
        <button v-if="list.publish_date" class="block text-caption mx-auto" :class="list.gems ? ' pt-3' : ''">
          📅 {{ list.publish_date }}
        </button>
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <V2InPlaceEdit :value="list?.title" @submit="updateTitle" />
              <span>({{ list.cards?.length }})</span>
            </div>
            <p class="text-caption">{{ list.position }}-{{ list.id }}&nbsp;<span>🎬</span></p>
          </div>
          <div class="handle grabbable text-2xl">📌</div>
        </div>
      </div>

      <AlertMessage v-if="error" type="error" :message="error" />

      <draggable
        class="thin-scrollbar card-container"
        :list="list.cards"
        group="cards"
        @change="log"
        itemKey="id"
        :animation="200"
        ghost-class="ghost"
      >
        <template #item="{ element, index }">
          <V2Card :card="element" :position="index" @delete="sort(list)" />
        </template>
      </draggable>

      <div class="l-footer flex items-center">
        <button @click="isAddingCard = true" class="btn hover:bg-green-400">➕</button>
        <button @click="isEditingList = true" class="btn hover:bg-yellow-400">✏️</button>
        <div class="ml-auto">
          <ConfirmDeleteInPlace :onDelete="deleteList" />
        </div>
      </div>
    </div>

    <ListFormDialog
      action="Update List"
      :showDialog="isEditingList"
      :edit="list"
      :onSubmit="updateList"
      :onClose="close"
      :onDelete="deleteList"
    />

    <CardFormDialog action="Add Card" :showDialog="isAddingCard" :onSubmit="addCard" :onClose="close" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import draggable from 'vuedraggable';

import { List, Card as iCard } from '@/data/types/mock';
import { useLists, useCards } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import ConfirmDeleteInPlace from '@/components/ui/ConfirmDeleteInline.vue';
import V2InPlaceEdit from '@/components/v2/boards/V2InPlaceEdit.vue';
import V2Card from '@/components/v2/boards/V2Card.vue';
import CardFormDialog from '@/components/v2/boards/dialogs/CardFormDialog.vue';
import ListFormDialog from '@/components/v2/boards/dialogs/ListFormDialog.vue';

export default defineComponent({
  name: 'v2List',
  components: {
    draggable,
    AlertMessage,
    ConfirmDeleteInPlace,
    V2InPlaceEdit,
    V2Card,
    ListFormDialog,
    CardFormDialog,
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: true,
    },
    isHiddenOverflowY: {
      type: Boolean,
      required: true,
    },
    position: {
      type: Number,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const state = reactive({
      isAddingCard: false,
      isEditingList: false,
    });

    const { data, update, del, sort } = useLists;
    const { add } = useCards;

    async function updateList(list: List) {
      await update({ ...props.list, ...list });
    }

    async function updateTitle(title: string) {
      await update({ ...props.list, title });
    }

    async function deleteList() {
      await del(props.list);
      // TODO: re-position lists?
    }

    async function addCard(card: iCard) {
      const list = props.list;
      await add(list, {
        ...card,
        position: list?.cards?.length || 0,
      });
    }

    function close() {
      state.isEditingList = false;
      state.isAddingCard = false;
    }

    async function log(e: any) {
      // const { element, oldIndex, newIndex } = e.moved;
      await sort(props.list);
    }

    return {
      t,
      ...toRefs(data),
      ...toRefs(state),
      updateList,
      updateTitle,
      deleteList,
      addCard,
      sort,
      close,
      log,
    };
  },
});
</script>

<style scoped>
.gem-badge {
  @apply w-11 h-11 absolute inset-x-0 mx-auto -top-1 rounded-full font-bold;
}

.b-list {
  @apply m-2 bg-gray-600 bg-opacity-30 rounded p-2 border-t-4 flex flex-col gap-2;
}

.text-caption {
  @apply text-xs text-gray-600 dark:text-gray-400;
}

.ghost {
  @apply opacity-50 border-dashed border border-cyan-300;
}

.card-container {
  @apply flex flex-col gap-2 overflow-x-hidden overflow-y-auto;
}
</style>
