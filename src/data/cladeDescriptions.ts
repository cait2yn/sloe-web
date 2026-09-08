import type { CladeId } from "../types";

/** Sidebar blurb per clade, shown in place of the app tagline once a category is selected. Kept to roughly the same length as that default caption. */
export const cladeDescriptions: Record<CladeId, string> = {
  bacteria: "A prokaryotic domain of single-celled organisms without a nucleus, found in nearly every environment on Earth.",
  archaea: "A prokaryotic domain — genomic evidence places Eukarya as a lineage emerging from within it, specifically among the Asgard archaea.",
  animalia: "The animal kingdom: multicellular organisms with nervous tissue and mobility at some stage of life.",
  fungi: "The fungal kingdom — organisms that digest food externally by secreting enzymes, then absorbing the nutrients.",
  archaeplastida: "A supergroup of nearly all photosynthetic eukaryotes, from single-celled algae to mosses, ferns, and flowering plants.",
  sar: "A supergroup linking Stramenopiles, Alveolates, and Rhizaria — diverse microbial eukaryotes.",
  discoba: "A eukaryotic clade including euglenids and their relatives, nested within the Diaphoretickes supergroup alongside SAR and Archaeplastida.",
  amoebozoa: "A supergroup of amoeboid eukaryotes that move and feed using blunt, blob-like pseudopods.",
};
