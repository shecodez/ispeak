<template>
  <div class="relative">
    <div @click="openMenu = !openMenu"><FlagIcon :locale="locale" /></div>
    <div v-show="openMenu" class="bg-gray-300 dark:bg-gray-600 absolute right-0 py-4 rounded shadow">
      <div
        v-for="l in supportedLocales"
        :key="l.id"
        @click="setLocale(l.id)"
        class="hover:bg-gray-500 px-4 py-1"
        :class="locale === l.id ? 'bg-gray-500' : ''"
      >
        {{ l.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import FlagIcon from './FlagIcon.vue';

export default defineComponent({
  components: { FlagIcon },
  name: 'SwitchLocale',
  setup() {
    const openMenu = ref(false);
    const { locale } = useI18n();

    const supportedLocales = [
      { id: 'en', name: 'English' },
      { id: 'ja', name: '日本語' },
    ];

    const setLocale = (val: string) => {
      locale.value = val;
      openMenu.value = false;
    };

    return { openMenu, supportedLocales, locale, setLocale };
  },
});
</script>
