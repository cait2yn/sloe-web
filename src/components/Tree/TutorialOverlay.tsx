import { useEffect, useState } from "react";
import styled from "styled-components";
import { useBlurTransition, blurStyle } from "../../hooks/useBlurTransition";

const Box = styled.div`
  position: absolute;
  left: 19px;
  top: 18px;
  margin: 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 500;
  font-size: 11px;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textSecondary};
  white-space: pre-line;
  pointer-events: none;
`;

const VISIBLE_MS = 2800;
const TRANSITION_MS = 250;

/** A brief onboarding hint that blurs in once the canvas has loaded, then blurs back out on its own a couple seconds later. */
export function TutorialOverlay() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  const { displayed, phase } = useBlurTransition(show ? "shown" : null, show, TRANSITION_MS);
  if (!displayed) return null;

  return (
    <Box style={blurStyle(phase, TRANSITION_MS)}>
      {"+Drag to move,\n+scroll to zoom \n+hover nodes for details"}
    </Box>
  );
}
