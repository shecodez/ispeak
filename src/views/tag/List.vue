<template>
  <div class="mx-16">
    <h1 class="text-4xl my-1 capitalize">{{ t('tags') }}</h1>

    <Spinner v-if="isLoading" />
    <AlertMessage v-else-if="error" type="error" :message="error" />
    <div v-else class="flex flex-wrap gap-2">
      <TagCloud :tags="tags" showCount tagSize="btn" />
      <!-- <template v-for="tag in tags" :key="tag.id">
        <router-link :to="`/tags/${tag.id}`">
          <Tag :name="tag.id" :count="tag.count" size="btn" />
        </router-link>
      </template> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import useApi from '@/use/api';
import Tag from '@/components/shared/Tag.vue';
import TagCloud from '@/components/shared/TagCloud.vue';

export default defineComponent({
  components: { Tag, TagCloud },
  name: 'TagList',
  setup() {
    const { t } = useI18n();

    const { data: tags, isLoading, error, get } = useApi('/tags');
    get();

    return { tags, isLoading, error, t };
  },
});
</script>
