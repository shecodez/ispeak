<template>
  <Modal :isOpen="showDialog" :title="t('add_note')" :onClose="onClose" :onAction="submitNote">
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
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';
import { Note, NoteColor } from '@/data/interfaces';

export default defineComponent({
  name: 'NewNoteDialog',
  components: { Modal },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    members: {
      type: Array, // Array as PropType<Member>
      default: [],
    },
    onClose: {
      type: Function,
    },
  },
  setup(props) {
    const { t } = useI18n();

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

    const state = reactive({
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
      console.log('Create Note', state);

      if (props.onClose) props.onClose();
    };

    return { ...toRefs(state), getNoteColors, setNoteColor, getTextColors, setTextColor, submitNote, t };
  },
});
</script>

<style scoped>
.color-btn {
  @apply h-10 w-10 rounded-full;
}
</style>
