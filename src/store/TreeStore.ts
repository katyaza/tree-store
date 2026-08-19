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

  getChildren(id: Id): T[] {
    const childIds = this.children.get(id);

    if (!childIds) {
      return [];
    }

    return [...childIds]
      .map((childId) => this.items.get(childId))
      .filter((item): item is T => item !== undefined);
  }

  getAllChildren(id: Id): T[] {
    const result: T[] = [];
    const queue = [...(this.children.get(id) ?? [])];

    let index = 0;

    while (index < queue.length) {
      const childId = queue[index++];
      const child = this.items.get(childId);

      if (!child) {
        continue;
      }

      result.push(child);

      const children = this.children.get(childId);

      if (children) {
        queue.push(...children);
      }
    }

    return result;
  }

  getAllParents(id: Id): T[] {
    const result: T[] = [];
    let currentId: Id | null = id;

    while (currentId !== null) {
      const item = this.items.get(currentId);

      if (!item) {
        return [];
      }

      result.push(item);
      currentId = item.parent;
    }

    return result;
  }
}