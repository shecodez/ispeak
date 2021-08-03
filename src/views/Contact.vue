<template>
  <FixedFrame>
    <div class="-ml-16 mt-16">
      <h1 class="text-4xl font-bold mb-2 text-center">Contact Us</h1>
      <div class="flex">
        <div class="w-1/2" />
        <div class="w-1/2">
          <form class="w-3/4 mx-auto">
            <div class="form-group">
              <label>Name</label>
              <input v-model="name" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="email" />
            </div>
            <div class="form-group">
              <label>Subject</label>
              <input v-model="subject" />
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea type="text" v-model="message" />
            </div>

            <button class="btn primary-blue">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </FixedFrame>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import { ContactForm } from '@/data/interfaces';
import FixedFrame from '@/components/layouts/FixedFrame.vue';

export default defineComponent({
  name: 'Contact',
  components: { FixedFrame },
  setup() {
    const appName = import.meta.env.VITE_APP_NAME;

    const state = reactive<ContactForm>({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    return { ...toRefs(state), appName };
  },
});
</script>
