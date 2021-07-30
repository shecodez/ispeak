<template>
  <FixedFrame>
    <aside class="toolbar flex items-center justify-between py-3 px-4">
      <h1 class="text-2xl capitalize">🎬 {{ t('sagas') }}</h1>
    </aside>

    <div class="mx-4 grid grid-cols-4 gap-4">
      <h2 class="title text-3xl capitalize">🔥 {{ t('hot') }} {{ `(${hot?.length})` }}</h2>

      <div class="p-4 border inline-block" v-for="saga in hot" :key="saga.id">
        <router-link :to="`/sagas/${saga.id}`">
          {{ saga.title }}
        </router-link>
      </div>

      <h2 class="title text-3xl capitalize">Top 7 {{ `(${top7?.length})` }}</h2>

      <div class="p-4 border inline-block" v-for="saga in top7" :key="saga.id">
        <router-link :to="`/sagas/${saga.id}`">
          {{ saga.title }}
        </router-link>
      </div>

      <h2 class="title text-3xl capitalize">All {{ `(${sagas?.length})` }}</h2>

      <div class="p-4 border inline-block" v-for="saga in sagas" :key="saga.id">
        <router-link :to="`/sagas/${saga.id}`">
          {{ saga.title }}
        </router-link>
      </div>
    </div>
    <!-- <Pagination /> -->
  </FixedFrame>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import useApi from '@/use/api';
import FixedFrame from '@/components/layouts/FixedFrame.vue';
import SagaList from '@/components/saga/SagaList.vue';
import Pagination from '@/components/ui/Pagination.vue';

export default defineComponent({
  name: 'Sagas',
  components: { FixedFrame, SagaList, Pagination },
  setup() {
    const { t } = useI18n();

    const { data: sagas, isLoading, error, get } = useApi('/kanbans');
    get();

    const hot = computed(() => {
      return sagas.value.filter((saga: any) => saga.tags.includes('hot'));
    });

    const top7 = computed(() => {
      return sagas.value.filter((saga: any) => saga.tags.includes('top-7'));
    });

    return { sagas, hot, top7, isLoading, error, t };
  },
});
</script>

<style scoped>
.title {
  @apply p-4 border bg-blue-300;
}
</style>
