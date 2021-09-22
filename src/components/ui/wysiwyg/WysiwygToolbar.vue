<template>
  <div v-if="!hideToolbar" class="wysiwyg-toolbar flex items-center">
    <template v-for="tool in tools" :key="tool.name">
      <n-tooltip v-if="tool.component" trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-button @click="tool.action" text class="btn">
            <component :is="tool.component" />
          </n-button>
        </template>
        {{ tool.name }}
      </n-tooltip>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue';
import Bold from 'virtual:vite-icons/mdi/format-bold';
import Italic from 'virtual:vite-icons/mdi/format-italic';
import Strike from 'virtual:vite-icons/ph/text-strikethrough-duotone';
import Heading1 from 'virtual:vite-icons/ci/heading-h1';
import Heading2 from 'virtual:vite-icons/ci/heading-h2';
import Paragraph from 'virtual:vite-icons/teenyicons/paragraph-outline';
import BulletList from 'virtual:vite-icons/ph/list-bullets';
import OrderedList from 'virtual:vite-icons/mdi/format-list-numbered';
import FormatClear from 'virtual:vite-icons/mdi/format-clear';
import Undo from 'virtual:vite-icons/mdi/undo-variant';
import Redo from 'virtual:vite-icons/mdi/redo-variant';

export default defineComponent({
  name: 'WysiwygToolbar',
  props: {
    hideToolbar: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const tools = shallowRef([
      { name: 'Bold', component: Bold, action: applyBold },
      { name: 'Italic', component: Italic, action: applyItalic },
      { name: 'Strike', component: Strike, action: applyStrike },
      { name: 'Code' },
      { name: 'Highlight' },
      { divider: true },
      { name: 'Heading 1', component: Heading1, action: applyH1 },
      { name: 'Heading 2', component: Heading2, action: applyH2 },
      { name: 'Paragraph', component: Paragraph, action: applyP },
      { name: 'Bullet List', component: BulletList, action: applyUL },
      { name: 'Ordered List', component: OrderedList, action: applyOL },
      { name: 'Task List' },
      { name: 'Code Block' },
      { divider: true },
      { name: 'Block quote' },
      { name: 'Horizontal Rule' },
      { divider: true },
      { name: 'Hard Break' },
      { name: 'Clear Format', component: FormatClear, action: removeFormat },
      { divider: true },
      { name: 'Undo', component: Undo, action: undo },
      { name: 'Redo', component: Redo, action: redo },
    ]);

    function applyBold() {
      document.execCommand('bold');
    }
    function applyItalic() {
      document.execCommand('italic');
    }
    function applyStrike() {
      document.execCommand('strikeThrough');
    }
    function applyH1() {
      document.execCommand('formatBlock', false, '<H1>');
    }
    function applyH2() {
      document.execCommand('formatBlock', false, '<H2>');
    }
    function applyP() {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
    function applyUL() {
      document.execCommand('insertUnorderedList');
    }
    function applyOL() {
      document.execCommand('insertOrderedList');
    }
    function removeFormat() {
      document.execCommand('removeFormat');
    }
    function undo() {
      document.execCommand('undo');
    }
    function redo() {
      document.execCommand('redo');
    }

    return { tools };
  },
});
</script>
