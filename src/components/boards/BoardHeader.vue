<template>
  <n-page-header @back="handleBack">
    <template #title>
      <a href="#" class="title">{{ board.title }}</a>
    </template>
    <template #avatar>
      <n-avatar>{{ abbrTitle }}</n-avatar>
    </template>

    <template #extra>
      <n-space align="center" justify="end">
        <n-button ghost style="padding: 0 0.715em">
          <n-icon>
            <i-globe v-if="board.is_public" />
            <i-lock v-else />
          </n-icon>
        </n-button>
        <n-input placeholder="Search...">
          <template #prefix>
            <n-icon><i-search /></n-icon>
          </template>
        </n-input>
        <AvatarGroup :items="['AAA', 'BEE', 'CDC', 'DD']" :showAddBtn="true" />
        <n-dropdown :options="options" placement="bottom-start">
          <n-button text size="tiny" color="#9d9ea2">
            <template #icon><i-ellipsis-v /></template>
          </n-button>
        </n-dropdown>
      </n-space>
    </template>
  </n-page-header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { Search as ISearch, EllipsisV as IEllipsisV, Lock as ILock, GlobeAmericas as IGlobe } from '@vicons/fa';

import AvatarGroup from '@/components/ui/AvatarGroup.vue';

export default defineComponent({
  name: 'BoardHeader',
  components: { AvatarGroup, ISearch, IEllipsisV, ILock, IGlobe },
  props: ['board'],
  setup(props) {
    const { t } = useI18n();

    function handleBack() {
      console.log('Go Back');
    }

    const abbrTitle = computed(() =>
      props.board.title
        .split(/\s/)
        .reduce((res: string, word: string) => (res += word.slice(0, 1)), '')
        .substring(0, 3)
    );

    const options = [
      {
        label: t('add_list'),
        key: '1',
      },
      {
        label: t('edit_board'),
        key: '2',
      },
      {
        label: t('delete_board'),
        key: '3',
      },
    ];

    return { handleBack, abbrTitle, options };
  },
});
</script>

<style scoped>
.title {
  text-decoration: none;
  color: inherit;
  font-weight: bold;
}

/* .n-input {
  background-color: #eaebef;
} */

.n-button {
  display: flex;
  align-content: center;
  padding: 0 0.4em;
}
</style>
