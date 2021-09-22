<template>
  <div class="sb-container flex flex-col gap-3 border rounded-lg p-4">
    <div class="sb-header flex items-center justify-between">
      <div class="flex gap-3 items-center">
        <Avatar v-model:path="board.profiles.avatar_url" :username="board.profiles.username" size="w-12 h-12" />
        <div class="flex flex-col">
          <router-link :to="{ name: 'StoryBoardIntro', params: { id: board.id } }">
            <b>{{ board.title }}</b>
          </router-link>
          <small class="text-xs text-gray-400 flex items-center"><i-mdi-at />{{ owner }}</small>
        </div>
      </div>
      <button class="f-center">
        <n-dropdown @select="handleSelect" :options="options" placement="bottom-start">
          <n-button text class="text-gray-400">
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
      <p>{{ board.description }}</p>
    </div>
    <div class="sb-footer flex items-center text-gray-400">
      <small class="italic">{{ formatDate(board.updated_at || board.inserted_at) }}</small>
      <div class="f-center gap-1 ml-auto">
        <i-flat-color-icons-alarm-clock /><small>{{ t('min', { count: rand(5, 160) }) }} </small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import { Board } from '@/data/types/mock';
import { rand, formatDateDistance } from '@/utils';
import Avatar from '@/components/shared/Avatar.vue';

export default defineComponent({
  components: { Avatar },
  name: 'StoryBoardIndexCard',
  props: {
    board: {
      type: Object as PropType<Board>,
      required: true,
    },
    index: {
      type: Number,
    },
  },
  setup(props) {
    const { t, locale } = useI18n();

    const owner = computed(() => props.board.profiles?.username);
    const options = computed(() => [
      {
        label: true ? t('follow', { user: owner.value }) : t('unfollow', { user: owner.value }),
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
    ]);

    function handleSelect(key: string) {
      const boardId = Number(props.board.id);

      switch (key) {
        case '1':
          console.log('FOLLOW/UNFOLLOW', props.board.user_id);
          break;
        case '2':
          console.log('DOWNLOAD STORYBOARD', boardId);
          break;
        case '3':
          console.log('SHARE STORYBOARD', boardId);
          break;
        default:
          break;
      }
    }

    function formatDate(date: string, mock = false) {
      return formatDateDistance(date, locale.value, mock);
    }

    return { t, owner, options, handleSelect, rand, formatDate };
  },
});
</script>
