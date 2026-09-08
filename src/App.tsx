import { useState } from "react";
import styled from "styled-components";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { PhylogramTree } from "./components/Tree/PhylogramTree";
import { CustomCursor } from "./components/CustomCursor/CustomCursor";
import { phylogeny } from "./data/phylogeny";
import { ancestorIds } from "./utils/tree";

// Figma's "main screen" frame (66:63) is 1440x1024 with the sidebar+canvas
// block (68:226) inset 139px from the left/right edges — clamp() reproduces
// that exact inset at the 1440x1024 reference size while still shrinking
// gracefully on smaller viewports. Top/bottom insets are trimmed to a
// matching 96px (the full Figma-derived ~163px/161px read as too much dead
// space above and below the content).
const Layout = styled.div`
  display: flex;
  gap: 40px;
  align-items: stretch;
  height: 100vh;
  padding: clamp(24px, 9vh, 96px) clamp(24px, 9.65vw, 139px);
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 860px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 24px;
  }
`;

const CanvasFrame = styled.div`
  flex: 1;
  min-width: 0;
  border-radius: 4px;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  overflow: hidden;

  @media (max-width: 860px) {
    height: 640px;
  }
`;

function App() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [focusRequest, setFocusRequest] = useState<{ id: string; nonce: number; select?: boolean } | null>(null);

  // Expand a node and every ancestor on the way to it so the path is
  // visible, then pan/zoom the canvas to it. Used by both the sidebar's
  // clade shortcuts and search results.
  const handleFocusNode = (nodeId: string, opts?: { select?: boolean }) => {
    const trail = [...ancestorIds(phylogeny, nodeId), nodeId];
    setExpandedIds((prev) => {
      const next = new Set(prev);
      trail.forEach((id) => next.add(id));
      return next;
    });
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      trail.forEach((id) => next.delete(id));
      return next;
    });
    setFocusRequest({ id: nodeId, nonce: Date.now(), select: opts?.select });
  };

  return (
    <Layout>
      <CustomCursor />
      <Sidebar
        onSelectClade={handleFocusNode}
        onSearchSelect={(id) => handleFocusNode(id, { select: true })}
      />
      <CanvasFrame>
        <PhylogramTree
          root={phylogeny}
          expandedIds={expandedIds}
          collapsedIds={collapsedIds}
          focusRequest={focusRequest}
        />
      </CanvasFrame>
    </Layout>
  );
}

export default App;
