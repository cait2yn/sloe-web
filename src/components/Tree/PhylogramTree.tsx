import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import type { TreeNode } from "../../types";
import { useTreeLayout, type LaidOutNode } from "../../hooks/useTreeLayout";
import { useZoomPan } from "../../hooks/useZoomPan";
import { HoverCard } from "../HoverCard/HoverCard";
import { TutorialOverlay } from "./TutorialOverlay";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Link = styled.path<{ $active: boolean; $color: string }>`
  fill: none;
  stroke: ${(p) => (p.$active ? p.$color : p.theme.color.border)};
  stroke-width: ${(p) => (p.$active ? 2.4 : 1.2)}px;
  transition:
    stroke 0.25s ease,
    stroke-width 0.25s ease;
`;

const NodeCircle = styled.circle<{ $fill: string; $interactive: boolean; $active: boolean }>`
  fill: ${(p) => p.$fill};
  stroke: ${({ theme }) => theme.color.bg};
  stroke-width: 1.5px;
  cursor: ${(p) => (p.$interactive ? "pointer" : "default")};
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(${(p) => (p.$active ? 1.4 : 1)});
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const NodeLabel = styled.text<{ $emphasis: boolean; $muted: boolean; $active: boolean }>`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${(p) => (p.$emphasis ? "12px" : "10px")};
  font-weight: ${(p) => (p.$active ? 700 : p.$emphasis ? 600 : 400)};
  font-style: ${(p) => (p.$muted ? "normal" : "italic")};
  fill: ${({ theme }) => theme.color.text};
  pointer-events: none;
  transition: font-weight 0.15s ease;
`;

const RANK_EMPHASIS = new Set(["Origin", "Domain", "Kingdom", "Supergroup"]);
const MARGIN_LEFT = 28;
const MARGIN_RIGHT = 170;

export interface PhylogramTreeHandle {
  focusNode: (id: string) => void;
}

interface PhylogramTreeProps {
  root: TreeNode;
  expandedIds: Set<string>;
  collapsedIds: Set<string>;
  focusRequest: { id: string; nonce: number; select?: boolean } | null;
}

function elbowPath(source: LaidOutNode, target: LaidOutNode): string {
  // Vertical "trunk" at the parent's depth, then a horizontal run out to
  // the child — the right-angle connector of a rectangular phylogram.
  return `M${source.x},${source.y} V${target.y} H${target.x}`;
}

function findAncestorForBadge(node: LaidOutNode): TreeNode {
  if (node.data.rank !== "Species") return node.data;
  return node.parent?.data ?? node.data;
}

/** Every node id from the root down to `node`, inclusive — the lineage that lights up on hover/select. */
function ancestorChainIds(node: LaidOutNode | null): Set<string> {
  const ids = new Set<string>();
  let cur = node;
  while (cur) {
    ids.add(cur.data.id);
    cur = cur.parent;
  }
  return ids;
}

export function PhylogramTree({ root, expandedIds, collapsedIds, focusRequest }: PhylogramTreeProps) {
  const theme = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 900, height: 700 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const availableWidth = Math.max(size.width - MARGIN_LEFT - MARGIN_RIGHT, 200);
  const layout = useTreeLayout(root, availableWidth, expandedIds, collapsedIds);
  const { transform, zoomTo, reset } = useZoomPan(svgRef);

  const marginTop = Math.max(0, (size.height - layout.spreadHeight) / 2);

  useEffect(() => {
    if (!focusRequest) return;
    const target = layout.byId.get(focusRequest.id);
    if (target) {
      zoomTo(MARGIN_LEFT + target.x, marginTop + target.y, 1.4);
      if (focusRequest.select) setSelectedId(focusRequest.id);
    } else {
      reset();
      setSelectedId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest?.nonce]);

  const activeId = hoveredId ?? selectedId;
  const activeNode = activeId ? layout.byId.get(activeId) : null;
  const activeChainIds = activeNode ? ancestorChainIds(activeNode) : null;
  const selectedNode = selectedId ? layout.byId.get(selectedId) : null;

  return (
    <Wrapper ref={wrapperRef}>
      <Svg ref={svgRef} viewBox={`0 0 ${size.width} ${size.height}`}>
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          <g transform={`translate(${MARGIN_LEFT},${marginTop})`}>
            {[...layout.links]
              // Sibling links share the same trunk coordinates near their
              // parent (each draws the full vertical run from the parent's
              // y down to its own), so they overlap in the shared range.
              // Rendering active links last keeps the highlighted stroke on
              // top instead of getting cut into by a later, plain sibling
              // painted over the same pixels.
              .sort((a, b) => Number(activeChainIds?.has(a.target.data.id) ?? false) - Number(activeChainIds?.has(b.target.data.id) ?? false))
              .map((link) => {
                const active = activeChainIds?.has(link.target.data.id) ?? false;
                const color = link.target.clade ? theme.clade[link.target.clade].swatch : theme.color.text;
                return (
                  <Link
                    key={`${link.source.data.id}-${link.target.data.id}`}
                    d={elbowPath(link.source, link.target)}
                    $active={active}
                    $color={color}
                  />
                );
              })}
            {layout.nodes.map((node) => {
              const isRoot = node.depth === 0;
              const fill = node.clade ? theme.clade[node.clade].swatch : theme.color.neutralJoin;
              const hasChildren = !!node.data.children?.length;
              const label = node.data.common ?? node.data.name;
              const emphasis = RANK_EMPHASIS.has(node.data.rank);
              const onChain = activeChainIds?.has(node.data.id) ?? false;
              return (
                <g
                  key={node.data.id}
                  data-cursor="view"
                  data-cursor-color={fill}
                  data-cursor-label="Select"
                  transform={`translate(${node.x},${node.y})`}
                  onMouseEnter={() => setHoveredId(node.data.id)}
                  onMouseLeave={() => setHoveredId((id) => (id === node.data.id ? null : id))}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(node.data.id);
                  }}
                >
                  <NodeCircle
                    r={isRoot ? 6 : emphasis ? 5 : 3.5}
                    $fill={fill}
                    $interactive={hasChildren}
                    $active={node.data.id === activeId}
                  />
                  {node.hasHiddenChildren && (
                    <circle r={2} cx={0} cy={0} fill="none" stroke={fill} strokeWidth={1} />
                  )}
                  <NodeLabel
                    $emphasis={emphasis}
                    $muted={node.data.rank !== "Species"}
                    $active={onChain}
                    x={10}
                    dy="0.32em"
                    textAnchor="start"
                  >
                    {label}
                  </NodeLabel>
                </g>
              );
            })}
          </g>
        </g>
      </Svg>
      <HoverCard
        node={activeNode?.data ?? null}
        badgeAncestor={activeNode ? findAncestorForBadge(activeNode) : undefined}
        clade={activeNode?.clade}
        isSelected={!!activeNode && activeNode.data.id === selectedId}
        deselectTarget={selectedNode?.data}
        onDeselect={() => setSelectedId(null)}
      />
      <TutorialOverlay />
    </Wrapper>
  );
}
