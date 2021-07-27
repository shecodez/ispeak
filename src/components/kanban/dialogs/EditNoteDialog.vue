<template>
  <Modal :isOpen="showDialog" :title="t('edit_note')" :onClose="closeDialogFn">
    <form>
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

export enum Color {
  blue = '#a9e6ff',
  purple = '#eddef2',
  mint = '#b6ffe0',
  yellow = '#fdffa4',
  pink = '#f3ddf3',
  red = '#de7477',
  gray = '#999',
  light = '#f3f3f3',
  dark = '#333',
}

export type EditNote = {
  //id: string;
  text: string;
  noteColor: Color;
  textColor: Color;
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
    // ['#93c5fd', '#818cf8', '#6ee7b7', '#fcd34d', '#fca5a5', '#f4f5f8', '#92949c', '#222428'];
    const getNoteColors = [
      Color.blue,
      Color.purple,
      Color.mint,
      Color.yellow,
      Color.red,
      Color.light,
      Color.gray,
      Color.dark,
    ];

    const getTextColors = [Color.dark, Color.light];

    // const getKanbanMembers = () => {}
    // onMounted(() => getKanbanMembers())

    const state = reactive({
      // assignedTo: [] // or speaker if note isDialogue
      text: '',
      //audioURL: '',
      //imageURL: ''
      noteColor: getNoteColors[3],
      textColor: getTextColors[0],
      //hint: '', // translation, thoughts, extra line (toggle to show)
    });

    const setFields = (note: EditNote | undefined) => {
      if (note) {
        const { text, noteColor, textColor } = note;
        state.text = text;
        state.noteColor = noteColor;
        state.textColor = textColor;
      }
    };

    watch(
      () => props.note,
      (note) => {
        setFields(note);
      },
      { immediate: true }
    );

    const setNoteColor = (color: Color) => {
      if (color === Color.dark) {
        setTextColor(Color.light);
      } else {
        setTextColor(Color.dark);
      }
      state.noteColor = color;
    };

    const setTextColor = (color: Color) => {
      state.textColor = color;
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

    return { ...toRefs(state), getNoteColors, setNoteColor, getTextColors, setTextColor, updateNote, deleteNote, t };
  },
});
</script>

<style scoped>
.color-btn {
  @apply h-10 w-10 rounded-full;
}
</style>
