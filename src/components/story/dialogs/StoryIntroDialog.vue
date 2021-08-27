<template>
  <Modal fullscreen>
    <div>*This is fullscreen dialog*</div>

    <h1>title</h1>
    <small>author</small>

    <div class="flex">
      <div>clockIcon # mins</div>
      <div>eyeIcon # views</div>
      <div>heartIcon # likes</div>
    </div>

    <div>starRating</div>

    <p>
      Description: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo aliquam consectetur temporibus officia,
      optio nesciunt adipisci soluta aspernatur nulla nam similique non sunt vitae ullam, quis nisi vero explicabo quos!
    </p>

    <div class="flex">
      <button>download (tooltip: read offline)</button>
      <button>start reading</button>
    </div>

    <h2># boards(stanzas)</h2>
    <p>*images flex off screen</p>
    <div class="flex">
      <template v-for="i in 3" :key="i">
        <div class="w-52 h-52 bg-blue-400">
          <div>stanza(board) {{ i }} image</div>
          <h4>title</h4>
        </div>
      </template>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Board } from '@/data/types/mock';
import Modal from '@/components/ui/Modal.vue';

export default defineComponent({
  name: 'StoryIntroDialog',
  components: { Modal },
  props: {
    intro: {
      type: Object as PropType<Board>,
    },
  },
  setup() {},
});
</script>
