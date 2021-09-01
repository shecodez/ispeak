<template>
  <div class="wrapper relative min-w-screen min-h-screen text-gray-900">
    <div class="frosted-glass">
      <div class="absolute inset-0 flex flex-col overflow-hidden">
        <Header />
        <slot />
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';

export default defineComponent({
  name: 'AuthLayout',
  components: { Header, Footer },
  setup() {},
});
</script>

<style scoped>
.wrapper {
  /* background-color: #f4f6f8; */
  background-image: url('/src/assets/fakurian-design-PGdW_bHDbpI-unsplash.jpg');
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
</style>
