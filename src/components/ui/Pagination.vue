<template>
  <div class="flex items-center space-x-2 overflow-hidden">
    <button @click="setCurrentPage(currentPage - 1)" :disabled="currentPage <= 1">{{ t('prev') }}</button>

    <ul class="flex items-center space-x-1">
      <li v-if="currentPage - 3 > 0"><button @click="setCurrentPage(1)">1</button> ...</li>

      <li v-for="(_, i) in totalPages" :key="`pg-${i}`" v-show="i <= currentPage + 1 && i >= currentPage - 3">
        <button :class="i + 1 === currentPage ? 'bg-yellow-500' : ''" @click="setCurrentPage(i + 1)">
          {{ i + 1 }}
        </button>
      </li>

      <li v-if="currentPage + 2 < totalPages">
        ... <button @click="setCurrentPage(totalPages)">{{ totalPages }}</button>
      </li>
    </ul>

    <button @click="setCurrentPage(currentPage + 1)" :disabled="currentPage >= totalPages">{{ t('next') }}</button>

    <!-- <div>
      Go to Page <input type="text" v-model="goToPage" /> of <b>{{ totalPages }}</b>
      <button class="ml-2" @click="setCurrentPage(goToPage)">🚀<span class="sr-only">go</span></button>
    </div> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Pagination',
  props: {
    onPage: {
      type: Number,
      default: 1,
    },
    totalItems: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 5,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

    const currentPage = ref(props.onPage);
    const goToPage = ref();
    watch(
      () => currentPage.value,
      (currentPage) => {
        goToPage.value = currentPage;
      },
      { immediate: true }
    );
    const setCurrentPage = (toPage: number) => {
      //console.log('gotopg', goToPage.value, 'topg', toPage);
      if (toPage < 1 || toPage > totalPages.value) return;
      currentPage.value = toPage;
    };

    return { t, currentPage, totalPages, goToPage, setCurrentPage };
  },
});
</script>

<style scoped>
button {
  @apply px-2 py-1 border rounded;
}
button:disabled,
button[disabled] {
  @apply text-gray-500 border-gray-500 cursor-not-allowed;
}
input {
  @apply px-2 max-w-11 max-h-9 rounded bg-transparent text-right;
}
</style>
