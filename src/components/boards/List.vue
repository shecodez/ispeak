<template>
  <div :class="isHiddenOverflowY ? 'list-container max-h-11/12' : ''">
    <div
      class="flex flex-col gap-2 relative overflow-hidden max-h-full"
      :class="list.publish_date ? (list.gems ? 'border-indigo-500' : 'border-green-500') : 'border-gray-500'"
    >
      <n-space align="center" justify="space-between">
        <small>
          <b style="margin-right: 0.25rem">{{ list.title }}</b>
          <!-- <n-tag size="small" style="border-radius: 50%">{{ list.cards.length }}</n-tag> -->
          <n-badge :value="list.cards?.length" :max="999" color="#ccc" />
        </small>

        <div>
          <div class="handle grabbable hidden md:block">📌</div>
          <n-dropdown :options="options">
            <n-button text size="tiny" color="#9d9ea2">
              <template #icon><i-ellipsis-h /></template>
            </n-button>
          </n-dropdown>
        </div>
      </n-space>

      <AlertMessage v-if="error" type="error" :message="error" />

      <draggable
        class="flex flex-col mt-0.5 overflow-x-hidden overflow-y-auto"
        :list="list.cards"
        group="cards"
        @change="log"
        itemKey="id"
        :animation="200"
        ghost-class="ghost"
      >
        <template #item="{ element, index }">
          <Card :card="element" :position="index" @delete="sort(list)" />
        </template>
      </draggable>

      <n-button dashed style="width: 100%">
        <template #icon>
          <n-icon>+</n-icon>
        </template>
        Card
      </n-button>
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
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import draggable from 'vuedraggable';
import { EllipsisH as IEllipsisH } from '@vicons/fa';

import { List, Card as iCard } from '@/data/types/mock';
import { useLists, useCards } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import ConfirmDeleteInPlace from '@/components/ui/ConfirmDeleteInline.vue';
import InPlaceEdit from '@/components/boards/InPlaceEdit.vue';
import Card from '@/components/boards/Card.vue';
import CardFormDialog from '@/components/boards/dialogs/CardFormDialog.vue';
import ListFormDialog from '@/components/boards/dialogs/ListFormDialog.vue';

export default defineComponent({
  name: 'List',
  components: {
    draggable,
    IEllipsisH,
    AlertMessage,
    ConfirmDeleteInPlace,
    InPlaceEdit,
    Card,
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
      options: [
        {
          label: t('add_card'),
          key: '1',
        },
        {
          label: t('edit_list'),
          key: '2',
        },
        {
          label: t('delete_list'),
          key: '3',
        },
      ],
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
.ghost {
  @apply opacity-50 border-dashed border border-cyan-300;
}

.n-space {
  color: #4d4c51;
}

.n-button {
  color: #9c9ea2;
  display: flex;
  align-content: center;
}
</style>
