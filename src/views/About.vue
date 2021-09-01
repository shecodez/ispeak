<template>
  <Layout :title="t('about')">
    <div class="flex-1 text-center">
      <h1 class="text-4xl font-bold mb-2">About Us</h1>
      <p>
        {{ appName }} is a easy to use, flexible, fun way to organize and manage boards for stories, scripts, tasks,
        projects, the list goes on. Get started for free today!
      </p>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import Layout from '@/layouts/Default.vue';

export default defineComponent({
  name: 'About',
  components: { Layout },
  setup() {
    const { t } = useI18n();
    const appName = import.meta.env.VITE_APP_NAME;

    return { t, appName };
  },
});
</script>
