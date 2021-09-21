import { reactive } from 'vue';

import { Board } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';
import { add as addAct } from '@/use/db/useActivity';

type State = {
  isLoading: boolean;
  boards: Board[];
  count: number;
  board: null | Board;
  error: null | Error;
};

const state = reactive<State>({
  isLoading: false,
  board: null,
  boards: [],
  count: 0,
  error: null,
});

async function all(query = '*', page = 1, limit = 10) {
  const startIdx = page * limit - limit;
  const endIdx = page * limit - 1;

  try {
    state.isLoading = true;
    // 1) get total count of boards
    const { count } = await supabase.from('boards').select('*', { count: 'exact', head: true }); //.eq('deleted_at', null);
    // 2) get limit data of boards
    const { data, error } = await supabase
      .from('boards')
      .select(query)
      .range(startIdx, endIdx)
      .order('updated_at', { ascending: false });
    //.eq('deleted_at', null);
    if (error) throw error;
    if (data === null) return (state.boards = []);

    state.boards = data;
    state.count = Number(count);
  } catch (e: any) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

async function allByUserId(userId: string | undefined, query = '*', page = 1, limit = 25) {
  if (!userId) return;
  const startIdx = page * limit - limit;
  const endIdx = page * limit - 1;

  try {
    state.isLoading = true;
    const { count } = await supabase.from('boards').select('*', { count: 'exact', head: true }).eq('user_id', userId); //.eq('deleted_at', null);
    const { data, error } = await supabase
      .from('boards')
      .select(query)
      .range(startIdx, endIdx)
      .order('updated_at', { ascending: false })
      .eq('user_id', userId);
    if (error) throw error;
    if (data === null) return (state.boards = []);

    state.boards = data;
    state.count = Number(count);
  } catch (e: any) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

async function allMyBoards(query = '*', page = 1, limit = 25) {
  await allByUserId(supabase.auth.user()?.id, query, page, limit);
}

async function getById(
  id: number,
  query = `id, title, slug, image_url, description, is_public, updated_at, profiles:user_id ( username ),  
  lists ( id, position, title, subtitle, slug, image_url, image_by, description, publish_date, board_id, 
    cards ( id, position, text, details, label, color, text_color, list_id )
  )`
) {
  try {
    state.isLoading = true;
    const { data, error } = await supabase
      .from('boards')
      .select(query)
      .eq('id', id)
      .order('position')
      .order('position', { foreignTable: 'lists' })
      .order('position', { foreignTable: 'lists.cards' })
      .single();
    if (error) throw error;

    state.board = data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

async function add(board: Board): Promise<null | Board> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase.from('boards').insert(board);
    if (error) throw error;

    const data: Board = body ? { ...body[0], lists: [] } : null;
    state.boards.push(data);
    await addAct({ text: `created board named **${data.title}**`, board_id: data.id });
    return data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return null;
  } finally {
    state.isLoading = false;
  }
}

async function update(board: Board, isIsolatedUpdate = false): Promise<null | Board> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase
      .from('boards')
      .update({
        title: board.title,
        slug: board.slug,
        //subtitle: board.subtitle,
        image_url: board.image_url,
        //image_by: board.image_by,
        //excerpt: board.excerpt,
        description: board.description,
        is_public: board.is_public,
      })
      .match({ id: board.id });
    //.eq('id', board.id).single();
    if (error) throw error;

    const data: Board = body ? { ...body[0] } : null;
    const idx = state.boards.findIndex((b) => b.id === data.id);
    state.boards.splice(idx, 1, { ...state.boards[idx], ...data });
    if (state.board?.id === board.id) state.board = { ...state.board, ...data };
    if (!isIsolatedUpdate) await addAct({ text: `updated this board`, board_id: board.id });
    return data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return null;
  } finally {
    state.isLoading = false;
  }
}

async function updateTitle(board: Board, title: string) {
  await update({ ...board, title }, true);
  await addAct({ text: `renamed board to **${title}** (from ${board.title})`, board_id: board.id });
}

async function updateVisibility(board: Board, is_public: boolean) {
  await update({ ...board, is_public }, true);
  const message = is_public ? 'visible to the public' : 'visible to its members only';
  await addAct({ text: `changed board to **${message}**`, board_id: board.id });
}

async function updateBackground(board: Board, image_url: string) {
  await update({ ...board, image_url }, true);
  await addAct({ text: `updated board background image`, board_id: board.id });
}

/**
 * Update the Board's Lists positions (rpc = stored procedure)
 * @param board
 * @returns boolean or error
 */
async function sort(board: Board) {
  if (!board.lists?.length) return;

  try {
    //state.isLoading = true;
    const { data, error } = await supabase.rpc('sort_board', {
      board_id: board.id,
      list_ids: board.lists?.map((list) => list.id),
    });
    if (error) throw error;

    return data;
    // update state?
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return false;
  } finally {
    //state.isLoading = false;
  }
}

async function deleteById(id: number, isInternalUse = false) {
  try {
    state.isLoading = true;
    const { error } = await supabase.from('boards').delete().eq('id', id);
    if (error) throw error;

    const idx = state.boards.findIndex((b) => b.id === id);
    state.boards.splice(idx, 1);
    if (state.board?.id === id) state.board = null;
    //if (!isInternalUse) await addAct({ text: `archived board_id:${id}`, board_id: id });
    return true; //toast.success('Board deleted.');
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return false; //toast.error('Error deleting Board');
  } finally {
    state.isLoading = false;
  }
}

async function del(board: Board): Promise<boolean> {
  const success = await deleteById(Number(board.id), true);
  //if (success) await addAct({ text: `archived **${board.title}**`, board_id: board.id });
  return success;
}

export {
  state as data,
  all,
  allByUserId,
  allMyBoards,
  getById,
  add,
  update,
  updateTitle,
  updateVisibility,
  updateBackground,
  sort,
  deleteById,
  del,
};
