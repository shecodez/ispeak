<template>
  <Modal :isOpen="showDialog" :title="action" :onClose="onClose">
    <form class="flex flex-col gap-2" @submit.prevent @keydown.enter.prevent>
      <div class="form-group">
        <label>Text</label>
        <textarea
          v-model="text"
          class="sticky-note"
          :style="`background-color: ${color}; color: ${text_color};`"
          rows="4"
          placeholder="Enter card text..."
        />
      </div>

      <div class="form-group">
        <label>Details</label>
        <input type="text" v-model="details" />
      </div>

      <div class="form-group">
        <label>Label</label>
        <input type="text" v-model="label" />
      </div>

      <div class="flex flex-wrap md:flex-nowrap md:space-x-4">
        <div class="form-group md:max-w-1/2">
          <label>Text Color</label>
          <div class="grid grid-cols-5 gap-2 py-1">
            <button v-for="c in getTextColors" :key="c" @click.prevent="setTextColor(c)">
              <div :style="`background-color: ${c};`" class="color-btn f-center">
                <i-icomoon-free-checkmark
                  v-show="text_color === c"
                  :class="text_color === Color.dark ? 'text-white' : 'text-black'"
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
          <label>Label Color</label>
          <div class="grid grid-cols-5 gap-2 py-1">
            <button v-for="c in getColors" :key="c" @click.prevent="setColor(c)">
              <div :style="`background: ${c};`" class="color-btn f-center">
                <i-icomoon-free-checkmark
                  v-show="color === c"
                  :class="color === Color.dark ? 'text-white' : 'text-black'"
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
      <div class="actions w-full flex items-center justify-end gap-2 capitalize">
        <button button="button" @click="submitForm" class="btn border">💾 {{ action }}</button>
        <InPlaceConfirmDelete v-if="edit" :onDelete="delEdit" />
        <button v-else type="button" @click="onClose">❌ cancel</button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { Color, Card } from '@/data/types/mock';
import Modal from '@/components/ui/Modal.vue';
import InPlaceConfirmDelete from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'CardForm',
  components: { Modal, InPlaceConfirmDelete },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
    onDelete: {
      type: Function,
    },
    action: {
      type: String,
      default: 'submit',
    },
    edit: {
      type: Object as PropType<Card>,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const getColors = [
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

    const setColor = (color: Color) => {
      if (color === Color.dark) {
        setTextColor(Color.light);
      } else {
        setTextColor(Color.dark);
      }
      state.color = color;
    };

    const setTextColor = (color: Color) => {
      state.text_color = color;
    };

    const state = reactive<Card>({
      position: 0,
      text: '',
      // audio_url: '',
      details: '',
      label: '',
      color: getColors[3],
      text_color: getTextColors[0],
      //assigned_to: ''
    });

    function setFields() {
      if (props.edit) {
        const { position, text, label, details, color, text_color } = props.edit;

        state.position = position;
        state.text = text;
        state.details = details;
        state.label = label;
        state.color = color;
        state.text_color = text_color;
      }
    }
    watch(
      () => props.edit,
      (card) => {
        if (card) setFields();
      },
      { immediate: true }
    );

    function reset() {
      state.position = 0;
      state.text = '';
      // state.audio_url= '';
      state.details = '';
      state.label = '';
      state.color = getColors[3];
      state.text_color = getTextColors[0];
      //state.assigned_to= '';
    }

    function isValid() {
      return !!state.text;
    }
    function submitForm() {
      if (isValid()) {
        props.onSubmit(state);
      }
      props.onClose();
      reset();
    }

    function delEdit() {
      if (props.edit && props.onDelete) {
        props.onDelete(props.edit);
        props.onClose();
      }
    }

    return {
      t,
      Color,
      getColors,
      getTextColors,
      setColor,
      setTextColor,
      ...toRefs(state),
      submitForm,
      delEdit,
    };
  },
});
</script>

<style scoped>
.color-btn {
  @apply h-10 w-10 rounded-full;
}
</style>
