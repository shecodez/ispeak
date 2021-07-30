<template>
  <Modal :isOpen="showDialog" :title="t('add_note')" :onClose="closeDialogFn" :onAction="addNote">
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
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';
import { Color } from './EditNoteDialog.vue';

export type NewNote = {
  text: string;
  noteColor: Color;
  textColor: Color;
};

export default defineComponent({
  name: 'NewNoteDialog',
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

    const addNote = () => {
      console.log('Submit New Note', state);
      if (props.closeDialogFn) {
        props.closeDialogFn();
      }
    };

    return { ...toRefs(state), getNoteColors, setNoteColor, getTextColors, setTextColor, addNote, t };
  },
});
</script>

<style scoped>
.color-btn {
  @apply h-10 w-10 rounded-full;
}
</style>
