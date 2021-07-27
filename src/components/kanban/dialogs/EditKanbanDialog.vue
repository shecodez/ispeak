<template>
  <Modal :isOpen="showDialog" title="⚙️ Kanban Settings" :onClose="onClose">
    <form>
      <div class="form-group">
        <div class="ml-auto">public🔓toggle🔒private</div>
      </div>

      <div class="form-group">
        <label>Title</label>
        <input type="text" v-model="title" />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="description" />
      </div>

      <div class="form-group">
        <label>Members</label>
        <ChipInput placeholder="Add Kanban krew" />
      </div>

      <div class="form-group">
        <label>Boards</label>
        <div class="grid grid-cols-3 gap-2 max-h-24 thin-scrollbar">
          <template v-for="(board, i) in boards" :key="board.id">
            <div
              @click="setStatus(board, i)"
              class="border p-2 rounded cursor-pointer"
              :class="board.isPublished ? (board.isEpic ? 'epic' : 'published') : 'draft'"
            >
              {{ board.title }}
            </div>
          </template>
        </div>
      </div>

      <div class="form-group">
        <label>Tags</label>
        <ChipInput placeholder="Enter Tags" :max="10" />
      </div>
    </form>

    <template v-slot:action>
      <button class="btn bg-green-300 ml-auto" @click="updateKanban">{{ t('save') }}</button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';
import ChipInput from '@/components/ui/ChipInput.vue';

export default defineComponent({
  name: 'EditKanbanDialog',
  components: { Modal, ChipInput },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
    },
  },
  // methods: {
  //   onClose() {
  //     this.$emit('closeEvent');
  //   },
  //   onSave() {
  //     this.$emit('saveEvent');
  //   },
  // },
  setup(props) {
    const { t } = useI18n();

    const state = reactive({
      title: '',
      description: '',
    });

    const updateKanban = () => {
      console.log('Update Kanaban');
      // if success
      if (props.onClose) props.onClose();
    };

    const boards = ref([
      { id: '1', title: 'Chapter 1', isPublished: true, isEpic: false },
      { id: '2', title: 'Chapter 2', isPublished: false, isEpic: false },
      { id: '3', title: 'Chapter 3', isPublished: true, isEpic: true },
      { id: '4', title: 'Chapter 4', isPublished: false, isEpic: true },
      { id: '5', title: 'Chapter 5', isPublished: false, isEpic: false },
    ]);

    const setStatus = (board: any, i: number) => {
      console.log('Board', board, i);
      if ((!board.isPublished && !board.isEpic) || (!board.isPublished && board.isEpic)) {
        // draft || epic -> published
        boards.value[i].isPublished = true;
        return;
      }
      if (board.isPublished && !board.isEpic) {
        // published -> epic
        boards.value[i].isEpic = true;
        return;
      }
      if (board.isEpic && board.isPublished) {
        // published && epic -> draft
        boards.value[i].isEpic = false;
        boards.value[i].isPublished = false;
        return;
      }
    };

    return { ...toRefs(state), updateKanban, setStatus, t, boards };
  },
});
</script>

<style scoped>
.draft {
  @apply border-white bg-gray-300 bg-opacity-30;
}
.published {
  @apply border-green-500 bg-green-300 bg-opacity-30;
}
.epic {
  @apply border-indigo-500 bg-indigo-300 bg-opacity-30;
}
</style>
