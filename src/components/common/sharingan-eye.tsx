"use client";

import { useEffect, useId, useImperativeHandle, useRef, type Ref } from "react";
import { SHARINGAN_FROM, SHARINGAN_FULL, SHARINGAN_TO } from "./sharingan-data";

/**
 * Sharingan → Mangekyō eye. The 3 tomoe + pupil morph into the pinwheel
 * (one flubber interpolator per piece) while the inner group spins 2 turns.
 *
 * Driven imperatively through `ref.go(0 | 1)`: a rAF loop walks `progress`
 * toward the target and writes SVG attributes directly (no React state per
 * frame), so it can reverse smoothly from any point mid-animation.
 * Reduced motion: a short crossfade between the two eyes, no spin, no morph.
 *
 * flubber (~15 kB gz) is loaded on demand: pass `preload` once the eye is
 * near the viewport, and `go()` waits for it if it isn't ready yet.
 */

export type SharinganHandle = {
  /** Animate to 0 (tomoe) or 1 (pinwheel). `onSettle` runs once it gets there, unless another `go` interrupts. */
  go: (target: 0 | 1, onSettle?: () => void) => void;
  /** Where the eye is heading (0 or 1). */
  target: () => 0 | 1;
};

const DURATION = 1800; // ms for the full transform
const REDUCED_DURATION = 400;
const TURNS = 2;

type Ring = [number, number][];
const toPath = (rings: Ring[]) => rings.map((r) => "M" + r.map((p) => p.join(" ")).join("L") + "Z").join("");
const FROM_PATHS = SHARINGAN_FROM.map((r) => toPath([r]));
const END_PATH = toPath([SHARINGAN_FULL]);

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Interp = (t: number) => string;
let morphsPromise: Promise<Interp[]> | null = null;
let morphsReady: Interp[] | null = null;
/** Imports only `interpolate`, once per page, and builds the 4 interpolators. */
function loadMorphs() {
  morphsPromise ??= import("flubber").then(({ interpolate }) => {
    morphsReady = SHARINGAN_FROM.map((r, i) => interpolate(r, SHARINGAN_TO[i], { maxSegmentLength: 4 }));
    return morphsReady;
  });
  return morphsPromise;
}

