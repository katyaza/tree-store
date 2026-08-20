import { describe, expect, it } from 'vitest';
import { TreeStore } from './TreeStore';

const items = [
  { id: 1, parent: null, label: 'Item 1' },
  { id: '2', parent: 1, label: 'Item 2' },
  { id: 3, parent: 1, label: 'Item 3' },
  { id: 4, parent: '2', label: 'Item 4' },
  { id: 5, parent: '2', label: 'Item 5' },
  { id: 6, parent: 4, label: 'Item 6' },
];

describe('TreeStore', () => {
  const store = new TreeStore(items);

  it('getAll returns all items', () => {
    expect(store.getAll()).toEqual(items);
  });

  it('getItem returns item by id', () => {
    expect(store.getItem(1)).toEqual(items[0]);
    expect(store.getItem('2')).toEqual(items[1]);
  });

  it('getItem returns undefined for unknown id', () => {
    expect(store.getItem(999)).toBeUndefined();
  });

  it('returns direct children', () => {
    expect(store.getChildren(1)).toEqual([
      items[1],
      items[2],
    ]);
  });

  it('returns empty array when there are no children', () => {
    expect(store.getChildren(3)).toEqual([]);
  });

  it('returns empty array for unknown id', () => {
    expect(store.getChildren(999)).toEqual([]);
  });

  it('returns all children', () => {
    expect(store.getAllChildren(1)).toEqual([
      items[1],
      items[2],
      items[3],
      items[4],
      items[5],
    ]);
  });
  it('returns all parents from item to root', () => {
    expect(store.getAllParents(6)).toEqual([
      items[5],
      items[3],
      items[1],
      items[0],
    ]);
  });

  it('returns only the item for root', () => {
    expect(store.getAllParents(1)).toEqual([
      items[0],
    ]);
  });

  it('returns empty array for unknown id', () => {
    expect(store.getAllParents(999)).toEqual([]);
  });

  it('add a new item', () => {
    const newItem = {
      id: 7,
      parent: 3,
      label: 'Item 7',
    };

    store.addItem(newItem);

    expect(store.getItem(7)).toEqual(newItem);
    expect(store.getChildren(3)).toContainEqual(newItem);
  });

  it('removes item and all its children', () => {
    const store = new TreeStore(items);

    store.removeItem('2');

    expect(store.getItem('2')).toBeUndefined();
    expect(store.getItem(4)).toBeUndefined();
    expect(store.getItem(5)).toBeUndefined();
    expect(store.getItem(6)).toBeUndefined();
    expect(store.getItem(1)).toEqual(items[0]);
    expect(store.getItem(3)).toEqual(items[2]);
  });

  it('updates an item', () => {
    const store = new TreeStore(items);

    const updatedItem = {
      id: 4,
      parent: '2',
      label: 'Updated Item',
    };

    store.updateItem(updatedItem);

    expect(store.getItem(4)).toEqual(updatedItem);
  });
  it('updates parent when it is changed', () => {
    const store = new TreeStore(items);

    const updatedItem = {
      id: 4,
      parent: 3,
      label: 'Updated Item',
    };

    store.updateItem(updatedItem);

    expect(store.getChildren('2')).toEqual([
      items[4],
    ]);

    expect(store.getChildren(3)).toEqual([
      updatedItem,
    ]);
  });
});