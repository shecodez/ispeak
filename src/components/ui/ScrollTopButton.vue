<template>
  <button @click="scrollTop" v-show="visible" class="bottom-right">
    <slot>
      <i-mdi-arrow-collapse-up class="animate-bounce w-6 h-6" />
    </slot>
  </button>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    scrollTop: function () {
      this.intervalId = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(this.intervalId);
        }
        window.scroll(0, window.pageYOffset - 50);
      }, 20);
    },
    scrollListener: function (e) {
      this.visible = window.scrollY > 150;
    },
  },
  mounted: function () {
    window.addEventListener('scroll', this.scrollListener);
  },
  beforeDestroy: function () {
    window.removeEventListener('scroll', this.scrollListener);
  },
};
</script>

<style scoped>
.bottom-right {
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
}
</style>
