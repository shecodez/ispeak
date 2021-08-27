<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <Avatar v-model:path="avatar_url" @upload="updateProfile" />

    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="store.user?.email" disabled />
    </div>

    <div>
      <label for="username">Name</label>
      <input id="username" type="text" v-model="username" />
    </div>

    <div>
      <label for="website">Website</label>
      <input id="website" type="website" v-model="website" />
    </div>

    <div>
      <input
        type="submit"
        class="button block primary"
        :value="isLoading ? 'Loading ...' : 'Update'"
        :disabled="isLoading"
      />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="isLoading">Sign Out</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';

import { store } from '@/store';
import { supabase } from '@/supabase';
import Avatar from '@/components/shared/Avatar.vue';

export default defineComponent({
  name: 'Profile',
  components: { Avatar },
  setup() {
    const state = reactive({
      isLoading: false,
      username: '',
      website: '',
      avatar_url: '',
    });

    async function getProfile() {
      try {
        state.isLoading = true;
        store.user = supabase.auth.user();

        let { data, error, status } = await supabase
          .from('profiles')
          .select(`username, website, avatar_url`)
          .eq('id', store.user?.id)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          state.username = data.username;
          state.website = data.website;
          state.avatar_url = data.avatar_url;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        state.isLoading = false;
      }
    }

    onMounted(() => {
      getProfile();
    });

    async function updateProfile() {
      try {
        state.isLoading = true;
        store.user = supabase.auth.user();

        const updates = {
          id: store.user?.id,
          username: state.username,
          website: state.website,
          avatar_url: state.avatar_url,
          updated_at: new Date(),
        };

        let { error } = await supabase.from('profiles').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        });

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        state.isLoading = false;
      }
    }

    async function signOut() {
      try {
        state.isLoading = true;
        let { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        state.isLoading = false;
      }
    }

    return { store, ...toRefs(state), getProfile, updateProfile, signOut };
  },
});
</script>
