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
});