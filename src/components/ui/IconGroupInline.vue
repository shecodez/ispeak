<template>
  <div class="flex items-center m-3 md:m-0">
    <template v-for="(item, i) in items" :key="item">
      <div class="overlapping-icon-group" v-if="i < showMax">
        {{ item.charAt(0) }}
      </div>
    </template>
    <span v-if="items.length > showMax" class="text-sm mx-2 italic text-gray-500"> +{{ items.length - showMax }} </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'IconGroupInline',
  props: {
    items: {
      type: [Array, Set],
      default: [],
    },
    showMax: {
      type: Number,
      default: 3,
    },
  },
  setup(props) {
    const { t } = useI18n();

    return { t };
  },
});
</script>

<style scoped>
.overlapping-icon-group {
  @apply w-10 h-10 border bg-gray-500 rounded-full flex items-center justify-center hover:transform hover:scale-110 -ml-2;
}
</style>
