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

  addItem(item: T): void {
    this.items.set(item.id, item);

    if (!this.children.has(item.parent)) {
      this.children.set(item.parent, new Set());
    }

    this.children.get(item.parent)!.add(item.id);
  }

  removeItem(id: Id): void {
    const item = this.items.get(id);

    if (!item) {
      return;
    }

    const idsToRemove = [id];
    let index = 0;

    while (index < idsToRemove.length) {
      const currentId = idsToRemove[index++];

      const children = this.children.get(currentId);

      if (children) {
        idsToRemove.push(...children);
      }
    }

    for (const currentId of idsToRemove) {
      const currentItem = this.items.get(currentId);

      if (!currentItem) {
        continue;
      }

      this.items.delete(currentId);
      this.children.delete(currentId);
    }

    const parentChildren = this.children.get(item.parent);

    if (parentChildren) {
      parentChildren.delete(id);

      if (parentChildren.size === 0) {
        this.children.delete(item.parent);
      }
    }
  }

  updateItem(item: T): void {
    const currentItem = this.items.get(item.id);

    if (!currentItem) {
      return;
    }

    if (currentItem.parent !== item.parent) {
      const oldParentChildren = this.children.get(currentItem.parent);

      if (oldParentChildren) {
        oldParentChildren.delete(item.id);
      }

      if (!this.children.has(item.parent)) {
        this.children.set(item.parent, new Set());
      }

      this.children.get(item.parent)!.add(item.id);
    }

    this.items.set(item.id, item);
  }
}