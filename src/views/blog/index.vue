<template>
  <Layout :title="t('blog')">
    <div class="flex-1">
      <UnderConstruction :wip="t('the_blog')" />
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import Layout from '@/layouts/Default.vue';
import UnderConstruction from '@/components/shared/UnderConstruction.vue';

export default defineComponent({
  name: 'Blog',
  components: { Layout, UnderConstruction },
  setup() {
    const { t } = useI18n();

    return { t };
  },
});
</script>
