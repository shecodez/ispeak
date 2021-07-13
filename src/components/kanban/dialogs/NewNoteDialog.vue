<template>
  <Modal :isOpen="showDialog" :title="t('add_note')" :onClose="closeDialogFn" :onAction="addNote">
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
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';

export type NewNote = {
  text: string;
  color: string;
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

    // blue, indigo, green, yellow, red, white, light-grey, dark-gray, custom
    const getDefaultColors = ['#93c5fd', '#818cf8', '#6ee7b7', '#fcd34d', '#fca5a5', '#f4f5f8', '#92949c', '#222428'];

    // const getKanbanMembers = () => {}
    // onMounted(() => getKanbanMembers())

    const note = reactive({
      text: '',
      //translation: '',
      //speaker: '', // if isDialogue  select 1 from getKanbanMembers
      //audioURL: '',
      //imageURL: ''
      color: getDefaultColors[3],
    });

    const setNoteColor = (color: string) => {
      note.color = color;
    };

    const addNote = () => {
      console.log('Submit New Note', note);
      if (props.closeDialogFn) {
        props.closeDialogFn();
      }
    };

    return { ...toRefs(note), getDefaultColors, setNoteColor, addNote, t };
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
