import { describe, expect, it } from 'vitest';
import { TreeStore } from './TreeStore';

interface PerformanceItem {
  id: number;
  parent: number | null;
  label: string;
}

function createItems(count: number): PerformanceItem[] {
  const items: PerformanceItem[] = [
    {
      id: 1,
      parent: null,
      label: 'Root',
    },
  ];

  for (let i = 2; i <= count; i++) {
    items.push({
      id: i,
      parent: Math.floor(i / 2),
      label: `Item ${i}`,
    });
  }

  return items;
}

describe('TreeStore performance', () => {
  const items = createItems(50_000);

  it('creates store quickly', () => {
    const start = performance.now();

    const store = new TreeStore(items);

    const elapsed = performance.now() - start;

    console.log(`TreeStore constructor: ${elapsed.toFixed(2)} ms`);

    expect(store.getAll()).toHaveLength(50_000);
  });

  it('getItem is fast', () => {
    const store = new TreeStore(items);

    const start = performance.now();

    for (let i = 0; i < 10_000; i++) {
      store.getItem(25_000);
    }

    const elapsed = performance.now() - start;

    console.log(`getItem x10000: ${elapsed.toFixed(2)} ms`);

    expect(store.getItem(25_000)?.id).toBe(25_000);
  });

  it('getChildren is fast', () => {
    const store = new TreeStore(items);

    const start = performance.now();

    for (let i = 0; i < 10_000; i++) {
      store.getChildren(1);
    }

    const elapsed = performance.now() - start;

    console.log(`getChildren x10000: ${elapsed.toFixed(2)} ms`);

    expect(store.getChildren(1)).toHaveLength(2);
  });

  it('getAllChildren works with large tree', () => {
    const store = new TreeStore(items);

    const start = performance.now();

    const result = store.getAllChildren(1);

    const elapsed = performance.now() - start;

    console.log(`getAllChildren: ${elapsed.toFixed(2)} ms`);

    expect(result).toHaveLength(49_999);
  });

  it('getAllParents works with large tree', () => {
    const store = new TreeStore(items);

    const start = performance.now();

    const result = store.getAllParents(50_000);

    const elapsed = performance.now() - start;

    console.log(`getAllParents: ${elapsed.toFixed(2)} ms`);

    expect(result[0].id).toBe(50_000);
    expect(result.at(-1)?.id).toBe(1);
  });
});