<template>
  <Modal :isOpen="showDialog" :title="t('add_board')" :onClose="onClose" :onAction="submitBoard">
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
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { Board } from '@/data/interfaces';
import Modal from '@/components/ui/Modal.vue';

export default defineComponent({
  name: 'NewBoardDialog',
  components: { Modal },
  props: {
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

    watch(
      () => state.title,
      (title) => {
        state.slug = title.toLowerCase().replaceAll(' ', '-');
      }
    );

    const submitBoard = () => {
      console.log('Submit Add Board', state);
      if (props.onClose) props.onClose();
    };

    return { ...toRefs(state), submitBoard, t };
  },
});
</script>
