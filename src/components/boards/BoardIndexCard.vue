<template>
  <div class="p-4 bg-white shadow rounded flex flex-col gap-2">
    <div class="mini-tags flex gap-1">
      <template v-for="i in 3" :key="`tag-${i}`">
        <div class="py-0.5 px-3 bg-green-500 my-auto" />
      </template>
      <button>+</button>

      <n-dropdown @select="handleSelect" :options="options" placement="bottom-start">
        <n-button text size="tiny" color="#9d9ea2" style="margin-left: auto">
          <template #icon><i-entypo-dots-three-horizontal /></template>
        </n-button>
      </n-dropdown>
    </div>

    <div class="flex items-center gap-2 mb-4">
      <n-avatar class="flex-shrink-0">
        {{ abbr(board.title) }}
      </n-avatar>
      <b class="hover:underline text-lg">
        <router-link :to="{ name: 'ViewBoard', params: { id: board.id } }">
          {{ board.title }}
        </router-link>
      </b>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1 text-sm">
        <i-mdi-web v-if="board.is_public" />
        <i-mdi-lock v-else />
        {{ board.is_public ? t('public') : t('private') }}
      </div>
      <AvatarGroup :items="['AAA', 'BEE', 'CDC', 'DD']" :showAddBtn="true" />
    </div>
  </div>

  <ConfirmDeleteDialog :showDialog="isDeleting" :onClose="close" :onDelete="deleteBoard" />
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Board } from '@/data/types/mock';
import { abbr } from '@/utils';
import AvatarGroup from '@/components/ui/AvatarGroup.vue';
import ConfirmDeleteDialog from '@/components/ui/ConfirmDeleteDialog.vue';

export default defineComponent({
  name: 'BoardIndexCard',
  components: { AvatarGroup, ConfirmDeleteDialog },
  props: {
    board: {
      type: Object as PropType<Board>,
      required: true,
    },
    del: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const { t } = useI18n();
    const router = useRouter();

    const state = reactive({
      isDeleting: false,
    });

    const options = [
      {
        label: 'View Board',
        key: '1',
      },
      {
        label: t('edit_board'),
        key: '2',
      },
      {
        label: t('delete_board'),
        key: '3',
      },
    ];

    function handleSelect(key: string) {
      switch (key) {
        case '1':
          router.push(`/boards/${props.board.id}`);
          break;
        case '2':
          router.push(`/boards/${props.board.id}/edit`);
          break;
        case '3':
          state.isDeleting = true;
          break;
        default:
          break;
      }
    }

    async function deleteBoard() {
      const board = props.board;
      if (board) {
        await props.del(board);
      }
      close();
    }

    function close() {
      state.isDeleting = false;
    }

    return { t, abbr, ...toRefs(state), options, handleSelect, deleteBoard, close };
  },
});
</script>
