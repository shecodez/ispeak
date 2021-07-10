<template>
  <h1>Drag & Drop</h1>

  <div>
    <div class="drop-zone" @drop="onDrop($event, 1)" @dragover.prevent @dragenter.prevent>
      <div
        v-for="item in listOne"
        :key="item.title"
        class="drag-el"
        draggable="true"
        @dragstart="startDrag($event, item.id)"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="drop-zone" @drop="onDrop($event, 2)" @dragover.prevent @dragenter.prevent>
      <div
        v-for="item in listTwo"
        :key="item.title"
        class="drag-el"
        draggable="true"
        @dragstart="startDrag($event, item.id)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DragAndDropDemo',
  setup() {
    const items = ref([
      {
        id: 0,
        title: 'Item A',
        list: 1,
      },
      {
        id: 1,
        title: 'Item B',
        list: 1,
      },
      {
        id: 2,
        title: 'Item C',
        list: 2,
      },
    ]);

    const listOne = computed(() => items.value.filter((i) => i.list === 1));
    const listTwo = computed(() => items.value.filter((i) => i.list === 2));

    const startDrag = (evt: any, id: string | number) => {
      evt.dataTransfer.dropEffect = 'move';
      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('itemID', id);
    };

    const onDrop = (evt: any, listId: number) => {
      const itemID = evt.dataTransfer.getData('itemID');
      const item = items.value.find((item) => item.id == itemID);
      item!.list = listId;
    };

    return { listOne, listTwo, startDrag, onDrop };
  },
});
</script>

<style scoped>
.drop-zone {
  background-color: rgba(0, 0, 0, 0.4);
  margin-bottom: 10px;
  padding: 10px;
}

.drag-el {
  background-color: darkgray;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid red;
}
</style>
