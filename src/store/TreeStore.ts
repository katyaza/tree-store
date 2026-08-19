import type { Id, TreeItem } from '../types/tree';

export class TreeStore<T extends TreeItem> {
  private items = new Map<Id, T>();
  private children = new Map<Id | null, Set<Id>>();

  constructor(items: T[]) {
    for (const item of items) {
      this.items.set(item.id, item);

      if (!this.children.has(item.parent)) {
        this.children.set(item.parent, new Set());
      }

      this.children.get(item.parent)!.add(item.id);
    }
  }

  getAll(): T[] {
    return [...this.items.values()];
  }

  getItem(id: Id): T | undefined {
    return this.items.get(id);
  }
}