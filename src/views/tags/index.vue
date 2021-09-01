<template>
  <FixedFrame>
    <aside class="toolbar flex items-center justify-between py-3 px-4">
      <h1 class="text-2xl capitalize">🏷️ {{ t('tags') }}</h1>
    </aside>

    <Spinner v-if="isLoading" />
    <AlertMessage v-else-if="error" type="error" :message="error" />
    <template v-else>
      <div class="mx-4">
        <TagCloud :tags="tags" showCount tagSize="btn" />
      </div>
    </template>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import useApi from '@/use/api';
import FixedFrame from '@/layouts/FixedFrame.vue';
import TagCloud from '@/components/shared/TagCloud.vue';

export default defineComponent({
  components: { FixedFrame, TagCloud },
  name: 'Tags',
  setup() {
    const { t } = useI18n();

    const { data: tags, isLoading, error, get } = useApi('/tags');
    get();

    return { tags, isLoading, error, t };
  },
});
</script>
