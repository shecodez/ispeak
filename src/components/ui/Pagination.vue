<template>
  <div v-if="totalPages" class="flex flex-wrap items-center py-2 space-x-2 overflow-hidden">
    <button @click="onPrevPage" :disabled="currentPage <= 1" class="f-center">
      <i-cil-arrow-left />
    </button>

    <ul class="flex items-center space-x-1">
      <li v-if="showFirstPage" class="opacity-50"><button @click="onFirstPage">1</button> ...</li>

      <li v-for="page in pages" :key="page.name">
        <button
          type="button"
          @click="onPage(page.name)"
          :class="isPageActive(page.name) ? 'opacity-100' : 'opacity-50'"
        >
          {{ page.name }}
        </button>
      </li>

      <li v-if="showLastPage" class="opacity-50">
        ... <button @click="onLastPage">{{ totalPages }}</button>
      </li>
    </ul>

    <button @click="onNextPage" :disabled="currentPage >= totalPages" class="f-center">
      <i-cil-arrow-right />
    </button>

    <div class="text-sm">
      Go to Page
      <input class="mx-1" type="number" :min="1" :max="totalPages" v-model="pageInput" @keydown.enter="onPageInput" />
      of <b class="mx-1">{{ totalPages }}</b>
      <button @click="onPageInput" class="border">🚀<span class="sr-only">go</span></button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Pagination',
  props: {
    page: {
      type: Number,
      default: 1,
    },
    totalItems: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 4,
    },
    maxVisibleButtons: {
      type: Number,
      default: 5,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

    const currentPage = ref(props.page);
    watch(
      () => props.page,
      (newPage) => {
        currentPage.value = newPage;
      },
      { immediate: true }
    );

    const setCurrentPage = (page: number) => {
      if (page < 1 || page > totalPages.value || page === currentPage.value) return;
      //currentPage.value = page;
      emit('pagechange', page);
    };

    const isPageActive = (page: number) => {
      return currentPage.value === page;
    };

    const startPage = computed(() => {
      // When on the first page
      if (currentPage.value === 1) return 1;

      // When on the last page
      if (currentPage.value === totalPages.value) {
        return Math.max(totalPages.value - (props.maxVisibleButtons - 1), 1);
      }

      // When inbetween
      return currentPage.value < props.maxVisibleButtons
        ? Math.max(currentPage.value - Math.floor(props.maxVisibleButtons / 2), 1)
        : Math.min(
            currentPage.value - Math.floor(props.maxVisibleButtons / 2),
            totalPages.value - (props.maxVisibleButtons - 1)
          );
    });

    const pages = computed(() => {
      const range = [];

      for (
        let i = startPage.value;
        i <= Math.min(startPage.value + (props.maxVisibleButtons - 1), totalPages.value);
        i++
      ) {
        range.push({
          name: i,
          isDisabled: i === currentPage.value,
        });
      }

      return range;
    });

    const showFirstPage = computed(
      () => totalPages.value > props.maxVisibleButtons && currentPage.value - Math.ceil(props.maxVisibleButtons / 2) > 0
    );

    const showLastPage = computed(
      () =>
        totalPages.value > props.maxVisibleButtons &&
        currentPage.value + Math.ceil(props.maxVisibleButtons / 2) <= totalPages.value
    );

    const onFirstPage = () => {
      setCurrentPage(1);
      //emit('on-first', currentPage);
    };

    const onPrevPage = () => {
      setCurrentPage(currentPage.value - 1);
      //emit('on-prev', currentPage);
    };

    const onPage = (page: number) => {
      setCurrentPage(page);
      //emit('on-page', currentPage);
    };

    const onNextPage = () => {
      setCurrentPage(currentPage.value + 1);
      //emit('on-next', currentPage);
    };

    const onLastPage = () => {
      setCurrentPage(totalPages.value);
      //emit('on-last', currentPage);
    };

    const pageInput = ref();
    const onPageInput = () => {
      setCurrentPage(Number(pageInput.value));
      pageInput.value = undefined;
    };

    return {
      currentPage,
      totalPages,
      isPageActive,
      showFirstPage,
      pages,
      showLastPage,
      onFirstPage,
      onPrevPage,
      onPage,
      onNextPage,
      onLastPage,
      pageInput,
      onPageInput,
      t,
    };
  },
});
</script>

<style scoped>
button {
  @apply px-2 py-1 mx-1 rounded hover:opacity-100;
}

button:disabled,
button[disabled] {
  @apply opacity-50 cursor-not-allowed;
}

input {
  @apply max-w-12 px-0 max-h-8 rounded bg-transparent text-right;
}
</style>
