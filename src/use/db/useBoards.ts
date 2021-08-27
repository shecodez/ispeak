import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

import { Board } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';

const toast = useToast();

type State = {
  isLoading: boolean;
  boards: Board[];
  count: number;
  currentBoard: null | Board;
  error: null | Error;
};

const state = reactive<State>({
  isLoading: false,
  boards: [],
  count: 0,
  currentBoard: null,
  error: null,
});

// all - public boards for (/sagas) //TODO: replace this when rls is added to all()
async function allPublic(page = 1, limit = 10) {
  const startIdx = page * limit - limit;
  const endIdx = page * limit - 1;

  try {
    state.isLoading = true;
    // 1) get total count of boards
    const { count } = await supabase.from('boards').select('*', { count: 'exact', head: true }).eq('is_public', true);
    // 2) get limit data of boards
    const { data: boards, error } = await supabase
      .from('boards')
      .select('*')
      .range(startIdx, endIdx)
      .order('position')
      .eq('is_public', true);
    if (error) throw error;
    if (boards === null) return (state.boards = []);

    state.boards = boards;
    state.count = Number(count);
  } catch (e) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

// TODO: row lv security - return data if board.is_public || board.user_id = auth.user
async function all() {
  try {
    state.isLoading = true;
    const { data: boards, error, count } = await supabase.from('boards').select('*').order('position');
    if (error) throw error;
    if (boards === null) return (state.boards = []);

    state.boards = boards;
    state.count = Number(count);
  } catch (e) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

// TODO: rls return data if board.is_public && list.publish_date <= now || board.user_id = auth.user
// select * from lists l where TIMESTAMP(l.publish_date) <= NOW() ??
async function getById(id: number) {
  try {
    state.isLoading = true;
    const { data: board, error } = await supabase
      .from('boards')
      .select(
        'id, title, lists ( id, position, title, slug, description, publish_date, gems, cards ( id, position, text, details, label, color, text_color ))'
      )
      .eq('id', id)
      .order('position')
      .order('position', { foreignTable: 'lists' })
      .order('position', { foreignTable: 'lists.cards' })
      .single();
    if (error) throw error;

    state.currentBoard = board;
  } catch (e) {
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
    return data; // TODO: is return needed?
  } catch (e) {
    state.error = e.error_description || e.message;
    return null; // TODO: is return needed?
  } finally {
    state.isLoading = false;
  }
}

// rlc can only edit owner boards
async function update(board: Board): Promise<null | Board> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase
      .from('boards')
      .update({
        title: board.title,
        slug: board.slug,
        image_url: board.image_url,
        description: board.description,
        is_public: board.is_public,
      })
      .match({ id: board.id });
    //.eq('id', board.id).single();
    if (error) throw error;

    const data: Board = body ? { ...body[0] } : null;
    const idx = state.boards.findIndex((b) => b.id === data.id);
    state.boards.splice(idx, 1, { ...state.boards[idx], ...data });
    if (state.currentBoard?.id === board.id) state.currentBoard = { ...state.currentBoard, ...data };
    return data; // TODO: is return needed?
  } catch (e) {
    state.error = e.error_description || e.message;
    return null; // TODO: is return needed?
  } finally {
    state.isLoading = false;
  }
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
  } catch (e) {
    state.error = e.error_description || e.message;
    return false; // TODO: is return needed?
  } finally {
    //state.isLoading = false;
  }
}

async function del(board: Board) {
  try {
    state.isLoading = true;
    await supabase.from('boards').delete().eq('id', board.id);

    const idx = state.boards.findIndex((b) => b.id === board.id);
    state.boards.splice(idx, 1);
    toast.success('Board deleted.');
    if (state.currentBoard?.id === board.id) state.currentBoard = null;
  } catch (e) {
    toast.error('Error deleting Board');
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

export { state as data, all, allPublic, getById, add, update, sort, del };
