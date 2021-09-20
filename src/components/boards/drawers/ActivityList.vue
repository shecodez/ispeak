<template>
  <aside class="flex flex-col gap-4 h-full">
    <!-- <n-input v-if="!listOnly" v-model:value="q" size="large" placeholder="Search activities...">
      <template #prefix>
        <n-icon><i-uil-search /></n-icon>
      </template>
    </n-input> -->

    <div class="flex-1 flex flex-col gap-2">
      <h5 class="capitalize text-xs font-bold flex items-center gap-2 mb-2">
        <i-radix-icons-activity-log />
        {{ t('activity') }}
      </h5>
      <p v-if="!activity.length">{{ t('activity', activity.length) }}</p>
      <template v-else v-for="act in activity" :key="act.id">
        <div class="flex gap-2 items-start">
          <n-avatar size="small" class="flex-shrink-0">{{ act.profiles?.username.charAt(0) }}</n-avatar>
          <div>
            <p>
              <b>{{ act.profiles?.username }}</b>
              {{ act.text }}
            </p>
            <small class="text-gray-400">{{ formatDate(act.created_at) }}</small>
          </div>
        </div>
      </template>
    </div>

    <div v-if="!listOnly" class="flex">
      <ConfirmDeleteInline :onDelete="deleteBoard" :label="t('delete_board')" btnCss="primary-red text-white w-full" />
    </div>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import { Activity } from '@/data/types/mock';
import { db } from '@/use/db';
import { formatDateDistance } from '@/utils';
import ConfirmDeleteInline from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'ActivityList',
  components: { ConfirmDeleteInline },
  props: {
    // activity: {
    //   type: Array as PropType<Activity[]>,
    //   required: true,
    // },
    listOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { t, locale } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const { deleteById } = db.boards;
    const { state: store, allByBoardId } = db.activity; //TODO: add markdown parser for activity.text

    onMounted(async () => await allByBoardId(Number(route.params.id)));
    watch(
      () => route.params.id,
      (boardId) => {
        if (route) allByBoardId(Number(boardId));
      },
      { immediate: true }
    );

    const state = reactive({
      q: '',
      isLoading: false,
      error: null,
      isDeleting: false,
    });

    async function deleteBoard() {
      const success = await deleteById(Number(route.params.id));
      if (success) {
        toast.success(t('board_deleted'));
        router.push({ name: 'Boards ' });
      }
    }

    function formatDate(date: string, mock = false) {
      return formatDateDistance(date, locale.value, mock);
    }

    return { t, ...toRefs(store), ...toRefs(state), deleteBoard, formatDate };
  },
});
</script>
