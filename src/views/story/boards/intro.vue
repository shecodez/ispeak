<template>
  <Spinner v-if="isLoading" />
  <Layout v-if="title" :title="title">
    <AlertMessage v-if="error" type="error" :message="error" />
    <section v-if="storyboard" class="mx-auto xl:w-8/12">
      <div class="flex gap-8">
        <div class="w-20 mt-8 border-t-2 border-yellow-500" />
        <div class="mb-10 w-3/4">
          <h1 class="text-5xl mb-5 leading-snug">{{ title }}</h1>
          <p class="text-2xl italic text-gray-400">{{ storyboard.subtitle }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-8">
        <div class="flex gap-4">
          <aside class="sb-aside flex flex-col gap-3">
            <div class="flex items-center gap-4"><i-mdi-at class="text-yellow-500" />user/group</div>
            <div class="flex items-center gap-4">
              <i-ic-outline-featured-play-list class="text-yellow-500" />{{ t('list', storyboard.lists?.length || 0) }}
            </div>
            <div class="flex items-center gap-4">
              <i-mdi-heart-plus-outline class="text-yellow-500" />{{ t('like') }}
            </div>
            <div v-if="storyboard.updated_at" class="flex items-center gap-4">
              <i-clarity-date-line class="text-yellow-500" />
              {{ formatDate(storyboard.updated_at) }}
            </div>
          </aside>
          <article class="sb-text em-first-letter">
            <p>{{ storyboard.excerpt }}</p>
          </article>
        </div>

        <div class="flex gap-8" v-if="storyboard.image_url">
          <img :src="storyboard.image_url" class="sb-img" alt="board image" />
          <div v-if="storyboard.image_by" class="border-t-2 border-yellow-500 w-1/4 pb-4">
            <span class="block pt-4">{{ storyboard.image_by }}</span>
          </div>
        </div>

        <div class="flex gap-8">
          <aside class="sb-aside">
            <div class="border-t-2 border-yellow-500 py-4 h-60">
              <div class="w-full h-full bg-gray-200">Ad</div>
            </div>
          </aside>
          <article class="sb-text markdown">
            <p>{{ storyboard.description }}</p>
          </article>
          <aside class="sb-aside flex">
            <div class="border-t-2 border-yellow-500 w-full self-center">
              <h5 class="flex items-center gap-2 text-xs uppercase text-yellow-500 my-4">
                <i-fa-solid-tags class="text-yellow-500" /> {{ t('tag_cloud') }}
              </h5>
              <n-space>
                <template v-for="tag in 4" :key="tag">
                  <!-- TODO: getTagsRelatedToboardTags -->
                  <n-tag>{{ tag }} get related tags</n-tag>
                </template>
              </n-space>
            </div>
          </aside>
        </div>

        <div class="f-center gap-10">
          <button class="f-center gap-2"><i-mdi-cards-heart class="text-yellow-500" />{{ t('like', 0) }}</button>|
          <!-- TODO: make share a radial button -->
          <button class="f-center gap-2"><i-clarity-share-line class="text-yellow-500" /> {{ t('share') }}</button>|
          <button class="f-center gap-2"><i-uim-comment-message class="text-yellow-500" />{{ t('comment', 0) }}</button>
        </div>

        <div v-if="isCommenting" class="w-2/4 mx-auto">
          <!-- TODO: Add Disqus: https://disqus.com/features/engage/ -->
        </div>

        <div v-if="storyboard.lists?.length" class="grid grid-cols-3 p-14 bg-gray-200">
          <div />
          <div class="border-1 border-yellow-500 mx-auto" />
          <div class="flex gap-10 items-center">
            <div>
              <small class="text-xs uppercase">{{ t('next') }}</small>
              <router-link
                :to="{ name: 'StoryBoard', params: { id: storyboard.id } }"
                class="block text-xl hover:underline"
              >
                {{ storyboard.lists[0].title }}
              </router-link>
            </div>
            <button><i-la-long-arrow-alt-right /></button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { formatRelative, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { supabase } from '@/lib/supabase';
import { Board } from '@/data/types/mock';
import Spinner from '@/components/ui/Spinner.vue';
import Layout from '@/layouts/Default.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';

export default defineComponent({
  name: 'StoryBoardIntro',
  components: { Spinner, Layout, AlertMessage },
  setup() {
    const { t, locale } = useI18n();
    const route = useRoute();

    const state = reactive({
      isLoading: false,
      error: null,
      storyboard: {} as Board,
      isCommenting: false,
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
    });

    async function fetchBoardById(id: number) {
      try {
        state.isLoading = true;
        const { data, error } = await supabase
          .from('boards')
          .select('id, title, slug, image_url, description, updated_at, lists ( id, position, title, slug )')
          .order('position', { foreignTable: 'lists' })
          .eq('id', id)
          .single();
        if (error) throw error;

        state.storyboard = data;
      } catch (e) {
        state.error = e.error_description || e.message;
      } finally {
        state.isLoading = false;
      }
    }
    onMounted(() => fetchBoardById(Number(route.params.id)));

    const title = computed(() => state.storyboard.title);

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

    return { t, formatDate, ...toRefs(state), title };
  },
});

/*
storyboard: {
        id: 6,
        title: '初級日本語げんき GENKI Vol.1「第2版」(second edition)',
        subtitle: 'An integrated course in elementary Japanese',
        image_url: 'https://picsum.photos/800/400?random',
        image_by: 'random photos by unknown / picsum',
        excerpt:
          'Id voluptate Lorem cupidatat fugiat aliqua qui in duis eu. Aliqua laborum adipisicing aute fugiat eiusmod veniam labore ea duis eiusmod dolore qui. Esse laborum labore quis laborum aliquip aute aliquip. Ut quis sunt duis duis non excepteur. Reprehenderit ipsum excepteur sint dolor aliquip sit est.',
        description:
          'Eiusmod laborum consectetur consectetur velit do consectetur consequat velit id. Ut nulla id reprehenderit excepteur occaecat. Magna ad aliquip veniam veniam aliqua id magna magna. Pariatur minim magna enim tempor tempor. Enim ad id culpa amet consequat duis adipisicing enim fugiat eu anim id ea. Eu duis sunt aliquip et nulla cillum sit exercitation in consectetur.',
        lists: ['1', '2', '3'],
      },
*/
</script>

<style scoped>
.sb-text {
  @apply w-2/4;
}

.sb-aside {
  @apply w-1/4;
}

.sb-img {
  @apply w-3/4;
}

.em-first-letter p:first-child:first-letter {
  @apply text-4xl font-bold pr-1 text-yellow-500 uppercase;
}
</style>
