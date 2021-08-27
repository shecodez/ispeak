<template>
  <n-button @click="isAddingList = true" dashed style="width: 100%">
    <template #icon>
      <n-icon>+</n-icon>
    </template>
    {{ t('add_list') }}
  </n-button>

  <ListFormDialog action="Add List" :showDialog="isAddingList" :onSubmit="addList" :onClose="close" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ListFormDialog from '@/components/boards/dialogs/ListFormDialog.vue';

export default defineComponent({
  name: 'AddList',
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
