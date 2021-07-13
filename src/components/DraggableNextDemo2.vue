<template>
  <draggable
    class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    :list="kanban.boards"
    group="boards"
    @change="log"
    itemKey="id"
    handle=".handle"
  >
    <template #item="{ element, index }">
      <div class="board-container">
        <div
          class="board bg-gray-600 bg-opacity-30 rounded p-2 border-t-4"
          :class="element.isPublished ? ' border-green-500' : 'border-gray-500'"
        >
          <div class="board-header mx-2 flex items-center">
            {{ element.title }} {{ index }}
            <div class="handle btn ml-auto cursor-move">📍</div>
          </div>
          <draggable
            class="note-container pb-2"
            :list="element.notes"
            group="notes"
            @change="log"
            itemKey="id"
            ghostClass="ghost-card"
          >
            <template #item="{ element, index }">
              <div class="note p-4 m-2 rounded" :style="`background-color: ${element.color}`">
                {{ element.text }} {{ index }}
              </div>
            </template>
          </draggable>
          <div class="board-footer flex mb-2">
            <TooltipButton
              iconBtn
              tooltip="Add Note"
              buttonCss="btn hover:bg-green-500"
              text="➕"
              @on-click="addNote"
            />
            <button class="btn">Edit</button>
            <button class="btn ml-auto">Delete</button>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="border-4 border-dashed h-80 flex items-center justify-center rounded">
        <button class="btn bg-green-400">Add Board</button>
        <!-- <pre class="text-xs">{{ kanban }}</pre> -->
      </div>
    </template>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import TooltipButton from '@/components/ui/TooltipButton.vue';

export default {
  name: 'DraggableNextDemo2',
  components: {
    draggable,
    TooltipButton,
  },
  data() {
    return {
      kanban: {
        boards: [
          {
            id: 'A',
            priority: 0,
            notes: [
              { id: 'AA', color: 'green', text: 'note 1' },
              { id: 'AB', color: 'blue', text: 'note 2' },
            ],
            title: 'WIP',
            isPublished: true,
          },
          {
            id: 'B',
            priority: 1,
            notes: [
              { id: 'BA', color: 'pink', text: 'note 3' },
              { id: 'BB', color: 'red', text: 'note 4' },
              { id: 'BC', color: 'purple', text: 'note 5' },
              { id: 'BD', color: 'orange', text: 'note 6' },
            ],
            title: 'Review',
            isPublished: true,
          },
          {
            id: 'C',
            priority: 2,
            notes: [{ id: 'CA', color: 'cyan', text: 'note 7' }],
            title: 'Done',
            isPublished: false,
          },
        ],
      },
    };
  },
  methods: {
    log: function (evt) {
      window.console.log(evt);
    },
    addNote: function (evt) {
      console.log('Add new note');
    },
  },
};
</script>

<style scoped>
.list-group {
  border: 1px solid red;
  padding: 5px;
}
.list-group-item {
  border: 1px solid cyan;
  padding: 5px;
}
.ghost-card {
  @apply opacity-50 border border-blue-500;
}
</style>
