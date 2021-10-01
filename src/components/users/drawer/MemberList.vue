<template>
  <aside class="flex flex-col gap-4 h-full">
    <n-input v-if="!listOnly" clearable v-model:value="query" size="large" placeholder="Search board members...">
      <template #prefix>
        <n-icon><i-uil-search /></n-icon>
      </template>
    </n-input>

    <div class="flex-1 flex flex-col gap-2">
      <!-- <h5>Recent Boards:</h5>
      <template v-for="board in boards" :key="board.id">
        <n-avatar>{{ abbrTitle(board.title) }}</n-avatar> {{ board.title }}
      </template> -->
      <h5>{{ t('board_members') }}:</h5>
      <template v-for="member in filtered" :key="member.id">
        <div class="flex items-center rounded bg-white">
          <n-avatar round size="large" :src="member.profiles.avatar_url">
            <span v-if="!member.profiles.avatar_url">{{ member.profiles.username.charAt(0) }}</span>
          </n-avatar>
          <div class="flex-1 px-3 font-semibold text-xs">
            <router-link :to="`/${member.profiles.username}`">
              {{ member.profiles.username }}
            </router-link>
          </div>
        </div>
      </template>
    </div>

    <div v-if="!listOnly" class="text-center flex flex-col gap-2">
      <n-dynamic-tags v-model:value="emails">
        <template #input="{ submit }">
          <n-auto-complete
            size="small"
            :options="options"
            v-model:value="inputValue"
            :placeholder="t('email')"
            :clear-after-select="true"
            @select="submit($event)"
          />
        </template>
        <template #trigger="{ activate, disabled }">
          <n-button size="small" @click="activate()" type="primary" dashed :disabled="disabled">
            <template #icon>
              <n-icon>
                <i-mdi-plus />
              </n-icon>
            </template>
            {{ t('email') }}
          </n-button>
        </template>
      </n-dynamic-tags>
      <button @click="sendInvite" class="btn primary-blue" :disabled="!!!emails.length">
        <div class="f-center gap-2 text-xs uppercase text-white py-1">
          <i-mdi-email-send-outline />
          <span class="">{{ t('send_invite', emails.length) }}</span>
        </div>
      </button>
    </div>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

//import { useMembers } from '@/use/db';
//import { Member } from '@/data/types/mock';

export default defineComponent({
  name: 'MemberList',
  props: {
    members: {
      type: Array, //as PropType<Member[]>,
      required: true,
    },
    boardId: {
      type: Number,
      required: true,
    },
    listOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { t } = useI18n();
    //const { invite } = useMembers;

    const state = reactive({
      query: '',
      inputValue: '',
      emails: [],
    });

    const filtered = computed(() => {
      const q = state.query.toLowerCase();
      return props.members.filter((m) => m.username.includes(q));
    });

    const options = computed(() => {
      if (state.inputValue === null) {
        return [];
      }
      const prefix = state.inputValue.split('@')[0];
      const inputSuffix = state.inputValue.split('@')[1];
      if (inputSuffix) {
        return [
          {
            label: prefix + '@' + inputSuffix,
            value: prefix + '@' + inputSuffix,
          },
        ];
      }
      return ['@gmail.com', '@yahoo.com', '@aol.com'].map((suffix) => {
        return {
          label: prefix + suffix,
          value: prefix + suffix,
        };
      });
    });

    async function sendInvite() {
      if (!!!state.emails.length) return;
      // const success = await invite({ emails: state.emails, boardId: route.params.id });
      // if (success) {
      //   toast.success('Invite(s) sent!');
      // }
    }

    return { t, ...toRefs(state), filtered, options, sendInvite };
  },
});
</script>

<style scoped>
h5 {
  @apply text-xs uppercase font-semibold my-2;
}
</style>
