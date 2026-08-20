import { describe, expect, it } from 'vitest';
import { TreeStore } from './TreeStore';

const items = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
];

describe('TreeStore', () => {
  it('getAll returns all items', () => {
    const store = new TreeStore(items);

    expect(store.getAll()).toEqual(items);
  });

  it('getItem returns item by id', () => {
    const store = new TreeStore(items);

    expect(store.getItem(1)).toEqual(items[0]);
    expect(store.getItem('91064cee')).toEqual(items[1]);
  });

  it('getItem returns undefined for unknown id', () => {
    const store = new TreeStore(items);

    expect(store.getItem(999)).toBeUndefined();
  });

  it('returns direct children', () => {
    const store = new TreeStore(items);

    expect(store.getChildren(1)).toEqual([
      items[1],
      items[2],
    ]);

    expect(store.getChildren('91064cee')).toEqual([
      items[3],
      items[4],
      items[5],
    ]);
  });

  it('returns empty array when there are no children', () => {
    const store = new TreeStore(items);

    expect(store.getChildren(3)).toEqual([]);
  });

  it('returns empty array for unknown id', () => {
    const store = new TreeStore(items);

    expect(store.getChildren(999)).toEqual([]);
  });

  it('returns all children recursively', () => {
    const store = new TreeStore(items);

    expect(store.getAllChildren(1)).toEqual([
      items[1],
      items[2],
      items[3],
      items[4],
      items[5],
      items[6],
      items[7],
    ]);
  });

  it('returns all parents from item to root', () => {
    const store = new TreeStore(items);

    expect(store.getAllParents(6)).toEqual([
      items[5],
      items[1],
      items[0],
    ]);
  });

  it('returns only the root item for root', () => {
    const store = new TreeStore(items);

    expect(store.getAllParents(1)).toEqual([
      items[0],
    ]);
  });

  it('returns empty array for unknown id', () => {
    const store = new TreeStore(items);

    expect(store.getAllParents(999)).toEqual([]);
  });

  it('adds a new item', () => {
    const store = new TreeStore(items);

    const newItem = {
      id: 9,
      parent: 3,
      label: 'Айтем 9',
    };

    store.addItem(newItem);

    expect(store.getItem(9)).toEqual(newItem);
    expect(store.getChildren(3)).toEqual([newItem]);
  });

  it('removes item and all its children', () => {
    const store = new TreeStore(items);

    store.removeItem('91064cee');

    expect(store.getItem('91064cee')).toBeUndefined();
    expect(store.getItem(4)).toBeUndefined();
    expect(store.getItem(5)).toBeUndefined();
    expect(store.getItem(6)).toBeUndefined();
    expect(store.getItem(7)).toBeUndefined();
    expect(store.getItem(8)).toBeUndefined();

    expect(store.getItem(1)).toEqual(items[0]);
    expect(store.getItem(3)).toEqual(items[2]);
  });

  it('updates an item', () => {
    const store = new TreeStore(items);

    const updatedItem = {
      id: 4,
      parent: '91064cee',
      label: 'Обновлённый айтем',
    };

    store.updateItem(updatedItem);

    expect(store.getItem(4)).toEqual(updatedItem);
  });

  it('updates parent when it is changed', () => {
    const store = new TreeStore(items);

    const updatedItem = {
      id: 4,
      parent: 3,
      label: 'Обновлённый айтем',
    };

    store.updateItem(updatedItem);

    expect(store.getChildren('91064cee')).toEqual([
      items[4],
      items[5],
    ]);

    expect(store.getChildren(3)).toEqual([
      updatedItem,
    ]);
  });
});