<template>
  <div :class="isHiddenOverflowY ? 'list-container max-h-11/12' : ''">
    <div
      class="flex flex-col gap-2 relative overflow-hidden max-h-full"
      :class="list.publish_date ? (list.gems ? 'border-indigo-500' : 'border-green-500') : 'border-gray-500'"
    >
      <n-space align="center" justify="space-between">
        <small class="flex items-center gap-2">
          <InPlaceEdit :value="list?.title" @submit="updateTitle" css="text-xs font-bold" />
          <!-- <n-tag size="small" style="border-radius: 50%">{{ list.cards.length }}</n-tag> -->
          <n-badge :value="list.cards?.length" :max="999" color="#ccc" />
          <n-tooltip v-if="!!list.publish_date">
            <template #trigger>
              <span>✔️</span>
            </template>
            📅&nbsp;{{ list.publish_date }}
          </n-tooltip>
        </small>

        <div class="flex items-center gap-2">
          <div class="handle grabbable f-center hidden md:block">
            <i-mdi-arrow-all />
          </div>
          <n-dropdown @select="handleSelect" :options="options">
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

      <router-link :to="{ name: 'Board.List.NewCard', params: { listId: list.id } }">
        <div class="f-center border rounded bg-white bg-opacity-40 hover:bg-opacity-100 p-2 gap-1">
          <i-mdi-plus />
          <b class="text-xs">{{ t('card') }}</b>
        </div>
      </router-link>
    </div>

    <ConfirmDeleteDialog :showDialog="isDeleting" :onClose="close" :onDelete="deleteList" />
    <!-- <ListFormDialog
      action="Update List"
      :showDialog="isEditingList"
      :edit="list"
      :onSubmit="updateList"
      :onClose="close"
      :onDelete="deleteList"
    />

    <CardFormDialog action="Add Card" :showDialog="isAddingCard" :onSubmit="addCard" :onClose="close" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import draggable from 'vuedraggable';
import { EllipsisH as IEllipsisH } from '@vicons/fa';

import { List } from '@/data/types/mock';
import { useLists } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import ConfirmDeleteDialog from '@/components/ui/ConfirmDeleteDialog.vue';
import InPlaceEdit from '@/components/boards/InPlaceEdit.vue';
import Card from '@/components/boards/Card.vue';

export default defineComponent({
  name: 'List',
  components: {
    draggable,
    IEllipsisH,
    AlertMessage,
    ConfirmDeleteDialog,
    InPlaceEdit,
    Card,
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
    const router = useRouter();
    const { data, update, sort, del } = useLists;

    const state = reactive({
      isDeleting: false,
      options: [
        {
          label: !!props.list.publish_date ? 'Unpublish List' : 'Publish List',
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
        {
          label: t('add_card'),
          key: '4',
        },
      ],
    });

    async function updateTitle(title: string) {
      await update({ ...props.list, title });
    }

    async function togglePublishDate() {
      await update({ ...props.list, publish_date: !!props.list.publish_date ? null : new Date().toISOString() });
    }

    async function deleteList() {
      await del(props.list);
      // TODO: re-position lists?
    }

    function handleSelect(key: string) {
      const listId = Number(props.list.id);

      switch (key) {
        case '1':
          togglePublishDate();
          break;
        case '2':
          router.push({ name: 'Board.EditList', params: { listId } });
          break;
        case '3':
          state.isDeleting = true;
          break;
        case '4':
          router.push({ name: 'Board.List.NewCard', params: { listId } });
          break;
        default:
          break;
      }
    }

    function close() {
      state.isDeleting = false;
    }

    async function log(e: any) {
      // const { element, oldIndex, newIndex } = e.moved;
      await sort(props.list);
    }

    return {
      t,
      ...toRefs(data),
      ...toRefs(state),
      updateTitle,
      deleteList,
      handleSelect,
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
