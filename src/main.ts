import { createApp } from 'vue';
import Toast, { PluginOptions, POSITION } from 'vue-toastification';
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css';

import { i18n } from './i18n';
import { router } from './router';
import './firebase';

import 'virtual:windi.css';

import App from './App.vue';

const app = createApp(App);

app.use(i18n);
app.use(router);
const options: PluginOptions = {
  position: POSITION.BOTTOM_CENTER,
};
app.use(Toast, options);

app.mount('#app');
