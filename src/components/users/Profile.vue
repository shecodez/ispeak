<template>
  <div class="flex flex-col gap-8 h-full">
    <div class="flex flex-col gap-4 items-center">
      <!-- <n-avatar :src="profile?.avatar_url" :size="128" round style="flex-shrink: 0; flex-grow: 0">
        <span v-if="!!!profile?.avatar_url" class="text-4xl font-bold">
          {{ profile?.username.charAt(0) }}
        </span>
      </n-avatar> -->
      <Avatar v-model:path="profile.avatar_url" :username="profile.username" size="w-32 h-32" />
      <h3>{{ profile.username }}</h3>
      <div class="mx-auto">
        <button class="btn primary-blue text-white">
          {{ t('follow') }}
        </button>
      </div>

      <div class="flex w-full text-center capitalize items-center justify-around">
        <div class="flex flex-col">
          <h3>0</h3>
          <h5>{{ t('followers') }}</h5>
        </div>
        <div class="flex flex-col">
          <h3>{{ storyBoardCount }}</h3>
          <h5>{{ t('story_boards') }}</h5>
        </div>
        <div class="flex flex-col">
          <h3>0</h3>
          <h5>{{ t('following') }}</h5>
        </div>
      </div>
    </div>

    <div v-if="profile.bio">
      <h3>{{ t('bio') }}:</h3>
      <p>{{ profile.bio }}</p>
    </div>

    <BoardList :label="t('recent_boards')" :boards="boards" listOnly />

    <div class="liked">
      <h2 class="font-bold mb-2">💗 {{ t('like', likes.length) }}</h2>
      <hr />
      <!-- <BoardList :boards="likes" listOnly /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import { Board, Profile } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';
import Avatar from '@/components/shared/Avatar.vue';
import BoardList from '@/components/boards/drawers/BoardList.vue';

export default defineComponent({
  name: 'Profile',
  props: {
    profile: {
      type: Object as PropType<Profile>,
      required: true,
    },
  },
  components: { Avatar, BoardList },
  setup(props) {
    const { t } = useI18n();

    const state = reactive({
      isLoading: false,
      error: null,
      boards: [] as Board[],
      storyBoardCount: 0,
      likes: [],
    });
    async function fetchUserTop3Boards() {
      const userId = props.profile.id;
      try {
        state.isLoading = true;
        const { count } = await supabase
          .from('boards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        const { data, error } = await supabase
          .from('boards')
          .select('id, title, user_id')
          .limit(3)
          .order('updated_at', { ascending: false })
          .eq('user_id', userId);
        if (error) throw error;
        if (data === null) return (state.boards = []);

        state.storyBoardCount = Number(count);
        state.boards = data;
      } catch (e) {
        state.error = e.error_description || e.message;
      } finally {
        state.isLoading = false;
      }
    }
    onMounted(async () => await fetchUserTop3Boards());

    return {
      t,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
h3 {
  @apply text-sm font-semibold;
}
h5 {
  @apply text-xs text-gray-400;
}
</style>
