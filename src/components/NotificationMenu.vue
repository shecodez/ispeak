<template>
  <Menu ref="menu" w="w-64 max-w-72">
    <template v-slot:activator> 🔔<span class="sr-only">notifications</span></template>
    <div v-if="!notifications.length" class="p-4">No new notifications</div>
    <template v-else v-for="notif in notifications" :key="notif.id">
      <MenuItem>
        <div @click="handleClickNotif(notif.id)" class="p-2 text-base">
          {{ notif.message }}
        </div>
      </MenuItem>
    </template>
  </Menu>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import FlagIcon from './FlagIcon.vue';
import Menu from '@/components/shared/Menu.vue';
import MenuItem from '@/components/shared/MenuItem.vue';
import { useAuthState } from '../firebase';

export default defineComponent({
  components: { FlagIcon, Menu, MenuItem },
  name: 'NotificationMenu',
  setup() {
    const { isLoggedIn } = useAuthState();

    const notifications = ref([]);
    const getNotifications = () => {
      // notifications.value.push(getGeneralNotifications())
      if (isLoggedIn) {
        // notifications.value.push(userNotifications())
      }
      console.log('get notifications');
    };
    onMounted(() => getNotifications());
    // TODO:  { isLoading, notifications, error } = useNotifications()

    const handleClickNotif = (notificationId: string) => {
      console.log('actions on notification', notificationId);
    };

    return { notifications, handleClickNotif };
  },
});
</script>
