<template>
  <div
    class="tag rounded inline-flex shadow items-center text-white"
    :class="size"
    :style="`background-color: ${getTagBgColor}`"
  >
    <i-heroicons-solid-hashtag />
    <h1>{{ name }}</h1>
    <span
      v-if="count"
      class="bg-white bg-opacity-40 ml-2 p-1 px-1.5 rounded-full"
      :class="size.includes('xl') ? 'text-xl' : 'text-xs'"
    >
      {{ count < 10 ? `0${count}` : count }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'Tag',
  props: {
    name: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: 'text-xs px-2 py-1',
    },
  },
  setup: (props) => {
    const getTagBgColor = computed(() => {
      switch (props.name) {
        case 'hot':
          return 'red';
        case 'new':
          return 'green';
        case 'top-7':
          return 'blue';
        default:
          return 'gray';
      }
    });

    return { getTagBgColor };
  },
});
</script>
