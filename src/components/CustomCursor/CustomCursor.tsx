import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

/** Any element marked with this attribute morphs the cursor into the "View" pill on hover. */
export const CURSOR_VIEW_SELECTOR = '[data-cursor="view"]';
/** Optional companion attribute — the hex color the cursor should adopt while hovering that element (e.g. a node's resolved clade color). Falls back to the default fuscia when absent. */
export const CURSOR_COLOR_ATTR = "data-cursor-color";
/** Optional companion attribute — overrides the pill's default "View" label with custom text (e.g. "view the open tree of life phylogeny"). */
export const CURSOR_LABEL_ATTR = "data-cursor-label";

const DEFAULT_COLOR = "#ff5ea6";
const DEFAULT_LABEL = "View";

const CursorEl = styled.div<{ $active: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  border-radius: 14px;
  padding: ${(p) => (p.$active ? "0 8px" : "0")};
  width: ${(p) => (p.$active ? "auto" : "16px")};
  min-width: ${(p) => (p.$active ? "41px" : "16px")};
  height: ${(p) => (p.$active ? "22px" : "16px")};
  transition:
    width 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
    height 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
    padding 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
    background-color 0.15s ease,
    opacity 0.15s ease;
`;

/**
 * Replaces the native cursor everywhere on the page: a small fuscia dot by
 * default, expanding into a "View" pill over anything marked
 * data-cursor="view", and recoloring to match a hovered element's
 * data-cursor-color (e.g. a tree node's clade color) when present. Only
 * engages on fine-pointer/hover-capable devices (desktop mice/trackpads) —
 * touch devices keep native behavior, since they have no persistent hover
 * state for this to track.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      setVisible(true);
      const target = e.target as Element | null;
      const viewEl = target?.closest?.(CURSOR_VIEW_SELECTOR) as HTMLElement | SVGElement | null;
      setActive(!!viewEl);
      setColor(viewEl?.getAttribute(CURSOR_COLOR_ATTR) || DEFAULT_COLOR);
      setLabel(viewEl?.getAttribute(CURSOR_LABEL_ATTR) || DEFAULT_LABEL);
    };
    const handleLeave = () => setVisible(false);

    // pointermove, not mousemove: d3-zoom's own drag handling attaches a
    // window-level "mousemove" listener in the capture phase and calls
    // stopImmediatePropagation on it for the duration of a pan, which
    // silently swallowed a "mousemove" listener here — the cursor would
    // visually freeze at the drag's start position for the whole gesture
    // and only "catch up" on mouseup. "pointermove" is a separate event
    // stream d3-zoom (v3-style) never touches, so tracking it instead
    // sidesteps the conflict entirely rather than fighting over event
    // phase/order on the same event type.
    window.addEventListener("pointermove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <CursorEl ref={ref} $active={active} style={{ opacity: visible ? 1 : 0, background: color }}>
      {active ? label : null}
    </CursorEl>
  );
}
