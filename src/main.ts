import { createApp } from 'vue';
import Toast, { PluginOptions, POSITION } from 'vue-toastification';
import naive from 'naive-ui';
import MasonryWall from '@yeger/vue-masonry-wall';

import { i18n } from './i18n';
import { router } from './router';
import { supabase } from './lib/supabase';
import { auth } from './use/auth/useAuth';

import 'vue-toastification/dist/index.css';
import 'virtual:windi.css';

import App from './App.vue';

const app = createApp(App);

app.config.errorHandler = (err, vm, info) => {
  // TODO: send to sentry
};

// Register a global custom directive called `v-focus`
app.directive('focus', {
  // When the bound element is mounted into the DOM...
  mounted(el) {
    // Focus the element
    el.focus();
  },
});

app.use(i18n);
app.use(router);
app.use(naive);
const options: PluginOptions = {
  position: POSITION.BOTTOM_CENTER,
  timeout: 4200,
};
app.use(Toast, options);
app.use(MasonryWall);

if (!import.meta.env.PROD) {
  app.config.performance = true;
}

app.mount('#app');

supabase.auth.onAuthStateChange((event, session) => {
  if (event == 'SIGNED_IN') {
    auth.userSession = session;
  } else if (event == 'SIGNED_OUT') {
    auth.userSession = null;
  }
});
