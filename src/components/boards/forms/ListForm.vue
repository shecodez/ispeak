<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl">{{ action }}</h1>
      <router-link :to="{ name: 'ViewBoard', params: { id: route.params.id } }">❌ cancel</router-link>
    </div>

    <AlertMessage v-if="error" type="error" :message="error" />

    <form class="flex flex-col gap-2" @submit.prevent @keydown.enter.prevent>
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
        <label>Publish Date</label>
        <input type="date" v-model="publish_date" />
      </div>

      <!-- <div class="form-group">
        <label>Gems</label>
        <input type="number" v-model="gems" :min="0" :max="9" />
      </div> -->
    </form>

    <div class="actions w-full flex items-center justify-end gap-2 capitalize mt-4">
      <button type="button" @click="submitForm" class="btn border">💾 {{ action }}</button>
      <InPlaceConfirmDelete v-if="isEdit" :onDelete="deleteList" css="inline-block" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import slugify from '@sindresorhus/slugify';
import { useToast } from 'vue-toastification';

import { Board, List } from '@/data/types/mock';
import { db } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import InPlaceConfirmDelete from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'ListForm',
  props: {
    routeParamsBoard: {
      type: Object as PropType<Board>,
    },
  },
  components: { AlertMessage, InPlaceConfirmDelete },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const {
      data: { board },
      getById,
    } = db.boards;
    const { data: store, add, update, del, sort } = db.lists;

    onMounted(async () => await getById(Number(route.params.id))); // get current board

    const form = reactive<List>({
      //position: 0,
      title: '',
      slug: '',
      description: '',
      publish_date: null,
      gems: 0,
    });

    const edit = computed(() => board?.lists?.find((l) => l.id === Number(route.params.listId)));

    const action = computed(() => (!!edit.value ? t('edit_list') : t('add_list')));

    function setFields() {
      if (!!edit.value) {
        const { title, slug, description, publish_date, gems } = edit.value;

        form.title = title;
        form.slug = slug;
        form.description = description;
        form.publish_date = publish_date;
        form.gems = gems;
      }
    }
    watch(
      () => edit.value,
      (list) => {
        if (list) setFields();
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
      form.title = '';
      form.slug = '';
      form.description = '';
      form.publish_date = null;
      form.gems = 0;
    }

    async function deleteList() {
      if (!!edit.value) {
        const success = await del(edit.value);
        if (success) {
          // TODO: re-position lists?
          router.push({ name: 'ViewBoard', params: { id: route.params.id } });
          toast.success(t('list_deleted'));
        }
      }
    }

    function isValid() {
      return !!form.title;
    }
    async function submitForm() {
      if (isValid()) {
        if (!!edit.value) {
          await update({ ...edit.value, ...form });
        } else {
          await add(board!, { ...form, position: board?.lists?.length });
        }
      }
      router.push({ name: 'ViewBoard', params: { id: route.params.id } });
      reset();
    }

    return { t, ...toRefs(store), ...toRefs(form), action, route, isEdit: !!edit.value, submitForm, deleteList };
  },
});
</script>
