<template>
  <div class="w-1/2 mx-auto h-full overflow-auto">
    <!-- <WysiwygEditor v-model="text" /> -->
    <pre class="p-4 bg-gray-300 mt-12">{{ text }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

//import WysiwygEditor from '@/components/ui/wysiwyg/WysiwygEditor.vue';

export default defineComponent({
  name: 'Test',
  //components: { WysiwygEditor },
  setup() {
    const { t } = useI18n();

    const text = ref('');

    return { t, text };
  },
});

/* 
` # Hello, world!

**Lorem ipsum dolor** _sit amet_

* Some
* Unordered
* List


1. Some
1. Ordered
1. List`

  c = count
  (c==1) Liked by x
  (c==2) Liked by x and y
  (c==3) Liked by x y and z
  (c>=4) Liked by z and 3(c-1) others 
  <AvatarGroup />
*/
</script>
