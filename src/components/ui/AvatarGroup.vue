<template>
  <div class="flex items-center">
    <template v-for="(item, i) in items" :key="item">
      <n-tooltip trigger="hover" :show-arrow="false">
        <template #trigger>
          <div class="avatar-container f-center">
            <n-avatar v-if="i < 3" round size="small">
              {{ item.charAt(0) }}
            </n-avatar>
          </div>
        </template>
        {{ item }}
      </n-tooltip>
    </template>
    <button v-if="showAddBtn || isGtMax" @click="drawer = true" class="f-center">
      <n-avatar round size="small" class="plus-btn">
        <n-icon v-if="!isGtMax">+</n-icon>
        <span v-else>{{ `+${items.length - 3}` }}</span>
      </n-avatar>
    </button>
  </div>

  <n-drawer v-model:show="drawer" :width="320" placement="right">
    <n-drawer-content :title="t('menu').toUpperCase()" closable body-style="background-color: #eee">
      <MemberList :members="items" :boardId="boardId" />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import MemberList from '../users/drawer/MemberList.vue';

export default defineComponent({
  name: 'AvatarGroup', //TODO: rename to BoardMembersInline
  components: { MemberList },
  props: ['items', 'showAddBtn', 'boardId'],
  setup(props) {
    const { t } = useI18n();

    const state = reactive({
      drawer: false,
    });

    const isGtMax = computed(() => props.items.length > 3);

    return { t, ...toRefs(state), isGtMax };
  },
});
</script>

<style scoped>
.n-avatar {
  border: 1px solid #f4f6f8;
}

.avatar-container:not(:first-child) {
  margin-left: -0.4rem;
}

.n-avatar:hover {
  transform: scale(1.13);
}

.plus-btn {
  background-color: #ffd700;
  transform: none !important;
}
</style>
