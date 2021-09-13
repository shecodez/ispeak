<template>
  <ProgressBar label="article reading progress" :value="scrollProgress" />
  <Spinner v-if="isLoading" />
  <Layout v-if="title" :title="title">
    <AlertMessage v-if="error" type="error" :message="error" />

    <div class="sticky top-0 z-30 bg-white backdrop-filter backdrop-blur-lg bg-opacity-30">
      <div class="mx-auto w-11/12 xl:w-8/12 py-6 border-b border-gray-200">
        <n-page-header @back="handleBack">
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

        <div v-if="storyboard.lists?.length" class="grid grid-cols-1 lg:grid-cols-3 p-16 bg-gray-200">
          <div class="flex gap-10 items-center justify-end">
            <button v-if="prevList"><i-la-long-arrow-alt-left /></button>
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
            <button v-if="nextList"><i-la-long-arrow-alt-right /></button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue';
import { formatDistance, subDays } from 'date-fns';
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
  name: 'Test',
  components: { Spinner, Layout, AlertMessage, BoardHeader, CardRO, ProgressBar },
  setup() {
    const { t, locale } = useI18n();
    const route = useRoute();
    const router = useRouter();

    function handleBack() {
      router.back();
    }

    const filters = reactive({
      search: '',
      page: Number(route.query.page) || 1,
      limit: 1,
    });

    const state = reactive({
      isLoading: false,
      error: null,
      storyboard: {
        id: 6,
        title: '初級日本語げんき GENKI Vol.1「第2版」(second edition)',
        description: 'An integrated course in elementary Japanese',
        lists: [
          {
            id: 111,
            position: 0,
            title: 'あたらしいともだち New Friends',
            slug: 'あたらしいともだち-new-friends',
            description: 'Mary, an international student who just arrived in Japan, talks to a Japanese student.',
            publish_date: null,
            gems: 0,
            cards: [
              {
                id: 1110,
                text: 'Part I',
                details: '',
                assigned_to: '',
                color: '#333',
                text_color: '#f3f3f3',
                list_id: 111,
                position: 0,
              },
              {
                id: 1111,
                text: 'すみません。 いま なんじですか。',
                details: 'Mary: Excuse me. What time is it now?',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 111,
                position: 1,
              },
              {
                id: 1112,
                text: 'じゅうにじしはんです。',
                details: "Takashi: It's half past twelve.",
                assigned_to: 'たかし',
                color: '#a9e6ff',
                text_color: '#333',
                list_id: 111,
                position: 2,
              },
              {
                id: 1113,
                text: 'ありがとう ございます。',
                details: 'Thank you.',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 111,
                position: 3,
              },
              {
                id: 1114,
                text: 'いいえ。',
                details: "You're welcome.",
                assigned_to: 'たかし',
                color: '#a9e6ff',
                text_color: '#333',
                list_id: 111,
                position: 4,
              },
              {
                id: 2220,
                text: 'Part II',
                details: '',
                assigned_to: '',
                color: '#333',
                text_color: '#f3f3f3',
                list_id: 111,
                position: 5,
              },
              {
                id: 2221,
                text: 'あの、りゅうがくせいですか。',
                details: 'Um... are you an international student?',
                assigned_to: 'たかし',
                color: '#a9e6ff',
                text_color: '#333',
                list_id: 111,
              },
              {
                id: 2222,
                text: 'ええ、アリゾナだいがくのがくせいです。',
                details: 'Yes, I am a student at the University of Arizona.',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 111,
              },
              {
                id: 2223,
                text: 'そうですか。せんこうは なんですか。',
                details: 'I see. What is your major?',
                assigned_to: 'たかし',
                color: '#a9e6ff',
                text_color: '#333',
                list_id: 111,
              },
              {
                id: 2224,
                text: 'にほんごです。 いま にねんせえです。',
                details: 'Japanese. I am a sophmore now.',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 111,
              },
            ],
            board_id: 6,
          },
          {
            id: 333,
            position: 1,
            title: 'かいもの Shopping',
            slug: 'かいもの-shopping',
            description: '',
            publish_date: null,
            gems: 0,
            cards: [
              {
                id: 3330,
                text: 'Part I - Mary goes to a flea market',
                details: '',
                assigned_to: '',
                color: '#333',
                text_color: '#f3f3f3',
                list_id: 333,
                position: 0,
              },
              {
                id: 3331,
                text: 'すみません。 これは いくらですか？',
                details: 'Excuse me. How much is this?',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 1,
              },
              {
                id: 3332,
                text: 'それは さんぜんえんです。',
                details: 'vendor: It is 3,000 yen (~$30.00 USD)',
                assigned_to: 'みせのひと',
                color: '#eddef2',
                text_color: '#333',
                list_id: 333,
                position: 2,
              },
              {
                id: 3333,
                text: 'たかいですね。 じゃあ、あのとけいは いくらですか？',
                details: "It's expensive. Well then, how much is that watch?",
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 3,
              },
              {
                id: 3334,
                text: 'あれは さんぜんごひゃくえんです。',
                details: 'That is 3,500 yen (~$35.00 USD)',
                assigned_to: 'みせのひと',
                color: '#eddef2',
                text_color: '#333',
                list_id: 333,
                position: 4,
              },
              {
                id: 3335,
                text: 'そうですか。あれも たかいですね。',
                details: 'I see. That is expensive too.',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 5,
              },
              {
                id: 3336,
                text: 'これは せんはっぴゃくえんですよ。',
                details: 'This is 1,800 yen (~$18.00 USD)',
                assigned_to: 'みせのひと',
                color: '#eddef2',
                text_color: '#333',
                list_id: 333,
                position: 6,
              },
              {
                id: 3337,
                text: 'じゃあ、 そのとけはいを ください。',
                details: "Then, I'll take that watch",
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 7,
              },
              {
                id: 3300,
                text: '* * * A man finds a wallet on the ground * * *',
                details: '',
                assigned_to: '',
                color: '#333',
                text_color: '#f3f3f3',
                list_id: 333,
                position: 8,
              },
              {
                id: 3308,
                text: 'これは だれの さいふですか？',
                details: 'Stranger: Whose wallet is this?',
                assigned_to: 'しらないひと',
                color: '#de7477',
                text_color: '#333',
                list_id: 333,
                position: 9,
              },
              {
                id: 3309,
                text: 'わたしの さいふ です。ありがとう ごさいます。',
                details: "It's my wallet. Thank you very much.",
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 10,
              },
              {
                id: 4440,
                text: 'Part II - After shopping, Mary goes to a restaurant.',
                details: '',
                assigned_to: '',
                color: '#333',
                text_color: '#f3f3f3',
                list_id: 333,
                position: 11,
              },

              {
                id: 4441,
                text: 'いらっしゃいませ。 メニューを どうぞ。',
                details: 'Waitress: Welcome. Here is the menu.',
                assigned_to: 'ウエートレス',
                color: '#b6ffe0',
                text_color: '#333',
                list_id: 333,
                position: 12,
              },
              {
                id: 4442,
                text: 'どうも。 これは なんですか。',
                details: 'Thank you. What is this?',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 13,
              },

              {
                id: 4443,
                text: 'どれですか。 ああ、 とんかつです。',
                details: 'Which one? Oh, it is tonkatsu (pork cutlet).',
                assigned_to: 'ウエートレス',
                color: '#b6ffe0',
                text_color: '#333',
                list_id: 333,
                position: 14,
              },
              {
                id: 4444,
                text: 'とんかつ？ さかなですか。',
                details: 'Tonkatsu? Is it fish?',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 15,
              },

              {
                id: 4445,
                text: 'いいえ、 さかなじゃないです。 にくです。 おいしいですよ。',
                details: 'No, it is not fish. It is meat. It is delicious.',
                assigned_to: 'ウエートレス',
                color: '#b6ffe0',
                text_color: '#333',
                list_id: 333,
                position: 16,
              },
              {
                id: 4446,
                text: 'じゃあ、 これを おねがいします。',
                details: "Then, I'll have this.",
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 17,
              },
              {
                id: 4400,
                text: '* * *',
                details: '',
                assigned_to: '',
                color: '#333',
                text_color: '#f3f3f3',
                list_id: 333,
                position: 18,
              },
              {
                id: 4407,
                text: 'すみません。 トイレは どこですか。',
                details: 'Excuse me. Where is the restroom?',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 19,
              },
              {
                id: 4408,
                text: 'あそこです。',
                details: 'It is over there',
                assigned_to: 'ウエートレス',
                color: '#b6ffe0',
                text_color: '#333',
                list_id: 333,
                position: 20,
              },
              {
                id: 4409,
                text: 'ありがとう ございます。',
                details: 'Thank you very much.',
                assigned_to: 'マアリイ',
                color: '#fdffa4',
                text_color: '#333',
                list_id: 333,
                position: 21,
              },
            ],
            board_id: 6,
          },
        ],
      },
      recommended: [
        {
          id: 61,
          image_url: `https://picsum.photos/300/150?random=1`,
          title: '初級日本語げんき GENKI Vol.2「第3版」(third edition)',
        },
        {
          id: 62,
          image_url: `https://picsum.photos/300/150?random=2`,
          title: 'KANJI Look and Learn',
        },
      ],
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
    });

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

    const index = computed(() => filters.page - 1);
    const prevList = computed(() => state.storyboard?.lists?.[index.value - 1]);
    const list = computed(() => state.storyboard?.lists?.[index.value]);
    const nextList = computed(() => state.storyboard?.lists?.[index.value + 1]);

    const title = computed(() => list.value.title);
    const abbrTitle = computed(() =>
      list.value.title
        .split(/\s/)
        .reduce((res: string, word: string) => (res += word.slice(0, 1)), '')
        .substring(0, 3)
    );

    const storyboardLists = computed(() =>
      state.storyboard.lists.map(({ id, title }) => ({ value: id, label: title }))
    );

    const onPageChange = (page: number) => {
      router.push({ query: { page } });
      filters.page = page;
    };

    function rand(min = 0, max = 999) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function formatDate(date = subDays(new Date(), rand(0, 5))) {
      const today = new Date();
      switch (locale.value) {
        case 'ja':
          return formatDistance(date, today, { addSuffix: true, locale: ja });
        default:
          return formatDistance(date, today, { addSuffix: true });
      }
    }

    function handleScroll(event: any) {
      let top = event.target.scrollTop;
      let height = event.target.scrollHeight - event.target.offsetHeight;

      let progress = Math.ceil((top / height) * 100);
      state.scrollProgress = progress;
    }
    const handleDebouncedScroll = debounce(handleScroll, 100);
    onMounted(() => document.getElementById('scrollzone')?.addEventListener('scroll', handleDebouncedScroll));
    onUnmounted(() => document.getElementById('scrollzone')?.removeEventListener('scroll', handleDebouncedScroll));

    return {
      t,
      handleBack,
      formatDate,
      ...toRefs(filters),
      ...toRefs(state),
      handleSelect,
      handleUpdateValue,
      list,
      title,
      abbrTitle,
      prevList,
      nextList,
      storyboardLists,
    };
  },
});

/* c = count
  (c==1) Liked by x
  (c==2) Liked by x and y
  (c==3) Liked by x y and z
  (c>=4) Liked by z and 3(c-1) others 
  <AvatarGroup />
*/
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
