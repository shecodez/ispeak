<template>
  <div class="wrapper relative min-w-screen min-h-screen">
    <div class="frosted-glass">
      <div class="absolute inset-0 flex flex-col overflow-hidden">
        <PageHeader />

        <main class="cta flex-1 flex flex-col justify-around">
          <div class="w-4/5 mx-auto">
            <h1 class="text-2xl md:text-5xl lg:text-7xl leading-tight font-bold mb-12">
              {{ t('manage_your_lists') }} <br />
              <span class="typed-text capitalize">{{ typeText }}</span>
              <span class="cursor" :class="{ typing: isTyping }">&nbsp;</span>
              {{ t('easier') }}
            </h1>

            <AlertMessage
              v-if="sent"
              :type="error ? 'error' : 'success'"
              css="text-xl inline-flex"
              :message="error ? error : 'Sent you a link, check your email'"
            />
            <div v-else class="input-group">
              <input type="email" v-model="email" :placeholder="t('email_address')" @keydown.enter="submitEmail" />
              <button class="py-4 px-6 primary-yellow" @click="submitEmail">
                <span>{{ isLoading ? 'Loading...' : t('start_now') }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 transform scale-90 md:scale-120 mb-12">
            <template v-for="(row, i) in cards" :key="row">
              <div :class="cardCss(i)">
                <div class="flex flex-col gap-2">
                  <div class="animate-pulse h-3 bg-gray-200 rounded w-2/6 hidden md:block" />
                  <template v-for="card in cards[i]" :key="card">
                    <div v-if="card.id" class="card-shadow bg-gray-300 bg-opacity-30">
                      <div class="absolute transform scale-110 -mt-18 md:-mt-24 lg:-mt-16">
                        <Card :card="card" />
                      </div>
                    </div>
                    <CardSkeleton v-else />
                  </template>
                </div>
              </div>
            </template>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTitle } from '@vueuse/core';

import { useAuth } from '@/use/auth';
import PageHeader from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';
import Card from '@/components/boards/Card.vue';
import CardSkeleton from '@/components/ui/CardSkeleton.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';

export default defineComponent({
  name: 'Home',
  components: { PageHeader, Footer, Card, CardSkeleton, AlertMessage },
  setup() {
    const { t } = useI18n();
    const { auth, login } = useAuth;
    useTitle(`${t('home')} · 🎬 ${import.meta.env.VITE_APP_NAME}`);

    const state = reactive({
      email: '',
      sent: false,
      typeText: '',
      isTyping: false,
      typingSpd: 200,
      erasingSpd: 100,
      newTextDelay: 2000,
      typeArrIdx: 0,
      charIdx: 0,
      cards: [
        [1, 2],
        [3, 4, 5],
        [6],
        [
          {
            id: 7,
            text: 'Build a tool that manages audio dialogues to make studying 日本語 easier!',
            label: 'MVP',
            color: '#b6ffe0',
            assigned_to: ['shecodez'],
          },
          8,
        ],
        [9, 10, 11],
      ],
    });

    const typeArr = computed(() => [t('dialogues'), t('tasks'), t('todos')]);

    async function submitEmail() {
      await login({ email: state.email });
      state.sent = true;
    }

    function cardCss(rowIndex: number) {
      if (rowIndex === 0) return 'hidden lg:block';
      if (rowIndex === 1) return 'hidden lg:block';
      if (rowIndex === 2) return 'hidden md:block';
      if (rowIndex === 3) return 'block';
      if (rowIndex === 4) return 'hidden md:block';
    }

    function onEraseText() {
      if (state.charIdx > 0) {
        if (!state.isTyping) state.isTyping = true;

        state.typeText = typeArr.value[state.typeArrIdx].substring(0, state.charIdx - 1);
        state.charIdx -= 1;
        setTimeout(onEraseText, state.erasingSpd);
      } else {
        state.isTyping = false;
        state.typeArrIdx += 1;
        if (state.typeArrIdx >= typeArr.value.length) state.typeArrIdx = 0;

        setTimeout(onTypeText, state.typingSpd + 1000);
      }
    }

    function onTypeText() {
      if (state.charIdx < typeArr.value[state.typeArrIdx].length) {
        if (!state.isTyping) state.isTyping = true;

        state.typeText += typeArr.value[state.typeArrIdx].charAt(state.charIdx);
        state.charIdx += 1;

        setTimeout(onTypeText, state.typingSpd);
      } else {
        state.isTyping = false;
        setTimeout(onEraseText, state.newTextDelay);
      }
    }
    onMounted(() => setTimeout(onTypeText, state.newTextDelay + 200));

    return { t, ...toRefs(auth), ...toRefs(state), submitEmail, cardCss };
  },
});
</script>

<style scoped>
.wrapper {
  /* background-color: #f4f6f8; */
  background-image: url('https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
.frosted-glass {
  background: inherit;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
}
.frosted-glass::before {
  content: '';
  background: inherit;
  position: absolute;
  left: -25px;
  right: -25px;
  top: -25px;
  bottom: -25px;
  box-shadow: inset 0 0 0 3000px rgba(255, 255, 255, 0.8);
  filter: blur(10px);
}

.input-group {
  @apply flex w-11/12 md:w-1/2 lg:w-1/3;
}
.input-group > input {
  @apply bg-gray-200 border-transparent rounded-l-md flex-1;
}
.input-group > button {
  @apply rounded-r-md text-white font-font-semibold;
}

.card-shadow {
  @apply relative h-20 rounded-md max-w-sm w-full mx-auto;
}

.typed-text {
  @apply text-yellow-500;
}

.cursor {
  display: inline-block;
  margin-left: 3px;
  width: 4px;
  background-color: black;
  animation: cursorBlink 1s infinite;
}

.cursor.typing {
  animation: none;
}

@keyframes cursorBlink {
  49% {
    background-color: black;
  }
  50% {
    background-color: transparent;
  }
  50% {
    background-color: transparent;
  }
}
</style>
