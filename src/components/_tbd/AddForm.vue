<template>
  <form class="flex flex-col gap-2" @submit.prevent="submitForm">
    <div class="form-group">
      <label>title</label>
      <input v-focus type="text" v-model="title" />
    </div>

    <div class="actions flex gap-2">
      <button type="submit">💾 {{ action }}</button>
      <ConfirmDeleteInPlace v-if="edit" :onDelete="delEdit" />
      <button v-else type="button" @click="close">❌ cancel</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import ConfirmDeleteInPlace from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'ExampleForm',
  components: { ConfirmDeleteInPlace },
  props: {
    action: {
      type: String,
      default: 'submit',
    },
    edit: {
      type: Object, // Object as PropType<T>
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    const state = reactive({
      title: '',
    });

    function isValid() {
      return !!state.title;
    }

    function setFields() {
      if (props.edit) {
        const { title } = props.edit;
        state.title = title;
      }
    }
    watch(
      () => props.edit,
      (item) => {
        if (item) setFields();
      },
      { immediate: true }
    );

    function submitForm() {
      if (isValid()) {
        emit('submission', state);
      }
    }

    function close() {
      emit('close');
    }

    function delEdit() {
      if (props.edit) {
        emit('delete', props.edit.id);
      }
    }

    return { t, ...toRefs(state), submitForm, close, delEdit };
  },
});
</script>
