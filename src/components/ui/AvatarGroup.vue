<template>
  <div class="flex items-center">
    <template v-for="item in items.slice(0, 3)" :key="item.id">
      <n-tooltip trigger="hover" :show-arrow="false">
        <template #trigger>
          <div class="avatar-group-container f-center">
            <Avatar v-model:path="item.avatar_url" :username="item.username" size="avatar-group-item w-7 h-7" />
          </div>
        </template>
        {{ item.username }}
      </n-tooltip>
    </template>
    <button v-if="showAddBtn || isGtMax" @click="drawer = true" class="f-center avatar-group-container">
      <n-avatar round size="small" class="plus-btn">
        <n-icon v-if="!isGtMax"><i-mdi-plus /></n-icon>
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
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import { Profile } from '@/data/types/mock';
import MemberList from '../users/drawer/MemberList.vue';
import Avatar from '../shared/Avatar.vue';

export default defineComponent({
  name: 'AvatarGroup',
  components: { MemberList, Avatar },
  props: {
    items: {
      type: Array as PropType<Profile[]>,
      required: true,
    },
    showAddBtn: {
      type: Boolean,
      default: false,
    },
    boardId: {
      type: Number,
    },
  },
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

<style>
.avatar-group-item {
  border: 1px solid #f4f6f8;
}
.avatar-group-item:hover {
  transform: scale(1.13);
}
.avatar-group-container:not(:first-child) {
  margin-left: -0.4rem;
}
.plus-btn {
  background-color: #ffd700;
  transform: none !important;
}
</style>
