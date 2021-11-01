<template>
  <Modal :isOpen="showDialog" :title="t('confirm_delete')">
    <p>{{ deleteMessage }}</p>
    <template v-slot:action>
      <button class="btn bg-red-500 ml-auto" @click="del">{{ t('delete') }}</button>
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
    deleteMessage: {
      type: String,
      default: 'Are you sure you want to delete this?',
    },
    onClose: {
      type: Function,
    },
    onDelete: {
      type: Function,
    },
  },
  // methods: {
  //   onClose() {
  //     this.$emit('closeEvent');
  //   },
  //   onDelete() {
  //     this.$emit('deleteEvent');
  //   },
  // },
  setup(props) {
    const { t } = useI18n();

    const close = () => props.onClose;

    const del = () => props.onDelete;

    return { t, close, del };
  },
});
</script>
