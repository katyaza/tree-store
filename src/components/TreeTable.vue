<script setup lang="ts">
import { computed, ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import {
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from 'ag-grid-community';

import type { TreeItem } from '../types/tree';
import { TreeStore } from '../store/TreeStore';

const props = defineProps<{
  store: TreeStore<TreeItem>;
}>();

const expandedIds = ref<Set<string | number>>(
  new Set(
    props.store
      .getAll()
      .filter(item => props.store.getChildren(item.id).length > 0)
      .map(item => item.id),
  ),
);

const items = computed(() => props.store.getAll());

const hasChildren = (id: string | number): boolean => {
  return props.store.getChildren(id).length > 0;
};

/**
 * Строим плоский список в порядке дерева.
 * Важный момент: порядок самих items не меняем.
 */
const visibleItems = computed<TreeItem[]>(() => {
  const result: TreeItem[] = [];

  const roots = items.value.filter(item => item.parent === null);

  const addChildren = (parentId: string | number) => {
    const children = props.store.getChildren(parentId);

    for (const child of children) {
      result.push(child);

      if (expandedIds.value.has(child.id) && hasChildren(child.id)) {
        addChildren(child.id);
      }
    }
  };

  for (const root of roots) {
    result.push(root);

    if (expandedIds.value.has(root.id) && hasChildren(root.id)) {
      addChildren(root.id);
    }
  }

  return result;
});

const toggleExpanded = (id: string | number) => {
  const next = new Set(expandedIds.value);

  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  expandedIds.value = next;
};

const getLevel = (item: TreeItem): number => {
  let level = 0;
  let parent = item.parent;

  while (parent !== null) {
    const parentItem = props.store.getItem(parent);

    if (!parentItem) {
      break;
    }

    level++;
    parent = parentItem.parent;
  }

  return level;
};

const getPrefix = (item: TreeItem): string => {
  const level = getLevel(item);

  return level > 0 ? '└─ '.padStart(level * 4 + 3, ' ') : '';
};

const columnDefs: ColDef<TreeItem>[] = [
  {
    headerName: '№ п/п',
    width: 90,
    valueGetter: params => {
      if (!params.node || params.node.rowIndex == null) {
        return '';
      }

      return params.node.rowIndex + 1;
    },
    cellDataType: 'number',
  },

  {
    headerName: 'Категория',
    width: 150,
    cellRenderer: (params: ICellRendererParams<TreeItem>) => {
      const item = params.data;

      if (!item) {
        return '';
      }

      const group = hasChildren(item.id);

      if (!group) {
        return 'Элемент';
      }

      const expanded = expandedIds.value.has(item.id);

      const button = document.createElement('span');

      button.textContent = expanded ? '⌄ ' : '> ';
      button.style.cursor = 'pointer';
      button.style.userSelect = 'none';
      button.style.marginRight = '4px';

      button.addEventListener('click', event => {
        event.stopPropagation();
        toggleExpanded(item.id);
      });

      const text = document.createElement('span');
      text.textContent = 'Группа';

      const container = document.createElement('span');

      container.appendChild(button);
      container.appendChild(text);

      return container;
    },
  },

  {
    headerName: 'Наименование',
    flex: 1,
    valueGetter: params => {
      const item = params.data;

      if (!item) {
        return '';
      }

      return `${getPrefix(item)}${item.label}`;
    },
  },
];
</script>

<template>
  <div class="grid-wrapper">
    <AgGridVue
      :theme="themeQuartz"
      :rowData="visibleItems"
      :columnDefs="columnDefs"
      class="tree-grid"
      :suppressCellFocus="true"
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