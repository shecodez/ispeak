<template>
  <FixedFrame>
    <div class="m-4">
      <div v-if="user" class="p-2">
        <img class="rounded-full mb-2" :src="user?.photoURL" alt="user avatar" />

        <p class="mb-2">
          {{ t('logged_in_as', { email: user?.email }) }}
        </p>

        <LogoutButton />
        <div class="liked mt-8 mb-2">
          <h2 class="text-4xl capitalize mb-2">💗 {{ t('liked_stories') }} {{ `(${likes.length})` }}</h2>
          <hr />
          <!-- <SagaList :list="likes" /> -->
        </div>

        <div class="favorites my-2">
          <h2 class="text-4xl capitalize mb-2">⭐ {{ t('favorite_stories') }} {{ `(${likes.length})` }}</h2>
          <hr />
          <!-- <SagaList :list="likes" /> -->
        </div>

        <div class="saved mb-2">
          <h2 class="text-4xl capitalize mb-2">💾 {{ t('saved_stories') }} {{ `(${saved.length})` }}</h2>
          <hr />
          <!-- <SagaList :list="saved" /> -->
        </div>
      </div>
    </div>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

//import { useAuthState } from '@/firebase';
import FixedFrame from '@/layouts/FixedFrame.vue';
import LogoutButton from '@/components/shared/LogoutButton.vue';
//import SagaList from '@/components/saga/SagaList.vue';

export default defineComponent({
  name: '@me',
  components: { FixedFrame, LogoutButton },
  setup() {
    const { t } = useI18n();
    const { user } = { user: { email: 'me@shecodez.com', photoURL: null } }; //useAuthState();

    const likes = ref([]);

    const saved = ref([]);

    return { user, likes, saved, t };
  },
});
</script>
