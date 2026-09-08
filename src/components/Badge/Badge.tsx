import styled, { useTheme } from "styled-components";
import type { CladeId } from "../../types";

const Pill = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 4px;
  border-radius: 4px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  letter-spacing: -0.22px;
  white-space: nowrap;
  line-height: 1.5;
  user-select: none;
`;

interface BadgeProps {
  rank: string;
  name: string;
  clade?: CladeId;
}

export function Badge({ rank, name, clade }: BadgeProps) {
  const theme = useTheme();
  const palette = clade ? theme.clade[clade] : null;
  const bg = palette?.badgeBg ?? theme.color.border;
  const color = palette?.badgeText ?? theme.color.subtext;
  return (
    <Pill $bg={bg} $color={color}>
      {rank} {name}
    </Pill>
  );
}
