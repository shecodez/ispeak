<template>
  <h1 class="text-4xl m-3">{{ t('tags') }}</h1>

  <div class="mx-2 flex flex-wrap">
    <template v-for="tag in tags" :key="tag.id">
      <div class="tag btn bg-gray-500 m-1 f-center" :style="`background-color: ${tag.color}`">
        <i-heroicons-solid-hashtag />
        <router-link :to="{ path: 'sagas', query: { tag: tag.id } }">{{ tag.name }}</router-link>
        <span class="bg-white bg-opacity-40 text-xs ml-2 p-1 px-1.5 rounded-full">{{ tag.count }}</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Tags',
  setup() {
    const { t } = useI18n();

    const tags = ref([
      { id: 'hot', name: 'hot', count: 20, color: 'red' },
      { id: 'romance', name: 'romance', count: 42 },
      { id: 'educational', name: 'educational', count: 99 },
      { id: 'new', name: 'new', count: 16, color: 'green' },
      { id: 'top-7', name: 'top 7', count: 7, color: 'blue' },
    ]);
    //const getTags = () => []

    return { tags, t };
  },
});
</script>
