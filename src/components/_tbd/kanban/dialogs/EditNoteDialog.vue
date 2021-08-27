<template>
  <Modal :isOpen="showDialog" :title="t('edit_note')" :onClose="onClose">
    <form>
      <div class="form-group">
        <label>Assigned To</label>
        <select v-model="assignedTo" class="text-black">
          <template v-for="member in members" :key="member">
            <option :value="member">{{ member }}</option>
          </template>
          <option value="">none</option>
        </select>
      </div>

      <div class="form-group">
        <label>Text</label>
        <textarea
          v-model="text"
          class="sticky-note"
          :style="`background-color: ${noteColor}; color: ${textColor};`"
          rows="4"
          placeholder="Enter note text..."
        />
      </div>

      <div class="form-group">
        <label>Hint</label>
        <input type="text" v-model="hint" />
      </div>

      <div class="flex flex-wrap md:flex-nowrap md:space-x-4">
        <div class="form-group md:max-w-1/2">
          <label>Text Color</label>
          <div class="grid grid-cols-5 gap-2 py-1">
            <button v-for="c in getTextColors" :key="c" @click.prevent="setTextColor(c)">
              <div :style="`background-color: ${c};`" class="color-btn f-center">
                <i-icomoon-free-checkmark
                  v-show="textColor === c"
                  :class="textColor === '#333' ? 'text-white' : 'text-black'"
                />
              </div>
            </button>
            <!-- <button>
              <div class="color-btn border f-center">
                <i-eva-color-picker-fill class="text-xl" />
              </div>
            </button> -->
          </div>
        </div>

        <div class="form-group md:max-w-1/2">
          <label>Note Color</label>
          <div class="grid grid-cols-5 gap-2 py-1">
            <button v-for="c in getNoteColors" :key="c" @click.prevent="setNoteColor(c)">
              <div :style="`background: ${c};`" class="color-btn f-center">
                <i-icomoon-free-checkmark
                  v-show="noteColor === c"
                  :class="noteColor === '#333' ? 'text-white' : 'text-black'"
                />
              </div>
            </button>
            <!-- <button>
              <div class="color-btn border f-center">
                <i-eva-color-picker-fill class="text-xl" />
              </div>
            </button> -->
          </div>
        </div>
      </div>
    </form>

    <template v-slot:footer>
      <div class="w-full flex space-x-1 items-center justify-end">
        <button class="btn bg-indigo-300" @click="submitNote">Update Note</button>
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
import { Note, NoteColor } from '@/data/interfaces';

export default defineComponent({
  name: 'EditNoteDialog',
  components: { Modal, ConfirmDeleteInline },
  props: {
    edit: {
      type: Object as PropType<Note>,
    },
    members: {
      type: Array, // Array as PropType<Member>
      default: [],
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

    // blue, indigo, green, yellow, red, white, light-grey, dark-gray, custom
    // ['#93c5fd', '#818cf8', '#6ee7b7', '#fcd34d', '#fca5a5', '#f4f5f8', '#92949c', '#222428'];
    const getNoteColors = [
      NoteColor.blue,
      NoteColor.purple,
      NoteColor.mint,
      NoteColor.yellow,
      NoteColor.red,
      NoteColor.light,
      NoteColor.gray,
      NoteColor.dark,
    ];

    const getTextColors = [NoteColor.dark, NoteColor.light];

    const state = reactive<Note>({
      id: '',
      text: '',
      audioURL: '',
      hint: '', // translation, thoughts, extra line (toggle to show)
      //mediaURL: ''
      assignedTo: '',
      noteColor: getNoteColors[3],
      textColor: getTextColors[0],
      boardId: '',
    });

    const setFields = () => {
      if (props.edit) {
        const { text, audioURL, hint, assignedTo, noteColor, textColor } = props.edit;
        state.text = text;
        state.audioURL = audioURL;
        state.hint = hint;
        state.assignedTo = assignedTo;
        state.noteColor = noteColor;
        state.textColor = textColor;
      }
    };
    watch(
      () => props.edit,
      (note) => {
        if (note) setFields();
      }
    );

    const setNoteColor = (color: NoteColor) => {
      if (color === NoteColor.dark) {
        setTextColor(NoteColor.light);
      } else {
        setTextColor(NoteColor.dark);
      }
      state.noteColor = color;
    };

    const setTextColor = (color: NoteColor) => {
      state.textColor = color;
    };

    const submitNote = () => {
      console.log('Updated Note', state);
      // if success
      if (props.onClose) props.onClose();

      if (props.edit) {
        emit('update', state);
      } else {
        emit('create', state);
      }
    };

    const deleteNote = () => {
      console.log('Delete Note', props.edit);
    };

    return { ...toRefs(state), getNoteColors, setNoteColor, getTextColors, setTextColor, submitNote, deleteNote, t };
  },
});
</script>

<style scoped>
.color-btn {
  @apply h-10 w-10 rounded-full;
}
</style>
