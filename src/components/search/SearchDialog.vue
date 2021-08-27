<template>
  <button @click="searching = true" :class="css">🔍</button>

  <Modal :isOpen="searching" :onClose="close" noBg>
    <input type="search" v-model="q" placeholder="Search..." @keydown.enter="search" />
    <div class="p-4 rounded flex flex-col bg-gray-300 dark:bg-gray-700">
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-if="!results.length">No results found.</div>
        <pre v-else>{{ results }}</pre>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import { supabase } from '@/supabase/db';
import Modal from '@/components/ui/Modal.vue';

export default defineComponent({
  name: 'SearchDialog',
  components: { Modal },
  props: {
    css: {
      type: String,
      default: 'f-center w-16 h-16 text-2xl',
    },
  },
  setup() {
    // https://supabase.io/docs/guides/database/full-text-search

    const { t } = useI18n();
    const state = reactive({
      searching: false,
      q: '',
      isLoading: false,
      results: [],
      error: null,
    });

    // TODO: Search multiple columns doent have javascript example
    /*
    SQL EXAMPLE:
    select 
      * 
    from 
      books
    where 
      to_tsvector(description || ' ' || title) -- concat columns, but be sure to include a space to separate them!
      @@ to_tsquery('little');
    */
    function search() {
      if (!state.q) return;

      try {
        state.isLoading = true;
        const { data, error } = supabase.from('kanbans').select().textSearch('title', state.q);
        if (error) throw error;
        state.results = data;
      } catch (err) {
        state.error = err.error_description || err.message;
      } finally {
        state.isLoading = false;
      }
    }

    function close() {
      state.searching = false;
    }

    return { t, ...toRefs(state), search, close };
  },
});
</script>
