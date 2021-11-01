<template>
  <div class="wrapper relative min-w-screen min-h-screen flex flex-col">
    <header class="py-5 px-10 flex items-center justify-between">
      <div class="brand flex text-2xl font-bold gap-3">
        <i-fa-solid-sticky-note class="text-yellow-500" />
        <router-link to="/">iKanban!</router-link>
      </div>
      <SwitchLocale />
    </header>

    <main class="f-center flex-1">
      <div>
        <div class="w-full flex md:flex-row-reverse ml-20">
          <div class="w-11/12 md:w-2/3 lg:w-1/2">
            <div class="not-found-gif w-md h-md rounded-full" />
          </div>
        </div>

        <div class="relative max-w-sm transform md:scale-125 lg:scale-150 mx-auto -mt-20">
          <Card :card="card">
            <div class="flex flex-col gap-2 font-bold">
              <router-link to="/" class="ml-auto capitalize hover:underline"> {{ t('go_home') }} X </router-link>
              <h1 class="text-4xl">{{ text }}</h1>
            </div>
          </Card>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Color, Card as iCard } from '@/data/types/mock';
import Card from '@/components/boards/Card.vue';
import Footer from '@/components/shared/Footer.vue';

export default defineComponent({
  name: 'NotFound',
  components: { Card, Footer },
  setup() {
    const { t } = useI18n();

    const card = ref<iCard>({
      id: 1,
      text: 'Hmm., this page was not found',
      label: '404',
      color: Color.red,
      assigned_to: [{ username: 'iKanban!' }],
    });

    const text = computed(() => t('page_not_found_message'));

    return { t, card, text };
  },

  //TODO: add transitions: fade-in for card and slide up for both card and gif
});
</script>

<style scoped>
.not-found-gif {
  background-image: url('/src/assets/JohnTravoltaLost.gif');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
.wrapper {
  background-color: #f9f9f9;
  /* background-image: url('./src/assets/404_frame2.png');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: contain;
  background-position: center center; */
}
</style>
