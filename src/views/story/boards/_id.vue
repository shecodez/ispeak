<template>
  <ProgressBar label="article reading progress" :value="scrollProgress" />
  <Spinner v-if="isLoading" />
  <Layout v-if="board && title" :title="`${title} | ${board.title}`">
    <AlertMessage v-if="error" type="error" :message="error" />
    <div class="sticky top-0 z-30 bg-white backdrop-filter backdrop-blur-lg bg-opacity-30">
      <div class="mx-auto w-11/12 xl:w-8/12 py-6 border-b border-gray-200">
        <n-page-header @back="handleBack" :subtitle="title">
          <template #title>
            <h2>{{ board.title }}</h2>
          </template>
          <template #avatar>
            <n-avatar>{{ abbr(title) }}</n-avatar>
          </template>

          <template #extra>
            <n-space align="center" justify="end">
              <n-select
                v-if="list"
                v-model:value="selectedListId"
                @update:value="handleSelectListId"
                :options="board.lists?.map(({ id, title }) => ({ value: id, label: title }))"
              />
              <n-dropdown @select="handleSelect" :options="options" placement="bottom-start">
                <n-button text size="tiny" color="#9d9ea2">
                  <template #icon><i-entypo-dots-three-vertical /></template>
                </n-button>
              </n-dropdown>
            </n-space>
          </template>
        </n-page-header>
      </div>
    </div>

    <section v-if="list" class="mx-auto w-11/12 xl:w-8/12 mt-12">
      <div class="flex gap-8">
        <div class="w-20 mt-3 lg:mt-5 border-t-2 border-yellow-500" />
        <div class="mb-10 w-3/4">
          <h1 class="text-lg lg:text-5xl mb-5 leading-snug">{{ list.title }}</h1>
          <p class="text-sm lg:text-2xl italic text-gray-400">{{ list.subtitle }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-8">
        <div class="flex flex-wrap gap-4">
          <aside class="sb-aside flex flex-col gap-3">
            <div class="flex items-center gap-4">
              <i-mdi-at class="text-yellow-500" />
              {{ owner }}
            </div>
            <div v-if="list.publish_date" class="flex items-center gap-4">
              <i-clarity-date-line class="text-yellow-500" />
              {{ formatDate(list.publish_date) }}
            </div>
            <div class="flex items-center gap-4">
              <i-carbon-bookmark-add class="text-yellow-500" />{{ t('bookmark') }}
            </div>
          </aside>
          <article class="sb-text markdown">
            <p>{{ list.description }}</p>
          </article>
        </div>

        <div class="flex gap-8">
          <img :src="list.image_url || 'https://picsum.photos/800/400?random'" class="sb-img" alt="board image" />
          <div class="border-t-2 border-yellow-500 w-1/4 pb-4">
            <span class="block pt-4">{{ list.image_by || 'random photo by unknown / picsum' }}</span>
          </div>
        </div>

        <div class="flex flex-wrap lg:flex-nowrap gap-8">
          <aside class="sb-aside">
            <div class="border-t-2 border-yellow-500 py-4 h-40 lg:h-60">
              <div class="w-full h-full bg-gray-400">Ad</div>
            </div>
          </aside>

          <div v-if="list?.cards?.length" class="sb-text flex flex-col gap-4">
            <template v-for="card in list.cards" :key="card.id">
              <div class="card-container relative mx-auto">
                <CardRO :card="card" />
              </div>
            </template>
          </div>

          <aside class="sb-aside flex">
            <div class="flex flex-col gap-4 overflow-hidden mt-4 self-center">
              <template v-for="sb in recommended" :key="sb.id">
                <div class="border-t-2 border-yellow-500" />
                <img :src="sb.image_url" alt="recommended image" />
                <span class="text-xs uppercase text-yellow-500">{{ t('recommended') }}</span>
                <h2 class="text-lg mb-6">{{ sb.title }}</h2>
              </template>
            </div>
          </aside>
        </div>

        <div class="f-center gap-4 lg:gap-10">
          <button class="f-center gap-2"><i-mdi-cards-heart class="text-yellow-500" />{{ t('like', 0) }}</button>|
          <!-- TODO: make share a radial button -->
          <button class="f-center gap-2"><i-clarity-share-line class="text-yellow-500" /> {{ t('share') }}</button>|
          <button @click="commenting = true" class="f-center gap-2">
            <i-uim-comment-message class="text-yellow-500" />{{ t('comment', comments) }}
          </button>
        </div>

        <div v-if="board.lists?.length" class="grid grid-cols-1 lg:grid-cols-3 p-16 bg-gray-700 bg-opacity-30">
          <div class="flex gap-10 items-center justify-end">
            <button v-if="prevList" @click="onPageChange(page - 1)" class="f-center">
              <i-la-long-arrow-alt-left />
            </button>
            <div v-if="prevList">
              <small class="text-xs uppercase">{{ t('previous') }}</small>
              <router-link
                :to="{ name: 'StoryBoard', params: { id: board.id }, query: { page: page - 1 } }"
                class="block text-xl hover:underline"
              >
                {{ prevList.title }}
              </router-link>
            </div>
          </div>
          <div class="border-1 border-yellow-500 mx-auto" />
          <div class="flex gap-10 items-center">
            <div v-if="nextList">
              <small class="text-xs uppercase">{{ t('next') }}</small>
              <router-link
                :to="{ name: 'StoryBoard', params: { id: board.id }, query: { page: page + 1 } }"
                class="block text-xl hover:underline"
              >
                {{ nextList.title }}
              </router-link>
            </div>
            <button v-if="nextList" @click="onPageChange(page + 1)" class="f-center">
              <i-la-long-arrow-alt-right />
            </button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import debounce from 'lodash.debounce';

import { Board } from '@/data/types/mock';
import { db } from '@/use/db';
import { abbr, formatDateRelative } from '@/utils';
import Spinner from '@/components/ui/Spinner.vue';
import Layout from '@/layouts/Default.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import BoardHeader from '@/components/boards/BoardIdHeader.vue';
import CardRO from '@/components/story/boards/CardRO.vue';
import ProgressBar from '@/components/ui/ProgressBar.vue';

export default defineComponent({
  name: 'StoryBoard',
  components: { Spinner, Layout, AlertMessage, BoardHeader, CardRO, ProgressBar },
  setup() {
    const { t, locale } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const { data: store, getById } = db.boards;

    const filters = reactive({
      search: '',
      page: computed(() => Number(route.query.page) || 1),
      limit: 1,
    });

    const state = reactive({
      owner: computed(() => store.board?.profiles?.username),
      selectedListId: 0,
      likeCount: 0,
      comments: 0,
      commenting: false,
      recommended: [] as Board[],
      scrollProgress: 0,
      pov: null, // to view cards from pov of selected card.assignedTo
    });

    const options = computed(() => [
      {
        label: true ? t('follow', { user: state.owner }) : t('unfollow', { user: state.owner }),
        key: '1',
      },
      {
        label: t('download'),
        key: '2',
      },
    ]);

    onMounted(async () => {
      await getById(Number(route.params.id));
      document.getElementById('scrollzone')?.addEventListener('scroll', handleDebouncedScroll);
    });

    const index = computed(() => filters.page - 1);
    const prevList = computed(() => store.board?.lists?.[index.value - 1]);
    const list = computed(() => store.board?.lists?.[index.value]);
    const nextList = computed(() => store.board?.lists?.[index.value + 1]);

    const title = computed(() => list.value?.title);

    //const storyboardLists = computed(() => store.board?.lists?.map(({ id, title }) => ({ value: id, label: title })));

    const onPageChange = (page: number) => {
      router.push({ query: { page } });
      //filters.page = page;
    };

    function handleBack() {
      router.back();
    }

    function handleSelect(key: string) {
      switch (key) {
        case '1':
          console.log('toggle Follow/Unfollow storyboard.owner');
          break;
        case '2':
          // toast if not logged in
          console.log('Download:', store.board?.id);
          break;
        default:
          break;
      }
    }

    //const selectedListId = computed(() => list.value?.id); // computed readonly error
    watch(
      () => list.value?.id,
      (id) => {
        if (id) state.selectedListId = id;
      },
      { immediate: true }
    );
    function handleSelectListId(value: number) {
      //console.log('select list value: ' + JSON.stringify(value));
      const page = Number(store.board?.lists?.findIndex((l) => l.id === value)) + 1;
      if (page > 0) onPageChange(page);
    }

    const handleSelectPov = (evt: any) => {
      state.pov = evt.target.value;
    };

    function formatDate(date: string, mock = false) {
      return formatDateRelative(date, locale.value, mock);
    }

    function handleScroll(event: any) {
      let top = event.target.scrollTop;
      let height = event.target.scrollHeight - event.target.offsetHeight;

      let progress = Math.ceil((top / height) * 100);
      state.scrollProgress = progress;
    }
    const handleDebouncedScroll = debounce(handleScroll, 100);
    //onMounted(() => document.getElementById('scrollzone')?.addEventListener('scroll', handleDebouncedScroll));
    onUnmounted(() => document.getElementById('scrollzone')?.removeEventListener('scroll', handleDebouncedScroll));

    return {
      t,
      abbr,
      ...toRefs(store),
      ...toRefs(filters),
      ...toRefs(state),
      options,
      title,
      prevList,
      list,
      nextList,
      onPageChange,
      handleBack,
      handleSelect,

      handleSelectListId,
      formatDate,
    };
  },
});
</script>

<style scoped>
.sb-text {
  @apply w-11/12 lg:w-2/4;
}

.sb-aside {
  @apply w-11/12 lg:w-1/4;
}

.sb-img {
  @apply w-3/4;
}

.card-container {
  max-width: 80%;
  min-width: 8rem;
}
</style>
