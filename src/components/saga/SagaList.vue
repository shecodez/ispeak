<template>
  <Spinner v-if="isLoading" />
  <AlertMessage v-else-if="error" type="error" :message="error" />
  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-if="sagas?.length === 0">No Results.</div>
    <template v-else v-for="saga in sagas" :key="saga.id">
      <div class="p-4 border rounded">
        <router-link :to="`/sagas/${saga.id}`">{{ saga.title }}</router-link>
        <TagCloud :tags="saga.tags" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useApi from '@/use/api';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';

export default defineComponent({
  name: 'SagaList',
  components: { Spinner, AlertMessage },
  props: {
    query: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const route = useRoute();

    const { data, isLoading, error, get } = useApi(props.query);
    get();

    const sagas = computed(() => {
      return data.value.filter((saga: any) => saga.tags.includes(route.params.tag));
    });
    // if (route.params.tag) {
    //   // filterByTag
    //   sagas.value = computed(() => {
    //     return data.value.filter((saga: any) => saga.tags.includes(route.params.tag));
    //   });
    // } else if (route.params.id) {
    //   // filerById
    //   sagas.value = computed(() => {
    //     return data.value.filter((saga: any) => saga.tags.includes(route.params.id));
    //   });
    // }

    return { sagas, isLoading, error, t };
  },
});
</script>
