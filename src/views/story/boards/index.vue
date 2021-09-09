<template>
  <Layout :title="t('story_boards')">
    <AlertMessage v-if="error" type="error" :message="error" />
    <template v-else>
      <div v-if="!storyboards?.length">No Results.</div>
      <masonry-wall :items="storyboards" :ssr-columns="1" :column-width="320" :padding="16">
        <template #default="{ item, index }">
          <div class="sb-container flex flex-col gap-3 border rounded-lg p-4">
            <div class="sb-header flex items-center justify-between">
              <div class="flex gap-3 items-center">
                <n-avatar :size="48" round :style="{ color: 'white', backgroundColor: 'gray' }">
                  <span class="text-xl font-bold">U</span>
                </n-avatar>
                <div class="flex flex-col">
                  <router-link :to="{ name: 'StoryBoard', params: { id: item.id } }">
                    <b>{{ item.title }}</b>
                  </router-link>
                  <small class="text-xs text-gray-400 flex items-center"><i-mdi-at />shecodez</small>
                </div>
              </div>
              <button class="f-center">
                <n-dropdown :options="options" placement="bottom-start">
                  <n-button text color="#9d9ea2">
                    <template #icon><i-entypo-dots-three-horizontal /></template>
                  </n-button>
                </n-dropdown>
              </button>
            </div>
            <div class="sb-img -mx-4">
              <img :src="`https://picsum.photos/500/${rand(200, 400)}?random=${index}`" />
            </div>
            <div class="sb-actions flex gap-3 items-center text-lg text-gray-400">
              <button><i-mdi-cards-heart /></button>
              <button><i-uim-comment-message /></button>
              <button class="ml-auto"><i-fa-solid-tags /></button>
            </div>
            <div class="sb-body">
              <small>{{ t('like', { count: rand() }) }} </small>
              <p>{{ item.description }}</p>
            </div>
            <div class="sb-footer flex items-center text-gray-400">
              <small class="italic">{{ formatDate() }}</small>
              <div class="f-center gap-1 ml-auto">
                <i-flat-color-icons-alarm-clock /><small>{{ t('min', { count: rand(5, 160) }) }} </small>
              </div>
            </div>
          </div>
        </template>
      </masonry-wall>
      <!-- <Pagination :page="page" :totalItems="count" :itemsPerPage="limit" @pagechange="onPageChange" /> -->
    </template>
  </Layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { formatDistance, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { useBoards } from '@/use/db';
import Layout from '@/layouts/Default.vue';

export default defineComponent({
  name: 'StoryBoards',
  components: { Layout },
  setup() {
    const { t, locale } = useI18n();
    const route = useRoute();
    const router = useRouter();

    const filters = reactive({
      search: '',
      tag: 'top-7',
      page: Number(route.query.page) || 1,
      limit: 25,
    });

    const state = reactive({
      mock_storyboards: [
        { id: 1, title: 'iKanban!', description: 'web dev log' },
        { id: 2, title: '🦊KitsuKami', description: '🎮 game dev log' },
        { id: 3, title: 'Aki & Art 🛠️', description: 'Akiya🗝️ and Artisan🖌️ web dev log' },
        { id: 4, title: 'HoloSpace-App.com', description: 'web dev log' },
        { id: 5, title: 'WiFi Watcher', description: '📱 mobile dev log' },
        { id: 6, title: 'げんき 「第2版」', description: 'An integrated course in elementary Japanese' },
        {
          id: 7,
          title: '🥧PiPCii 👁️👄👁️',
          description: '(pi-pc-eyes) intra web dev log - Pi statstation for PC battlestaion',
        },
        { id: 8, title: 'microNovations.com', description: '' },
        { id: 9, title: 'Smart Homie', description: '' },
        { id: 10, title: 'Wi-Fi.FYI', description: '' },
        { id: 11, title: 'ChIP', description: 'Chat has Interaction Power' },
        { id: 12, title: 'shecodez.com', description: 'personal portfolio' },
        { id: 13, title: 'Genshin Impact · XIAO.EXE', description: 'YouTube Genshin Impact EXE series' },
        {
          id: 14,
          title: 'Moving abroad?!?✈️📦',
          description: 'Part I: WTF🥰 (Wonderful Treasure Finds) in my 🧳 carry-on',
        },
        {
          id: 15,
          title: "The King's Knight",
          description:
            "He's a discarded prince nobody is allowed to lay eyes upon, and she's a day-blind paladin hired to protect him...",
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
        {
          label: t('share'),
          key: '3',
        },
      ]),
    });

    const { data, allPublic } = useBoards;
    onMounted(async () => await allPublic(filters.page, filters.limit));
    const storyboards = computed(() => data.boards);

    const onPageChange = (page: number) => {
      router.push({ query: { page } });
      filters.page = page;
      allPublic(page, filters.limit);
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

    return { t, ...toRefs(filters), ...toRefs(state), storyboards, ...toRefs(data), onPageChange, rand, formatDate };
  },
});
</script>
