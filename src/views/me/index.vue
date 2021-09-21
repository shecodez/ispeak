<template>
  <ProgressBar label="for decoration only" :value="100" />
  <Spinner v-if="isLoading" />
  <Layout v-if="profile" :title="t('profile')">
    <AlertMessage v-if="error" type="error" :message="error" />
    <main class="mx-6">
      <div class="w-full flex flex-col items-center mb-4">
        <div class="relative mx-auto">
          <n-avatar :src="profile?.avatar_url" :size="96" round style="flex-shrink: 0; flex-grow: 0">
            <span v-if="!!!profile?.avatar_url" class="text-4xl font-bold">
              {{ profile?.username.charAt(0) }}
            </span>
          </n-avatar>
          <button v-if="user" class="absolute top-0 right-0 font-bold">{{ t('upload') }}</button>
        </div>
        <InPlaceEdit :value="profile.username" @submit="updateUsername" css="font-black" showButtons />
      </div>
      <div v-if="user" class="flex flex-col items-center gap-4 mb-8">
        <span class="text-xs font-semibold text-gray-400">
          {{ t('logged_in_as', { email: user?.email }) }}
        </span>
        <div v-if="profile.bio">
          <h5>{{ t('bio') }}</h5>
          <p>{{ profile.bio }}</p>
        </div>
        <div class="flex gap-2">
          <router-link :to="{ name: 'EditProfile' }" class="btn primary-blue text-white">
            {{ t('edit') }}
          </router-link>
          <button v-if="user" @click="logout" class="btn primary-red text-white">
            <div class="f-center gap-2">
              <i-ant-design-logout-outlined />
              <span>{{ t('logout') }}</span>
            </div>
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="liked">
          <h2 class="text-3xl capitalize mb-2">💗 {{ t('like', likes.length) }}</h2>
          <hr />
          <!-- <StoryBoards :boards="liked" /> -->
        </div>

        <div class="bookmarked">
          <h2 class="text-3xl capitalize mb-2">💾 {{ t('bookmark', bookmarks.length) }}</h2>
          <hr />
          <!-- <StoryBoards :boards="bookmarked" /> -->
        </div>
      </div>
    </main>
  </Layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuth } from '@/use/auth';
import { db } from '@/use/db';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import Spinner from '@/components/ui/Spinner.vue';
import Layout from '@/layouts/Default.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';

export default defineComponent({
  name: '@me',
  components: { ProgressBar, Spinner, Layout, AlertMessage },
  setup() {
    const { t } = useI18n();

    const { auth, logout } = useAuth;
    const user = computed(() => auth.userSession?.user);

    const { state: store, getMe, updateUsername } = db.profiles;
    onMounted(async () => await getMe());

    const state = reactive({
      likes: [],
      bookmarks: [],
    });

    return { t, logout, user, ...toRefs(store), updateUsername, ...toRefs(state) };
  },
});
</script>
