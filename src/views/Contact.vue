<template>
  <Layout :title="t('contact')">
    <section class="text-gray-600 body-font relative flex-1 flex items-center">
      <div class="absolute inset-0 bg-gray-300">
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
          title="map"
          scrolling="no"
          src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=Hachi%C5%8Dji+(iKanban)&amp;ie=UTF8&amp;t=&amp;z=15&amp;iwloc=B&amp;output=embed"
          style="filter: grayscale(1) contrast(1.2) opacity(0.4)"
        />
      </div>
      <div class="container px-5 py-24 mx-auto flex">
        <div class="form-card">
          <h2 class="title-font">{{ t('get_in_touch') }}</h2>
          <p class="leading-relaxed mb-5 text-gray-600">
            Have a question 🤔? Want to give some feedback? Report a bug 🐞? et cetera. Feel free to drop us a line, we
            can't wait to hear from you 🥰.
          </p>

          <AlertMessage
            v-if="sent"
            :type="error ? 'error' : 'success'"
            css="text-lg"
            :message="t('message_sent_thanks')"
          />
          <form v-else @submit.prevent="submitForm">
            <!-- <h2 class="title-font">{{ t('send_a_message') }}</h2> -->
            <div class="relative mb-4">
              <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
              <input v-model="email" type="email" name="email" class="leading-8" />
            </div>
            <div class="relative mb-4">
              <label for="message" class="leading-7 text-sm text-gray-600">Message</label>
              <textarea v-model="message" name="message" class="h-32 resize-none leading-6"></textarea>
            </div>

            <button class="f-center btn primary-yellow text-white gap-2 uppercase text-lg">
              <i-mdi-email-send-outline />
              {{ t('send') }}
            </button>
          </form>

          <div class="social mt-4">
            <h2 class="title-font">{{ t('follow_us') }}</h2>
            <div class="flex gap-4 text-xs">
              <i-logos-twitter />
              <i-logos-linkedin-icon />
              <!--TODO: replace Discord with HoloSpace >.> -->
              <i-logos-discord-icon />
              <i-logos-youtube-icon />
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import { ContactForm } from '@/data/types/mock';
import Layout from '@/layouts/Default.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';

export default defineComponent({
  components: { Layout },
  name: 'Contact',
  setup() {
    const { t } = useI18n();

    const state = reactive({
      sent: false,
      valid: true,
      isLoading: false,
      error: null,
    });

    const form = reactive<ContactForm>({
      //name: '',
      email: '',
      //subject: '',
      message: '',
    });

    function submitForm() {
      console.log('Send Email', form);
      state.sent = true;
    }

    return { t, ...toRefs(state), ...toRefs(form), submitForm };
  },
});
</script>

<style scoped>
.form-card {
  @apply lg:w-1/3  md:w-1/2  bg-white rounded-lg p-8 flex flex-col md:ml-auto  w-full  mt-10  md:mt-0  relative  z-10  shadow-md;
}

h2 {
  @apply text-gray-900 text-lg mb-1 font-medium;
}

input,
textarea {
  @apply w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none  text-gray-700 py-1 px-3 transition-colors  duration-200  ease-in-out;
}

/*
.title-font {}
*/
</style>
