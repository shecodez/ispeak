<template>
  <!-- <h1 class="text-4xl">Saga {{ $route.params.id }}</h1> -->
  <FixedFrame>
    <aside class="toolbar p-4">
      <div class="flex items-center space-x-1">
        <button class="text-2xl hover:transform hover:scale-110">💗</button>
        <h2 class="text-2xl">{{ saga?.title }}</h2>
      </div>

      <div class="flex flex-wrap items-center space-x-2">
        <label class="text-sm font-semibold mr-2">view as:</label>
        <select @change="setMe($event)" class="text-black">
          <template v-for="member in saga.members" :key="member">
            <option :value="member">{{ member }}</option>
          </template>
          <option value="">none</option>
        </select>

        <select v-if="!isLoading" @change="setSagaBoardId($event)" class="text-black" :value="board.id">
          <template v-for="board in sagaBoards" :key="board.id">
            <option :value="board.id">{{ board.title }}</option>
          </template>
        </select>
      </div>
    </aside>

    <Spinner v-if="isLoading" />
    <AlertMessage v-else-if="error" type="error" :message="error" />
    <template v-else>
      <div class="px-4 flex-1 thin-scrollbar">
        <div class="flex gap-5 mb-2">
          <h1 class="text-3xl">{{ board.title }}</h1>
          <IconGroupInline :items="boardMembers" />
        </div>

        <p class="pb-4">{{ saga?.description }}</p>

        <div class="flex-1 flex flex-col gap-4 overflow-y-auto thin-scrollbar">
          <template v-for="note in board.notes" :key="note.id">
            <div
              class="note-container relative"
              :class="!me || !note.assignedTo ? 'mx-auto' : me === note.assignedTo ? 'ml-auto' : 'mr-auto'"
            >
              <StickyNote :note="note" />
            </div>
          </template>
        </div>
      </div>
      <Pagination :page="filters._page" :itemsPerPage="filters._limit" :totalItems="total" @pagechange="onPageChange" />
    </template>
  </FixedFrame>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useApi from '@/use/api';
import { useUrlQuery, useUrlParams } from '@/use/fetch';
import { Kanban, Note } from '@/data/interfaces';
import FixedFrame from '@/components/layouts/FixedFrame.vue';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Pagination from '@/components/ui/Pagination.vue';
import Menu from '@/components/ui/Menu.vue';
import StickyNote from '@/components/notes/Note.vue';
import IconGroupInline from '@/components/ui/IconGroupInline.vue';

export default defineComponent({
  name: 'Saga',
  components: { FixedFrame, Spinner, AlertMessage, Pagination, Menu, StickyNote, IconGroupInline },
  setup() {
    const { t } = useI18n();
    const route = useRoute();

    const filters = reactive({
      search: '',
      _page: 1, // board index
      _limit: 1,
    });

    // const { data: saga, isLoading, error, get } = useApi(`/kanbans/${route.params.id}`);
    // get();

    const url = useUrlParams(`/kanbans/${route.params.id}`, filters);
    const { result: saga, reload, isLoading, error } = useUrlQuery(url, {} as Kanban);
    const total = computed(() => saga.value.boards.length);

    const board = computed(() => saga.value.boards[filters._page - 1]);
    const boardMembers = computed(
      () => new Set(board.value.notes?.filter((i: Note) => Boolean(i.assignedTo)).map((x: Note) => x.assignedTo))
    );

    const me = ref('');
    const setMe = (evt: any) => {
      me.value = evt.target.value;
    };

    const sagaBoards = computed(() => saga.value?.boards?.map((board) => ({ id: board.id, title: board.title })));
    const setSagaBoardId = (evt: any) => {
      const boardId = evt.target.value;
      var idx = sagaBoards.value.findIndex((b) => b.id === boardId);
      filters._page = idx + 1;
    };

    const onPageChange = (page: number) => {
      filters._page = page;
    };

    return {
      filters,
      saga,
      isLoading,
      error,
      total,
      sagaBoards,
      setSagaBoardId,
      me,
      setMe,
      board,
      boardMembers,
      onPageChange,
      t,
    };
  },
});
</script>

<style scoped>
.note-container {
  max-width: 80%;
}
</style>
