<template>
  <div class="flex items-center gap-2" :class="css">
    <button @click="canDelete ? deleteIt() : prepareToDelete()" type="button" class="btn" :class="btnCss">
      <span>🗑️</span>
      <span v-if="canDelete">{{ t('confirm') }}</span>
      <span v-else>&nbsp;{{ label }}</span>
      <span class="sr-only">Delete</span>
    </button>

    <button v-if="canDelete" type="button" class="btn opacity-70 hover:opacity-100" @click="cancelDelete()">
      {{ t('cancel') }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ConfirmDeleteInline',
  props: {
    onDelete: {
      type: Function,
    },
    label: {
      type: String,
      default: '',
    },
    css: {
      type: String,
      default: 'w-full',
    },
    btnCss: {
      type: String,
      default: 'text-red-500 hover:bg-red-500 hover:text-white',
    },
  },
  setup(props) {
    const { t } = useI18n();

    const canDelete = ref(false);
    const prepareToDelete = () => {
      canDelete.value = true;
      //console.log('PREPARE DELETE');
    };
    const deleteIt = () => {
      if (props.onDelete) props.onDelete();
      canDelete.value = false;
      //console.log('DELETE IT');
    };
    const cancelDelete = () => {
      canDelete.value = false;
      //console.log('CANCEL DELETE');
    };

    return { t, canDelete, prepareToDelete, deleteIt, cancelDelete };
  },
});
</script>
