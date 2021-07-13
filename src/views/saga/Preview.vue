<template>
  <h1>Peview</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Preview',
  setup() {
    const router = useRouter();
    const params = router.currentRoute.value.params;

    return { params };
  },
});
</script>
