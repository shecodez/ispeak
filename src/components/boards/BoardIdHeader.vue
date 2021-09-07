<template>
  <n-page-header @back="handleBack">
    <template #title>
      <!-- <a href="#" class="title">{{ board.title }}</a> -->
      <InPlaceEdit :value="board.title" @submit="updateTitle" css="font-bold" showButtons />
    </template>
    <template #avatar>
      <n-avatar>{{ abbrTitle }}</n-avatar>
    </template>

    <template #extra>
      <n-space align="center" justify="end">
        <n-tooltip trigger="hover" :show-arrow="false">
          <template #trigger>
            <n-button ghost style="padding: 0 0.715em">
              <n-icon>
                <i-globe v-if="board.is_public" />
                <i-lock v-else />
              </n-icon>
            </n-button>
          </template>
          {{ board.is_public ? t('public') : t('private') }}
        </n-tooltip>
        <n-input placeholder="Search...">
          <template #prefix>
            <n-icon><i-search /></n-icon>
          </template>
        </n-input>
        <AvatarGroup :items="['AAA', 'BEE', 'CDC', 'DD']" :showAddBtn="true" />
        <n-dropdown @select="handleSelect" :options="options" placement="bottom-start">
          <n-button text size="tiny" color="#9d9ea2">
            <template #icon><i-ellipsis-v /></template>
          </n-button>
        </n-dropdown>
      </n-space>
    </template>
  </n-page-header>

  <ConfirmDeleteDialog :showDialog="isDeleting" :onClose="close" :onDelete="deleteBoard" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Search as ISearch, EllipsisV as IEllipsisV, Lock as ILock, GlobeAmericas as IGlobe } from '@vicons/fa';

import { Board as iBoard } from '@/data/types/mock';
import { useBoards } from '@/use/db';
import AvatarGroup from '@/components/ui/AvatarGroup.vue';

export default defineComponent({
  name: 'BoardIdHeader',
  components: { AvatarGroup, ISearch, IEllipsisV, ILock, IGlobe },
  props: {
    board: {
      type: Object as PropType<iBoard>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const router = useRouter();
    const { update, del } = useBoards;

    function handleBack() {
      router.back();
    }

    const state = reactive({
      isDeleting: false,
      options: [
        {
          label: props.board.is_public ? 'Make Private' : 'Go Public',
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
        {
          label: t('add_list'),
          key: '4',
        },
        {
          label: 'Send Invites',
          key: '5',
        },
      ],
    });

    const abbrTitle = computed(() =>
      props.board.title
        .split(/\s/)
        .reduce((res: string, word: string) => (res += word.slice(0, 1)), '')
        .substring(0, 3)
    );

    async function updateTitle(title: string) {
      await update({ ...props.board!, title });
    }

    async function toggleIsPublic() {
      //console.log('UPDATE board.is_public', board.is_public);
      await update({ ...props.board!, is_public: !props.board.is_public });
    }

    async function deleteBoard() {
      const { board } = props;
      if (board) {
        await del(board);
      }
      close();
    }

    function close() {
      state.isDeleting = false;
    }

    function handleSelect(key: string) {
      switch (key) {
        case '1':
          toggleIsPublic();
          break;
        case '2':
          router.push(`/boards/${props.board.id}/edit`);
          break;
        case '3':
          state.isDeleting = true;
          break;
        case '4':
          router.push(`/boards/${props.board.id}/lists/new`);
          break;
        default:
          break;
      }
    }

    return { t, handleBack, ...toRefs(state), abbrTitle, updateTitle, handleSelect, deleteBoard, close };
  },
});
</script>

<style scoped>
.title {
  text-decoration: none;
  color: inherit;
  font-weight: bold;
}

/* .n-input {
  background-color: #eaebef;
} */

.n-button {
  display: flex;
  align-content: center;
  padding: 0 0.4em;
}
</style>
