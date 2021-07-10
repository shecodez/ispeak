<template>
  <Modal :isOpen="showDialog" :title="t('edit_board')" :onClose="closeDialogFn">
    <form>
      <div class="form-group">
        <label>Title</label>
        <input v-model="title" />
      </div>

      <div class="form-group">
        <label>Prologue</label>
        <textarea v-model="prologue" />
      </div>
    </form>

    <template v-slot:footer>
      <div class="w-full flex space-x-1 items-center justify-end">
        <button class="btn bg-indigo-300" @click="updateBoard">Update Board</button>
        <ConfirmDeleteInline :onDelete="deleteBoard" />
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/shared/Modal.vue';
import ConfirmDeleteInline from '@/components/shared/ConfirmDeleteInline.vue';

export type EditBoard = {
  title: string;
  prologue: string;
};

export default defineComponent({
  name: 'EditBoardDialog',
  components: { Modal, ConfirmDeleteInline },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    closeDialogFn: {
      type: Function,
    },
    board: {
      type: Object as PropType<EditBoard>,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const state = reactive({
      title: '',
      prologue: '',
    });

    const setFields = (board: EditBoard | undefined) => {
      if (board) {
        const { title, prologue } = board;
        state.title = title;
        state.prologue = prologue;
      }
    };

    watch(
      () => props.board,
      (board) => {
        setFields(board);
      },
      { immediate: true }
    );

    const updateBoard = () => {
      console.log('Submit Updated Board', state);
      if (props.closeDialogFn) {
        props.closeDialogFn();
      }
    };

    const deleteBoard = () => {
      console.log('Delete Board', props.board);
    };

    return { ...toRefs(state), updateBoard, deleteBoard, t };
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
