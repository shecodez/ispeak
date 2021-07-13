<template>
  <div class="mx-3">
    <h1 class="text-4xl my-3">Sagas</h1>
    <router-link to="/shecodez/s/1">Saga 1</router-link> | <router-link to="/shecodez/s/2">Saga 2</router-link> |
    <router-link to="/shecodez/s/42">Saga 42</router-link>
  </div>

  params: {{ params }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SagaList',
  setup() {
    const router = useRouter();
    const params = router.currentRoute.value.params;

    return { params };
  },
});
</script>
