<template>
  <n-modal v-model:show="show" :mask-closable="false">
    <n-card style="width: 600px" :title="`💡 ${t('info')}`" :bordered="false" size="huge">
      <template #header-extra>
        <button @click="close" aria-label="close modal">❌<span class="sr-only">close modal</span></button>
      </template>

      <div class="text-center">
        <img v-show="tip.mediaURL" :src="tip.mediaURL" alt="tip visual" />
        <p class="my-2 font-semibold">{{ tip.message }}</p>

        <button class="btn border m-1">Get another tip</button>
      </div>

      <template #footer>
        <div class="flex w-full justify-around border-t pt-3 font-semibold">
          <router-link :to="{ name: 'Contact' }">Contact</router-link>
          <router-link :to="{ name: 'FAQs' }">FAQs</router-link>
          <router-link :to="{ name: 'Blog' }">Blog</router-link>
          <router-link :to="{ name: 'Privacy' }">Privacy</router-link>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { onKeyDown } from '@vueuse/core';

export default defineComponent({
  name: 'HelpDialog',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useI18n();
    onKeyDown(
      'Escape',
      () => {
        if (props.show === true) {
          close();
        }
      },
      { target: document }
    );

    const tip = ref({
      id: 'take-a-break',
      mediaURL: '/src/assets/takeABreak.jpeg',
      message: "Hold up ✋, you've been working for too long. Don't forget to take a break. 🥰",
    });
    const getATip = () => {};

    function close() {
      emit('close');
    }
    return { t, tip, close };
  },
});
</script>

<style scoped>
a {
  @apply opacity-70 hover:opacity-100;
}
</style>
