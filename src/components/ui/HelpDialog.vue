<template>
  <Modal :isOpen="showDialog" :title="`💡 ${t('help')}`" :onClose="closeDialogFn">
    <div class="text-center">
      <img v-show="tip.mediaURL" :src="tip.mediaURL" alt="tip visual" />
      <p class="my-2 font-semibold">{{ tip.message }}</p>

      <button class="btn border m-1">Get another tip 🦉</button>
    </div>
    <template v-slot:footer>
      <div class="flex w-full justify-around border-t py-2">
        <span>Contact</span>
        <span>FAQs</span>
        <span>Blog</span>
        <span>Privacy</span>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';

export default defineComponent({
  name: 'HelpDialog',
  components: { Modal },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    closeDialogFn: {
      type: Function,
    },
  },
  setup() {
    const { t } = useI18n();
    const tip = ref({
      id: 'take-a-break',
      mediaURL: '/src/assets/takeABreak.jpeg',
      message: "✋ Hold up, you've been working for too long. Don't forget to take a break. 🥰",
    });
    const getATip = () => {};

    return { tip, t };
  },
});
</script>
