"use client";

import React, { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { useAssetLoader } from "@/hooks/use-asset-loader";

const GREETINGS = [
  "नमस्ते",
  "Hello",
  "Bonjour",
  "स्वागत",
  "Ciao",
  "Olà",
  "やあ",
  "Hallå",
  "Guten Tag",
  "प्रणाम",
  "Hallo",
  "आपका स्वागत है",
];

const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const;

// The whole overlay slides up off-screen (GPU transform, never `top`).
const slideUp: Variants = {
  initial: { y: 0 },
  exit: { y: "-100vh", transition: { duration: 1.1, ease: EASE_CURTAIN, delay: 0.15 } },
};

/**
 * Intro screen: greetings in several languages march forward with real load
 * progress (0 → 100%), then the panel lifts with a curved bottom edge.
 *
 * Server-rendered so it covers the page from the very first paint. Colours
 * come from the theme tokens. Mounted/unmounted by <IntroGate>.
 */
export default function Preloader({
  onComplete,
  onExitStart,
}: {
  onComplete?: () => void;
  onExitStart?: () => void;
}) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [desktop, setDesktop] = useState(false);
  const { progress, isComplete } = useAssetLoader();

  useEffect(() => {
    setSize({ w: window.innerWidth, h: window.innerHeight });
    setDesktop(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  useEffect(() => {
    if (!isComplete) return;
    onExitStart?.();
    onComplete?.();
  }, [isComplete, onComplete, onExitStart]);

  const pct = Math.min(100, Math.max(0, progress));
  const index = Math.min(GREETINGS.length - 1, Math.floor((pct / 100) * GREETINGS.length));

  // Curved bottom edge for the lift (desktop only; too heavy for phone GPUs).
  const { w, h } = size;
  const curve: Variants = {
    initial: {
      d: `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 300} 0 ${h} L0 0`,
      transition: { duration: 1.7, ease: EASE_CURTAIN },
    },
    exit: {
      d: `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`,
      transition: { duration: 1.7, ease: EASE_CURTAIN, delay: 0.3 },
    },
  };

  return (
    <motion.div
      id="intro-preloader"
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct}%`}
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[99] text-foreground"
      style={{ willChange: "transform" }}
    >
      {/* Panel background: a flat fill on mobile / before measuring, the
          curved SVG on desktop so the bottom edge bows as it lifts. */}
      {desktop && w > 0 ? (
        <svg className="absolute left-0 top-0 w-full" style={{ height: "calc(100% + 300px)" }} aria-hidden>
          <motion.path variants={curve} initial="initial" exit="exit" className="fill-background" />
        </svg>
      ) : (
        <div className="absolute inset-0 bg-background" aria-hidden />
      )}

      {/* Faint grid, same as the page */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Soft accent glow (desktop) */}
      {desktop && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-brand/15 blur-[120px]"
        />
      )}

      {/* Greeting */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        {/* Dot + word centre together as one unit; the clip keeps the slide-up
            masked, and the tall line-height keeps Devanagari matras visible. */}
        <div className="flex items-center gap-4">
          <span className="block size-2.5 shrink-0 rounded-full bg-brand" />
          <span className="relative block overflow-hidden">
            <motion.span
              key={index}
              initial={{ y: "35%", opacity: 0.4 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="block whitespace-nowrap text-5xl font-light leading-[1.6] md:text-6xl"
            >
              {GREETINGS[index]}
            </motion.span>
          </span>
        </div>
      </div>

      {/* Bottom-left label */}
      <div className="absolute bottom-8 left-6 flex items-center gap-3 md:left-10" aria-hidden>
        <span className="block size-1.5 animate-pulse rounded-full bg-brand" />
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Gaurav Raj · Portfolio
        </span>
      </div>

      {/* Bottom-right counter */}
      <div className="absolute bottom-5 right-6 flex items-end tabular-nums md:right-10" aria-hidden>
        <span className="text-[22vw] font-light leading-none tracking-tighter md:text-[11vw]">
          {String(pct).padStart(2, "0")}
        </span>
        <span className="mb-[2.4vw] ml-1 text-[5vw] font-light text-accent-text md:mb-[1.4vw] md:text-[2.4vw]">
          %
        </span>
      </div>

      {/* Progress bar along the bottom (compositor-only scaleX) */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-foreground/10" aria-hidden>
        <div
          className="h-full origin-left bg-brand transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
    </motion.div>
  );
}
