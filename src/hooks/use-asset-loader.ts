"use client";

import { useEffect, useState } from "react";

/**
 * Real page-load progress for the intro Preloader.
 *
 * Completion is driven by two honest signals:
 *   1. window "load"       → same-origin resources are in.
 *   2. document.fonts.ready → Geist Sans / Mono are ready.
 *
 * The displayed number trickles up smoothly, is capped below 100 until both
 * signals fire, and is bounded by:
 *   - MIN_MS: long enough to read a few greetings.
 *   - MAX_MS: a safety cap so a slow asset can never hold the page hostage.
 */
export function useAssetLoader({ minMs = 1800, maxMs = 6000 } = {}) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let realDone = false;
    let raf = 0;
    let current = 0;
    let lastShown = -1;

    let pending = 2;
    const settle = () => {
      pending -= 1;
      if (pending <= 0) realDone = true;
    };

    if (document.readyState === "complete") settle();
    else window.addEventListener("load", settle, { once: true });

    if ("fonts" in document) document.fonts.ready.then(settle).catch(settle);
    else settle();

    const loop = (now: number) => {
      const elapsed = now - start;
      const trickle = 90 * (1 - Math.exp(-elapsed / 900));
      const finished = (realDone && elapsed >= minMs) || elapsed >= maxMs;
      const target = finished ? 100 : Math.min(trickle, realDone ? 96 : 90);

      current += (target - current) * 0.12;
      if (finished && target - current < 0.4) current = 100;

      // Only re-render when the integer actually changes.
      const shown = Math.round(current);
      if (shown !== lastShown) {
        lastShown = shown;
        setProgress(shown);
      }

      if (current >= 100) {
        setIsComplete(true);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [minMs, maxMs]);

  return { progress, isComplete };
}
