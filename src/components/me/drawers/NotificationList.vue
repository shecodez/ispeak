<template>
  <aside class="flex flex-col gap-4 h-full">
    <!-- <n-input v-if="!listOnly" v-model:value="q" size="large" placeholder="Search notifications...">
      <template #prefix>
        <n-icon><i-uil-search /></n-icon>
      </template>
    </n-input> -->

    <div class="flex-1 flex flex-col gap-2">
      <h5 class="capitalize text-xs font-bold flex items-center gap-2 mb-2">
        <i-fa-solid-bell />
        {{ t('notifications') }}
      </h5>
      <p v-if="!notifications.length">{{ t('notification', notifications.length) }}</p>
      <template v-else v-for="notification in notifications" :key="notification.id">
        <div class="flex gap-2 items-start">
          <!-- <n-avatar size="small" class="flex-shrink-0">{{ notif.profiles?.username.charAt(0) }}</n-avatar> -->
          <div>
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.text }}</p>
            <small class="text-gray-400">{{ formatDate(notification.created_at) }}</small>
          </div>
        </div>
      </template>
    </div>

    <div v-if="!listOnly" class="flex">
      <button class="btn primary-green f-center gap-2 text-white w-full">
        <i-uiw-reload />
        {{ t('refresh') }}
      </button>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

//import { Notification } from '@/data/types/mock';
//import { db } from '@/use/db';
import { formatDateDistance } from '@/utils';

interface Notifications {
  id?: string | number;
  title: string;
  text: string;
  created_at: string;
}

export default defineComponent({
  name: 'NotificationList',
  props: {
    // notifications: {
    //   type: Array as PropType<Notification[]>,
    //   required: true,
    // },
    listOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { t, locale } = useI18n();

    //const { state: store, all, reload } = db.notifications;
    //onMounted(async () => await all());

    const state = reactive({
      q: '',
      notifications: [] as Notifications[],
      isLoading: false,
      error: null,
    });

    function formatDate(date: string, mock = false) {
      return formatDateDistance(date, locale.value, mock);
    }

    return { t, /*...toRefs(store),*/ ...toRefs(state), formatDate };
  },
});
</script>
