<template>
  <!-- <h1 class="text-4xl">Saga {{ $route.params.id }}</h1> -->
  <FixedFrame>
    <Spinner v-if="isLoading" />
    <aside v-if="story" class="toolbar px-3 pt-4.5 pb-1 flex justify-between">
      <div class="flex items-center gap-2">
        <button class="scale-up-btn">💗</button>
        <h2 class="text-xl font-bold">{{ story.title }}</h2>
      </div>

      <div class="flex items-center gap-2">
        <!-- <label class="text-sm font-semibold mr-2">view as:</label>
        <select @change="setMe($event)" class="text-black">
          <template v-for="member in story.members" :key="member">
            <option :value="member">{{ member }}</option>
          </template>
          <option value="">none</option>
        </select> -->
        <select v-if="!isLoading && list" class="text-black" :value="list.id">
          <template v-for="list in story?.lists" :key="list.id">
            <option :value="list.id">{{ list.title }}</option>
          </template>
        </select>
        <button class="scale-up-btn">📥</button>
      </div>
    </aside>

    <AlertMessage v-if="error" type="error" :message="error" />
    <template v-else>
      <div class="px-3 flex-1 thin-scrollbar">
        <div class="flex gap-5">
          <h1 class="text-2xl">{{ list?.title }}</h1>
          <!-- <IconGroup :items="members" /> -->
        </div>

        <p class="pb-4">{{ story?.description }}</p>

        <div v-if="list?.cards?.length" class="flex-1 flex flex-col gap-4 overflow-y-auto thin-scrollbar">
          <template v-for="card in list.cards" :key="card.id">
            <div
              class="card-container relative"
              :class="!pov || !card.assigned_to ? 'mx-auto' : pov === card.assigned_to ? 'ml-auto' : 'mr-auto'"
            >
              <CardRO :card="card" />
            </div>
          </template>
        </div>
      </div>

      <Pagination :page="page" :itemsPerPage="limit" :totalItems="story?.lists?.length" @pagechange="onPageChange" />
    </template>
  </FixedFrame>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useTitle } from '@vueuse/core';

import { useBoards } from '@/use/db';
import FixedFrame from '@/components/layouts/FixedFrame.vue';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import Pagination from '@/components/ui/Pagination.vue';
import Menu from '@/components/ui/Menu.vue';
import IconGroup from '@/components/ui/IconGroup.vue';
import CardRO from '@/components/story/CardRO.vue';

export default defineComponent({
  name: 'StoryBoard',
  components: { FixedFrame, Spinner, AlertMessage, Pagination, Menu, IconGroup, CardRO },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const { data, getById } = useBoards;

    onMounted(async () => await getById(Number(route.params.id)));

    const filters = reactive({
      search: '',
      page: Number(route.query.page) || 1,
      limit: 1,
    });

    const story = computed(() => data.currentBoard);
    const list = computed(() => data.currentBoard?.lists?.[filters.page - 1]);

    const title = computed(() => `${list.value?.title} ${story.value?.title} · 🎬 ${import.meta.env.VITE_APP_NAME}`);
    useTitle(title);

    const pov = ref('');
    const setPov = (evt: any) => {
      pov.value = evt.target.value;
    };

    const onPageChange = (page: number) => {
      router.push({ query: { page } });
      filters.page = page;
    };

    return {
      t,
      ...toRefs(filters),
      story,
      list,
      ...toRefs(data),
      onPageChange,
      pov,
    };
  },
});
</script>

<style scoped>
.card-container {
  max-width: 80%;
  min-width: 8rem;
}
</style>
