<template>story chapters</template>

<script lang="ts">
import { computed, defineComponent, onMounted, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTitle } from '@vueuse/core';

import { useBoards } from '@/use/db';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';

export default defineComponent({
  name: 'ListRO',
  components: { Spinner, AlertMessage },
  props: {
    query: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();

    useTitle(`${t('stories')} · 🎬 ${import.meta.env.VITE_APP_NAME}`);

    const { data, all } = useBoards;

    onMounted(async () => await all());

    const stories = computed(() => data.boards);

    return { t, ...toRefs(data), stories };
  },
});
</script>
