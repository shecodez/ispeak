import { createI18n } from 'vue-i18n';

import messages from '@intlify/vite-plugin-vue-i18n/messages';
//import { datetimeFormats } from '@/i18n/dateFormats';
//import { numberFormats } from '@/i18n/numFormats';

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.locale || 'en',
  fallbackLocale: 'en',
  //globalInjection: true,
  messages,
  //datetimeFormats,
  //numberFormats
});
