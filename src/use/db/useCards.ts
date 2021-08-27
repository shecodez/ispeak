import { reactive } from 'vue';

import { List, Card } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';
import { data as boardState } from './useBoards';

type State = {
  isLoading: boolean;
  error: null | Error;
};

const state = reactive<State>({
  isLoading: false,
  error: null,
});

async function add(list: List, card: Card): Promise<null | Card> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase.from('cards').insert({ ...card, list_id: list.id });
    if (error) throw error;

    const data: Card = body ? { ...body[0], cards: [] } : null;
    const idx = Number(boardState.currentBoard?.lists?.findIndex((l) => l.id === data.list_id));
    if (idx >= 0) {
      boardState.currentBoard?.lists?.[idx].cards?.push(data);
    }
    return data; // TODO: is return needed?
  } catch (e) {
    state.error = e.error_description || e.message;
    return null; // TODO: is return needed?
  } finally {
    state.isLoading = false;
  }
}

async function update(card: Card): Promise<null | Card> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase
      .from('cards')
      .update({ text: card.text, hint: card.hint, bg_color: card.bg_color, text_color: card.text_color })
      .match({ id: card.id });
    //.eq('id', list.id).single();
    if (error) throw error;

    const data: Card = body ? { ...body[0] } : null;
    const listIdx = Number(boardState.currentBoard?.lists?.findIndex((l) => l.id === data.list_id));
    const idx = Number(boardState.currentBoard?.lists?.[listIdx].cards?.findIndex((c) => c.id === data.id));
    if (idx >= 0) {
      boardState.currentBoard?.lists?.[listIdx].cards?.splice(idx, 1, data);
    }
    return data; // TODO: is return needed?
  } catch (e) {
    state.error = e.error_description || e.message;
    return null; // TODO: is return needed?
  } finally {
    state.isLoading = false;
  }
}

async function del(card: Card) {
  try {
    state.isLoading = true;
    await supabase.from('cards').delete().eq('id', card.id);

    const listIdx = Number(boardState.currentBoard?.lists?.findIndex((l) => l.id === card.list_id));
    const idx = Number(boardState.currentBoard?.lists?.[listIdx].cards?.findIndex((c) => c.id === card.id));
    if (idx >= 0) {
      boardState.currentBoard?.lists?.[listIdx].cards?.splice(idx, 1);
    }
  } catch (e) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

export { state as data, add, update, del };
