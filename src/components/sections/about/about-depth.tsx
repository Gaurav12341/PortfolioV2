"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { IconPointerFilled } from "@tabler/icons-react";
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

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One plane of the stack. In flex mode it slides out to its `z`, gets a
 * frame drawn around it and a mono label in one corner.
 */
function Plane({
  flex,
  amount,
  z,
  index,
  label,
  depth,
  corner,
  className = "",
  fade = false,
  children,
}: {
  flex: boolean;
  amount: MotionValue<number>;
  z: number;
  index: number;
  label: string;
  depth: number;
  corner: "tl" | "tr" | "bl" | "br";
  className?: string;
  /** only visible in flex mode */
  fade?: boolean;
  children?: ReactNode;
}) {
  /* clamp: the spring overshoots below 0 on the way back, which would flip
     the stack order for a frame (name in front of the cut-out) */
  const tz = useTransform(amount, (f) => Math.max(0, f) * z);
  const fadeIn = useTransform(amount, (f) => Math.max(0, f));
  const pos = {
    tl: "left-4 top-4",
    tr: "right-4 top-4 text-right",
    bl: "bottom-4 left-4",
    br: "bottom-4 right-4 text-right",
  }[corner];

  return (
    <motion.div className={`absolute inset-0 ${className}`} style={fade ? { z: tz, opacity: fadeIn } : { z: tz }} aria-hidden={fade || undefined}>
      {children}

      {/* frame + faint glass tint, flex mode only */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-brand/[0.015]"
        initial={false}
        animate={{ opacity: flex ? 1 : 0 }}
        transition={{ duration: 0.5, delay: flex ? 0.15 + index * 0.06 : 0 }}
      />
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          fill="none"
          className="stroke-brand"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ pathLength: flex ? 1 : 0, opacity: flex ? 0.7 : 0 }}
          transition={{ duration: flex ? 1.1 : 0.35, ease: EASE, delay: flex ? 0.2 + index * 0.09 : 0 }}
        />
      </svg>

      <motion.p
        aria-hidden
        className={`pointer-events-none absolute ${pos} font-mono text-[11px] leading-snug text-accent-text`}
        initial={false}
        animate={{ opacity: flex ? 1 : 0, y: flex ? 0 : 6 }}
        transition={{ duration: 0.45, delay: flex ? 0.55 + index * 0.09 : 0 }}
      >
        <span className="text-foreground">{String(index).padStart(2, "0")}</span> · {label}
        <br />
        <span className="text-muted-foreground">
          z {z > 0 ? "+" : ""}
          {z}px · depth {depth}
        </span>
      </motion.p>
    </motion.div>
  );
}

/**
 * About opener: 2.5D depth stage (PHASES.md Phase 5 idea, applied to the
 * full-body portrait). Back to front: accent glow, nameplate, the cut-out,
 * then the headline. Nearer layers travel further with the pointer and the
 * scroll, so the flat illustration reads as having depth.
 *
 * "Let me flex!" swings the stack round in 3D to show the planes (from the
 * parallax demo), with drawn frames, labels and a live readout. While it's
 * open the pointer orbits the stack. Esc or the button puts it back.
 *
 * Desktop: the stage sticks for ~70vh while the subject pushes in. Phones get
 * a shorter stick, no pointer motion, and the headline below the figure.
 * Reduced motion: one static frame, no sticking, flex mode switches instantly.
 * Motion values only, so nothing re-renders while it moves.
 */
