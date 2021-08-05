<template>
  <FixedFrame>
    <aside class="toolbar flex items-center justify-between py-3 px-4">
      <h1 class="text-2xl capitalize">🎬 {{ t('sagas') }}</h1>
    </aside>

    <div class="flex-1">
      <ul class="mx-4 grid grid-cols-4 gap-4">
        <li>
          <h2 v-if="tagged.length" class="title text-3xl capitalize">
            🔥 {{ filters.tag.replace('-', ' ') }} {{ `(${tagged?.length})` }}
          </h2>
        </li>
        <template v-for="saga in tagged" :key="saga.id">
          <li class="p-4 border inline-block">
            <router-link :to="`/sagas/${saga.id}`">{{ saga.title }}</router-link>
          </li>
        </template>

        <li><h2 class="title text-3xl capitalize">All</h2></li>
        <template v-for="saga in sagas" :key="saga.id">
          <li class="p-4 border inline-block">
            <router-link :to="`/sagas/${saga.id}`">{{ saga.title }}</router-link>
          </li>
        </template>
      </ul>
    </div>

    <Pagination :page="filters._page" :totalItems="total" :itemsPerPage="filters._limit" @pagechange="onPageChange" />
  </FixedFrame>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import debounce from 'lodash.debounce';

import useApi from '@/use/api';
import { useUrlQuery, useUrlParams } from '@/use/fetch';
import { Kanban } from '@/data/interfaces';
import FixedFrame from '@/components/layouts/FixedFrame.vue';
import SagaList from '@/components/saga/SagaList.vue';
import Pagination from '@/components/ui/Pagination.vue';

export default defineComponent({
  name: 'Sagas',
  components: { FixedFrame, SagaList, Pagination },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    // values will be filtered out if null or empty
    const filters = reactive({
      search: '',
      tag: 'top-7',
      _page: 1, //route.params.page.toString(),
      _limit: 2,
    });

    // const { data: sagas, isLoading, error, get } = useApi('/kanbans');
    // get();
    console.log('PAGE', route.params.page);

    const url = useUrlParams('/kanbans', filters);
    const { result: sagas, reload, isLoading, error } = useUrlQuery(url, [] as Kanban[]);
    const total = ref(5); // sagas.totalItems should be returned from api

    const tagged = computed(() => {
      return sagas.value?.filter((saga: any) => saga.tags.includes(filters.tag));
    });

    const onPageChange = (page: number) => {
      filters._page = page;
    };

    const setSearch = debounce((event: InputEvent) => {
      filters.search = (event.target as HTMLInputElement).value;
    }, 200); // prevent reloading after each character

    return { filters, sagas, total, onPageChange, tagged, isLoading, error, t };
  },
});
</script>

<style scoped>
.title {
  @apply p-4 border bg-blue-300;
}
</style>
