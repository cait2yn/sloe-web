import { useMemo } from "react";
import { hierarchy, tree, type HierarchyPointNode } from "d3-hierarchy";
import type { CladeId, TreeNode } from "../types";

export interface LaidOutNode {
  data: TreeNode;
  parent: LaidOutNode | null;
  clade?: CladeId;
  x: number; // horizontal position (depth-based, root at 0)
  y: number; // vertical position (leaf spread)
  depth: number;
  hasHiddenChildren: boolean;
}

export interface LaidOutLink {
  source: LaidOutNode;
  target: LaidOutNode;
}

export interface TreeLayout {
  nodes: LaidOutNode[];
  links: LaidOutLink[];
  byId: Map<string, LaidOutNode>;
  /** Total vertical extent the layout used — may exceed the viewport. */
  spreadHeight: number;
}

/** A node's children are collapsed by default when every child is a species tip. */
export function isDefaultCollapsed(node: TreeNode): boolean {
  return !!node.children?.length && node.children.every((c) => c.rank === "Species");
}

function pruneChildren(node: TreeNode, expanded: Set<string>, collapsed: Set<string>): TreeNode["children"] {
  if (!node.children?.length) return undefined;
  const wantsCollapsed = collapsed.has(node.id) || (isDefaultCollapsed(node) && !expanded.has(node.id));
  if (wantsCollapsed) return undefined;
  return node.children;
}

function buildPruned(node: TreeNode, expanded: Set<string>, collapsed: Set<string>): TreeNode {
  const children = pruneChildren(node, expanded, collapsed);
  return {
    ...node,
    children: children?.map((c) => buildPruned(c, expanded, collapsed)),
  };
}

export function nodeHasHiddenChildren(node: TreeNode, expanded: Set<string>, collapsed: Set<string>): boolean {
  if (!node.children?.length) return false;
  return pruneChildren(node, expanded, collapsed) === undefined;
}

const MIN_LEAF_SPACING = 22;

// A very rough per-character width estimate (px) for the label font, used
// only to keep depth columns far enough apart that a long label can't run
// into the next column's node — not exact glyph metrics, just enough
// headroom that overlap doesn't happen.
const LABEL_CHAR_WIDTH = 7;
const LABEL_PADDING = 24;

/**
 * A rectangular, right-angle phylogram: root at the left, tips fanning out
 * vertically to the right, elbow connectors instead of diagonal/radial
 * links. Leaf spacing is fixed so dense subtrees grow the canvas rather
 * than cramming — the caller pans/zooms (via useZoomPan) to reach it.
 */
export function useTreeLayout(
  root: TreeNode,
  width: number,
  expandedIds: Set<string>,
  collapsedIds: Set<string>,
): TreeLayout {
  return useMemo(() => {
    const pruned = buildPruned(root, expandedIds, collapsedIds);
    const h = hierarchy(pruned, (d) => d.children);
    const leafCount = h.leaves().length;
    const spreadHeight = Math.max(leafCount * MIN_LEAF_SPACING, 1);

    // tree() (not cluster()) positions each node proportional to its true
    // hierarchical depth rather than force-aligning every visible leaf to
    // the same rightmost column — otherwise a phylum like Chordata, whose
    // class-level children stay expanded by default, renders shallower
    // than sibling phyla whose (hidden) species children make them the
    // leaf instead, even though both are the same real depth.
    const layout = tree<TreeNode>().size([spreadHeight, Math.max(width, 200)]);
    layout(h);

    // d3's own per-depth x (here horizontal) just divides the available
    // width evenly across depths, with no notion of label width — a long
    // label (e.g. "Heimdallarchaeia") can then run straight into the next
    // column's node when that column happens to sit close by (most visibly
    // on a single-child chain, where parent and child land at the same
    // vertical position too). Widen only the columns that actually need it,
    // based on the longest label found at each depth, and leave the rest at
    // d3's even spacing.
    const rawPoints = h.descendants() as HierarchyPointNode<TreeNode>[];
    const maxDepth = rawPoints.reduce((m, p) => Math.max(m, p.depth), 0);
    const labelWidthByDepth = new Array(maxDepth + 1).fill(0);
    for (const p of rawPoints) {
      const label = p.data.common ?? p.data.name;
      const estWidth = label.length * LABEL_CHAR_WIDTH + LABEL_PADDING;
      if (estWidth > labelWidthByDepth[p.depth]) labelWidthByDepth[p.depth] = estWidth;
    }
    const evenGap = Math.max(width, 200) / Math.max(maxDepth, 1);
    const columnX: number[] = [0];
    for (let d = 1; d <= maxDepth; d++) {
      columnX[d] = columnX[d - 1] + Math.max(evenGap, labelWidthByDepth[d - 1]);
    }

    const byId = new Map<string, LaidOutNode>();
    const nodes: LaidOutNode[] = [];
    const points = rawPoints;

    for (const p of points) {
      const inheritedClade: CladeId | undefined = p.data.color ?? (p.parent ? byId.get(p.parent.data.id)?.clade : undefined);
      const laid: LaidOutNode = {
        data: p.data,
        parent: p.parent ? (byId.get(p.parent.data.id) ?? null) : null,
        clade: inheritedClade,
        x: columnX[p.depth], // depth -> horizontal, widened per-column where labels need it
        y: p.x, // spread -> vertical
        depth: p.depth,
        hasHiddenChildren: nodeHasHiddenChildren(findOriginal(root, p.data.id), expandedIds, collapsedIds),
      };
      byId.set(p.data.id, laid);
      nodes.push(laid);
    }

    const links: LaidOutLink[] = [];
    for (const p of points) {
      if (!p.parent) continue;
      const source = byId.get(p.parent.data.id)!;
      const target = byId.get(p.data.id)!;
      links.push({ source, target });
    }

    return { nodes, links, byId, spreadHeight };
  }, [root, width, expandedIds, collapsedIds]);
}

function findOriginal(root: TreeNode, id: string): TreeNode {
  if (root.id === id) return root;
  for (const c of root.children ?? []) {
    const found = findOriginal(c, id);
    if (found) return found;
  }
  return root;
}