export function AboutDepth() {
  const reduce = useReducedMotionSafe();
  const d = about.depth;
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [flex, setFlex] = useState(false);

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

  /* flex: 0 = flat, 1 = exploded. Slight overshoot so it lands with weight. */
  const flexRaw = useMotionValue(0);
  const flexSpring = useSpring(flexRaw, { stiffness: 80, damping: 15, mass: 0.9 });
  const amount = reduce ? flexRaw : flexSpring;
  const rotY = useTransform([amount, px], ([f, p]: number[]) => f * (-30 + p * 14));
  const rotX = useTransform([amount, py], ([f, p]: number[]) => f * (9 - p * 7));
  const sceneScale = useTransform(amount, (f) => 1 - f * 0.38);
  const rotYText = useTransform(rotY, (v) => `${v.toFixed(1)}°`);
  const rotXText = useTransform(rotX, (v) => `${v.toFixed(1)}°`);

  useEffect(() => {
    flexRaw.set(flex ? 1 : 0);
    if (!flex) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFlex(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flex, flexRaw]);

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
  const plane = { flex, amount };

  return (
    <>
      <div ref={wrapRef} className={reduce ? "relative" : "relative h-[125svh] md:h-[170svh]"}>
        <div
          ref={stageRef}
          className={`${reduce ? "relative" : "sticky top-0"} h-[92svh] w-full overflow-hidden md:h-svh`}
          style={{ perspective: 1400 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ rotateY: rotY, rotateX: rotX, scale: sceneScale, transformStyle: "preserve-3d" }}
          >
            {/* 0 · measuring grid, only visible in flex mode */}
            <Plane {...plane} z={-340} index={0} label="grid" depth={0} corner="tl" fade>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--line-strong)_1px,transparent_1px),linear-gradient(to_bottom,var(--line-strong)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </Plane>

            {/* 1 · accent glow (moves least) */}
            <Plane {...plane} z={-240} index={1} label="glow" depth={0.15} corner="tr">
              <motion.div aria-hidden className="absolute -inset-10" style={still ?? glow}>
                <div className="absolute left-1/2 top-[38%] size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[90px]" />
              </motion.div>
            </Plane>

            {/* 2 · nameplate, behind the figure */}
            <Plane {...plane} z={-110} index={2} label="nameplate" depth={0.45} corner="tl">
              <motion.div
                aria-hidden
                className="absolute inset-x-0 top-[20svh] flex justify-center md:top-[21svh]"
                style={reduce ? undefined : { y: nameScrollY }}
              >
                <motion.span
                  className="type-nameplate whitespace-nowrap text-[clamp(2.5rem,9.4vw,10rem)] text-foreground/90"
                  style={still ?? name}
                >
                  {d.nameplate}
                </motion.span>
              </motion.div>
            </Plane>

            {/* 3 · the cut-out */}
            <Plane {...plane} z={40} index={3} label="cut-out" depth={1} corner="bl">
              <motion.div className="absolute inset-0 flex items-end justify-center" style={still ?? subject}>
                <span
                  aria-hidden
                  className="absolute bottom-[1.2svh] left-1/2 h-[4svh] w-[30svh] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(40_10_20/0.35),transparent)] blur-md"
                />
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
            </Plane>

            {/* 4 · headline + caption, in front (moves most). Desktop only; phones get it below. */}
            <Plane {...plane} z={170} index={4} label="headline" depth={1.35} corner="br" className="hidden md:block">
              <motion.div className="pointer-events-none absolute inset-0" style={reduce ? undefined : { y: fgScrollY }}>
                <motion.div className="container-page relative h-full" style={still ?? fg}>
                  <div className="absolute bottom-[9svh] left-6 max-w-[24rem] md:left-10">
                    <SplitText
                      as="h2"
                      text={about.headline}
                      className="text-h3 font-semibold text-balance lg:text-[2rem] lg:leading-[1.15]"
                    />
                  </div>
                  <p className="absolute bottom-[9svh] right-6 text-right font-mono text-xs leading-relaxed text-muted-foreground md:right-10">
                    {d.caption[0]}
                    <br />
                    {d.caption[1]}
                  </p>
                </motion.div>
              </motion.div>
            </Plane>
          </motion.div>

          {/* readout, flat on top of the scene */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-6 top-24 font-mono text-[11px] leading-relaxed text-muted-foreground md:left-10 md:top-28"
            initial={false}
            animate={{ opacity: flex ? 1 : 0, x: flex ? 0 : -8 }}
            transition={{ duration: 0.4, delay: flex ? 0.5 : 0 }}
          >
            <p className="text-accent-text">
              depth stack · <span className="md:hidden">4</span>
              <span className="hidden md:inline">5</span> planes
            </p>
            <p>
              rotY <motion.span className="text-foreground tabular-nums">{rotYText}</motion.span> · rotX{" "}
              <motion.span className="text-foreground tabular-nums">{rotXText}</motion.span>
            </p>
            <p className="hidden md:block">move the mouse to orbit · esc to close</p>
          </motion.div>

          <div className="group absolute right-6 top-24 z-10 md:right-10 md:top-28">
            <button
              type="button"
              onClick={() => setFlex((f) => !f)}
              aria-pressed={flex}
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-line-strong bg-surface-solid/80 px-4 py-2 text-sm font-medium text-foreground shadow-[0_6px_20px_-10px_rgb(225_29_72/0.5)] backdrop-blur transition-[transform,color,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-brand hover:text-brand-fg hover:shadow-[0_12px_28px_-10px_rgb(225_29_72/0.7)] focus-visible:text-brand-fg active:translate-y-0 active:scale-[0.97]"
            >
              {/* fill sweeps in from the left on hover */}
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 rounded-full bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100 group-has-[:focus-visible]:scale-x-100"
              />
              <span aria-hidden className="relative flex size-2">
                {!flex && !reduce && <span className="absolute inset-0 animate-ping rounded-full bg-brand/60 group-hover:bg-brand-fg/60" />}
                <span className="relative size-2 rounded-full bg-brand transition-colors duration-300 group-hover:bg-brand-fg" />
              </span>
              <span className="relative">{flex ? "Put it back" : "Let me Flex!"}</span>
            </button>

            {/* a cursor that keeps reaching for the button and "clicks" it. The ring
                pops on the press, then lingers and fades while the cursor drifts back.
                Keyframe times must end at 1, or the ring jumps when the loop restarts. */}
            {!flex && !reduce && (
              <div aria-hidden className="pointer-events-none absolute -bottom-7 right-3 transition-opacity duration-200 group-hover:opacity-0">
                <motion.span
                  className="absolute -left-1 -top-1 size-2.5 rounded-full border border-brand"
                  animate={{ scale: [0.5, 0.5, 0.6, 1.5, 1.5], opacity: [0, 0, 0.9, 0.6, 0] }}
                  transition={{ duration: 2.4, times: [0, 0.46, 0.48, 0.62, 1], repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  className="block text-foreground drop-shadow-[0_2px_3px_rgb(0_0_0/0.25)]"
                  animate={{ x: [18, 0, 0, 0, 18], y: [16, 0, 0, 0, 16], scale: [1, 1, 0.82, 1, 1] }}
                  transition={{ duration: 2.4, times: [0, 0.4, 0.47, 0.56, 1], repeat: Infinity, ease: EASE }}
                >
                  <IconPointerFilled size={20} />
                </motion.span>
              </div>
            )}
          </div>
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
