<template>
  <div class="wysiwyg">
    <WysiwygToolbar />
    <div @input="handleInput" v-html="innerValue" contenteditable="true" class="wysiwyg-editor" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Marked } from '@ts-stack/markdown';
import TurndownService from 'turndown';

import WysiwygToolbar from './WysiwygToolbar.vue';

export default defineComponent({
  name: 'WysiwygEditor',
  components: { WysiwygToolbar },
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      innerValue: Marked.parse(this.modelValue) || '<p><br></p>',
    };
  },
  mounted() {
    document.execCommand('defaultParagraphSeparator', false, 'p');
  },
  methods: {
    handleInput(event) {
      const turndown = new TurndownService({
        emDelimiter: '_',
        linkStyle: 'inlined',
        headingStyle: 'atx',
      });

      this.$emit('update:modelValue', turndown.turndown(event.target.innerHTML));
    },
  },
});
</script>

<style>
.wysiwyg-editor {
  @apply w-full outline-none border-2 p-4 rounded-lg border-gray-300 focus:border-green-300;
}
.wysiwyg-editor h1 {
  @apply block text-2xl font-bold pb-4;
}
.wysiwyg-editor h2 {
  @apply block text-xl font-bold pb-4;
}
.wysiwyg-editor p {
  @apply block pb-4;
}
.wysiwyg-editor ul {
  @apply ml-6 list-disc;
}
.wysiwyg-editor ol {
  @apply ml-6 list-decimal;
}
</style>
