"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  "a, button, [role='button'], summary, label[for], select, .cursor-pointer, [data-cursor='hover']";
const TEXT_FIELD = "input, textarea, [contenteditable='true'], iframe";

/**
 * Subtle custom cursor: a small accent dot that tracks the pointer exactly,
 * plus a thin ring that lags behind and grows over interactive elements.
 *
 * - Positions are written straight to `transform` in a rAF loop (no React
 *   re-renders per mousemove), and the loop sleeps once the ring settles.
 * - Disabled on touch / coarse pointers and under prefers-reduced-motion,
 *   where the native cursor is left alone.
 * - Hidden over text fields and iframes so the I-beam / embed cursors work.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let frame = 0;

    const render = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      scale += (targetScale - scale) * 0.2;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;

      const settled =
        Math.abs(target.x - pos.x) < 0.1 &&
        Math.abs(target.y - pos.y) < 0.1 &&
        Math.abs(targetScale - scale) < 0.005;
      frame = settled ? 0 : requestAnimationFrame(render);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const setVisible = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      dot.style.opacity = v ? "1" : "0";
      ring.style.opacity = v ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

      const el = e.target as Element | null;
      const overText = !!el?.closest?.(TEXT_FIELD);
      const overInteractive = !overText && !!el?.closest?.(INTERACTIVE);
      setVisible(!overText);
      targetScale = overInteractive ? 1.6 : 1;
      ring.dataset.hover = overInteractive ? "true" : "false";
      wake();
    };

    const onLeave = () => setVisible(false);
    const onDown = () => {
      targetScale *= 0.85;
      wake();
    };
    const onUp = (e: PointerEvent) => onMove(e);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] size-8 rounded-full border border-foreground/35 opacity-0 transition-[opacity,background-color,border-color] duration-300 data-[hover=true]:border-brand/60 data-[hover=true]:bg-brand/10"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] size-1.5 rounded-full bg-brand opacity-0 transition-opacity duration-200"
      />
    </>
  );
}
