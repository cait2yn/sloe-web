import { useEffect, useRef, useState, type RefObject } from "react";
import { select } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomTransform } from "d3-zoom";

export interface ZoomPanControls {
  transform: ZoomTransform;
  zoomTo: (x: number, y: number, scale?: number) => void;
  reset: () => void;
}

export function useZoomPan(svgRef: RefObject<SVGSVGElement | null>): ZoomPanControls {
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const zoomBehavior = useRef(zoom<SVGSVGElement, unknown>().scaleExtent([0.2, 4]));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const selection = select(svg);
    zoomBehavior.current.on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
      setTransform(event.transform);
    });
    selection.call(zoomBehavior.current);
    return () => {
      selection.on(".zoom", null);
    };
  }, [svgRef]);

  const zoomTo = (x: number, y: number, scale = 1.4) => {
    const svg = svgRef.current;
    if (!svg) return;
    const { width, height } = svg.getBoundingClientRect();
    const next = zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-x, -y);
    select(svg).transition().duration(500).call(zoomBehavior.current.transform, next);
  };

  const reset = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const { width, height } = svg.getBoundingClientRect();
    const next = zoomIdentity.translate(width / 2, height / 2);
    select(svg).transition().duration(500).call(zoomBehavior.current.transform, next);
  };

  return { transform, zoomTo, reset };
}
