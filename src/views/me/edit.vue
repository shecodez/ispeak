<template>
  <div class="m-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl capitalize">{{ t('edit_profile') }}</h1>
      <router-link :to="{ name: '@me' }">❌ cancel</router-link>
    </div>

    <AlertMessage v-if="error" type="error" :message="error" />

    <form class="flex flex-col gap-2" @submit.prevent @keydown.enter.prevent>
      <div class="form-group">
        <label>{{ t('username') }}</label>
        <input v-focus type="text" v-model="username" />
      </div>

      <div class="form-group">
        <label>{{ t('bio') }}</label>
        <textarea v-model="bio" rows="4" placeholder="bio..." />
      </div>
    </form>

    <div class="actions w-full flex items-center justify-end gap-2 capitalize mt-4">
      <button type="button" @click="updateProfile" class="btn border">💾 {{ t('submit') }}</button>
      <InPlaceConfirmDelete :onDelete="deleteProfile" css="inline-block" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import { Profile } from '@/data/types/mock';
import { db } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import InPlaceConfirmDelete from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'EditMe',
  components: { AlertMessage, InPlaceConfirmDelete },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const { state: store, getMe, update, del } = db.profiles;

    onMounted(async () => await getMe());

    const form = reactive<Profile>({
      username: '',
      bio: '',
      avatar_url: '',
    });

    function setFields() {
      if (!!store.profile) {
        const { username, bio, avatar_url } = store.profile;

        form.username = username;
        form.bio = bio;
        form.avatar_url = avatar_url;
      }
    }
    watch(
      () => store.profile,
      (profile) => {
        if (profile) setFields();
      },
      { immediate: true }
    );

    async function deleteProfile() {
      if (!!store.profile) {
        const success = await del(store.profile);
        if (success) {
          router.push({ name: 'Home' });
          toast.success(t('profile_deleted'));
        }
      }
    }

    function isValid() {
      return !!form.username;
    }
    async function updateProfile() {
      if (isValid()) {
        await update({ ...store.profile, ...form });
      }
    }

    return { t, route, ...toRefs(store), ...toRefs(form), updateProfile, deleteProfile };
  },
});
</script>
