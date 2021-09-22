<template>
  <div class="w-1/2 mx-auto h-full overflow-auto">
    <WysiwygEditor v-model="text" />
    <pre class="p-4 bg-gray-300 mt-12">{{ text }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import WysiwygEditor from '@/components/ui/wysiwyg/WysiwygEditor.vue';

export default defineComponent({
  name: 'WysiwygDemo',
  components: { WysiwygEditor },
  setup() {
    const text = ref('');

    return { text };
  },
});
</script>
