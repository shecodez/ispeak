<template>
  <aside class="flex flex-col gap-4 h-full">
    <n-input v-if="!listOnly" v-model:value="q" size="large" placeholder="Search boards by title...">
      <template #prefix>
        <n-icon><i-uil-search /></n-icon>
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
          <n-avatar size="large">
            {{ abbr(board.title) }}
          </n-avatar>
          <div class="flex-1 px-3 font-semibold text-xs">
            <router-link :to="`/boards/${board.id}`">{{ board.title }}</router-link>
          </div>
        </div>
      </template>
    </div>

    <div v-if="!listOnly" class="text-center flex flex-col gap-2">
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
import { computed, defineComponent, PropType, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

import { abbr } from '@/utils';
import { useBoards } from '@/use/db';
import { Board } from '@/data/types/mock';

export default defineComponent({
  name: 'BoardList',
  props: {
    boards: {
      type: Array as PropType<Board[]>,
      required: true,
    },
    listOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const router = useRouter();
    const { add } = useBoards;

    const currentRouteName = computed(() => useRoute().name);

    const q = ref('');

    async function addBoard() {
      const data = await add({ title: t('untitled'), position: props.boards.length });
      router.push(`/boards/${data?.id}`);
    }

    return { t, abbr, q, currentRouteName, addBoard };
  },
});
</script>

<style scoped>
h5 {
  @apply text-xs uppercase font-semibold my-2;
}
</style>
