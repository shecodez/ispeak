<template>
  <button @click="isAddingList = true" class="btn primary-green">
    {{ t('add_list') }}
  </button>

  <ListFormDialog action="Add List" :showDialog="isAddingList" :onSubmit="addList" :onClose="close" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ListFormDialog from '@/components/v2/boards/dialogs/ListFormDialog.vue';

export default defineComponent({
  name: 'v2AddList',
  components: { ListFormDialog },
  props: {
    addList: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();

    const isAddingList = ref(false);

    function close() {
      isAddingList.value = false;
    }

    return { t, isAddingList, close };
  },
});
</script>
