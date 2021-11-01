<template>
  <ProgressBar label="for design only" :value="100" />
  <Spinner v-if="isLoading" />
  <Layout v-if="title" :title="title">
    <AlertMessage v-if="error" type="error" :message="error" />
    <section v-if="board" class="mx-auto xl:w-8/12">
      <div class="flex gap-8">
        <div class="w-20 mt-8 border-t-2 border-yellow-500" />
        <div class="mb-10 w-3/4">
          <h1 class="text-5xl mb-5 leading-snug">{{ title }}</h1>
          <p class="text-2xl italic text-gray-400">{{ board.subtitle }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-8">
        <div class="flex gap-4">
          <aside class="sb-aside flex flex-col gap-3">
            <div class="flex items-center gap-4">
              <i-mdi-at class="text-yellow-500" />{{ board.profiles?.username }}
            </div>
            <div class="flex items-center gap-4">
              <i-ic-outline-featured-play-list class="text-yellow-500" />{{ t('list', board.lists?.length || 0) }}
            </div>
            <div class="flex items-center gap-4">
              <i-mdi-heart-plus-outline class="text-yellow-500" />{{ t('like') }}
            </div>
            <div class="flex items-center gap-4">
              <i-clarity-date-line class="text-yellow-500" />
              {{ formatDate(board.updated_at || board.inserted_at) }}
            </div>
          </aside>
          <article class="sb-text em-first-letter">
            <p>{{ board.excerpt }}</p>
          </article>
        </div>

        <div class="flex gap-8" v-if="board.image_url">
          <img :src="board.image_url" class="sb-img" alt="board image" />
          <div v-if="board.image_by" class="border-t-2 border-yellow-500 w-1/4 pb-4">
            <span class="block pt-4">{{ board.image_by }}</span>
          </div>
        </div>

        <div class="flex gap-8">
          <aside class="sb-aside">
            <div class="border-t-2 border-yellow-500 py-4 h-60">
              <div class="w-full h-full bg-gray-200">Ad</div>
            </div>
          </aside>
          <article class="sb-text markdown">
            <p>{{ board.description }}</p>
          </article>
          <aside class="sb-aside flex">
            <div class="border-t-2 border-yellow-500 w-full self-center">
              <h5 class="flex items-center gap-2 text-xs uppercase text-yellow-500 my-4">
                <i-fa-solid-tags class="text-yellow-500" /> {{ t('tag_cloud') }}
              </h5>
              <n-space v-if="tags.length">
                <template v-for="tag in tags" :key="tag.id">
                  <n-tag>{{ tag.name }}</n-tag>
                </template>
              </n-space>
              <small v-else>{{ t('tag', tags.length) }}</small>
            </div>
          </aside>
        </div>

        <div class="f-center gap-10">
          <button class="f-center gap-2"><i-mdi-cards-heart class="text-yellow-500" />{{ t('like', likeCount) }}</button
          >|
          <!-- TODO: make share a radial button -->
          <button class="f-center gap-2"><i-clarity-share-line class="text-yellow-500" /> {{ t('share') }}</button>|
          <button @click="commenting = true" class="f-center gap-2">
            <i-uim-comment-message class="text-yellow-500" />{{ t('comment', comments) }}
          </button>
        </div>

        <div v-if="commenting" class="w-2/4 mx-auto">
          <!-- TODO: Add Disqus: https://disqus.com/features/engage/ -->
          <small>comments comming soon!</small>
        </div>

        <div v-if="board.lists?.length" class="grid grid-cols-3 p-14 bg-gray-200">
          <div />
          <div class="border-1 border-yellow-500 mx-auto" />
          <div class="flex gap-10 items-center">
            <div>
              <small class="text-xs uppercase">{{ t('next') }}</small>
              <router-link :to="{ name: 'StoryBoard', params: { id: board.id } }" class="block text-xl hover:underline">
                {{ board.lists[0].title }}
              </router-link>
            </div>
            <router-link :to="{ name: 'StoryBoard', params: { id: board.id } }" class="f-center">
              <i-la-long-arrow-alt-right />
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { Tag } from '@/data/types/mock';
import { db } from '@/use/db';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Layout from '@/layouts/Default.vue';
import { formatDateRelative } from '@/utils';

export default defineComponent({
  name: 'StoryBoardIntro',
  components: { ProgressBar, Spinner, Layout, AlertMessage },
  setup() {
    const { t, locale } = useI18n();
    const route = useRoute();
    const { data: store, getById } = db.boards;

    const state = reactive({
      likeCount: 0, // db.likes.count
      tags: [] as Tag[],
      comments: 0,
      commenting: false,
    });

    const options = computed(() => [
      {
        label: true ? t('follow') : t('unfollow'),
        key: '1',
      },
      {
        label: t('download'),
        key: '2',
      },
    ]);

    onMounted(() =>
      getById(Number(route.params.id), '*, lists ( id, position, title, slug ), profiles:user_id ( username )')
    );

    const title = computed(() => store.board?.title);

    function formatDate(date: string | undefined, mock = false) {
      return formatDateRelative(date || '', locale.value, mock);
    }

    return { t, ...toRefs(store), ...toRefs(state), options, title, formatDate };
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
