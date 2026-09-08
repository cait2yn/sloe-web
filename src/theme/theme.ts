import type { CladeId } from "../types";

export interface CladePalette {
  swatch: string;
  badgeBg: string;
  badgeText: string;
}

export interface Theme {
  mode: "light" | "dark";
  color: {
    bg: string;
    surface: string;
    surfaceRaised: string;
    border: string;
    text: string;
    textSecondary: string;
    subtext: string;
    neutralJoin: string;
    brand: string;
    brandTint: string;
  };
  clade: Record<CladeId, CladePalette>;
  font: {
    brand: string;
    mono: string;
    sans: string;
  };
}

// Hex values pulled directly from the Figma "@claude component reference"
// section (nodes 58:19–58:38 for swatches, 69:234–69:256 for badge states).
const cladeLight: Record<CladeId, CladePalette> = {
  discoba: { swatch: "#FF5EA6", badgeBg: "rgba(255,94,166,0.15)", badgeText: "#cf538b" }, // fuscia
  archaea: { swatch: "#FFA15E", badgeBg: "rgba(255,161,94,0.15)", badgeText: "#e37e36" }, // orange
  fungi: { swatch: "#7E5EFF", badgeBg: "rgba(126,94,255,0.15)", badgeText: "#7e5eff" }, // indigo
  animalia: { swatch: "#CC5EFF", badgeBg: "rgba(204,94,255,0.15)", badgeText: "#993ac5" }, // magenta
  sar: { swatch: "#62E1B7", badgeBg: "rgba(98,225,183,0.15)", badgeText: "#289f78" }, // teal
  archaeplastida: { swatch: "#97E162", badgeBg: "rgba(151,225,98,0.15)", badgeText: "#50ac0e" }, // lime
  bacteria: { swatch: "#67D8EC", badgeBg: "rgba(103,216,236,0.15)", badgeText: "#267786" }, // blue-1
  amoebozoa: { swatch: "#67A3EC", badgeBg: "rgba(103,163,236,0.15)", badgeText: "#3f6a9f" }, // blue-2
};

// Dark-mode variants: raw swatch hue used as badge text (reads bright against
// a dark surface instead of the muted light-mode text shade), bg opacity
// bumped slightly so the tint still registers against a dark ground.
const cladeDark: Record<CladeId, CladePalette> = {
  discoba: { swatch: "#FF7FB8", badgeBg: "rgba(255,94,166,0.22)", badgeText: "#ff8ec0" },
  archaea: { swatch: "#FFB47A", badgeBg: "rgba(255,161,94,0.22)", badgeText: "#ffb885" },
  fungi: { swatch: "#9A82FF", badgeBg: "rgba(126,94,255,0.24)", badgeText: "#a993ff" },
  animalia: { swatch: "#D97FFF", badgeBg: "rgba(204,94,255,0.22)", badgeText: "#dd93ff" },
  sar: { swatch: "#7EE8C4", badgeBg: "rgba(98,225,183,0.22)", badgeText: "#8bedcb" },
  archaeplastida: { swatch: "#AAE885", badgeBg: "rgba(151,225,98,0.22)", badgeText: "#b3ec91" },
  bacteria: { swatch: "#87E1F1", badgeBg: "rgba(103,216,236,0.22)", badgeText: "#93e5f3" },
  amoebozoa: { swatch: "#87B7F0", badgeBg: "rgba(103,163,236,0.22)", badgeText: "#95c0f2" },
};

const font = {
  brand: "'Libre Baskerville', Georgia, serif",
  mono: "'Oxygen Mono', ui-monospace, monospace",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

export const lightTheme: Theme = {
  mode: "light",
  color: {
    bg: "#fdfdfd", // neutral-15
    surface: "#fbfbfb", // neutral-50
    surfaceRaised: "#ffffff",
    border: "#efefef",
    text: "#3c3c3c", // neutral-800
    textSecondary: "#939393", // neutral-400
    subtext: "#828282",
    neutralJoin: "#b0b0b0",
    brand: "#FF5EA6",
    brandTint: "#ffeff6",
  },
  clade: cladeLight,
  font,
};

export const darkTheme: Theme = {
  mode: "dark",
  color: {
    bg: "#18181a",
    surface: "#1f2023",
    surfaceRaised: "#2a2b2f",
    border: "#33343a",
    text: "#f2f2f2",
    textSecondary: "#a6a6a6",
    subtext: "#8a8a8a",
    neutralJoin: "#6b6c72",
    brand: "#FF7FB8",
    brandTint: "#3a2430",
  },
  clade: cladeDark,
  font,
};
