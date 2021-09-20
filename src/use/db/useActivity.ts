import { reactive } from 'vue';

import { Activity } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';

type State = {
  isLoading: boolean;
  activity: Activity[];
  count: number;
  act: null | Activity;
  error: null | Error;
};

const state = reactive<State>({
  isLoading: false,
  act: null,
  activity: [],
  count: 0,
  error: null,
});

async function allByBoardId(boardId: number, page = 1, limit = 10) {
  const startIdx = page * limit - limit;
  const endIdx = page * limit - 1;

  try {
    state.isLoading = true;
    const { count } = await supabase
      .from('activity')
      .select('*', { count: 'exact', head: true })
      .eq('board_id', boardId);
    const { data, error } = await supabase
      .from('activity')
      .select('id text created_at profiles ( username, avatar_url )')
      .range(startIdx, endIdx)
      .order('created_at')
      .eq('board_id', boardId);
    if (error) throw error;
    if (data === null) return (state.activity = []);

    state.activity = data;
    state.count = Number(count);
  } catch (e: any) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

async function getById(id: number) {
  try {
    state.isLoading = true;
    const { data, error } = await supabase
      .from('activity')
      .select('id text created_at profiles ( username, avatar_url )')
      .eq('id', id)
      .single();
    if (error) throw error;

    state.act = data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

// TODO: this most def needs to be realtime
async function add(act: Activity): Promise<null | Activity> {
  try {
    state.isLoading = true;
    const { body, error } = await supabase.from('activity').insert(act);
    if (error) throw error;

    const data: Activity = body ? { ...body[0] } : null;
    state.activity.push(data);
    return data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return null;
  } finally {
    state.isLoading = false;
  }
}

export { state, allByBoardId, getById, add };
