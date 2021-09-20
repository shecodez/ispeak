<template>
  <div class="h-full">
    <AlertMessage v-if="error" type="error" :message="error" />
    <draggable
      class="w-full h-full flex"
      :class="isHideOverflowY ? 'overflow-y-hidden' : 'flex-col overflow-x-hidden'"
      :list="board?.lists"
      group="lists"
      @change="log"
      itemKey="id"
      handle=".handle"
      :animation="200"
    >
      <template #item="{ element, index }">
        <List :list="element" :position="index" />
      </template>
      <template #footer>
        <div class="list-container">
          <router-link :to="{ name: 'Board.NewList' }" class="flex items-center gap-1">
            <i-mdi-plus />
            <b class="text-xs">{{ t('add_list') }}</b>
          </router-link>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable';

import { db } from '@/use/db';
import { Board } from '@/data/types/mock';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import List from '@/components/boards/List.vue';

export default defineComponent({
  name: 'Board',
  props: {
    data: {
      type: Object as PropType<Board>,
    },
  },
  components: {
    draggable,
    AlertMessage,
    List,
  },
  setup(props) {
    const { t } = useI18n();
    const route = useRoute();
    const { data: store, getById, sort } = db.boards;

    const state = reactive({
      isHideOverflowY: true,
    });

    // if not props.board fetchboardById
    // async function fetchBoardById(id: number) {
    //   //if (props?.board?.id === Number(route.params.id)) return state.board = props.board;
    //   try {
    //     state.isLoading = true;
    //     const { data, error } = await supabase
    //       .from('boards')
    //       .select(
    //         'id, title, slug, image_url, description, is_public, updated_at, lists ( id, position, title, slug, description, publish_date, gems, board_id, cards ( id, position, text, details, label, color, text_color, list_id ))'
    //       )
    //       .eq('id', id)
    //       .order('position')
    //       .order('position', { foreignTable: 'lists' })
    //       .order('position', { foreignTable: 'lists.cards' })
    //       .single();
    //     if (error) throw error;

    //     state.board = data;
    //   } catch (e) {
    //     state.error = e.error_description || e.message;
    //   } finally {
    //     state.isLoading = false;
    //   }
    // }
    onMounted(async () => await getById(Number(route.params.id)));
    watch(
      () => route.params.id,
      (id) => {
        if (id) getById(Number(id));
      }
      //{ immediate: true }
    );

    async function log(e: any) {
      //const { element, oldIndex, newIndex } = e.moved;
      if (store.board) await sort(store.board);
    }

    return {
      t,
      ...toRefs(store),
      ...toRefs(state),
      log,
    };
  },
});
</script>
