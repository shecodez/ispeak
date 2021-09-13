<template>
  <Layout :title="t('boards')">
    <template v-slot:header>
      <n-page-header @back="handleBack">
        <template #title>
          <a href="#" class="title">{{ t('boards') }}</a>
        </template>

        <template #extra>
          <n-space align="center" justify="end">
            <n-input placeholder="Search...">
              <template #prefix>
                <n-icon><i-search /></n-icon>
              </template>
            </n-input>
            <n-button @click="addBoard">
              <n-icon>
                <i-plus />
              </n-icon>
              <span class="ml-2">{{ t('add_board') }}</span>
            </n-button>
            <n-dropdown @select="handleSelect" :options="options" placement="bottom-end">
              <n-button text size="tiny" color="#9d9ea2">
                <template #icon><i-ellipsis-v /></template>
              </n-button>
            </n-dropdown>
          </n-space>
        </template>
      </n-page-header>
    </template>

    <Spinner v-if="isLoading" />
    <AlertMessage v-if="error" type="error" :message="error" />
    <section v-else>
      <div v-if="!boards?.length">No Results.</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <template v-for="board in boards" :key="board.id">
          <BoardIndexCard :board="board" :del="del" />
        </template>
      </div>
    </section>

    <!-- <Pagination /> -->
  </Layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Search as ISearch, EllipsisV as IEllipsisV, PlusCircle as IPlus } from '@vicons/fa';

import { useBoards } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Layout from '@/layouts/Minimalist.vue';
import Spinner from '@/components/ui/Spinner.vue';
import BoardIndexCard from '@/components/boards/BoardIndexCard.vue';
//import Pagination from '@/components/ui/Pagination.vue';

export default defineComponent({
  name: 'Boards',
  components: {
    AlertMessage,
    Layout,
    Spinner,
    ISearch,
    IEllipsisV,
    IPlus,
    BoardIndexCard,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const { data: state, all, add, del } = useBoards;
    onMounted(async () => await all());

    async function addBoard() {
      const data = await add({ title: t('untitled'), position: state.boards.length });
      router.push(`/boards/${data?.id}`);
    }

    function handleBack() {
      console.log('Go Back');
    }

    const options = [
      {
        label: t('add_board'),
        key: '1',
      },
    ];

    function handleSelect(key: string) {
      switch (key) {
        case '1':
          addBoard();
          break;
        default:
          break;
      }
    }

    return {
      t,
      ...toRefs(state),
      del,
      addBoard,
      handleBack,
      options,
      handleSelect,
    };
  },
});
</script>
