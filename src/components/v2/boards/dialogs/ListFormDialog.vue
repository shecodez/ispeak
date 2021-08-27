<template>
  <Modal :isOpen="showDialog" :title="action" :onClose="onClose">
    <form class="flex flex-col gap-2" @submit.prevent @keydown.enter.prevent>
      <div class="form-group">
        <label>Title</label>
        <input v-focus type="text" v-model="title" />
      </div>

      <div class="form-group">
        <label>Slug</label>
        <input v-model="slug" readonly />
      </div>

      <div class="form-group">
        <label>Description <small>(Plain Text)</small></label>
        <textarea v-model="description" />
        <p class="text-xs">Rich Text Format for Description coming soon!</p>
      </div>

      <div class="form-group">
        <label>Publish Date</label>
        <input type="date" v-model="publish_date" />
      </div>

      <!-- <div class="form-group">
        <label>Gems</label>
        <input type="number" v-model="gems" :min="0" :max="9" />
      </div> -->
    </form>
    <template v-slot:footer>
      <div class="actions w-full flex items-center justify-end gap-2 capitalize">
        <button type="button" @click="submitForm" class="btn border">💾 {{ action }}</button>
        <InPlaceConfirmDelete v-if="edit" :onDelete="delEdit" />
        <button v-else type="button" @click="onClose">❌ cancel</button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import slugify from '@sindresorhus/slugify';

import { List } from '@/data/types/mock';
import Modal from '@/components/ui/Modal.vue';
import InPlaceConfirmDelete from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'v2ListFormDialog',
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
      type: Object as PropType<List>,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const state = reactive<List>({
      position: 0,
      title: '',
      slug: '',
      description: '',
      publish_date: null,
      gems: 0,
    });

    function setFields() {
      if (props.edit) {
        const { position, title, slug, description, publish_date, gems } = props.edit;

        state.position = position;
        state.title = title;
        state.slug = slug;
        state.description = description;
        state.publish_date = publish_date;
        state.gems = gems;
      }
    }
    watch(
      () => props.edit,
      (list) => {
        if (list) setFields();
      },
      { immediate: true }
    );

    watch(
      () => state.title,
      (title) => {
        state.slug = slugify(title);
      }
    );

    function reset() {
      state.position = 0;
      state.title = '';
      state.slug = '';
      state.description = '';
      state.publish_date = null;
      state.gems = 0;
    }

    function isValid() {
      return !!state.title;
    }
    function submitForm() {
      if (isValid()) {
        //emit('submission', state);
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

    return { t, ...toRefs(state), submitForm, delEdit };
  },
});
</script>
