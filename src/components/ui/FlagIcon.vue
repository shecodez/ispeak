<template>
  <i-emojione-flag-for-united-states v-show="locale === 'en'" />
  <i-emojione-flag-for-japan v-show="locale === 'ja'" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FlagIcon',
  props: {
    locale: {
      type: String,
      required: true,
    },
  },
  setup: () => {},
});
</script>
