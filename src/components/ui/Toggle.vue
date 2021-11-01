<template>
  <div
    class="w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 cursor-pointer"
    :class="modelValue ? color : ''"
    @click="toggle"
  >
    <div
      class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300"
      :class="{ 'translate-x-4': modelValue }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Toggle',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'bg-green-500',
    },
  },
  setup(props, { emit }) {
    const toggle = () => {
      emit('update:modelValue', !props.modelValue);
    };
    return { toggle };
  },
});
</script>
