import styled from "styled-components";
import type { CladeId, Innovation, TreeNode } from "../../types";
import { Badge } from "../Badge/Badge";
import { CrossIcon } from "./CrossIcon";
import { useBlurTransition, blurStyle } from "../../hooks/useBlurTransition";

const FooterBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-height: 39px;
  box-sizing: border-box;
  padding: 8px 12px;
  background: ${({ theme }) => theme.color.surface};
  border-top: 1px solid ${({ theme }) => theme.color.border};
  pointer-events: none;
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SpeciesName = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 500;
  font-size: 12px;
  font-style: italic;
  color: ${({ theme }) => theme.color.text};
  white-space: nowrap;
`;

const EmptyLabel = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

const DescriptionBox = styled.div`
  position: absolute;
  right: 12px;
  bottom: 51px;
  width: 306px;
  max-width: calc(100% - 24px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 16px;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textSecondary};
  pointer-events: none;
`;

const InnovationLine = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.text};

  strong {
    font-weight: 600;
  }
`;

const Blurb = styled.p`
  margin: 0;
`;

const DeselectButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  padding: 4px 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.border};
  color: ${({ theme }) => theme.color.subtext};
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 500;
  font-size: 11px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    filter: brightness(0.95);
  }
`;

const SIGNIFICANT_RANKS = new Set(["Origin", "Domain", "Kingdom", "Supergroup", "Clade"]);

interface HoverCardProps {
  /** The node currently shown in the footer/description — hover takes priority over selection. */
  node: TreeNode | null;
  badgeAncestor?: TreeNode;
  clade?: CladeId;
  /** Whether `node` is the actual selected node (vs. just hovered) — controls the species description reveal. */
  isSelected: boolean;
  /** The actually-selected node, independent of whatever's currently hovered — drives the Deselect button. */
  deselectTarget?: TreeNode;
  onDeselect: () => void;
}

interface FooterContentValue {
  node: TreeNode | null;
  badgeAncestor?: TreeNode;
  clade?: CladeId;
}

interface DescriptionValue {
  blurb?: string;
  innovation?: Innovation;
}

export function HoverCard({ node, badgeAncestor, clade, isSelected, deselectTarget, onDeselect }: HoverCardProps) {
  const isSpecies = node?.rank === "Species";
  const showBlurb = node ? (isSpecies ? isSelected : SIGNIFICANT_RANKS.has(node.rank)) : false;
  // A branch's defining innovation is relevant both when hovering that
  // phylum/class directly (badgeAncestor === node) and when hovering any
  // of its species (badgeAncestor === the parent phylum) — either way it
  // rides along in the same description box instead of a separate tick.
  const innovation = badgeAncestor?.innovation;
  const showDescription = (showBlurb && !!node?.blurb) || !!innovation;

  const footerKey = node?.id ?? null;
  const footerValue: FooterContentValue = { node, badgeAncestor, clade };
  const { displayed: footer, phase: footerPhase } = useBlurTransition(footerKey, footerValue);

  const descriptionKey = showDescription ? (node?.id ?? null) : null;
  const descriptionValue: DescriptionValue = { blurb: showBlurb ? node?.blurb : undefined, innovation };
  const { displayed: description, phase: descriptionPhase } = useBlurTransition(descriptionKey, descriptionValue);

  const deselectKey = deselectTarget?.id ?? null;
  const { displayed: deselect, phase: deselectPhase } = useBlurTransition(deselectKey, deselectTarget);

  return (
    <>
      {deselect && (
        <DeselectButton data-cursor="view" onClick={onDeselect} style={blurStyle(deselectPhase)}>
          Deselect {deselect.common ?? deselect.name}
          <CrossIcon color="currentColor" />
        </DeselectButton>
      )}
      {descriptionKey && (
        <DescriptionBox style={blurStyle(descriptionPhase)}>
          {description.blurb && <Blurb>{description.blurb}</Blurb>}
          {description.innovation && (
            <InnovationLine>
              <strong>{description.innovation.short}:</strong> {description.innovation.text}
            </InnovationLine>
          )}
        </DescriptionBox>
      )}
      <FooterBar>
        <FooterContent style={blurStyle(footerPhase)}>
          {footer.node && footer.badgeAncestor ? (
            <>
              <Badge rank={footer.badgeAncestor.rank} name={footer.badgeAncestor.name} clade={footer.clade} />
              {footer.node.rank === "Species" && <SpeciesName>{footer.node.name}</SpeciesName>}
            </>
          ) : (
            <EmptyLabel>None Selected</EmptyLabel>
          )}
        </FooterContent>
      </FooterBar>
    </>
  );
}
