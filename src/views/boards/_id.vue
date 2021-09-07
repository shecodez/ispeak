<template>
  <Layout>
    <template v-slot:header>
      <BoardHeader v-if="currentBoard" :board="currentBoard" />
    </template>

    <router-view />

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
    <n-drawer-content title="Activity Log" closable body-style="background-color: #eee">
      <ActivityList />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable';

import { useBoards } from '@/use/db';
import Layout from '@/layouts/Minimalist.vue';
//import AlertMessage from '@/components/shared/AlertMessage.vue';
import BoardHeader from '@/components/boards/BoardIdHeader.vue';
import ActivityList from '@/components/boards/drawers/ActivityList.vue';

export default defineComponent({
  name: 'Board',
  components: {
    draggable,
    Layout,
    BoardHeader,
    ActivityList,
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const { data, getById } = useBoards;
    onMounted(async () => await getById(Number(route.params.id)));
    watch(
      () => route.params.id,
      (id) => {
        if (id) getById(Number(id));
      }
      //{ immediate: true }
    );
    //const board = computed(() => data.currentBoard)

    const state = reactive({
      drawer: false,
    });

    function handleClose(show: boolean) {
      if (!show) {
        state.drawer = false;
      }
    }

    return { t, ...toRefs(data), ...toRefs(state), handleClose };
  },
});
</script>

<style scoped>
.fab {
  @apply fixed bottom-6 right-6 shadow;
}
</style>
