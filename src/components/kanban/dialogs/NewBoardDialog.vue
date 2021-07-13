<template>
  <Modal :isOpen="showDialog" :title="t('add_board')" :onClose="closeDialogFn" :onAction="addBoard">
    <form>
      <div class="form-group">
        <label>Title</label>
        <input v-model="title" />
      </div>

      <div class="form-group">
        <label>Prologue</label>
        <textarea v-model="prologue" />
      </div>

      <!-- <div class="form-group">
      <label>Epilogue</label>
      <textarea v-model="epilogue" />
    </div> -->
    </form>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';

export type NewBoard = {
  title: string;
  prologue: string;
  //isEpic (req gems to view)
};

export default defineComponent({
  name: 'NewBoardDialog',
  components: { Modal },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    closeDialogFn: {
      type: Function,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const board = reactive({
      priority: 1,
      title: '',
      prologue: '',
      //epilogue: '',
      notes: [],
    });

    const addBoard = () => {
      console.log('Submit Add Board', board);
      if (props.closeDialogFn) {
        props.closeDialogFn();
      }
    };

    return { ...toRefs(board), addBoard, t };
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
