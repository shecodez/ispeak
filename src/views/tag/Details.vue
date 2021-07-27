<template>
  <div class="ml-16">
    <Spinner v-if="isLoading" />
    <AlertMessage v-else-if="error" type="error" :message="error" />

    <Tag :name="tag?.id" :count="tag?.count" size="text-4xl btn" />

    <div class="border-4 border-dashed my-2">
      <p v-if="tag?.description" class="p-4">{{ tag.description }}</p>
    </div>

    <div class="flex-1">
      <SagaList query="/kanbans" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useApi from '@/use/api';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import SagaList from '@/components/saga/SagaList.vue';
import Tag from '@/components/shared/Tag.vue';

export default defineComponent({
  name: 'TagDetailsPage',
  components: { Spinner, AlertMessage, SagaList, Tag },
  setup() {
    const { t } = useI18n();
    const route = useRoute();

    const { data: tags, isLoading, error, get } = useApi(`/tags`);
    get();

    const tag = computed(() => {
      return tags.value.find((t: any) => t.id === route.params.tag);
    });

    return { tag, route, isLoading, error, t };
  },
});
</script>
