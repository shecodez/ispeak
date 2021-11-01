<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <Avatar v-model:path="avatar_url" @upload="updateAvatarUrl" />

    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="auth.userSession?.user?.email" disabled />
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
      <!-- <button class="button block" @click="signOut" :disabled="isLoading">Sign Out</button> -->
      <LogoutButton />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';

//import { store } from '@/store';
import { useAuth } from '@/use/auth';
import { db } from '@/use/db';
import Avatar from '@/components/shared/Avatar.vue';
import LogoutButton from '@/components/shared/LogoutButton.vue';

export default defineComponent({
  name: 'Profile',
  components: { Avatar, LogoutButton },
  setup() {
    const { state, getMe, update, updateAvatarUrl } = db.profiles;
    const { auth } = useAuth;

    const form = reactive({
      username: '',
      website: '',
      avatar_url: '',
    });

    const updateProfile = () => update({ ...form });

    onMounted(() => {
      getMe();
    });

    return { auth, ...toRefs(state), ...toRefs(form), updateProfile, updateAvatarUrl };
  },
});
</script>
