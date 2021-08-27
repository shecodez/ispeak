<template>
  <div style="display: flex">
    <template v-for="(item, i) in items" :key="item">
      <n-tooltip trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-avatar v-if="i < 3" round size="small">
            {{ item.charAt(0) }}
          </n-avatar>
        </template>
        {{ item }}
      </n-tooltip>
    </template>
    <n-avatar v-if="showAddBtn || gtMax" round size="small" style="background-color: #ffd700; transform: none">
      <n-icon v-if="!gtMax">+</n-icon>
      <span v-else>{{ `+${items.length - 3}` }}</span>
    </n-avatar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'AvatarGroup',
  props: ['items', 'showAddBtn'],
  setup(props) {
    const gtMax = computed(() => props.items.length > 3);

    return { gtMax };
  },
});
</script>

<style scoped>
.n-avatar {
  border: 1px solid #f4f6f8;
}

.n-avatar:not(:first-child) {
  margin-left: -0.4rem;
}

.n-avatar:hover {
  transform: scale(1.13);
}
</style>
