export type Rank =
  | "Origin"
  | "Domain"
  | "Supergroup"
  | "Kingdom"
  | "Phylum"
  | "Class"
  | "Clade"
  | "Species";

export type CladeId =
  | "bacteria"
  | "archaea"
  | "animalia"
  | "fungi"
  | "archaeplastida"
  | "sar"
  | "discoba"
  | "amoebozoa";

export interface Innovation {
  /** 1-3 word label rendered on the branch tick mark itself. */
  short: string;
  /** Full textbook-style sentence, shown on hover. */
  text: string;
}

export interface TreeNode {
  id: string;
  name: string;
  common?: string;
  rank: Rank;
  /** Clade this node belongs to for coloring. Undefined = neutral (structural join). */
  color?: CladeId;
  time?: string;
  blurb?: string;
  /** The defining evolutionary novelty (synapomorphy) that arose on this node's branch, marked as a tick on the tree. */
  innovation?: Innovation;
  children?: TreeNode[];
}

export interface CladeMeta {
  id: CladeId;
  label: string;
  rootId: string;
}
