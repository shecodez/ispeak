import { reactive } from 'vue';

import { Profile } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';

type State = {
  isLoading: boolean;
  profile: null | Profile;
  error: null | Error;
};

const state = reactive<State>({
  isLoading: false,
  profile: null,
  error: null,
});

async function getById(id: string | undefined, query = '*') {
  try {
    state.isLoading = true;
    const { data, error } = await supabase.from('profiles').select(query).eq('id', id).single();
    if (error) throw error;

    state.profile = data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

async function getMe(query = '*') {
  await getById(supabase.auth.user()?.id, query);
}

async function update(profile: Profile): Promise<null | Profile> {
  try {
    state.isLoading = true;
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      })
      .eq('id', profile.id)
      .single();
    if (error) throw error;

    state.profile = data;
    return data;
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return null;
  } finally {
    state.isLoading = false;
  }
}

async function updateUsername(username: string) {
  const profile = state.profile;
  await update({ ...profile, username });
}

async function updateAvatarUrl(avatar_url: string) {
  const profile = state.profile;
  await update({ ...profile, avatar_url });
}

async function deleteById(id: string | undefined) {
  if (!id) return false;
  try {
    state.isLoading = true;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;

    if (state.profile?.id === id) state.profile = null;
    return true; //toast.success('Profile deleted.');
  } catch (e: any) {
    state.error = e.error_description || e.message;
    return false; //toast.error('Error deleting Profile');
  } finally {
    state.isLoading = false;
  }
}

async function del(profile: Profile): Promise<boolean> {
  return await deleteById(profile.id);
}

export { state, getById, getMe, update, updateUsername, updateAvatarUrl, del };
