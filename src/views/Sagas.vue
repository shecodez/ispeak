<template>
  <div class="mx-3">
    <h1 class="text-4xl my-3">Sagas</h1>
    <p>filter by: {{ params }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Sagas',
  setup() {
    const router = useRouter();
    const params = router.currentRoute.value.params;

    return { params };
  },
});
</script>
