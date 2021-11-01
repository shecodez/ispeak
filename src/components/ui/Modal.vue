<template>
  <teleport to="body">
    <div
      v-if="showModal"
      class="modal-backdrop bg-black bg-opacity-60 absolute inset-0 flex items-center justify-center z-40"
    >
      <div
        ref="modal"
        role="dialog"
        class="w-11/12"
        :class="noBg ? '' : 'modal-container'"
        aria-labelledby="mtitle"
        aria-describedby="mbody"
      >
        <header class="modal-header flex items-center justify-between mb-4">
          <slot name="header">
            <h4 id="mtitle" class="text-lg font-bold">{{ title }}</h4>
          </slot>
          <button @click="close" aria-label="close modal">❌<span class="sr-only">close modal</span></button>
        </header>
        <div id="mbody" class="modal-body">
          <slot>
            <p>{{ content }}</p>
          </slot>
        </div>
        <footer class="modal-footer flex space-x-2 -mb-1 mt-3">
          <slot name="footer">
            <slot name="action">
              <button class="btn primary-green ml-auto" @click="submit">Submit</button>
            </slot>
            <button @click="close" aria-label="close modal" class="btn border ml-auto">Cancel</button>
          </slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { onClickOutside, onKeyDown } from '@vueuse/core';

export default defineComponent({
  name: 'Modal',
  props: {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
    },
    onAction: {
      type: Function,
    },
    noBg: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const showModal = ref(false);
    watch(
      () => props.isOpen,
      (isOpen) => {
        showModal.value = isOpen;
      }
    );

    const close = () => {
      showModal.value = false;
      if (props.onClose) {
        props.onClose();
      }
    };

    const modal = ref();
    onClickOutside(modal, () => {
      if (showModal.value === true) {
        close();
      }
    });
    onKeyDown(
      'Escape',
      () => {
        if (showModal.value === true) {
          close();
        }
      },
      { target: document }
    );

    const submit = () => props.onAction;

    return { t, showModal, close, modal, submit };
  },
});
</script>

<style scoped>
.modal-container {
  @apply flex flex-col md:max-w-lg p-6 bg-gray-300 dark:bg-gray-700 shadow-lg rounded;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
