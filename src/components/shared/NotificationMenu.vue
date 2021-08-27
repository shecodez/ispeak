<template>
  <Menu ref="menu" w="w-64 max-w-72">
    <template v-slot:activator>
      <div class="relative inline-flex">
        🔔<span class="sr-only">notifications</span>
        <span v-if="isNew" class="absolute right-0 flex h-3 w-3">
          <span class="absolute animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
        </span>
      </div>
    </template>
    <div v-if="!notifications.length" class="p-4">No new notifications</div>
    <template v-else v-for="note in notifications" :key="note.id">
      <MenuItem>
        <div @click="handleClickNotif(note.id)" class="p-2 text-base">
          {{ note.message }}
        </div>
      </MenuItem>
    </template>
  </Menu>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import FlagIcon from '@/components/ui/FlagIcon.vue';
import Menu from '@/components/ui/Menu.vue';
import MenuItem from '@/components/ui/MenuItem.vue';

export default defineComponent({
  components: { FlagIcon, Menu, MenuItem },
  name: 'NotificationMenu',
  setup() {
    const isNew = ref(false);

    const notifications = ref([]);
    // const getNotifications = () => {
    //   //console.log('get notifications');
    // };
    // onMounted(() => getNotifications());
    // TODO:  { isLoading, notifications, error } = useNotifications()

    const handleClickNotif = (notificationId: string) => {
      console.log('actions on notification', notificationId);
    };

    return { notifications, isNew, handleClickNotif };
  },
});
</script>
