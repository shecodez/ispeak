<template>
  <Modal :isOpen="showDialog" title="⚙️ Kanban Settings" :onClose="onClose">
    <div>title</div>
    <div>description</div>
    <div>members</div>
    <div>published/epic boards</div>
    <template v-slot:action>
      <button class="btn bg-green-300 ml-auto" @click="updateKanban">{{ t('save') }}</button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';

export default defineComponent({
  name: 'ConfirmDeleteDialog',
  components: { Modal },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
    },
  },
  // methods: {
  //   onClose() {
  //     this.$emit('closeEvent');
  //   },
  //   onSave() {
  //     this.$emit('saveEvent');
  //   },
  // },
  setup(props) {
    const { t } = useI18n();

    const updateKanban = () => {
      console.log('Update Kanaban');
      // if success
      if (props.onClose) props.onClose();
    };

    return { updateKanban, t };
  },
});
</script>
