<template>
  <Modal :isOpen="showDialog" title="⚙️ Kanban Settings" :onClose="onClose">
    <form>
      <div class="form-group flex items-center text-lg space-x-2">
        <b>🔒</b><Toggle v-model="isPublic" /><b>🌎</b>
        <b>{{ isPublic ? 'Public' : 'Private' }}</b>
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
        <ChipInput v-model="members" placeholder="Add Members" />
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
              <p class="truncate">{{ board.title }}</p>
            </div>
          </template>
        </div>
        <div class="flex items-center space-x-2 text-xs py-1">
          <b>Legend:</b>
          <div class="draft w-3 h-3" />
          <i>Draft</i>
          <div class="published w-3 h-3" />
          <i>Published</i>
          <div class="epic w-3 h-3" />
          <i>Epic</i>
        </div>
      </div>

      <div class="form-group">
        <label>Tags</label>
        <ChipInput v-model="tags" placeholder="Enter Tags" :maxChips="10" />
      </div>
    </form>

    <template v-slot:action>
      <button class="btn primary-green ml-auto capitalize" @click="submitKanban">{{ t('save') }}</button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { Kanban, Board } from '@/data/interfaces';
import Modal from '@/components/ui/Modal.vue';
import ChipInput from '@/components/ui/ChipInput.vue';
import Toggle from '@/components/ui/Toggle.vue';

export default defineComponent({
  name: 'EditKanbanDialog',
  components: { Modal, ChipInput, Toggle },
  props: {
    edit: {
      type: Object as PropType<Kanban>,
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    const state = reactive<Kanban>({
      id: '',
      title: '',
      slug: '',
      description: '',
      imageURL: '',
      isPublic: true,
      boards: [],
      members: [],
      tags: [],
      uid: '',
      username: '',
    });

    const setFields = () => {
      if (props.edit) {
        const { title, description, imageURL, isPublic, boards, members, tags } = props.edit;
        state.title = title;
        state.description = description;
        state.imageURL = imageURL;
        state.isPublic = isPublic;
        state.boards = boards;
        state.members = members;
        state.tags = tags;
      }
    };
    //onMounted(() => setFields());
    watch(
      () => props.edit,
      (edit) => {
        if (edit) setFields();
      }
    );

    const submitKanban = () => {
      console.log('Update Kanaban', state);
      // if success
      if (props.onClose) props.onClose();

      if (props.edit) {
        emit('update', state);
      } else {
        emit('create', state);
      }
    };

    // toggleBoardState
    const setStatus = (board: Board, i: number) => {
      //console.log('Board', board, i);
      if ((!board.isPublished && !board.isEpic) || (!board.isPublished && board.isEpic)) {
        // draft || epic -> published
        state.boards[i].isPublished = true;
        return;
      }
      if (board.isPublished && !board.isEpic) {
        // published -> epic
        state.boards[i].isEpic = true;
        return;
      }
      if (board.isEpic && board.isPublished) {
        // published && epic -> draft
        state.boards[i].isEpic = false;
        state.boards[i].isPublished = false;
        return;
      }
    };

    return { ...toRefs(state), submitKanban, setStatus, t };
  },
});
</script>

<style scoped>
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
