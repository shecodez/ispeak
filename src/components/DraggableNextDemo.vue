<template>
  <!-- <div class="grid grid-cols-4 gap-4">
    <div class="bg-gray-600">
      <h3>Draggable 1</h3>
      <button class="btn border">Move</button>
      <draggable class="list-group" :list="list1" group="people" @change="log" itemKey="name">
        <template #item="{ element, index }">
          <div class="list-group-item">{{ element.name }} {{ index }}</div>
        </template>
      </draggable>
    </div>

    <div class="bg-gray-600">
      <h3>Draggable 2</h3>
      <button class="btn border">Move</button>
      <draggable class="list-group" :list="list2" group="people" @change="log" itemKey="name">
        <template #item="{ element, index }">
          <div class="list-group-item">{{ element.name }} {{ index }}</div>
        </template>
      </draggable>
    </div>

    <pre>{{ list1 }}</pre>
    <pre>{{ list2 }}</pre>
  </div> -->
  <div class="flex">
    <div class="w-3/4">
      <h3>Draggable Kanban</h3>

      <draggable class="grid grid-cols-3 gap-4" :list="kanban.boards" group="boards" @change="log" itemKey="id">
        <template #item="{ element, index }">
          <div class="border">
            <div class="border-green-400">
              <div class="mx-2 flex items-center">
                {{ element.title }} {{ index }}
                <button class="btn ml-auto">📍</button>
              </div>
              <draggable class="px-2 pt-2 border pb-4" :list="element.notes" group="notes" @change="log" itemKey="id">
                <template #item="{ element, index }">
                  <div class="p-4 m-2 rounded" :style="`background-color: ${element.color}`">
                    {{ element.text }} {{ index }}
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div class="w-1/4">
      <pre>{{ kanban }}</pre>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  name: 'DraggableNextDemo',
  components: {
    draggable,
  },
  data() {
    return {
      list1: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ],
      list2: [
        { name: 'Juan', id: 5 },
        { name: 'Edgard', id: 6 },
        { name: 'Johnson', id: 7 },
      ],

      kanban: {
        boards: [
          {
            id: 'A',
            priority: 0,
            notes: [
              { id: 'AA', color: 'green', text: 'note 1' },
              { id: 'AB', color: 'blue', text: 'note 2' },
            ],
            title: 'title 0',
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
            title: 'title 1',
          },
          {
            id: 'C',
            priority: 2,
            notes: [{ id: 'CA', color: 'cyan', text: 'note 7' }],
            title: 'title 2',
          },
        ],
      },
    };
  },
  methods: {
    log: function (evt) {
      window.console.log(evt);
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
</style>
