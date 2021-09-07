<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl">{{ action }}</h1>
    <router-link :to="{ name: 'ViewBoard', params: { id: route.params.id } }">❌ cancel</router-link>
  </div>

  <AlertMessage v-if="error" type="error" :message="error" />

  <form class="flex flex-col gap-2" @submit.prevent @keydown.enter.prevent>
    <div class="form-group flex items-center text-lg space-x-2">
      <b>🔒</b><Toggle v-model="is_public" /><b>🌎</b>
      <b>{{ is_public ? 'Public' : 'Private' }}</b>
    </div>

    <div class="form-group">
      <label>Title</label>
      <input v-focus type="text" v-model="title" />
    </div>

    <div class="form-group">
      <label>Slug</label>
      <input v-model="slug" readonly />
    </div>

    <div class="form-group">
      <label>Description <small>(Plain Text)</small></label>
      <textarea v-model="description" />
      <p class="text-xs">Rich Text Format for Description coming soon!</p>
    </div>

    <div class="form-group">
      <label>Lists</label>
      <div v-if="lists" class="grid grid-cols-3 gap-2 max-h-24 thin-scrollbar">
        <template v-for="(list, i) in lists" :key="list.id">
          <div
            @click="togglePublished(list, Number(i))"
            class="border p-2 rounded cursor-pointer flex justify-between"
            :class="list.publish_date ? (list.gems ? 'epic' : 'published') : 'draft'"
          >
            <p class="truncate">{{ list.title }}</p>
            <div v-if="list.gems" class="border inline-block right-0 px-1.5 bg-blue-500 bg-opacity-30 rounded-full">
              💎 <span class="font-semibold">{{ list.gems }}</span>
            </div>
            <div v-else class="font-semibold">✨ Free</div>
          </div>
        </template>
      </div>
      <div v-else class="italic">No lists found.</div>
      <div class="legend flex items-center space-x-2 text-xs py-1">
        <b>Legend:</b>
        <div class="draft" />
        <i>Draft</i>
        <div class="published" />
        <i>Published</i>
        <div class="epic" />
        <i>Epic</i>
      </div>
    </div>

    <!-- <div class="form-group">
        <label>Tags</label>
        <ChipInput v-model="tags" placeholder="Enter Tags" :maxChips="10" />
      </div> -->
  </form>

  <div class="actions w-full flex items-center justify-end gap-2 capitalize mt-4">
    <button type="button" @click="submitForm" class="btn border">💾 {{ action }}</button>
    <InPlaceConfirmDelete v-if="isEdit" :onDelete="deleteBoard" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import slugify from '@sindresorhus/slugify';

import { Board, List } from '@/data/types/mock';
import { useBoards } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';

import ChipInput from '@/components/ui/ChipInput.vue';
import Toggle from '@/components/ui/Toggle.vue';
import InPlaceConfirmDelete from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'BoardForm',
  components: { AlertMessage, ChipInput, Toggle, InPlaceConfirmDelete },
  setup(props) {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const { data, getById, add, update, del } = useBoards;

    onMounted(async () => await getById(Number(route.params.id))); // get current board

    const form = reactive<Board>({
      position: 0,
      title: '',
      slug: '',
      description: '',
      image_url: '',
      is_public: true,
      lists: [],
      //tags: []
      //members: []
    });

    const edit = computed(() => data.currentBoard);

    const action = computed(() => (!!edit.value ? t('edit_board') : t('add_board')));

    const isEdit = !!edit.value;

    function setFields() {
      if (!!edit.value) {
        const { position, title, slug, image_url, description, is_public, lists } = edit.value;

        form.position = position;
        form.title = title;
        form.slug = slug;
        form.image_url = image_url;
        form.description = description;
        form.is_public = is_public;
        form.lists = lists;
        //form.tags = tags
        //form.members = members
      }
    }
    watch(
      () => edit.value,
      (board) => {
        if (board) setFields();
      },
      { immediate: true }
    );

    watch(
      () => form.title,
      (title) => {
        form.slug = slugify(title);
      }
    );

    function reset() {
      form.position = 0;
      form.title = '';
      form.slug = '';
      form.description = '';
      form.is_public = true;
      form.lists = [];
      //form.tags = []
      //form.members = []
    }

    async function deleteBoard() {
      if (!!edit.value) await del(edit.value);
      router.push({ name: 'Boards ' });
    }

    function isValid() {
      return !!form.title;
    }
    async function submitForm() {
      if (isValid()) {
        if (!!edit.value) {
          await update({ ...edit.value, ...form });
        } else {
          await add(form);
        }
      }
      reset();
    }

    function togglePublished(list: List, index: number) {
      form.lists?.splice(index, 1, { ...list, publish_date: list.publish_date ? null : Date.now().toString() });
    }

    function setGemCost(list: List, gems: number) {
      const idx = form.lists?.findIndex((l) => l.id === list.id) || -1;
      if (idx >= 0) {
        form.lists?.splice(idx, 1, { ...list, gems });
      }
    }

    return { t, ...toRefs(form), togglePublished, action, route, isEdit, submitForm, deleteBoard };
  },
});
</script>

<style scoped>
.legend > .draft,
.legend > .epic,
.legend > .published {
  @apply w-3 h-3;
}

.draft {
  @apply border-white bg-gray-300 bg-opacity-30;
}

.epic {
  @apply border-indigo-500 bg-indigo-300 bg-opacity-30;
}

.published {
  @apply border-green-500 bg-green-300 bg-opacity-30;
}
</style>
