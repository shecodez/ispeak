<template>
  <FixedFrame showBottomFrame isHorizontal>
    <aside class="toolbar pt-3 px-2">
      <div class="flex items-center space-x-1">
        <button class="text-2xl hover:transform hover:scale-110">⭐</button>
        <EditInputInline ref="titleInput" :text="kanban?.title" :tooltip="t('edit_title')" @on-update="updateTitle" />
      </div>

      <div class="flex flex-wrap items-center space-x-2">
        <button class="btn border mx-2">
          {{ kanban.isPublic ? '🌎 Public' : '🔒 Private' }}
        </button>
        <IconGroupInline :items="kanban.members" />
        <Menu :list="publishList" w="w-48 max-w-56">
          <template v-slot:activator>
            <button class="btn bg-green-500 whitespace-nowrap">{{ t('publish') }} ✔️</button>
          </template>
        </Menu>
        <button class="text-2xl hover:transform hover:scale-110 px-2" @click="openKanbanSettingsDialog">
          <Tooltip :text="t('kanban_settings')" placement="bottom-left">⚙️</Tooltip>
          <span class="sr-only">Kanban Settings</span>
        </button>
      </div>
    </aside>

    <Spinner v-if="isLoading" />
    <AlertMessage v-if="error" type="error" :message="error" />
    <Editor v-else :kanban="kanban" />
    <!-- <Pagination v-if="kanban" :onPage="7" :totalItems="36" /> -->

    <template v-slot:bottom>
      <button class="primary-red rounded-tl-3xl h-full w-16" @click="openDeleteKanbanDialog">
        <Tooltip :text="t('delete_kanban')" placement="left">🗑️</Tooltip>
        <span class="sr-only">Delete Kanban/D&D Board</span>
      </button>
    </template>
  </FixedFrame>

  <EditKanbanDialog :edit="kanban" :showDialog="showKanbanSettingsDialog" :onClose="closeKanbanSettingsDialog" />
  <ConfirmDeleteDialog
    :showDialog="showDeleteKanbanDialog"
    :onClose="closeDeleteKanbanDialog"
    :onDelete="deleteKanban"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';

import useApi from '@/use/api';
import EditInputInline from '@/components/ui/EditInputInline.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import Pagination from '@/components/ui/Pagination.vue';
import ConfirmDeleteDialog from '@/components/ui/ConfirmDeleteDialog.vue';
import EditKanbanDialog from '@/components/_tbd/kanban/dialogs/EditKanbanDialog.vue';
import Menu from '@/components/ui/Menu.vue';
import Editor from '@/components/_tbd/kanban/Editor.vue';
import Spinner from '@/components/ui/Spinner.vue';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import FixedFrame from '@/layouts/FixedFrame.vue';
import IconGroupInline from '@/components/ui/IconGroup.vue';

export default defineComponent({
  name: 'Kanban',
  components: {
    EditInputInline,
    Tooltip,
    Pagination,
    ConfirmDeleteDialog,
    EditKanbanDialog,
    Menu,
    Editor,
    Spinner,
    AlertMessage,
    FixedFrame,
    IconGroupInline,
  },
  props: {
    id: {
      type: [String, Number],
    },
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const { data: kanban, isLoading, error, get, del } = useApi(`/kanbans/${route.params.id}`);

    const isSaved = ref(true);

    onBeforeRouteLeave((to, from) => {
      if (!isSaved) {
        const answer = window.confirm('Do you really want to leave? You have unsaved changes!');
        // cancel the navigation and stay on the same page
        if (!answer) return false;
      }
    });

    onMounted(() => get());

    // TODO: 🔒 -> private 🔓 -> isPublic if(!isPublic)
    // 🔐-> generate a Key -> [key] 🔑 <- dropdown: copy keyremove key, generate new key

    const publishList = computed(() =>
      kanban.value?.boards?.map((b) => ({ id: b.id, title: b.title, isChecked: b.isPublished }))
    );

    const titleInput = ref();
    const updateTitle = (title: string) => {
      console.log('Update Kanban Title:', title);
      titleInput.value.closeEdit();
    };

    const showKanbanSettingsDialog = ref(false);
    const openKanbanSettingsDialog = () => {
      showKanbanSettingsDialog.value = true;
    };
    const closeKanbanSettingsDialog = () => {
      showKanbanSettingsDialog.value = false;
    };

    const showDeleteKanbanDialog = ref(false);
    const openDeleteKanbanDialog = () => {
      showDeleteKanbanDialog.value = true;
    };
    const closeDeleteKanbanDialog = () => {
      showDeleteKanbanDialog.value = false;
    };
    const deleteKanban = () => {
      del(); // TODO: toast.success('Success: Kanban deleted.', { timeout: 4000 })
      closeKanbanSettingsDialog();
      router.push('/kanbans');
    };

    return {
      t,
      kanban,
      isLoading,
      error,
      publishList,
      titleInput,
      updateTitle,
      showKanbanSettingsDialog,
      openKanbanSettingsDialog,
      closeKanbanSettingsDialog,
      showDeleteKanbanDialog,
      openDeleteKanbanDialog,
      closeDeleteKanbanDialog,
      deleteKanban,
    };
  },
});
</script>
