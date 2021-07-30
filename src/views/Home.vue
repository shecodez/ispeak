<template>
  <FixedFrame>
    <div class="w-1/4 mx-auto">
      <button class="btn bg-red-500 m-4" @click="showErrorToast">Show Error Toast</button>
      <br />
      <button class="btn border m-4" @click="showLoginToast">Show Login Toast</button>
    </div>
  </FixedFrame>
</template>

<script lang="ts">
import FixedFrame from '@/components/layouts/FixedFrame.vue';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

export default defineComponent({
  name: 'Home',
  components: { FixedFrame },
  setup() {
    const { locale, t } = useI18n();
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
