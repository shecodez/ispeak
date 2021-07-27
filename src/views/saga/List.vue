<template>
  <div class="ml-16">
    <h1 class="text-4xl my-3">Sagas</h1>

    <div class="hot">
      <h2>🔥</h2>
      <div class="p-4 border inline-block" v-for="saga in hot" :key="saga.id">
        <router-link :to="`/sagas/${saga.id}`">
          {{ saga.title }}
        </router-link>
      </div>
    </div>

    <div class="top-7">
      <h2>Top 7</h2>
      <div class="p-4 border inline-block" v-for="saga in top7" :key="saga.id">
        <router-link :to="`/sagas/${saga.id}`">
          {{ saga.title }}
        </router-link>
      </div>
    </div>

    <div class="all">
      <h2>All</h2>
      <div class="p-4 border inline-block" v-for="saga in sagas" :key="saga.id">
        <router-link :to="`/sagas/${saga.id}`">
          {{ saga.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import useApi from '@/use/api';
import SagaList from '@/components/saga/SagaList.vue';

export default defineComponent({
  components: { SagaList },
  name: 'Sagas',
  setup() {
    const { data: sagas, isLoading, error, get } = useApi('/kanbans');
    get();

    const hot = computed(() => {
      return sagas.value.filter((saga: any) => saga.tags.includes('hot'));
    });

    const top7 = computed(() => {
      return sagas.value.filter((saga: any) => saga.tags.includes('top-7'));
    });

    return { sagas, hot, top7, isLoading, error };
  },
});
</script>
