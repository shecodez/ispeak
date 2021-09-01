import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

import { Board, Profile } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';

const toast = useToast();

type State = {
  isLoading: boolean;
  results: Board[] | Profile[];
  count: number;
  error: null | Error;
};

const state = reactive<State>({
  isLoading: false,
  results: [],
  count: 0,
  error: null,
});

/**
 * search boards.
 * @param q searchTerm
 * @param column optional - defaults to title
 */
async function searchBoards(q: string, column = 'title') {
  try {
    state.isLoading = true;
    const { data, error } = await supabase.from('boards').select().textSearch(column, q);
    if (error) throw error;

    console.log('search Boards', data, error);
    state.results = data || [];
  } catch (e) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

export { state as data, searchBoards };

// https://supabase.io/docs/guides/database/full-text-search
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
