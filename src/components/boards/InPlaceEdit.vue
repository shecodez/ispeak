<template>
  <div class="flex items-center gap-2">
    <input v-if="isEditing" v-focus type="text" v-model="inputValue" @keydown.enter="submit" @keydown.esc="close" />
    <div v-else @click="isEditing = true" :class="css">{{ value }}</div>

    <button v-if="showButtons" @click="toggleEditing">{{ isEditing ? '❌' : '✏️' }}</button>
    <button v-if="showButtons && isEditing" @click="submit">
      <i-gg-spinner v-if="isLoading" class="text-2xl animate-spin" />
      <span v-else>💾</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { onKeyDown } from '@vueuse/core';

export default defineComponent({
  name: 'InPlaceEdit',
  props: {
    value: {
      type: String,
      default: '',
    },
    css: {
      type: String,
      default: 'text-lg font-simibold',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    showButtons: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    const state = reactive({
      inputValue: props.value,
      isEditing: false,
    });

    function toggleEditing() {
      state.isEditing = !state.isEditing;
    }

    function submit() {
      if (state.inputValue != props.value) {
        emit('submit', state.inputValue);
      }
      state.isEditing = false;
    }

    function close() {
      state.isEditing = false;
    }

    onKeyDown(
      'Escape',
      () => {
        if (state.isEditing === true) {
          close();
        }
      },
      { target: document }
    );

    return { t, ...toRefs(state), toggleEditing, submit, close };
  },
});
</script>

<style scoped>
input {
  @apply bg-transparent;
}
button {
  @apply text-sm;
}
</style>
