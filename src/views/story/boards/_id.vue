<template>
  <ProgressBar label="article reading progress" :value="scrollProgress" />
  <Spinner v-if="isLoading" />
  <Layout v-if="title" :title="`${title} | ${storyboard.title}`">
    <AlertMessage v-if="error" type="error" :message="error" />

    <div class="sticky top-0 z-30 bg-white backdrop-filter backdrop-blur-lg bg-opacity-30">
      <div class="mx-auto w-11/12 xl:w-8/12 py-6 border-b border-gray-200">
        <n-page-header @back="handleBack" :subtitle="title">
          <template #title>
            <h2>{{ storyboard.title }}</h2>
          </template>
          <template #avatar>
            <n-avatar>{{ abbrTitle }}</n-avatar>
          </template>

          <template #extra>
            <n-space align="center" justify="end">
              <n-select v-model:value="list.id" @update:value="handleUpdateValue" :options="storyboardLists" />
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
            <div class="flex items-center gap-4"><i-mdi-at class="text-yellow-500" />user/group</div>
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
              <template v-for="board in recommended" :key="board.id">
                <div class="border-t-2 border-yellow-500" />
                <img :src="board.image_url" alt="recommended image" />
                <span class="text-xs uppercase text-yellow-500">{{ t('recommended') }}</span>
                <h2 class="text-lg mb-6">{{ board.title }}</h2>
              </template>
            </div>
          </aside>
        </div>

        <div class="f-center gap-4 lg:gap-10">
          <button class="f-center gap-2"><i-mdi-cards-heart class="text-yellow-500" />{{ t('like', 0) }}</button>|
          <!-- TODO: make share a radial button -->
          <button class="f-center gap-2"><i-clarity-share-line class="text-yellow-500" /> {{ t('share') }}</button>|
          <button class="f-center gap-2"><i-uim-download-alt class="text-yellow-500" />{{ t('download') }}</button>
        </div>

        <div v-if="storyboard.lists?.length" class="grid grid-cols-1 lg:grid-cols-3 p-16 bg-gray-700 bg-opacity-30">
          <div class="flex gap-10 items-center justify-end">
            <button v-if="prevList" @click="onPageChange(page - 1)" class="f-center">
              <i-la-long-arrow-alt-left />
            </button>
            <div v-if="prevList">
              <small class="text-xs uppercase">{{ t('previous') }}</small>
              <router-link
                :to="{ name: 'StoryBoard', params: { id: storyboard.id }, query: { page: page - 1 } }"
                class="block text-xl hover:underline"
              >
                <pre>{{ prevList.title }}</pre>
              </router-link>
            </div>
          </div>
          <div class="border-1 border-yellow-500 mx-auto" />
          <div class="flex gap-10 items-center">
            <div v-if="nextList">
              <small class="text-xs uppercase">{{ t('next') }}</small>
              <router-link
                :to="{ name: 'StoryBoard', params: { id: storyboard.id }, query: { page: page + 1 } }"
                class="block text-xl hover:underline"
              >
                <pre>{{ nextList.title }}</pre>
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
import { computed, defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue';
import { formatRelative, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import debounce from 'lodash.debounce';

import { supabase } from '@/lib/supabase';
import { Board, List } from '@/data/types/mock';
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
    //const { data, getById } = useBoards;

    function handleBack() {
      router.back();
    }

    const filters = reactive({
      search: '',
      page: computed(() => Number(route.query.page) || 1),
      limit: 1,
    });

    const state = reactive({
      isLoading: false,
      error: null,
      storyboard: {} as Board,
      recommended: [],
      options: computed(() => [
        {
          label: true ? t('follow') : t('unfollow'), // `t('follow', props.board.owner)` (username/group)
          key: '1',
        },
        {
          label: t('download'),
          key: '2',
        },
      ]),
      scrollProgress: 0,
      pov: null, // view cards from pov of selected card.assignedTo
    });

    async function fetchBoardById(id: number) {
      try {
        state.isLoading = true;
        const { data, error } = await supabase
          .from('boards')
          .select(
            'id, title, slug, image_url, description, is_public, updated_at, lists ( id, position, title, slug, description, publish_date, gems, board_id, cards ( id, position, text, details, label, color, text_color, list_id ))'
          )
          .eq('id', id)
          .order('position')
          .order('position', { foreignTable: 'lists' })
          .order('position', { foreignTable: 'lists.cards' })
          .single();
        if (error) throw error;

        state.storyboard = data;
      } catch (e) {
        state.error = e.error_description || e.message;
      } finally {
        state.isLoading = false;
      }
    }
    onMounted(async () => {
      await fetchBoardById(Number(route.params.id));
      document.getElementById('scrollzone')?.addEventListener('scroll', handleDebouncedScroll);
    });

    const index = computed(() => filters.page - 1);
    const prevList = computed(() => state.storyboard?.lists?.[index.value - 1]);
    const list = computed(() => state.storyboard?.lists?.[index.value]);
    const nextList = computed(() => state.storyboard?.lists?.[index.value + 1]);

    const title = computed(() => list.value?.title);
    const abbrTitle = computed(() =>
      list.value?.title
        .split(/\s/)
        .reduce((res: string, word: string) => (res += word.slice(0, 1)), '')
        .substring(0, 3)
    );

    const storyboardLists = computed(() =>
      state.storyboard.lists?.map(({ id, title }) => ({ value: id, label: title }))
    );

    const handleSelectPov = (evt: any) => {
      state.pov = evt.target.value;
    };

    const onPageChange = (page: number) => {
      router.push({ query: { page } });
      //filters.page = page;
    };

    function handleSelect(key: string) {
      switch (key) {
        case '1':
          console.log('toggle Follow/Unfollow storyboard.owner');
          break;
        case '2':
          // toast if not logged in
          console.log('Download:', state.storyboard.id);
          break;
        default:
          break;
      }
    }

    function handleUpdateValue(value: number) {
      console.log('list select value: ' + JSON.stringify(value));
      // find list index and go to page
    }

    function rand(min = 0, max = 999) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function formatDate(date: string, mock = false) {
      if (!date) return;

      if (mock) date = subDays(new Date(), rand(0, 5)).toString();
      const today = new Date();
      switch (locale.value) {
        case 'ja':
          return formatRelative(new Date(date), today, { locale: ja });
        default:
          return formatRelative(new Date(date), today);
      }
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
      handleBack,
      formatDate,
      ...toRefs(filters),
      ...toRefs(state),
      handleSelect,
      handleUpdateValue,
      onPageChange,
      list,
      title,
      abbrTitle,
      prevList,
      nextList,
      storyboardLists,
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
