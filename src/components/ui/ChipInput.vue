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
  <div v-if="hint" class="hint text-xs">{{ hint }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ChipInput',
  props: {
    modelValue: {
      type: Array,
      default: [],
    },
    placeholder: {
      type: String,
      default: 'Enter a chip',
    },
    maxCharsPerChip: {
      type: Number,
      default: 32,
    },
    maxChips: {
      type: Number,
      default: 16,
    },
  },
  setup(props, { emit }) {
    const chips = ref<string[]>([]);
    if (props.modelValue.length) {
      chips.value = props.modelValue as string[];
    }

    const hint = ref('');
    const addChip = (event: any) => {
      event.preventDefault();
      const val = event.target.value.trim();
      // TODO: check blacklisted chips
      if (val.length > 0) {
        if (chips.value.includes(val)) {
          hint.value = `Item '${val}' is already included.`;
          return;
        }
        if (val.length > props.maxCharsPerChip) {
          hint.value = `Chip too long. Must be ${props.maxCharsPerChip} or less.`;
          return;
        }
        if (chips.value.length + 1 > props.maxChips) {
          hint.value = `Too many Chips. Must be ${props.maxChips} or less.`;
          return;
        }
        chips.value.push(val);
        event.target.value = '';
        hint.value = '';
      }
      emit('update:modelValue', chips.value);
    };

    const removeChip = (index: number) => {
      chips.value.splice(index, 1);
      emit('update:modelValue', chips.value);
    };

    const removeLast = (event: any) => {
      if (event.target.value.length === 0) {
        removeChip(chips.value.length - 1);
      }
      emit('update:modelValue', chips.value);
    };

    return { chips, addChip, hint, removeChip, removeLast };
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
