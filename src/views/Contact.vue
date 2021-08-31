<template>
  <n-layout position="absolute" content-style="display: flex; flex-direction: column;">
    <n-layout-header>
      <div class="px-6 py-4 flex items-center justify-between">
        <div class="brand flex text-2xl font-bold gap-3">
          <i-fa-solid-sticky-note class="text-yellow-500" />
          <router-link to="/">{{ appName }}</router-link>
        </div>
        <SwitchLocale />
      </div>
    </n-layout-header>
    <n-layout has-sider content-style="display: flex;">
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="0"
        :width="320"
        show-trigger="bar"
        bordered
        content-style="padding: 24px;"
        inverted
      >
        <div class="flex flex-col gap-4 h-full">
          <div class="intro">
            <h2>{{ t('get_in_touch') }}</h2>
            <p class="text-lg">
              Have a question 🤔? Want to give some feedback? Report a bug 🐞? et cetera. Feel free to drop us a line,
              we can't wait to hear from you 🥰.
            </p>
          </div>
          <div class="flex-1">
            <AlertMessage
              v-if="sent"
              :type="error ? 'error' : 'success'"
              css="text-lg"
              :message="t('message_sent_thanks')"
            />
            <form v-else>
              <h2>{{ t('send_a_message') }}</h2>
              <n-space vertical>
                <n-input size="large" v-model:value="name" type="text" :placeholder="t('name')" required />
                <n-input size="large" v-model:value="email" type="email" :placeholder="t('email')" required />
                <n-input size="large" v-model:value="message" type="textarea" :placeholder="t('message')" required />

                <n-button type="info" @click="submitForm">
                  <template #icon>
                    <n-icon>
                      <i-mail />
                    </n-icon>
                  </template>
                  {{ t('send') }}
                </n-button>
              </n-space>
            </form>
          </div>
          <div class="social">
            <h2>{{ t('follow_us') }}</h2>
            <div class="flex gap-4 text-2xl">
              <i-logos-twitter />
              <i-logos-linkedin-icon />
              <!--TODO: replace Discord with HoloSpace >.> -->
              <i-logos-discord-icon />
              <i-logos-youtube-icon />
            </div>
          </div>
        </div>
      </n-layout-sider>
      <n-layout-content content-style="flex: 1;"><GoogleMap /></n-layout-content>
      <!-- <n-layout-footer><Footer /></n-layout-footer> -->
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useTitle } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { Envelope as iMail } from '@vicons/fa';

import { ContactForm } from '@/data/types/mock';
import Footer from '@/components/shared/Footer.vue';
import GoogleMap from '@/components/ui/GoogleMap.vue';
import SwitchLocale from '@/components/shared/SwitchLocale.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';

export default defineComponent({
  name: 'Contact',
  components: { Footer, GoogleMap, SwitchLocale, iMail, AlertMessage },
  setup() {
    const { t } = useI18n();
    const appName = import.meta.env.VITE_APP_NAME;
    useTitle(`${t('contact')} · 🎬 ${appName}`);

    const state = reactive({
      sent: false,
      valid: true,
      isLoading: false,
      error: null,
      directionsFrom: null, // https://developers.google.com/maps/documentation/javascript/directions
    });

    const form = reactive<ContactForm>({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    function submitForm() {
      console.log('Send Email', form);
      state.sent = true;
    }

    return { t, appName, ...toRefs(state), ...toRefs(form), submitForm };
  },
});
</script>

<style scoped>
h2 {
  @apply text-xl uppercase mb-2;
}
</style>
