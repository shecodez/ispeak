<template>
  <button @click="toggleSearch" class="relative z-40" :class="css">
    <span v-if="isSearching">❌</span>
    <span v-else>🔍</span>
  </button>

  <div v-if="isSearching" class="overlay fixed inset-0 z-30">
    <div class="search flex flex-col w-11/12 md:w-2/3 lg:w-3/5">
      <div class="input-group flex items-center gap-2">
        <!-- <div class="clearable-input relative flex items-center">
        <input type="search" v-model="q" placeholder="Search..." @keydown.enter="search" />
        <button v-if="q" @click="clearQ" class="f-center"><i-mdi-close /></button>
      </div> -->
        <input type="search" v-model="q" placeholder="Search..." @keydown.enter="search" />
        <button @click="search" class="f-center">
          <i-gg-spinner v-if="isLoading" class="text-2xl animate-spin" />
          <i-mdi-search v-else />
        </button>
      </div>

      <div v-if="showResults" class="results p-4 my-4 rounded flex flex-col bg-gray-200 text-black">
        <AlertMessage v-if="error" type="error" :message="error" />
        <div v-if="!results.length">No results found.</div>
        <ul v-else class="flex flex-col gap-2">
          <template v-for="r in results" :key="r.id">
            <li class="p-4 bg-gray-800 bg-opacity-30">
              <router-link :to="`/story/boards/${r.id}`" class="text-lg font-bold">
                {{ r.title }}
              </router-link>
              <p>{{ r.description }}</p>
            </li>
          </template>
        </ul>
        <!-- <b class="ml-auto mt-2 text-xs">Result(s): {{ results.length }}</b> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { onKeyDown } from '@vueuse/core';

import { useSearch } from '@/use/db';
import Modal from '@/components/ui/Modal.vue';
import AlertMessage from '../shared/AlertMessage.vue';

export default defineComponent({
  name: 'SearchDialog',
  components: { Modal, AlertMessage },
  props: {
    css: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { t } = useI18n();
    const { data, searchBoards } = useSearch;

    const state = reactive({
      q: '',
      isSearching: false,
      showResults: false,
    });

    async function search() {
      if (!state.q) return;
      await searchBoards(state.q);
      state.showResults = true;
    }

    function toggleSearch() {
      state.isSearching = !state.isSearching;
      state.showResults = false;
    }

    function close() {
      state.showResults = false;
      state.isSearching = false;
    }

    onKeyDown(
      'Escape',
      () => {
        if (state.isSearching === true) {
          close();
        }
      },
      { target: document }
    );

    return { t, ...toRefs(data), ...toRefs(state), search, toggleSearch, close };
  },
});
</script>

<style scoped>
.overlay {
  @apply flex flex-col items-center justify-center bg-black bg-opacity-80 overflow-hidden;
}

.clearable-input > input {
  @apply pr-20;
}
.clearable-input > button {
  @apply absolute right-0;
}

.input-group {
  @apply text-6xl text-white;
}
.input-group input {
  @apply flex-1 bg-transparent outline-none border-0 border-b-1 border-white text-3xl md:text-4xl lg:text-5xl xl:text-7xl;
}
.input-group button {
  @apply flex-shrink-0;
}
</style>
