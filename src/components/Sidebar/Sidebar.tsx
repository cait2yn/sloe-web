import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import styled, { useTheme } from "styled-components";
import chevronRight from "../../assets/icons/chevron-right.svg";
import searchIcon from "../../assets/icons/search.svg";
import { clades } from "../../data/phylogeny";
import { cladeDescriptions } from "../../data/cladeDescriptions";
import { searchTree } from "../../utils/search";
import { BrandMark } from "./BrandMark";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import type { CladeId } from "../../types";

const Aside = styled.aside`
  width: 221px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BrandHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Wordmark = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.brand};
  font-weight: 600;
  font-size: 24px;
  letter-spacing: -0.96px;
  color: ${({ theme }) => theme.color.text};
`;

const TaglineBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Tagline = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text};
`;

const Caption = styled.p`
  margin: 12px 0 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textSecondary};
  max-width: 189px;
`;

// Swapping the sidebar's clade content via a key-swap AnimatePresence
// (framer-motion) turned out to conflict with React StrictMode's
// double-invoked render pass — it would work once, then wedge on every
// subsequent switch. This hand-rolled phase machine drives plain CSS
// transitions instead, which don't depend on any library-side exit
// bookkeeping, so it can't get confused by StrictMode.
type TransitionPhase = "idle" | "exiting" | "entering";
const TRANSITION_MS = 220;

// The tagline/caption swap is the primary content change, so it gets the
// fuller "slide-blur" treatment. The icon and reference link are just
// recoloring, so they get a lighter blur-only fade — enough motion to read
// as a change, not so much it fights for attention with the text swap.
function slideBlurStyle(phase: TransitionPhase): CSSProperties {
  const transition = `opacity ${TRANSITION_MS}ms ease, filter ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`;
  if (phase === "idle") return { transition, opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" };
  const y = phase === "exiting" ? -6 : 6;
  return { transition, opacity: 0, filter: "blur(6px)", transform: `translateY(${y}px)` };
}

function blurFadeStyle(phase: TransitionPhase): CSSProperties {
  const transition = `opacity ${TRANSITION_MS}ms ease, filter ${TRANSITION_MS}ms ease`;
  if (phase === "idle") return { transition, opacity: 1, filter: "blur(0px)" };
  return { transition, opacity: 0, filter: "blur(6px)" };
}

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReferenceLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.color.brandTint};
  color: ${({ theme }) => theme.color.brand};
  text-decoration: none;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  letter-spacing: -0.24px;
`;

const PhylogenyCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
`;

// Accordion reveal via grid-template-rows (0fr -> 1fr) rather than height:
// auto isn't animatable and JS-measured heights add a layer of state just
// to fight StrictMode/timing quirks — this is plain CSS, no measurement,
// no library, so it can't wedge the way the AnimatePresence swap did.
const ExplainerWrapper = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${(p) => (p.$open ? "1fr" : "0fr")};
  margin-top: ${(p) => (p.$open ? "10px" : "0px")};
  width: 100%;
  transition:
    grid-template-rows 0.25s ease,
    margin-top 0.25s ease;
`;

const ExplainerInner = styled.div`
  overflow: hidden;
  min-height: 0;
`;

const ExpandableButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  width: 100%;
`;

const Icon20 = styled.img<{ $rotated?: boolean }>`
  width: 20px;
  height: 20px;
  transform: rotate(${(p) => (p.$rotated ? 90 : 0)}deg);
  transition: transform 0.15s ease;
`;

const Explainer = styled.p<{ $open: boolean }>`
  margin: 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textSecondary};
  max-width: 189px;
  opacity: ${(p) => (p.$open ? 1 : 0)};
  transition: opacity 0.2s ease ${(p) => (p.$open ? "0.08s" : "0s")};
`;

// Recolors to match whichever clade is currently selected in Navigation
// (same value driving the icon/reference-link color), so it stays tied to
// the active category rather than a fixed brand color.
const InlineLink = styled.a`
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s ease;
`;

const NavBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NavHeading = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text};
`;

const NavCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text};

  &::placeholder {
    color: ${({ theme }) => theme.color.textSecondary};
  }
`;

const ResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  max-height: 280px;
  overflow-y: auto;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  z-index: 10;
`;

const ResultRow = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  border: none;
  background: ${(p) => (p.$active ? p.theme.color.border : "transparent")};
  padding: 8px 12px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.color.border};
  }
`;

const ResultMain = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.color.text};
`;

const ResultDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const ResultRank = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.color.subtext};
`;

const ResultHint = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 11px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

const EmptyState = styled.p`
  margin: 0;
  padding: 10px 12px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CategoryRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  width: 100%;
`;

const CategoryLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const CategoryLabel = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text};
`;

interface SidebarProps {
  onSelectClade: (cladeRootId: string) => void;
  onSearchSelect: (nodeId: string) => void;
}

const DEFAULT_TAGLINE = "Some Life on Earth";
const DEFAULT_CAPTION =
  "A brief phylogeny of SOME life on Earth — not all, under the two-domain system — solely for educational and/or exploratory purposes.";

