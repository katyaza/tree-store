export type Id = string | number;

export interface TreeItem {
  id: Id;
  parent: Id | null;
  [key: string]: unknown;
}