<template>
  <div v-show="banner" class="min-h-16 bg-blue-300 rounded-tl-3xl flex items-center px-3">
    <p>{{ text }}</p>
    <button class="ml-auto mx-2" @click="closeBanner()">❌</button>
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
