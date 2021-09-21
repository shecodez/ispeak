<template>
  <Spinner v-if="isLoading" />
  <Layout v-if="title" :title="title">
    <template v-slot:header>
      <BoardHeader v-if="board" :board="board" />
    </template>

    <router-view :routeParamsBoard="board"></router-view>

    <n-tooltip trigger="hover" :show-arrow="false">
      <template #trigger>
        <n-button @click="drawer = true" circle size="large" color="#ffd700" class="fab">
          <template #icon>
            <n-icon><i-radix-icons-activity-log /></n-icon>
          </template>
        </n-button>
      </template>
      {{ t('activity') }}
    </n-tooltip>
  </Layout>

  <n-drawer v-model:show="drawer" :width="320" placement="right" :on-update:show="handleClose">
    <n-drawer-content :title="t('menu').toUpperCase()" closable body-style="background-color: #eee">
      <ActivityList />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable';

import { Board } from '@/data/types/mock';
import { db } from '@/use/db';
import Spinner from '@/components/ui/Spinner.vue';
import Layout from '@/layouts/Minimalist.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import BoardHeader from '@/components/boards/BoardIdHeader.vue';
import ActivityList from '@/components/boards/drawers/ActivityList.vue';

export default defineComponent({
  name: 'Board',
  components: {
    draggable,
    Spinner,
    Layout,
    AlertMessage,
    BoardHeader,
    ActivityList,
  },
  props: {
    routeParamsBoard: {
      type: Object as PropType<Board>,
    },
    id: {
      type: [String, Number], // router.params.id = boardId
    },
    listId: {
      type: [String, Number],
    },
    cardId: {
      type: [String, Number],
    },
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const { data: store, getById } = db.boards;

    const state = reactive({
      drawer: false,
    });

    onMounted(async () => await getById(Number(route.params.id)));
    watch(
      () => route.params.id,
      (id) => {
        if (id) getById(Number(id));
      }
      //{ immediate: true }
    );
    const title = computed(() => store.board?.title);

    function handleClose(show: boolean) {
      if (!show) {
        state.drawer = false;
      }
    }

    return { t, ...toRefs(store), ...toRefs(state), title, handleClose };
  },
});
</script>

<style scoped>
.fab {
  @apply fixed bottom-6 right-6 shadow;
}
</style>
