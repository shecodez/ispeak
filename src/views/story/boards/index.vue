<template>
  <ProgressBar label="for design only" :value="100" />
  <Spinner v-if="isLoading" />
  <Layout :title="t('story_boards')">
    <AlertMessage v-if="error" type="error" :message="error" />
    <template v-else>
      <div v-if="!boards?.length">No Results.</div>
      <main>
        <div class="text-center text-2xl lg:text-4xl font-bold pt-2 mb-8">🌎 {{ t('explore') }}</div>
        <masonry-wall :items="boards" :ssr-columns="1" :column-width="320" :padding="16">
          <template #default="{ item, index }">
            <StoryBoardIndexCard :board="item" :index="index" />
          </template>
        </masonry-wall>
      </main>
      <!-- <Pagination :page="page" :totalItems="count" :itemsPerPage="limit" @pagechange="onPageChange" /> -->
    </template>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { db } from '@/use/db';
import Spinner from '@/components/ui/Spinner.vue';
import Layout from '@/layouts/Default.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import StoryBoardIndexCard from '@/components/story/boards/StoryBoardIndexCard.vue';

export default defineComponent({
  name: 'StoryBoards',
  components: { Spinner, Layout, AlertMessage, ProgressBar, StoryBoardIndexCard },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const { data: store, all } = db.boards;

    const filters = reactive({
      search: '',
      tag: '🔥hot',
      page: Number(route.query.page) || 1,
      limit: 25,
    });

    const query =
      'id, title, subtitle, image_url, description, inserted_at, updated_at, profiles:user_id ( username, avatar_url )';
    onMounted(async () => all(query, filters.page, filters.limit));

    const onPageChange = (page: number) => {
      router.push({ query: { page } });
      filters.page = page;
      all(query, page, filters.limit);
    };

    // TODO: load more when scrolled to the bottom

    return {
      t,
      ...toRefs(store),
      ...toRefs(filters),
      onPageChange,
    };
  },
});
</script>
