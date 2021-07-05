<template>
  <form>
    <div>
      <label>Color:</label>
      <input v-model="color" />
    </div>
    <div>
      <label>Text</label>
      <input v-model="text" />
    </div>
    <div>
      <label>Translation</label>
      <input v-model="translation" />
    </div>
    <div>
      <label>Speaker</label>
      <select v-model="speaker">
        <option v-for="c in cast" :key="c" value="c">{{ c }}</option>
      </select>
    </div>
    <div>
      <button class="btn">record 🎙️</button>
    </div>

    <button class="btn block">Submit</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'NoteForm',
  setup() {
    const cast = ['narrator', 'jack', 'jill'];
    const note = reactive({
      color: 'yellow',
      text: '',
      translation: '',
      speaker: '',
      audioURL: '',
      //imageURL: ''
    });

    return { cast, ...toRefs(note) };
  },
});
</script>
