<template>
  <div class="w-full border p-2 flex flex-wrap">
    <template v-for="(chip, i) in chips" :key="chip">
      <!-- TODO: chip bg-color = color(hash(chip)) -->
      <div class="m-1 py-1 px-2 rounded flex flex-nowrap space-x-1 items-center bg-gray-400">
        <span class="text-sm">{{ chip }}</span>
        <button class="opacity-80 hover:opacity-100 my-auto" @click="removeChip(i)">x</button>
      </div>
    </template>
    <input
      type="text"
      :placeholder="placeholder"
      @keydown.enter="addChip"
      @keydown.,="addChip"
      @keydown.delete="removeLast"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ChipInput',
  props: {
    placeholder: {
      type: String,
      default: 'Enter a chip',
    },
  },
  setup() {
    const chips = ref<string[]>([]);

    const addChip = (event: any) => {
      event.preventDefault();
      const val = event.target.value.trim();
      // TODO: check blacklisted chips
      if (val.length > 0) {
        chips.value.push(val);
        event.target.value = '';
      }
    };

    const removeChip = (index: number) => {
      chips.value.splice(index, 1);
    };

    const removeLast = (event: any) => {
      if (event.target.value.length === 0) {
        removeChip(chips.value.length - 1);
      }
    };

    return { chips, addChip, removeChip, removeLast };
  },
});
</script>

<style scoped>
button {
  @apply opacity-80 hover:opacity-100 focus:outline-none;
}
input {
  @apply px-2 text-sm border-0 bg-transparent focus:outline-none focus:shadow-none;
}
</style>
