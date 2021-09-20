<template>
  <div :class="isHideOverflowY ? 'list-container max-h-11/12' : ''">
    <div class="relative flex flex-col gap-2 overflow-hidden max-h-full">
      <n-space align="center" justify="space-between">
        <small class="flex items-center gap-2">
          <InPlaceEdit :value="list?.title" @submit="updateTitle" css="text-xs font-bold" />
          <n-badge v-if="list.cards?.length" :value="list.cards?.length" :max="99" color="#ccc" />
          <n-tooltip v-if="!!publishDate">
            <template #trigger>
              <span v-if="isPast(new Date(publishDate))">✔️<span class="sr-only">published</span></span>
              <span v-else>⏳<span class="sr-only">publish scheduled</span></span>
            </template>
            📅&nbsp;{{ publishDate }}
          </n-tooltip>
        </small>

        <div class="flex items-center gap-2">
          <div class="handle grabbable hidden md:flex items-center">
            <i-mdi-arrow-all />
          </div>
          <n-dropdown @select="handleSelect" :options="options">
            <n-button text size="tiny" color="#9d9ea2">
              <template #icon><i-entypo-dots-three-horizontal /></template>
            </n-button>
          </n-dropdown>
        </div>
      </n-space>

      <AlertMessage v-if="error" type="error" :message="error" />

      <draggable
        :id="`list-${list.id}`"
        :data-title="list.title"
        class="flex flex-col mt-0.5 overflow-x-hidden overflow-y-auto"
        :list="list.cards"
        group="cards"
        @change="log"
        @move="checkMove"
        itemKey="id"
        :animation="200"
        ghost-class="ghost"
        drag-class="drag"
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { isPast } from 'date-fns';
import draggable from 'vuedraggable';

import { List } from '@/data/types/mock';
import { db } from '@/use/db';
import ConfirmDeleteDialog from '@/components/ui/ConfirmDeleteDialog.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import InPlaceEdit from '@/components/boards/InPlaceEdit.vue';
import Card from '@/components/boards/Card.vue';

export default defineComponent({
  name: 'List',
  components: {
    draggable,
    ConfirmDeleteDialog,
    AlertMessage,
    InPlaceEdit,
    Card,
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: true,
    },
    isHideOverflowY: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const { data, updateTitle: updateListTitle, updatePublishDate, sort, del } = db.lists;
    const { add } = db.activity;

    const state = reactive({
      isDeleting: false,
      publishDate: props.list.publish_date,
    });

    async function updateTitle(title: string) {
      await updateListTitle(props.list, title);
    }

    async function togglePublishDate() {
      const publish_date = !!state.publishDate ? null : new Date().toISOString();
      await updatePublishDate(props.list, publish_date);
      //state.publishDate = publish_date;
    }

    async function deleteList() {
      await del(props.list);
      // TODO: re-position lists?
    }

    const options = computed(() => [
      {
        label: !!state.publishDate ? 'Unpublish List' : 'Publish List',
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
    ]);

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
      // const { element, oldIndex, newIndex } = e.added; // e.removed
      await sort(props.list); // sort from list and to list
    }

    // NOTE: not sure how to handle this...?
    async function checkMove(e: any) {
      const { from, dragged, to } = e;

      const fromList = document.getElementById(from.id)?.getAttribute('data-title');
      const toList = document.getElementById(to.id)?.getAttribute('data-title');
      const cardText = document.getElementById(dragged.id)?.getAttribute('data-text');

      //console.log(`moved **${cardText}** from ${fromList} to ${toList}`);
      await add({ text: `moved **${cardText}** from ${fromList} to ${toList}`, board_id: Number(route.params.id) });
    }

    return {
      t,
      isPast,
      ...toRefs(data),
      ...toRefs(state),
      options,
      updateTitle,
      deleteList,
      handleSelect,
      sort,
      close,
      log,
      checkMove,
    };
  },
});
</script>

<style scoped>
.drag {
  opacity: 100 !important;
}

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
