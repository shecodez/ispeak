<template>
  <div class="flex items-center space-x-2 overflow-hidden">
    <button @click="setCurrentPage(currentPage - 1)" :disabled="currentPage <= 1" class="f-center">
      <i-cil-arrow-left />
    </button>

    <ul class="flex items-center space-x-1">
      <li v-if="currentPage - 3 > 0" class="opacity-50"><button @click="setCurrentPage(1)">1</button> ...</li>

      <li v-for="(_, i) in totalPages" :key="`pg-${i}`" v-show="i <= currentPage + 1 && i >= currentPage - 3">
        <button :class="i + 1 === currentPage ? 'opacity-100' : 'opacity-50'" @click="setCurrentPage(i + 1)">
          {{ i + 1 }}
        </button>
      </li>

      <li v-if="currentPage + 2 < totalPages" class="opacity-50">
        ... <button @click="setCurrentPage(totalPages)">{{ totalPages }}</button>
      </li>
    </ul>

    <button @click="setCurrentPage(currentPage + 1)" :disabled="currentPage >= totalPages" class="f-center">
      <i-cil-arrow-right />
    </button>

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
    page: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 4,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    const totalPages = computed(() => Math.ceil(props.total / props.limit));

    const currentPage = ref(props.page);
    const goToPage = ref();
    watch(
      () => props.page,
      (newPage) => {
        currentPage.value = newPage;
        goToPage.value = newPage;
      },
      { immediate: true }
    );
    const setCurrentPage = (toPage: number) => {
      //console.log('gotopg', goToPage.value, 'topg', toPage);
      if (toPage < 1 || toPage > totalPages.value) return;
      currentPage.value = toPage;
      emit('on-goto-page', toPage);
    };

    const onPrev = () => {
      setCurrentPage(currentPage.value + 1);
      emit('on-prev', currentPage);
    };

    const onNext = () => {
      setCurrentPage(currentPage.value - 1);
      emit('on-next', currentPage);
    };

    return { t, currentPage, totalPages, goToPage, setCurrentPage };
  },
});
</script>

<style scoped>
button {
  @apply px-3 py-1;
}
button:disabled,
button[disabled] {
  @apply opacity-50 cursor-not-allowed;
}
input {
  @apply px-2 max-w-11 max-h-9 rounded bg-transparent text-right;
}
</style>
