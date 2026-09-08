import { phylogeny } from "../data/phylogeny";
import { searchAliases } from "../data/searchAliases";
import type { CladeId, TreeNode } from "../types";

export interface SearchResult {
  node: TreeNode;
  parentName: string | null;
  clade?: CladeId;
  /** The term that actually matched, when it wasn't the node's own name — e.g. "clam" for Mollusca. */
  matchedAlias: string | null;
  score: number;
}

interface IndexEntry {
  node: TreeNode;
  parentName: string | null;
  clade?: CladeId;
  terms: string[]; // lowercase: name, common, aliases
}

let index: IndexEntry[] | null = null;

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];

  function walk(node: TreeNode, parentName: string | null, inheritedClade: CladeId | undefined) {
    const clade = node.color ?? inheritedClade;
    const ownTerms = [node.name.toLowerCase(), node.common?.toLowerCase()].filter((t): t is string => !!t);
    const aliases = (searchAliases[node.id] ?? []).map((a) => a.toLowerCase());
    entries.push({
      node,
      parentName,
      clade,
      terms: [...ownTerms, ...aliases],
    });
    for (const child of node.children ?? []) walk(child, node.common ?? node.name, clade);
  }

  walk(phylogeny, null, undefined);
  return entries;
}

function getIndex(): IndexEntry[] {
  if (!index) index = buildIndex();
  return index;
}

/** Very small stemmer — just enough to fold "clams" -> "clam", "mollusks" -> "mollusk". */
function singularize(term: string): string {
  if (term.endsWith("ies") && term.length > 4) return term.slice(0, -3) + "y";
  if (term.endsWith("es") && term.length > 4) return term.slice(0, -2);
  if (term.endsWith("s") && !term.endsWith("ss") && term.length > 3) return term.slice(0, -1);
  return term;
}

function matchScore(term: string, query: string, queryAlt: string): number {
  if (term === query || term === queryAlt) return 100;
  if (term.startsWith(query) || term.startsWith(queryAlt)) return 80;
  if (term.includes(query) || term.includes(queryAlt)) return 60;
  return 0;
}

export function searchTree(rawQuery: string, limit = 8): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) return [];
  const queryAlt = singularize(query);

  const results: SearchResult[] = [];

  for (const entry of getIndex()) {
    let best = 0;
    let bestTerm: string | null = null;
    for (const term of entry.terms) {
      const s = matchScore(term, query, queryAlt);
      if (s > best) {
        best = s;
        bestTerm = term;
      }
    }
    if (best > 0) {
      const isOwnName = entry.node.name.toLowerCase() === bestTerm || entry.node.common?.toLowerCase() === bestTerm;
      results.push({
        node: entry.node,
        parentName: entry.parentName,
        clade: entry.clade,
        matchedAlias: isOwnName ? null : bestTerm,
        score: best,
      });
    }
  }

  results.sort((a, b) => b.score - a.score || a.node.name.localeCompare(b.node.name));
  return results.slice(0, limit);
}
