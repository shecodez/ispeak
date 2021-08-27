<template>
  <FixedFrame>
    <div class="flex-1 w-1/4 mx-auto">
      <button class="btn bg-red-500 m-4" @click="showErrorToast">Show Error Toast</button>
      <br />
      <button class="btn border m-4" @click="showLoginToast">Show Login Toast</button>
    </div>
    <Footer />
  </FixedFrame>
</template>

<script lang="ts">
import { useTitle } from '@vueuse/core';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import FixedFrame from '@/components/layouts/FixedFrame.vue';
import Footer from '@/components/shared/Footer.vue';

export default defineComponent({
  name: 'Home',
  components: { FixedFrame, Footer },
  setup() {
    const { locale, t } = useI18n();
    useTitle(`${t('home')} · 🎬 ${import.meta.env.VITE_APP_NAME}`);

    const toast = useToast();

    const showErrorToast = () => toast.error('エラーtoast', { timeout: 5000 });

    const showLoginToast = () =>
      toast(t('you_must_be_logged_in'), {
        timeout: 5000,
        // action: {
        //   text: 'Login',
        //   // onClick: (e: any, toastObject: ToastObject) => {
        //   //   toastObject.goAway(0);
        //   // },
        //   push: {
        //     name: 'Login',
        //   },
        // },
      });

    return { locale, t, showErrorToast, showLoginToast };
  },
});
</script>