export function Sidebar({ onSelectClade, onSearchSelect }: SidebarProps) {
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  // `activeCladeId` is the target selection; `displayedCladeId` is what's
  // currently rendered and lags behind it for the duration of the exit
  // animation (see the phase effect below).
  const [activeCladeId, setActiveCladeId] = useState<CladeId | null>(null);
  const [displayedCladeId, setDisplayedCladeId] = useState<CladeId | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const theme = useTheme();

  const handleGoHome = () => setActiveCladeId(null);

  useEffect(() => {
    if (activeCladeId === displayedCladeId) return;
    setPhase("exiting");
    const exitTimer = setTimeout(() => {
      setDisplayedCladeId(activeCladeId);
      setPhase("entering");
      // Two rAFs so the browser paints the "entering" (blurred) state at
      // least once before we flip to "idle" — otherwise the transition to
      // idle can get coalesced with the entering style and never animate.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("idle"));
      });
    }, TRANSITION_MS);
    return () => clearTimeout(exitTimer);
  }, [activeCladeId, displayedCladeId]);

  const activeClade = displayedCladeId ? clades.find((c) => c.id === displayedCladeId) : undefined;
  const iconColor = displayedCladeId ? theme.clade[displayedCladeId].swatch : theme.color.brand;
  const linkBg = displayedCladeId ? theme.clade[displayedCladeId].badgeBg : theme.color.brandTint;
  const linkColor = displayedCladeId ? theme.clade[displayedCladeId].swatch : theme.color.brand;

  const handleCategoryClick = (clade: (typeof clades)[number]) => {
    setActiveCladeId((id) => (id === clade.id ? null : clade.id));
    onSelectClade(clade.rootId);
  };

  const results = useMemo(() => searchTree(query), [query]);
  const trimmed = query.trim();
  const isOpen = trimmed.length > 0;

  const selectResult = (nodeId: string) => {
    onSearchSelect(nodeId);
    setQuery("");
    setActiveIndex(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
      return;
    }
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const result = results[activeIndex];
      if (result) selectResult(result.node.id);
    }
  };

  return (
    <Aside>
      <BrandBlock>
        <BrandHeader>
          <BrandRow
            data-cursor="view"
            data-cursor-label="Some Life on Earth"
            onClick={handleGoHome}
            style={{ cursor: "pointer" }}
          >
            <BrandMark color={iconColor} style={blurFadeStyle(phase)} />
            <Wordmark>sloe</Wordmark>
          </BrandRow>
          <TaglineBlock style={slideBlurStyle(phase)}>
            <Tagline>{activeClade ? activeClade.label : DEFAULT_TAGLINE}</Tagline>
            <Caption>{displayedCladeId ? cladeDescriptions[displayedCladeId] : DEFAULT_CAPTION}</Caption>
          </TaglineBlock>
        </BrandHeader>
        <LinkList>
          <ReferenceLink
            href="https://tree.opentreeoflife.org/"
            target="_blank"
            rel="noreferrer"
            data-cursor="view"
            style={{ ...blurFadeStyle(phase), background: linkBg, color: linkColor }}
          >
            Open Tree of Life
            <ArrowUpRightIcon color={linkColor} />
          </ReferenceLink>
          <PhylogenyCard>
            <ExpandableButton data-cursor="view" onClick={() => setExplainerOpen((v) => !v)} aria-expanded={explainerOpen}>
              What is a Phylogeny?
              <Icon20 src={chevronRight} alt="" $rotated={explainerOpen} />
            </ExpandableButton>
            <ExplainerWrapper $open={explainerOpen}>
              <ExplainerInner>
                <Explainer $open={explainerOpen}>
                  A{" "}
                  <InlineLink
                    href="https://en.wikipedia.org/wiki/Phylogenetic_tree"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: linkColor }}
                  >
                    phylogeny
                  </InlineLink>{" "}
                  is a branching diagram that shows estimated evolutionary relationships among organisms,
                  based on shared ancestry — the closer two branches meet, the more recently they shared a
                  common ancestor.
                </Explainer>
              </ExplainerInner>
            </ExplainerWrapper>
          </PhylogenyCard>
        </LinkList>
      </BrandBlock>


      <NavBlock>
        <NavHeading>Navigation</NavHeading>
        <NavCard>
          <SearchWrapper>
            <SearchBox>
              <SearchInput
                placeholder="“human”"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
              />
              <Icon20 src={searchIcon} alt="" />
            </SearchBox>
            {isOpen && (
              <ResultsDropdown>
                {trimmed.length < 2 ? (
                  <EmptyState>Keep typing…</EmptyState>
                ) : results.length === 0 ? (
                  <EmptyState>No matches for “{trimmed}”</EmptyState>
                ) : (
                  results.map((result, i) => (
                    <ResultRow
                      key={result.node.id}
                      type="button"
                      data-cursor="view"
                      $active={i === activeIndex}
                      onMouseDown={(e) => {
                        // fires before the input's blur, so the click still registers
                        e.preventDefault();
                        selectResult(result.node.id);
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      <ResultMain>
                        {result.clade && <ResultDot $color={theme.clade[result.clade].swatch} />}
                        {result.node.common ?? result.node.name}
                        <ResultRank>{result.node.rank}</ResultRank>
                      </ResultMain>
                      {result.matchedAlias && <ResultHint>matches “{result.matchedAlias}”</ResultHint>}
                    </ResultRow>
                  ))
                )}
              </ResultsDropdown>
            )}
          </SearchWrapper>
          <CategoryList>
            {clades.map((clade) => (
              <CategoryRow
                key={clade.id}
                data-cursor="view"
                data-cursor-color={theme.clade[clade.id].swatch}
                data-cursor-label="Learn More"
                onClick={() => handleCategoryClick(clade)}
              >
                <CategoryLeft>
                  <Dot $color={theme.clade[clade.id].swatch} />
                  <CategoryLabel>{clade.label}</CategoryLabel>
                </CategoryLeft>
                <Icon20 src={chevronRight} alt="" />
              </CategoryRow>
            ))}
          </CategoryList>
        </NavCard>
      </NavBlock>
    </Aside>
  );
}
