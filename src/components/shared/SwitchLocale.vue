<template>
  <Menu ref="menu">
    <template v-slot:activator>
      <FlagIcon :locale="locale" />
    </template>

    <template v-for="l in supportedLocales" :key="l.id">
      <MenuItem :isActive="locale === l.id">
        <div @click="setLocale(l.id)" class="p-2 text-base">
          {{ l.name }}
        </div>
      </MenuItem>
    </template>
  </Menu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import FlagIcon from '@/components/ui/FlagIcon.vue';
import Menu from '@/components/ui/Menu.vue';
import MenuItem from '@/components/ui/MenuItem.vue';

export default defineComponent({
  components: { FlagIcon, Menu, MenuItem },
  name: 'SwitchLocale',
  setup() {
    const { locale } = useI18n();

    const menu = ref();

    const supportedLocales = [
      { id: 'en', name: 'English' },
      { id: 'ja', name: '日本語' },
    ];

    const setLocale = (val: string) => {
      if (val === locale.value) return;

      locale.value = val;
      menu.value.closeMenu();
    };

    return { locale, menu, supportedLocales, setLocale };
  },
});
</script>
