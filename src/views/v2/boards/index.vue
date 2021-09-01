<template>
  <FixedFrame>
    <Spinner v-if="isLoading" />
    <aside class="toolbar px-3 pt-3.5 flex items-center justify-between">
      <h1 class="text-xl font-bold capitalize">📋 {{ t('boards') }}</h1>
      <button class="btn primary-green" @click="addBoard">➕ {{ t('add_board') }}</button>
    </aside>

    <AlertMessage v-if="error" type="error" :message="error" />
    <template v-else>
      <section class="m-3 flex-1 thin-scrollbar">
        <div v-if="!boards?.length">No Results.</div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <template v-for="board in boards" :key="board.id">
            <router-link :to="{ name: 'Board', params: { id: board.id } }">
              <div class="p-4 h-24 border rounded">
                {{ board.title }}
              </div>
            </router-link>
          </template>
        </div>
      </section>

      <Pagination />
    </template>

    <!-- TODO: add showBottomFrame to FixedFrame to make below button visible -->
    <template v-slot:bottom>
      <button class="bg-red-500 rounded-tl-3xl h-full w-16">
        <Tooltip :text="t('delete_board')" placement="left">🗑️</Tooltip>
        <span class="sr-only">Delete D&D Board/View Delete Activity</span>
      </button>
    </template>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTitle } from '@vueuse/core';
import { useRouter } from 'vue-router';

import { useBoards } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import FixedFrame from '@/layouts/FixedFrame.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import Spinner from '@/components/ui/Spinner.vue';
import Pagination from '@/components/ui/Pagination.vue';

export default defineComponent({
  name: 'v2Boards',
  components: { AlertMessage, FixedFrame, Tooltip, Spinner, Pagination },
  setup() {
    const { t } = useI18n();
    const router = useRouter();

    useTitle(`Boards · 🎬 ${import.meta.env.VITE_APP_NAME}`);

    const { data: state, all, add, del } = useBoards;

    onMounted(async () => await all());

    async function addBoard() {
      const data = await add({ title: t('untitled'), position: state.boards.length });
      router.push(`/boards/${data?.id}`);
    }

    return { t, ...toRefs(state), addBoard };
  },
});
</script>

<style scoped>
li a,
li button {
  @apply block h-40 min-w-40 p-4 transition-all duration-300 ease-in-out;
}

li a {
  @apply bg-black bg-opacity-30 hover:bg-opacity-40 rounded;
}

li button {
  @apply border-2 border-dashed;
}
</style>
