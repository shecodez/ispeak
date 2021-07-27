<template>
  <div class="ml-16 flex flex-col h-full overflow-hidden">
    <!-- <h1 class="text-4xl">Saga {{ $route.params.id }}</h1> -->
    <Spinner v-if="isLoading" />
    <AlertMessage v-else-if="error" type="error" :message="error" />
    <template v-else>
      <h1 class="text-4xl mb-2">{{ saga.title }} - {{ saga.boards[page - 1].title }}</h1>

      <div>
        <p>{{ saga?.description }}</p>
      </div>

      <div class="flex-1 flex flex-col space-y-2 overflow-y-auto thin-scrollbar">
        <template v-for="note in saga.boards[page - 1].notes" :key="note.id">
          <div class="p-4 border">{{ note.text }}</div>
        </template>
      </div>

      <Pagination :onPage="page" :itemsPerPage="1" :totalItems="saga.boards.length" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useApi from '@/use/api';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Pagination from '@/components/ui/Pagination.vue';

export default defineComponent({
  name: 'SagaDetailsPage',
  components: { Spinner, AlertMessage, Pagination },
  setup() {
    const { t } = useI18n();
    const route = useRoute();

    const page = ref(1); // board index

    const { data: saga, isLoading, error, get } = useApi(`/kanbans/${route.params.id}`);
    get();

    const prev = () => {
      if (page.value - 1 > 0) page.value -= 1;
    };

    const next = () => {
      if (page.value + 1 <= saga.value.boards.length) page.value += 1;
    };

    return { saga, page, prev, next, isLoading, error, t };
  },
});
</script>
