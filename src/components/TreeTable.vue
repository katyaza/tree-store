<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3';
import { themeQuartz } from 'ag-grid-community';

import { TreeStore } from '../store/TreeStore';

const props = defineProps<{
  store: TreeStore;
}>();

const rowData = props.store.getAll();

const columnDefs = [
  {
    field: 'id',
    headerName: '№ п/п',
    cellDataType: 'text',
  },
  {
    headerName: 'Категория',
    valueGetter: (params: any) => {
      const children = props.store.getChildren(params.data.id);

      return children.length > 0 ? 'Группа' : 'Элемент';
    },
  },
  {
    field: 'label',
    headerName: 'Наименование',
  },
];
</script>

<template>
  <div class="grid-wrapper">
    <AgGridVue
      :theme="themeQuartz"
      :rowData="rowData"
      :columnDefs="columnDefs"
      class="tree-grid"
    />
  </div>
</template>

<style>
.grid-wrapper {
  width: 100%;
  height: 500px;
}

.tree-grid {
  width: 100%;
  height: 100%;
}
</style>