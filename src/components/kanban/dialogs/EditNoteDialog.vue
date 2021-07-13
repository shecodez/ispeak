<template>
  <Modal :isOpen="showDialog" :title="t('edit_note')" :onClose="closeDialogFn">
    <form>
      <div class="form-group">
        <label>Text</label>
        <textarea
          v-model="text"
          class="sticky-note"
          :class="color === '#222428' ? 'text-white' : 'text-black'"
          :style="`background-color: ${color}`"
          rows="4"
          placeholder="Enter note text..."
        />
      </div>

      <div class="form-group">
        <label>Color</label>
        <div class="grid grid-cols-5 gap-2 py-1 md:max-w-1/2">
          <button v-for="c in getDefaultColors" :key="c" @click.prevent="setNoteColor(c)">
            <div :style="`background: ${c};`" class="color-btn f-center">
              <i-icomoon-free-checkmark
                v-show="color === c"
                :class="color === '#f4f5f8' ? 'text-black' : 'text-white'"
              />
            </div>
          </button>
          <button>
            <div class="color-btn border f-center">
              <i-eva-color-picker-fill class="text-xl" />
            </div>
          </button>
        </div>
      </div>
    </form>

    <template v-slot:footer>
      <div class="w-full flex space-x-1 items-center justify-end">
        <button class="btn bg-indigo-300" @click="updateNote">Update Note</button>
        <ConfirmDeleteInline :onDelete="deleteNote" />
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';
import ConfirmDeleteInline from '@/components/ui/ConfirmDeleteInline.vue';

export type EditNote = {
  text: string;
  color: string;
};

export default defineComponent({
  name: 'EditNoteDialog',
  components: { Modal, ConfirmDeleteInline },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    closeDialogFn: {
      type: Function,
    },
    note: {
      type: Object as PropType<EditNote>,
    },
  },
  setup(props) {
    const { t } = useI18n();

    // blue, indigo, green, yellow, red, white, light-grey, dark-gray, custom
    const getDefaultColors = ['#93c5fd', '#818cf8', '#6ee7b7', '#fcd34d', '#fca5a5', '#f4f5f8', '#92949c', '#222428'];

    // const getKanbanMembers = () => {}
    // onMounted(() => getKanbanMembers())

    const state = reactive({
      text: '',
      color: getDefaultColors[3],
      //translation: '',
      //speaker: '', // if isDialogue  select 1 from getKanbanMembers
      //audioURL: '',
      //imageURL: ''
    });

    const setFields = (note: EditNote | undefined) => {
      if (note) {
        const { text, color } = note;
        state.text = text;
        state.color = color;
      }
    };

    watch(
      () => props.note,
      (note) => {
        setFields(note);
      },
      { immediate: true }
    );

    const setNoteColor = (color: string) => {
      state.color = color;
    };

    const updateNote = () => {
      console.log('Submit Updated Note', state);
      if (props.closeDialogFn) {
        props.closeDialogFn();
      }
    };

    const deleteNote = () => {
      console.log('Delete Note', props.note);
    };

    return { ...toRefs(state), getDefaultColors, setNoteColor, updateNote, deleteNote, t };
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
.color-btn {
  @apply h-10 w-10 rounded-full;
}
.sticky-note {
  @apply p-2 shadow rounded border-none;
}
</style>
