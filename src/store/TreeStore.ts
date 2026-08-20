import type { Id, TreeItem } from '../types/tree';

export class TreeStore<T extends TreeItem> {
  private items = new Map<Id, T>();
  private children = new Map<Id | null, Set<Id>>();

  constructor(items: T[]) {
    for (const item of items) {
      this.items.set(item.id, item);

      let childIds = this.children.get(item.parent);

      if (!childIds) {
        childIds = new Set<Id>();
        this.children.set(item.parent, childIds);
      }

      childIds.add(item.id);
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

    const result: T[] = [];

    for (const childId of childIds) {
      const child = this.items.get(childId);

      if (child) {
        result.push(child);
      }
    }

    return result;
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

      const childIds = this.children.get(childId);

      if (childIds) {
        for (const id of childIds) {
          queue.push(id);
        }
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

    let childIds = this.children.get(item.parent);

    if (!childIds) {
      childIds = new Set<Id>();
      this.children.set(item.parent, childIds);
    }

    childIds.add(item.id);
  }

  removeItem(id: Id): void {
    const item = this.items.get(id);

    if (!item) {
      return;
    }

    const idsToRemove: Id[] = [id];

    let index = 0;

    while (index < idsToRemove.length) {
      const currentId = idsToRemove[index++];

      const childIds = this.children.get(currentId);

      if (childIds) {
        for (const childId of childIds) {
          idsToRemove.push(childId);
        }
      }
    }

    for (const currentId of idsToRemove) {
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

        if (oldParentChildren.size === 0) {
          this.children.delete(currentItem.parent);
        }
      }

      let newParentChildren = this.children.get(item.parent);

      if (!newParentChildren) {
        newParentChildren = new Set<Id>();
        this.children.set(item.parent, newParentChildren);
      }

      newParentChildren.add(item.id);
    }

    this.items.set(item.id, item);
  }
}