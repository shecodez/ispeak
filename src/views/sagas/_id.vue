<template>
  <!-- <h1 class="text-4xl">Saga {{ $route.params.id }}</h1> -->
  <FixedFrame>
    <aside class="toolbar py-3 px-4">
      <div class="flex items-center space-x-1">
        <button class="text-2xl hover:transform hover:scale-110">💗</button>
        <h2 class="text-2xl">{{ saga?.title }}</h2>
      </div>

      <div class="flex flex-wrap items-center space-x-2">
        <select @change="setPage($event)" class="text-black">
          <template v-for="board in sagaBoards" :key="board.id">
            <option :value="board.id">{{ board.title }}</option>
          </template>
        </select>
      </div>
    </aside>

    <Spinner v-if="isLoading" />
    <AlertMessage v-else-if="error" type="error" :message="error" />
    <template v-else>
      <div class="mx-4 flex-1 thin-scrollbar">
        <h1 class="text-3xl mb-2">{{ saga.boards[page - 1].title }}</h1>

        <p>{{ saga?.description }}</p>

        <div class="flex-1 flex flex-col space-y-2 overflow-y-auto thin-scrollbar">
          <template v-for="note in saga.boards[page - 1].notes" :key="note.id">
            <div class="p-4 border">{{ note.text }}</div>
          </template>
        </div>
      </div>
      <Pagination :page="page" :itemsPerPage="1" :totalItems="saga.boards.length" />
    </template>
  </FixedFrame>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useApi from '@/use/api';
import FixedFrame from '@/components/layouts/FixedFrame.vue';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Pagination from '@/components/ui/Pagination.vue';
import Menu from '@/components/ui/Menu.vue';

export default defineComponent({
  name: 'Saga',
  components: { FixedFrame, Spinner, AlertMessage, Pagination, Menu },
  setup() {
    const { t } = useI18n();
    const route = useRoute();

    const page = ref(1); // board index

    const { data: saga, isLoading, error, get } = useApi(`/kanbans/${route.params.id}`);
    get();

    const board = computed(() => saga.value.boards[page.value - 1].title);

    const sagaBoards = computed(() => saga.value?.boards?.map((b) => ({ id: b.id, title: b.title })));

    const setPage = (evt: any) => {
      const boardId = evt.target.value;
      var idx = sagaBoards.value.findIndex((b) => b.id === boardId);
      page.value = idx + 1;
    };

    const prev = () => {
      if (page.value - 1 > 0) page.value -= 1;
    };

    const next = () => {
      if (page.value + 1 <= saga.value.boards.length) page.value += 1;
    };

    return { saga, page, setPage, sagaBoards, prev, next, isLoading, error, t };
  },
});
</script>
