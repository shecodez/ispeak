<template>
  <div class="flex flex-col gap-8 h-full">
    <div class="flex flex-col gap-4 items-center">
      <div class="flex w-full items-center justify-between">
        <button><i-fa-regular-question-circle /></button>
        <button><i-fa-cog /></button>
      </div>

      <div class="relative w-32 h-32 rounded-full" :class="!profile.avatar_url && 'bg-gray-400'">
        <img v-if="profile.avatar_url" src="profile.avatar_url" alt="avatar" />
        <button class="absolute top-0 right-0 font-bold">{{ t('upload') }}</button>
      </div>
      <h3>{{ profile.username }}</h3>
      <button v-if="isLoggedIn" class="btn primary-blue text-white mx-auto">
        {{ t('edit') }}
      </button>

      <div class="flex w-full text-center capitalize items-center justify-around">
        <div class="flex flex-col">
          <h3>#</h3>
          <h5>{{ t('followers') }}</h5>
        </div>
        <div class="flex flex-col">
          <h3>#</h3>
          <h5>{{ t('story_boards') }}</h5>
        </div>
        <div class="flex flex-col">
          <h3>#</h3>
          <h5>{{ t('following') }}</h5>
        </div>
      </div>
    </div>

    <div v-if="profile.bio">
      <h3>bio:</h3>
      <p>{{ profile.bio }}</p>
    </div>

    <div>
      <BoardList :boards="boards" listOnly />
    </div>

    <button v-if="isLoggedIn" @click="logout" class="btn primary-red mt-auto">
      <div class="f-center gap-2 text-xs uppercase text-white py-1">
        <i-ant-design-logout-outlined />
        <span class="">{{ t('logout') }}</span>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import { Board, Profile } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/use/auth';
import BoardList from '@/components/boards/drawers/BoardList.vue';

export default defineComponent({
  name: 'Profile',
  props: {
    profile: {
      type: Object as PropType<Profile>,
      required: true,
    },
  },
  components: { BoardList },
  setup() {
    const { t } = useI18n();
    const { auth, logout } = useAuth;

    const state = reactive({
      isLoading: false,
      error: null,
      //profile: {} as Profile,
      boards: [] as Board[],
      isLoggedIn: computed(() => !!auth.userSession?.user),
    });
    async function fetchUserTop3Boards() {
      try {
        state.isLoading = true;
        const { data, error } = await supabase
          .from('boards')
          .select('id, title, user_id')
          .limit(3)
          .order('updated_at', { ascending: false })
          .eq('user_id', supabase.auth.user()?.id);
        if (error) throw error;
        if (data === null) return (state.boards = []);

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
      logout,
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
