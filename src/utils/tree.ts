import type { TreeNode } from "../types";

export function findNode(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

/** Ids of every ancestor of `id`, root first, not including `id` itself. */
export function ancestorIds(root: TreeNode, id: string): string[] {
  const path: string[] = [];
  function walk(node: TreeNode, trail: string[]): boolean {
    if (node.id === id) {
      path.push(...trail);
      return true;
    }
    for (const child of node.children ?? []) {
      if (walk(child, [...trail, node.id])) return true;
    }
    return false;
  }
  walk(root, []);
  return path;
}
