<template>
  <Spinner v-if="isLoading" />
  <div class="flex flex-col gap-8 h-full" :class="css">
    <div class="flex flex-col gap-4 items-center">
      <div class="flex w-full items-center justify-between text-gray-500">
        <n-popover trigger="hover" raw :show-arrow="false">
          <template #trigger>
            <button class="f-center"><i-fa-cog /></button>
          </template>
          <div class="flex-1 flex flex-col gap-2 p-4">
            <ToggleDark />
            <SwitchLocale />
            <router-link :to="{ name: '@me' }" class="opacity-70 hover: opacity-100">
              <i-mdi-account-circle />
            </router-link>
          </div>
        </n-popover>
        <button @click="showHelp = true" class="f-center"><i-fa-regular-question-circle /></button>
      </div>

      <AlertMessage v-if="error" type="error" :message="error" />
      <div class="w-full flex flex-col items-center">
        <Avatar
          v-model:path="profile.avatar_url"
          @upload="updateAvatarUrl"
          :username="profile.username"
          size="w-24 h-24"
          allowUpload
        />
        <InPlaceEdit :value="profile.username" @submit="updateUsername" css="font-black" showButtons />
      </div>

      <div class="text-xs flex gap-2 items-center">
        <span class="font-semibold text-gray-400">{{ t('logged_in_as', { email: user?.email }) }}</span>
        <i-ph-circle-wavy-check-duotone v-if="!!user?.email_confirmed_at" class="text-green-500" />
        <i-ph-warning-duotone v-else class="text-yellow-500" />
      </div>

      <div class="flex gap-2">
        <router-link :to="{ name: 'EditProfile' }" class="btn primary-blue text-white">
          {{ t('edit') }}
        </router-link>
        <LogoutButton />
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

    <div class="flex flex-col gap-4">
      <div class="liked">
        <h2 class="font-bold mb-2">💗 {{ t('like', likes.length) }}</h2>
        <hr />
        <!-- <BoardList :boards="likes" listOnly /> -->
      </div>

      <div class="bookmarked">
        <h2 class="font-bold mb-2">💾 {{ t('bookmark', bookmarks.length) }}</h2>
        <hr />
        <!-- <BoardList :boards="bookmarkes" listOnly /> -->
      </div>
    </div>

    <div class="mt-auto text-center flex flex-col gap-2">
      <router-link to="/boards" class="hover:underline">{{ t('go_to_boards') }}</router-link>
      <button @click="addBoard" class="btn primary-blue">
        <div class="f-center gap-2 text-xs uppercase text-white py-1">
          <i-mdi-plus-circle-outline />
          <span class="">{{ t('create_new_board') }}</span>
        </div>
      </button>
    </div>
  </div>
  <HelpDialog :show="showHelp" @close="closeHelp" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Board, Profile } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/use/auth';
import { db } from '@/use/db';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import BoardList from '@/components/boards/drawers/BoardList.vue';
import LogoutButton from '../shared/LogoutButton.vue';
import ToggleDark from '@/components/shared/ToggleDark.vue';
import SwitchLocale from '@/components/shared/SwitchLocale.vue';
import Avatar from '@/components/shared/Avatar.vue';

export default defineComponent({
  name: 'Me',
  props: {
    profile: {
      type: Object as PropType<Profile>,
      required: true,
    },
    css: {
      type: String,
      default: '',
    },
  },
  components: { Spinner, AlertMessage, BoardList, LogoutButton, ToggleDark, SwitchLocale, Avatar },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const { auth, logout } = useAuth;
    const { updateUsername, updateAvatarUrl } = db.profiles;
    const { add } = db.boards;

    const state = reactive({
      isLoading: false,
      likes: [],
      bookmarks: [],
      error: null,
      boards: [] as Board[],
      storyBoardCount: 0,
      isLoggedIn: computed(() => !!auth.userSession?.user),
      user: computed(() => auth.userSession?.user),
      showHelp: false,
    });

    async function fetchUserTop3Boards() {
      const userId = supabase.auth.user()?.id;
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
      } catch (e: any) {
        state.error = e.error_description || e.message;
      } finally {
        state.isLoading = false;
      }
    }
    onMounted(async () => await fetchUserTop3Boards());

    async function addBoard() {
      const data = await add({ title: t('untitled'), position: state.storyBoardCount });
      router.push({ name: 'ViewBoard', params: { id: data?.id } });
    }

    const closeHelp = () => {
      state.showHelp = false;
    };

    return {
      t,
      logout,
      updateUsername,
      updateAvatarUrl,
      ...toRefs(state),
      addBoard,
      closeHelp,
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
