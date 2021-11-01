<template>
  <ProgressBar label="for decoration only" :value="100" />
  <Spinner v-if="isLoading" />
  <Layout title="@me">
    <main class="m-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl capitalize">{{ t('edit_profile') }}</h1>
        <button @click="router.back()">❌ {{ t('cancel') }}</button>
      </div>

      <AlertMessage v-if="error" type="error" :message="error" />

      <form class="flex flex-col gap-2" @submit.prevent @keydown.enter.prevent>
        <div class="form-group">
          <label>{{ t('username') }}</label>
          <input v-focus type="text" v-model="username" />
        </div>

        <div class="form-group">
          <label>{{ t('bio') }}</label>
          <textarea v-model="bio" rows="4" :placeholder="`${t('bio')}...`" />
        </div>
      </form>

      <div class="actions w-full flex items-center justify-end gap-2 capitalize mt-4">
        <button type="button" @click="updateProfile" class="btn border">💾 {{ t('submit') }}</button>
        <!-- <InPlaceConfirmDelete :onDelete="deleteProfile" css="inline-block" /> -->
      </div>
    </main>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import { Profile } from '@/data/types/mock';
import { db } from '@/use/db';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import Spinner from '@/components/ui/Spinner.vue';
import Layout from '@/layouts/Default.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import InPlaceConfirmDelete from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'EditMe',
  components: { Spinner, ProgressBar, Layout, AlertMessage, InPlaceConfirmDelete },
  setup() {
    const { t } = useI18n();
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
          toast.success(t('profile_deleted'));
          // TODO: logout() // auto? router.push({ name: 'Home' });
        }
      }
    }

    function isValid() {
      return !!form.username;
    }
    async function updateProfile() {
      if (isValid()) {
        await update({ ...store.profile, ...form });
        // toast.success(t('profile_updated'));
        router.back();
      }
    }

    return { t, router, ...toRefs(store), ...toRefs(form), updateProfile, deleteProfile };
  },
});
</script>
