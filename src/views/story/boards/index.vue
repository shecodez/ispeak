<template>
  <FixedFrame>
    <aside class="toolbar px-3 pt-5 pb-1 flex items-center justify-between">
      <h1 class="text-xl font-bold capitalize">🎬 {{ t('stories') }}</h1>
    </aside>

    TODO: This will change to masonry

    <AlertMessage v-if="error" type="error" :message="error" />
    <template v-else>
      <section class="m-3 flex-1 thin-scrollbar">
        <div v-if="!stories?.length">No Results.</div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <template v-for="story in stories" :key="story.id">
            <router-link :to="{ name: 'StoryBoard', params: { id: story.id } }">
              <div class="p-4 h-24 border rounded">
                <h3>{{ story.title }}</h3>
                <!-- <TagCloud :tags="story.tags" /> -->
              </div>
            </router-link>
          </template>
        </div>
      </section>

      <Pagination :page="page" :totalItems="count" :itemsPerPage="limit" @pagechange="onPageChange" />
    </template>
  </FixedFrame>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useTitle } from '@vueuse/core';
import debounce from 'lodash.debounce';

import { useBoards } from '@/use/db';
import FixedFrame from '@/layouts/FixedFrame.vue';
import Pagination from '@/components/ui/Pagination.vue';

export default defineComponent({
  name: 'StoryBoards',
  components: { FixedFrame, Pagination },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();

    const filters = reactive({
      search: '',
      tag: 'top-7',
      page: Number(route.query.page) || 1,
      limit: 2,
    });

    useTitle(`${t('stories')} · 🎬 ${import.meta.env.VITE_APP_NAME}`);

    const { data, allPublic } = useBoards;
    onMounted(async () => await allPublic(filters.page, filters.limit));
    const stories = computed(() => data.boards);

    // const tagged = computed(() => {
    //   return stories.value?.filter((story: any) => story.tags.includes(filters.tag));
    // });

    const onPageChange = (page: number) => {
      router.push({ query: { page } });
      filters.page = page;
      allPublic(page, filters.limit);
    };

    const setSearch = debounce((event: InputEvent) => {
      filters.search = (event.target as HTMLInputElement).value;
    }, 200); // prevent reloading after each character

    return { t, ...toRefs(filters), stories, ...toRefs(data), onPageChange };
  },
});
</script>
