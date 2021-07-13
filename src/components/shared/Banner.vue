<template>
  <div v-show="banner" class="min-h-16 bg-yellow-400 bg-opacity-30 flex items-center rounded-tl-3xl overflow-hidden">
    <div class="w-16 h-full bg-yellow-500 mr-3 f-center"><i-ion-warning class="text-2xl" /></div>
    <p>{{ text }}</p>
    <button class="ml-auto mx-4" @click="closeBanner()" aria-label="close banner">❌</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Banner',
  props: {
    showBanner: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: 'This is a banner',
    },
  },
  setup(props) {
    const banner = ref(props.showBanner);

    const closeBanner = () => {
      banner.value = false;
    };

    return { banner, closeBanner };
  },
});
</script>
