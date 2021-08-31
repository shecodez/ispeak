<template>
  <Modal :isOpen="showDialog" :title="action" :onClose="onClose">
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

    <template v-slot:footer>
      <div class="actions w-full flex items-center justify-end gap-2 capitalize">
        <button type="button" @click="submitForm" class="btn border">💾 {{ action }}</button>
        <InPlaceConfirmDelete v-if="edit" :onDelete="delEdit" />
        <button v-else type="button" @click="onClose">❌ cancel</button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import slugify from '@sindresorhus/slugify';

import { Board, List } from '@/data/types/mock';
import Modal from '@/components/ui/Modal.vue';
import ChipInput from '@/components/ui/ChipInput.vue';
import Toggle from '@/components/ui/Toggle.vue';
import InPlaceConfirmDelete from '@/components/ui/ConfirmDeleteInline.vue';
import Badge from '@/components/ui/Badge.vue';

export default defineComponent({
  name: 'BoardForm',
  components: { Modal, ChipInput, Toggle, InPlaceConfirmDelete, Badge },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
    onDelete: {
      type: Function,
    },
    action: {
      type: String,
      default: 'submit',
    },
    edit: {
      type: Object as PropType<Board>,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const state = reactive<Board>({
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

    function setFields() {
      if (props.edit) {
        const { position, title, slug, image_url, description, is_public, lists } = props.edit;

        state.position = position;
        state.title = title;
        state.slug = slug;
        state.image_url = image_url;
        state.description = description;
        state.is_public = is_public;
        state.lists = lists;
        //state.tags = tags
        //state.members = members
      }
    }
    watch(
      () => props.edit,
      (board) => {
        if (board) setFields();
      },
      { immediate: true }
    );

    watch(
      () => state.title,
      (title) => {
        state.slug = slugify(title);
      }
    );

    function reset() {
      state.position = 0;
      state.title = '';
      state.slug = '';
      state.description = '';
      state.is_public = true;
      state.lists = [];
      //state.tags = []
      //state.members = []
    }

    function isValid() {
      return !!state.title;
    }
    function submitForm() {
      if (isValid()) {
        //emit('submission', state);
        props.onSubmit(state);
      }
      props.onClose();
      reset();
    }

    function delEdit() {
      if (props.edit && props.onDelete) {
        props.onDelete(props.edit);
        props.onClose();
      }
    }

    function togglePublished(list: List, index: number) {
      state.lists?.splice(index, 1, { ...list, publish_date: list.publish_date ? null : Date.now().toString() });
    }

    function setGemCost(list: List, gems: number) {
      const idx = state.lists?.findIndex((l) => l.id === list.id) || -1;
      if (idx >= 0) {
        state.lists?.splice(idx, 1, { ...list, gems });
      }
    }

    return { t, ...toRefs(state), togglePublished, submitForm, delEdit };
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
