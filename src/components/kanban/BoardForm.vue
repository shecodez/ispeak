<template>
  <form>
    <div>
      <label>Title</label>
      <input v-model="title" />
    </div>
    <div>
      <label>Title</label>
      <input v-model="prologue" />
    </div>
    <div>
      <label>Title</label>
      <input v-model="epilogue" />
    </div>

    <button class="btn block">Submit</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'BoardForm',
  setup() {
    const board = reactive({
      priority: 1,
      title: '',
      prologue: '',
      epilogue: '',
      notes: [],
    });

    return { ...toRefs(board) };
  },
});
</script>
