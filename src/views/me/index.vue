<template>
  <ProgressBar label="for decoration only" :value="100" />
  <Spinner v-if="isLoading" />
  <Layout v-if="profile" :title="t('profile')">
    <!-- <AlertMessage v-if="error" type="error" :message="error" /> -->
    <main class="mx-auto w-10/12 md:w-1/2">
      <Me :profile="profile" />
    </main>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import { db } from '@/use/db';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import Spinner from '@/components/ui/Spinner.vue';
import Layout from '@/layouts/AuthLayout.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Me from '@/components/me/Me.vue';

export default defineComponent({
  name: '@me',
  components: { ProgressBar, Spinner, Layout, AlertMessage, Me },
  setup() {
    const { t } = useI18n();

    const { state: store, getMe } = db.profiles;
    onMounted(async () => await getMe());

    return { t, ...toRefs(store) };
  },
});
</script>
