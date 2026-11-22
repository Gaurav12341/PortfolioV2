"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { SplitText } from "@/components/motion";
import { about } from "@/content/about";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

/** Pointer offset for a layer at `depth` (1 = the subject). */
function usePointerLayer(x: MotionValue<number>, y: MotionValue<number>, depth: number) {
  const px = about.depth.pointerPx * depth;
  return {
    x: useTransform(x, (v) => v * px),
    y: useTransform(y, (v) => v * px * 0.6),
  };
}

/**
 * About opener: 2.5D depth stage (PHASES.md Phase 5 idea, applied to the
 * full-body portrait). Back to front: accent glow, nameplate, the cut-out,
 * then the headline. Nearer layers travel further with the pointer and the
 * scroll, so the flat illustration reads as having depth.
 *
 * Desktop: the stage sticks for ~70vh while the subject pushes in. Phones get
 * a shorter stick, no pointer motion, and the headline below the figure.
 * Reduced motion: one static frame, no sticking. Motion values only, so
 * nothing re-renders while it moves.
 */
export function AboutDepth() {
  const reduce = useReducedMotionSafe();
  const d = about.depth;
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  /* scroll: 0 when the stage pins, 1 when it releases */
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const nameScrollY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fgScrollY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1, d.zoom]);

  /* pointer: -1…1 across the stage, smoothed */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });
  const glow = usePointerLayer(px, py, 0.15);
  const name = usePointerLayer(px, py, 0.45);
  const subject = usePointerLayer(px, py, 1);
  const fg = usePointerLayer(px, py, 1.35);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)").matches) return;
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, rawX, rawY]);

  const still = reduce ? { x: 0, y: 0 } : undefined;

  return (
    <>
      <div ref={wrapRef} className={reduce ? "relative" : "relative h-[125svh] md:h-[170svh]"}>
        <div
          ref={stageRef}
          className={`${reduce ? "relative" : "sticky top-0"} h-[92svh] w-full overflow-hidden md:h-svh`}
        >
          {/* 1 · accent glow (moves least) */}
          <motion.div aria-hidden className="absolute -inset-10" style={still ?? glow}>
            <div className="absolute left-1/2 top-[38%] size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[90px]" />
          </motion.div>

          {/* 2 · nameplate, behind the figure */}
          <motion.div aria-hidden className="absolute inset-x-0 top-[20svh] flex justify-center md:top-[21svh]" style={reduce ? undefined : { y: nameScrollY }}>
            <motion.span
              className="type-nameplate whitespace-nowrap text-[clamp(2.5rem,9.4vw,10rem)] text-foreground/90"
              style={still ?? name}
            >
              {d.nameplate}
            </motion.span>
          </motion.div>

          {/* 3 · the cut-out */}
          <motion.div className="absolute inset-0 flex items-end justify-center" style={still ?? subject}>
            <span aria-hidden className="absolute bottom-[1.2svh] left-1/2 h-[4svh] w-[30svh] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(40_10_20/0.35),transparent)] blur-md" />
            <motion.picture className="block origin-bottom" style={reduce ? undefined : { scale: zoom }}>
              <source media="(max-width: 767px)" srcSet={d.subject.mobile} />
              {/* eslint-disable-next-line @next/next/no-img-element -- height-driven art-directed cut-out */}
              <img
                src={d.subject.desktop}
                alt={d.alt}
                width={d.subject.width}
                height={d.subject.height}
                loading="lazy"
                decoding="async"
                className="block h-[80svh] w-auto drop-shadow-[0_30px_40px_rgb(60_10_30/0.25)] md:h-[92svh]"
              />
            </motion.picture>
          </motion.div>

          {/* 4 · headline + caption, in front (moves most). Desktop only; phones get it below. */}
          <motion.div className="pointer-events-none absolute inset-0 hidden md:block" style={reduce ? undefined : { y: fgScrollY }}>
            <motion.div className="container-page relative h-full" style={still ?? fg}>
              <div className="absolute bottom-[9svh] left-6 max-w-[24rem] md:left-10">
                <SplitText as="h2" text={about.headline} className="text-h3 font-semibold text-balance lg:text-[2rem] lg:leading-[1.15]" />
              </div>
              <p className="absolute bottom-[9svh] right-6 text-right font-mono text-xs leading-relaxed text-muted-foreground md:right-10">
                {d.caption[0]}
                <br />
                {d.caption[1]}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Phones: headline under the figure, where it stays readable */}
      <div className="container-page mt-10 md:hidden">
        <SplitText as="h2" text={about.headline} className="text-h2 font-semibold text-balance" />
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {d.caption[0]}. {d.caption[1]}.
        </p>
      </div>
    </>
  );
}
