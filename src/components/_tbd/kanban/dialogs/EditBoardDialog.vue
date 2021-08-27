<template>
  <Modal :isOpen="showDialog" :title="t('edit_board')" :onClose="onClose">
    <form>
      <div class="form-group">
        <label>Title</label>
        <input v-model="title" />
      </div>

      <div class="form-group">
        <label>Slug</label>
        <input v-model="slug" readonly />
      </div>

      <div class="form-group">
        <label>Description <small>(Plain Text)</small></label>
        <textarea v-model="description" />
        <p class="text-xs">Rich Text Format Description coming soon!</p>
      </div>

      <div class="form-group flex items-center text-lg space-x-2">
        <b>✖️</b><Toggle v-model="isPublished" /><b>✔️</b>
        <b>{{ isPublished ? 'Published' : 'Draft' }}</b>
      </div>

      <div class="form-group flex items-center text-lg space-x-2">
        <b>🈂️</b><Toggle v-model="isEpic" color="bg-indigo-500" /><b>💎</b>
        <b>{{ isEpic ? 'Epic' : 'Freebie' }}</b>
      </div>
    </form>

    <template v-slot:footer>
      <div class="w-full flex space-x-1 items-center justify-end">
        <button class="btn bg-indigo-300" @click="submitBoard">Update Board</button>
        <ConfirmDeleteInline :onDelete="deleteBoard" />
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { Board } from '@/data/interfaces';
import Modal from '@/components/ui/Modal.vue';
import ConfirmDeleteInline from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'EditBoardDialog',
  components: { Modal, ConfirmDeleteInline },
  props: {
    edit: {
      type: Object as PropType<Board>,
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const state = reactive<Board>({
      id: '',
      title: '',
      slug: '',
      description: '',
      isPublished: false,
      isEpic: false,
      notes: [],
      kanbanId: '',
    });

    const setFields = () => {
      if (props.edit) {
        const { title, slug, description, isPublished, isEpic, notes, kanbanId } = props.edit;
        state.title = title;
        state.slug = slug;
        state.description = description;
        state.isPublished = isPublished;
        state.isEpic = isEpic;
        state.notes = notes;
        state.kanbanId = kanbanId;
      }
    };
    watch(
      () => props.edit,
      (board) => {
        if (board) setFields();
      }
    );

    watch(
      () => state.title,
      (title) => {
        state.slug = title.toLowerCase().replaceAll(' ', '-');
      }
    );

    const submitBoard = () => {
      console.log('Submit Updated Board', state);
      if (props.onClose) props.onClose();
    };

    const deleteBoard = () => {
      console.log('Delete Board', props.edit);
    };

    return { ...toRefs(state), submitBoard, deleteBoard, t };
  },
});
</script>

<style scoped>
.form-group {
  @apply my-2;
}
label {
  @apply block text-xs font-semibold;
}
input,
textarea {
  @apply bg-transparent w-full border rounded p-2;
}
</style>
