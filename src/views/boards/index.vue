<template>
  <Spinner v-if="isLoading" />
  <Layout v-else :title="t('boards')">
    <template v-slot:header>
      <n-page-header @back="handleBack">
        <template #title>
          <h1 class="title">{{ t('boards') }}</h1>
        </template>

        <template #extra>
          <n-space align="center" justify="end">
            <n-input placeholder="Search...">
              <template #prefix>
                <n-icon><i-uil-search /></n-icon>
              </template>
            </n-input>
            <n-button @click="addBoard">
              <n-icon>
                <i-mdi-plus-circle-outline />
              </n-icon>
              <span class="ml-2">{{ t('add_board') }}</span>
            </n-button>
            <n-dropdown @select="handleSelect" :options="options" placement="bottom-end">
              <n-button text size="tiny" color="#9d9ea2">
                <template #icon><i-entypo-dots-three-vertical /></template>
              </n-button>
            </n-dropdown>
          </n-space>
        </template>
      </n-page-header>
    </template>
    <AlertMessage v-if="error" type="error" :message="error" />
    <section v-else>
      <div v-if="!boards?.length">No Results.</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <template v-for="board in boards" :key="board.id">
          <BoardCard :board="board" :del="del" />
        </template>
      </div>
    </section>
    <!-- <Pagination /> -->
  </Layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { db } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Layout from '@/layouts/Minimalist.vue';
import Spinner from '@/components/ui/Spinner.vue';
import BoardCard from '@/components/boards/BoardIndexCard.vue';
//import Pagination from '@/components/ui/Pagination.vue';

export default defineComponent({
  name: 'Boards',
  components: {
    AlertMessage,
    Layout,
    Spinner,
    BoardCard,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const { data: store, allMyBoards, add, del } = db.boards;

    onMounted(async () => await allMyBoards());

    const options = [
      {
        label: t('add_board'),
        key: '1',
      },
    ];

    async function addBoard() {
      const data = await add({ title: t('untitled'), position: store.boards.length });
      if (data) router.push(`/boards/${data?.id}`);
    }

    function handleBack() {
      router.go(-1); // same as router.back()?
    }

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
      ...toRefs(store),
      options,
      del,
      addBoard,
      handleBack,
      handleSelect,
    };
  },
});
</script>
