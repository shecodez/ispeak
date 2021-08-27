<template>
  <div class="flex items-center space-x-1">
    <button
      @click="canDelete ? deleteIt() : prepareToDelete()"
      type="button"
      class="btn text-red-500 hover:bg-red-500 hover:text-white"
    >
      🗑️<span class="sr-only">Delete</span>
      <span v-if="canDelete">{{ t('confirm') }}</span>
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
