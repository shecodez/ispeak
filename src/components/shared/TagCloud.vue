<template>
  <div class="flex gap-2">
    <template v-for="tag in tags" :key="tag">
      <router-link :to="`/tags/${tagId(tag)}`">
        <Tag :name="tagId(tag)" :count="showCount ? tag?.count : 0" :size="tagSize" />
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Tag from '@/components/shared/TagLink.vue';

export default defineComponent({
  name: 'TagCloud',
  components: { Tag },
  props: {
    tags: {
      type: Array,
      default: [],
    },
    showCount: {
      type: Boolean,
      default: false,
    },
    tagSize: {
      type: String,
    },
  },
  setup() {
    const tagId = (tag: any) => (tag?.id ? tag.id : tag);

    return { tagId };
  },
});
</script>