export function SharinganEye({
  ref,
  reduce = false,
  preload = false,
  className,
}: {
  ref?: Ref<SharinganHandle>;
  reduce?: boolean;
  preload?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/[^\w-]/g, "");
  const ids = { bgA: `${uid}-bgA`, bgB: `${uid}-bgB`, soft: `${uid}-soft`, iris: `${uid}-iris` };

  const glowRef = useRef<HTMLSpanElement>(null);
  const bgBRef = useRef<SVGCircleElement>(null);
  const spinRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const piecesRef = useRef<SVGGElement>(null);
  const endRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  /** Animation state lives in a ref: nothing here triggers a re-render. */
  const st = useRef({ progress: 0, target: 0 as 0 | 1, last: 0, raf: 0, onSettle: null as null | (() => void), reduce });
  st.current.reduce = reduce;

  /** Paint one frame for progress p (0..1). SVG attributes + one opacity only. */
  const render = (p: number) => {
    const s = st.current;
    const pieces = piecesRef.current;
    if (!pieces) return;
    const paths = pieces.children as HTMLCollectionOf<SVGPathElement>;

    if (s.reduce) {
      // crossfade: tomoe out, pinwheel in, nothing moves
      const f = smooth(0, 1, p);
      pieces.setAttribute("opacity", String(1 - f));
      for (let i = 0; i < paths.length; i++) paths[i].setAttribute("d", FROM_PATHS[i]);
      endRef.current!.setAttribute("opacity", String(f));
      spinRef.current!.setAttribute("transform", "");
      ringRef.current!.setAttribute("opacity", String(1 - f));
      bgBRef.current!.setAttribute("opacity", String(f));
      dotRef.current!.setAttribute("transform", "");
      dotRef.current!.setAttribute("opacity", String(f));
    } else {
      const m = smooth(0.15, 0.8, p);
      const morphs = morphsReady;
      const done = m >= 1;
      pieces.setAttribute("opacity", done ? "0" : "1");
      endRef.current!.setAttribute("opacity", done ? "1" : "0");
      if (!done) {
        const lastI = paths.length - 1; // the pupil grows a little ahead of the arms
        for (let i = 0; i < paths.length; i++) {
          const k = i === lastI ? smooth(0, 0.6, m) : m;
          paths[i].setAttribute("d", k <= 0 || !morphs ? FROM_PATHS[i] : morphs[i](k));
        }
      }
      spinRef.current!.setAttribute("transform", `rotate(${easeInOut(p) * 360 * TURNS} 512 512)`);
      ringRef.current!.setAttribute("opacity", String(1 - smooth(0.05, 0.45, p)));
      bgBRef.current!.setAttribute("opacity", String(smooth(0.3, 0.85, p)));
      const d = smooth(0.7, 1, p);
      dotRef.current!.setAttribute("transform", `translate(512 512) scale(${d}) translate(-512 -512)`);
      dotRef.current!.setAttribute("opacity", "1");
    }
    if (glowRef.current) glowRef.current.style.opacity = String(p);
  };

  const tick = (now: number) => {
    const s = st.current;
    const dt = s.last ? Math.min(now - s.last, 64) : 16;
    s.last = now;
    const step = dt / (s.reduce ? REDUCED_DURATION : DURATION);
    s.progress = s.target > s.progress ? Math.min(s.target, s.progress + step) : Math.max(s.target, s.progress - step);
    render(s.progress);
    if (s.progress !== s.target) {
      s.raf = requestAnimationFrame(tick);
    } else {
      s.raf = 0;
      s.last = 0;
      const cb = s.onSettle;
      s.onSettle = null;
      cb?.();
    }
  };

  const start = () => {
    const s = st.current;
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  };

  useImperativeHandle(ref, () => ({
    go(target, onSettle) {
      const s = st.current;
      s.target = target;
      s.onSettle = onSettle ?? null;
      if (s.reduce || morphsReady) return start();
      // first use before flubber arrived: start as soon as it's in
      loadMorphs().then(() => {
        if (st.current.target === target) start();
      });
    },
    target: () => st.current.target,
  }));

  useEffect(() => {
    if (preload) void loadMorphs();
  }, [preload]);

  /* repaint the current frame when reduced motion flips (e.g. OS setting) */
  useEffect(() => {
    render(st.current.progress);
  }, [reduce]);

  useEffect(() => () => cancelAnimationFrame(st.current.raf), []);

  return (
    <span aria-hidden className={`relative block rounded-full ${className ?? ""}`}>
      {/* glow: a fixed shadow whose opacity follows progress (compositor-only) */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_28px_5px_rgb(220_0_0/0.5)]"
        style={{ opacity: 0 }}
        ref={glowRef}
      />
      <svg viewBox="0 0 1024 1024" className="absolute inset-0 block size-full" focusable="false">
        <defs>
          <radialGradient id={ids.bgA} cx="512" cy="512" r="512" gradientUnits="userSpaceOnUse">
            <stop offset="0.16" stopColor="#2a0000" />
            <stop offset="0.27" stopColor="#940000" />
            <stop offset="0.45" stopColor="#b30000" />
            <stop offset="0.85" stopColor="#ab0000" />
            <stop offset="1" stopColor="#7a0000" />
          </radialGradient>
          <radialGradient id={ids.bgB} cx="512" cy="512" r="512" gradientUnits="userSpaceOnUse">
            <stop offset="0.3" stopColor="#9a0000" />
            <stop offset="0.5" stopColor="#bc0000" />
            <stop offset="0.85" stopColor="#aa0000" />
            <stop offset="1" stopColor="#800000" />
          </radialGradient>
          <filter id={ids.soft} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <clipPath id={ids.iris}>
            <circle cx="512" cy="512" r="500" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${ids.iris})`}>
          <circle cx="512" cy="512" r="512" fill={`url(#${ids.bgA})`} />
          <circle ref={bgBRef} cx="512" cy="512" r="512" fill={`url(#${ids.bgB})`} opacity="0" />
          <g ref={spinRef}>
            <circle
              ref={ringRef}
              cx="512"
              cy="512"
              r="264"
              fill="none"
              stroke="#4a0000"
              strokeWidth="12"
              filter={`url(#${ids.soft})`}
            />
            {/* one <path> per piece so overlaps never cancel out */}
            <g ref={piecesRef} fill="#0a0a0a">
              {FROM_PATHS.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
            <path ref={endRef} d={END_PATH} fill="#0a0a0a" opacity="0" />
            <circle
              ref={dotRef}
              cx="512"
              cy="512"
              r="70"
              fill="#a30000"
              transform="translate(512 512) scale(0) translate(-512 -512)"
            />
          </g>
        </g>
        {/* fixed outer border: outside the spinning group, never rotates or scales */}
        <circle cx="512" cy="512" r="490" fill="none" stroke="#0a0a0a" strokeWidth="44" />
      </svg>
    </span>
  );
}
