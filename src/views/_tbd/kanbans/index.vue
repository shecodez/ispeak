<template>
  <FixedFrame>
    <aside class="toolbar flex items-center justify-between py-3 px-4">
      <h1 class="text-2xl">📋 {{ t('my_kanbans') }}</h1>
      <button class="btn bg-green-500 ml-auto" @click="addKanban">➕ {{ t('add_kanban') }}</button>
    </aside>

    <Spinner v-if="isLoading" />
    <AlertMessage v-else-if="error" type="error" :message="error" />
    <template v-else>
      <div class="px-4 flex-1 thin-scrollbar">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-if="kanbans?.length === 0">No Kanbans yet...</div>
          <template v-else v-for="kanban in kanbans" :key="kanban.id">
            <div class="p-4 border rounded">
              <router-link :to="{ name: 'Kanban', params: { id: kanban.id } }">
                {{ kanban.title }}
              </router-link>
            </div>
          </template>
        </div>
      </div>
      <Pagination />
    </template>

    <!-- TODO: add showBottomFrame to FixedFrame to make button visible -->
    <template v-slot:bottom>
      <button class="bg-red-500 rounded-tl-3xl h-full w-16">
        <Tooltip :text="t('delete_kanban')" placement="left">🗑️</Tooltip>
        <span class="sr-only">Delete Drag&Drop Kanban</span>
      </button>
    </template>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
//import { useToast } from 'vue-toastification';

import useApi from '@/use/api';
import FixedFrame from '@/components/layouts/FixedFrame.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Pagination from '@/components/ui/Pagination.vue';

export default defineComponent({
  name: 'Kanbans',
  components: { FixedFrame, Tooltip, Spinner, AlertMessage, Pagination },
  setup() {
    const { t } = useI18n();

    const router = useRouter();
    //const toast = useToast();

    const { data: kanbans, isLoading, error, get, post } = useApi('/kanbans');

    onMounted(() => get());

    const addKanban = async () => {
      const id = Date.now();
      const payload = { id, title: t('untitled'), description: '', boards: [], members: [], tags: [] };

      try {
        await post(payload);
        //toast.success('New Kanban created!', { timeout: 4000 });
        router.push(`/kanbans/${id}`);
      } catch (err) {
        console.log(err);
      }
    };

    return { kanbans, addKanban, isLoading, error, t };
  },
});
</script>
