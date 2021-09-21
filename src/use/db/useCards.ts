import { reactive } from 'vue';

import { List, Card } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';
import { data as boardStore } from './useBoards';
import { add as addAct } from '@/use/db/useActivity';

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

    const data: Card = body ? { ...body[0] } : null;
    const idx = Number(boardStore.board?.lists?.findIndex((l) => l.id === data.list_id));
    if (idx >= 0) {
      boardStore.board?.lists?.[idx].cards?.push(data);
    }
    await addAct({ text: `added **${data.text}** to ${list.title}`, board_id: list.board_id });
    return data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return null;
  } finally {
    state.isLoading = false;
  }
}

async function update(card: Card, isIsolatedUpdate = false): Promise<null | Card> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase
      .from('cards')
      .update({
        text: card.text,
        //audio_url: card.audio_url,
        details: card.details,
        color: card.color,
        label: card.label,
        text_color: card.text_color,
      })
      .match({ id: card.id });
    //.eq('id', list.id).single();
    if (error) throw error;

    const data: Card = body ? { ...body[0] } : null;
    //const list = boardStore.board?.lists?.find((l) => l.id === data.list_id);
    const listIdx = Number(boardStore.board?.lists?.findIndex((l) => l.id === data.list_id));
    const idx = Number(boardStore.board?.lists?.[listIdx].cards?.findIndex((c) => c.id === data.id));
    if (idx >= 0) {
      boardStore.board?.lists?.[listIdx].cards?.splice(idx, 1, data);
    }
    if (!isIsolatedUpdate) await addAct({ text: `updated **${data.text}**`, board_id: boardStore.board?.id });
    return data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return null;
  } finally {
    state.isLoading = false;
  }
}

// internal only - doesnt update boardStore.currentboard
async function deleteById(id: number) {
  try {
    state.isLoading = true;
    const { error } = await supabase.from('cards').delete().eq('id', id);
    if (error) throw error;

    return true;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return false;
  } finally {
    state.isLoading = false;
  }
}

async function del(card: Card): Promise<boolean> {
  try {
    state.isLoading = true;
    if (!deleteById(Number(card.id))) return false;

    const listIdx = Number(boardStore.board?.lists?.findIndex((l) => l.id === card.list_id));
    const idx = Number(boardStore.board?.lists?.[listIdx].cards?.findIndex((c) => c.id === card.id));
    if (idx >= 0) {
      boardStore.board?.lists?.[listIdx].cards?.splice(idx, 1);
    }
    await addAct({ text: `archived ${card.text}`, board_id: boardStore.board?.id });
    return true;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return false;
  } finally {
    state.isLoading = false;
  }
}

export { state as data, add, update, del };
