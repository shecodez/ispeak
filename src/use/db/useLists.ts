import { reactive } from 'vue';

import { Board, List } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';
import { data as boardStore } from './useBoards';
import { add as addAct } from '@/use/db/useActivity';

type State = {
  isLoading: boolean;
  //list: List | null;
  error: null | Error;
};

const state = reactive<State>({
  isLoading: false,
  //list: null,
  error: null,
});

async function getById(id: number, query = '*'): Promise<null | List> {
  try {
    state.isLoading = true;
    const { data, error } = await supabase.from('lists').select(query).eq('id', id).single();
    if (error) throw error;

    //state.list = data;
    return data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return null;
  } finally {
    state.isLoading = false;
  }
}

async function add(board: Board, list: List): Promise<null | List> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase.from('lists').insert({ ...list, board_id: board.id });
    if (error) throw error;

    const data: List = body ? { ...body[0], cards: [] } : null;
    boardStore.board?.lists?.push(data);
    await addAct({ text: `added **${list.title}** to board`, board_id: list.board_id });

    return data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return null;
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
        //subtitle: list.subtitle,
        //image_url: list.image_url,
        //image_by: list.image_by,
        description: list.description,
        publish_date: list.publish_date,
      })
      .match({ id: list.id });
    //.eq('id', list.id).single();
    if (error) throw error;

    const data: List = body ? { ...body[0] } : null;
    const idx = Number(boardStore.board?.lists?.findIndex((l) => l.id === data.id));
    if (idx >= 0) {
      boardStore.board?.lists?.splice(idx, 1, { ...boardStore.board?.lists[idx], ...data });
    }
    await addAct({ text: `updated list ${list.title}`, board_id: list.board_id });
    return data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return null;
  } finally {
    state.isLoading = false;
  }
}

async function updateTitle(list: List, title: string) {
  await update({ ...list, title });
  await addAct({ text: `renamed list to **${title}** (from ${list.title})`, board_id: list.board_id });
}

async function updatePublishDate(list: List, publish_date: string | null) {
  await update({ ...list, publish_date });
  const message = !!publish_date ? 'published' : 'draft';
  await addAct({ text: `changed status of ${list.title} to **${message}**`, board_id: list.board_id });
}

async function updateBackground(list: List, image_url: string) {
  await update({ ...list, image_url });
  await addAct({ text: `updated ${list.title} background image`, board_id: list.board_id });
}

/**
 * Update the List's Cards positions (rpc = boardStored procedure)
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
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return false; // TODO: is return needed?
  } finally {
    //state.isLoading = false;
  }
}

async function deleteById(id: number) {
  try {
    state.isLoading = true;
    const { error } = await supabase.from('lists').delete().eq('id', id);
    if (error) throw error;

    const idx = Number(boardStore.board?.lists?.findIndex((l) => l.id === id));
    if (idx >= 0) {
      boardStore.board?.lists?.splice(idx, 1);
    }
    return true; //toast.success('List deleted.');
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return false; //toast.error('Error deleting list');
  } finally {
    state.isLoading = false;
  }
}

async function del(list: List): Promise<boolean> {
  const success = await deleteById(Number(list.id));
  if (success) await addAct({ text: `archived ${list.title}`, board_id: list.board_id });
  return success;
}

export { state as data, getById, add, update, updateTitle, updatePublishDate, updateBackground, sort, deleteById, del };

// TODO: await addAct({ text:`moved **${card.text}** from ${list.title} to ${list.title}`, board_id: route.params.id })`
