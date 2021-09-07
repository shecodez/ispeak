<template>
  <aside class="flex flex-col gap-4 h-full">
    <n-input v-model:value="q" size="large" placeholder="Search boards by title...">
      <template #prefix>
        <n-icon><i-search /></n-icon>
      </template>
    </n-input>

    <div class="flex-1 flex flex-col gap-2">
      <!-- <h5>Recent Boards:</h5>
      <template v-for="board in boards" :key="board.id">
        <n-avatar>{{ abbrTitle(board.title) }}</n-avatar> {{ board.title }}
      </template> -->

      <h5>My Boards:</h5>
      <template v-for="board in boards" :key="board.id">
        <div class="flex items-center rounded bg-white">
          <n-avatar size="large" :style="{ color: 'white', backgroundColor: 'gray' }">
            {{ abbrTitle(board.title) }}
          </n-avatar>
          <div class="flex-1 px-3 font-semibold text-xs">
            <router-link :to="`/boards/${board.id}`">{{ board.title }}</router-link>
          </div>
        </div>
      </template>
    </div>

    <div class="text-center flex flex-col gap-2">
      <router-link to="/boards" v-if="currentRouteName !== 'Boards'">Go to boards</router-link>
      <button @click="addBoard" class="btn primary-blue">
        <div class="f-center gap-2 text-xs uppercase text-white py-1">
          <i-mdi-plus-circle-outline />
          <span class="">{{ t('create_new_board') }}</span>
        </div>
      </button>
    </div>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { Search as ISearch } from '@vicons/fa';

import { useBoards } from '@/use/db';

export default defineComponent({
  name: 'BoardList',
  components: { ISearch },
  props: {
    boards: {
      type: Array,
      default: [],
    },
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const { data: state, add } = useBoards;

    const currentRouteName = computed(() => useRoute().name);

    const q = ref('');

    function abbrTitle(title: string) {
      return title
        .split(/\s/)
        .reduce((res: string, word: string) => (res += word.slice(0, 1)), '')
        .substring(0, 3);
    }

    async function addBoard() {
      const data = await add({ title: t('untitled'), position: state.boards.length });
      router.push(`/boards/${data?.id}`);
    }

    return { t, q, currentRouteName, ...toRefs(state), abbrTitle, addBoard };
  },
});
</script>

<style scoped>
h5 {
  @apply text-xs uppercase font-semibold my-2;
}
</style>
