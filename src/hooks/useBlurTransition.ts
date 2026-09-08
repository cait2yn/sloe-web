import { useEffect, useState, type CSSProperties } from "react";

export type BlurPhase = "idle" | "exiting" | "entering";

/**
 * Tracks `value` with a lag keyed by `key`, so a caller can blur old content
 * out before swapping to new content, then blur the new content in — the
 * same "appears/disappears should blur" treatment applied consistently
 * anywhere content swaps or mounts/unmounts, not just on first appearance.
 * `key` must be a stable primitive (e.g. a node id, or null) since a fresh
 * object every render would never compare equal and retrigger constantly.
 */
export function useBlurTransition<T>(key: string | number | null, value: T, exitMs = 130) {
  const [displayedKey, setDisplayedKey] = useState(key);
  const [displayed, setDisplayed] = useState(value);
  const [phase, setPhase] = useState<BlurPhase>("idle");

  useEffect(() => {
    if (key === displayedKey) {
      setDisplayed(value);
      return;
    }
    setPhase("exiting");
    const exitTimer = setTimeout(() => {
      setDisplayed(value);
      setDisplayedKey(key);
      setPhase("entering");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("idle"));
      });
    }, exitMs);
    return () => clearTimeout(exitTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, exitMs]);

  return { displayed, phase };
}

export function blurStyle(phase: BlurPhase, durationMs = 130): CSSProperties {
  const transition = `opacity ${durationMs}ms ease, filter ${durationMs}ms ease`;
  if (phase === "idle") return { transition, opacity: 1, filter: "blur(0px)" };
  return { transition, opacity: 0, filter: "blur(6px)" };
}
