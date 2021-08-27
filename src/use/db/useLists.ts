import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

import { Board, List } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';
import { data as boardState } from './useBoards';

const toast = useToast();

type State = {
  isLoading: boolean;
  error: null | Error;
};

const state = reactive<State>({
  isLoading: false,
  error: null,
});

async function add(board: Board, list: List): Promise<null | List> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase.from('lists').insert({ ...list, board_id: board.id });
    if (error) throw error;

    const data: List = body ? { ...body[0], cards: [] } : null;
    boardState.currentBoard?.lists?.push(data);
    return data; // TODO: is return needed?
  } catch (e) {
    state.error = e.error_description || e.message;
    return null; // TODO: is return needed?
  } finally {
    state.isLoading = false;
  }
}

async function update(list: List): Promise<null | List> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase
      .from('lists')
      .update({
        title: list.title,
        slug: list.slug,
        description: list.description,
        publish_date: list.publish_date,
        gems: list.gems,
      })
      .match({ id: list.id });
    //.eq('id', list.id).single();
    if (error) throw error;

    const data: List = body ? { ...body[0] } : null;
    const idx = Number(boardState.currentBoard?.lists?.findIndex((l) => l.id === data.id));
    if (idx >= 0) {
      boardState.currentBoard?.lists?.splice(idx, 1, { ...boardState.currentBoard?.lists[idx], ...data });
    }
    return data; // TODO: is return needed?
  } catch (e) {
    state.error = e.error_description || e.message;
    return null; // TODO: is return needed?
  } finally {
    state.isLoading = false;
  }
}

/**
 * Update the List's Cards positions (rpc = stored procedure)
 * @param list
 * @returns boolean or error
 */
async function sort(list: List) {
  if (!list.cards?.length) return;

  try {
    //state.isLoading = true;
    const { data, error } = await supabase.rpc('sort_list', {
      new_list_id: list.id,
      card_ids: list.cards?.map((card) => card.id),
    });
    if (error) throw error;

    return data;
  } catch (e) {
    state.error = e.error_description || e.message;
    return false; // TODO: is return needed?
  } finally {
    //state.isLoading = false;
  }
}

async function del(list: List) {
  try {
    state.isLoading = true;
    await supabase.from('lists').delete().eq('id', list.id);

    const idx = Number(boardState.currentBoard?.lists?.findIndex((l) => l.id === list.id));
    if (idx >= 0) {
      boardState.currentBoard?.lists?.splice(idx, 1);
    }
    toast.success('List deleted.');
    if (boardState.currentBoard?.id === list.id) boardState.currentBoard = null;
  } catch (e) {
    toast.error('Error deleting list');
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

export { state as data, add, update, sort, del };
