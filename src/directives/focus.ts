// Register a global custom directive called `v-focus`
export default {
  // When the bound element is mounted into the DOM...
  mounted(el: HTMLElement) {
    // Focus the element
    el.focus();
  },
};
