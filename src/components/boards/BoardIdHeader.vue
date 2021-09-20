<template>
  <n-page-header @back="handleBack">
    <template #title>
      <!-- <a href="#" class="title">{{ board.title }}</a> -->
      <InPlaceEdit :value="title" @submit="updateTitle" css="font-bold" showButtons />
    </template>
    <template #avatar>
      <n-avatar>{{ abbr(title) }}</n-avatar>
    </template>

    <template #extra>
      <n-space align="center" justify="end">
        <n-tooltip trigger="hover" :show-arrow="false">
          <template #trigger>
            <n-button @click="toggleIsPublic" ghost style="padding: 0 0.715em">
              <n-icon>
                <i-fa-solid-globe-americas v-if="isPublic" />
                <i-mdi-lock v-else />
              </n-icon>
            </n-button>
          </template>
          <span>{{ isPublic ? t('public') : t('private') }}</span>
        </n-tooltip>

        <n-input placeholder="Search...">
          <template #prefix>
            <n-icon><i-uil-search /></n-icon>
          </template>
        </n-input>

        <AvatarGroup :items="['AAA', 'BEE', 'CDC', 'DD']" :showAddBtn="true" />

        <n-dropdown @select="handleSelect" :options="options" placement="bottom-start">
          <n-button text size="tiny" color="#9d9ea2">
            <template #icon><i-entypo-dots-three-vertical /></template>
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

import { abbr } from '@/utils';
import { Board as iBoard } from '@/data/types/mock';
import { db } from '@/use/db';
import AvatarGroup from '@/components/ui/AvatarGroup.vue';
import ConfirmDeleteDialog from '@/components/ui/ConfirmDeleteDialog.vue';

export default defineComponent({
  name: 'BoardIdHeader',
  components: { AvatarGroup, ConfirmDeleteDialog },
  props: {
    board: {
      type: Object as PropType<iBoard>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const router = useRouter();
    const { data: store, updateTitle: updateBoardTitle, updateVisibility, del } = db.boards;

    const state = reactive({
      title: computed(() => props.board.title),
      isPublic: computed(() => props.board.is_public),
      isDeleting: false,
    });

    async function updateTitle(title: string) {
      await updateBoardTitle(props.board, title);
      //state.title = title;
    }

    async function toggleIsPublic() {
      const is_public = !state.isPublic;
      await updateVisibility(props.board, is_public);
      //state.isPublic = is_public;
    }

    async function deleteBoard() {
      const { board } = props;
      if (board) await del(board);
      close();
    }

    function close() {
      state.isDeleting = false;
    }

    function handleBack() {
      router.back();
    }

    const options = computed(() => [
      {
        label: state.isPublic ? 'Make Private' : 'Go Public',
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
      // {
      //   label: 'Change Background',
      //   key: '5',
      // },
    ]);

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

    return {
      t,
      abbr,
      ...toRefs(state),
      updateTitle,
      toggleIsPublic,
      deleteBoard,
      close,
      handleBack,
      options,
      handleSelect,
    };
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
