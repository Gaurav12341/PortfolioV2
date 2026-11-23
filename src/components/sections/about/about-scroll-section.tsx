"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { sequence } from "@/content/sequence";
import { aboutIntro } from "@/content/about";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

gsap.registerPlugin(ScrollTrigger);

/** Source frames are 1920×1080; every layer uses the same cover maths. */
const SRC_W = 1920;
const SRC_H = 1080;
const MOBILE_BP = 768;

/** object-fit: cover geometry for a 16:9 source in a W×H box, with a horizontal focal point. */
function cover(W: number, H: number, focalX: number) {
  const s = Math.max(W / SRC_W, H / SRC_H);
  const dw = SRC_W * s;
  const dh = SRC_H * s;
  return { s, dw, dh, ox: (W - dw) * focalX, oy: (H - dh) / 2 };
}

/** Quadratic ease-out, matching the pan in scripts/make-pan-frames.cjs. */
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

/**
 * Horizontal crop focal point for frame i. Desktop stays centred; phones
 * ease from centre to the face across the pan frames so the last frame
 * lands exactly where the portrait layer is cropped.
 */
function focalFor(i: number, mobile: boolean) {
  if (!mobile) return 0.5;
  const from = sequence.panStart - 1;
  const t = Math.min(1, Math.max(0, (i - from) / (sequence.frameCount - 1 - from)));
  return 0.5 + (sequence.face.x - 0.5) * easeOutQuad(t);
}

/**
 * Scroll sequence (PHASES.md · Phase 5). The stage is CSS-sticky inside a
 * tall wrapper (robust with Lenis and flex parents); ScrollTrigger only
 * scrubs the timeline across the wrapper.
 *
 *  0 → framesEnd   all frames scrub on a pinned canvas: the hand sign, then
 *                  a whip-pan that eases to a stop on the portrait (the
 *                  last frame is the portrait itself).
 *  framesEnd → 1   the live portrait layer takes over (pixel-identical to the
 *                  last frame), slow push-in + parallax (scroll and pointer),
 *                  the about intro fades in, then the pin releases.
 *
 * Frame 0 loads first; the rest stream in progressively and the canvas
 * shows the nearest loaded frame meanwhile. Reduced motion: the portrait
 * and intro render statically with no pin.
 */
export default function AboutScrollSection() {
  const reduce = useReducedMotionSafe();
  /** Tall outer wrapper: its extra height is the pinned scroll distance. */
  const wrapRef = useRef<HTMLDivElement>(null);
  /** Sticky viewport-sized stage inside it. */
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const pushRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const subjectLayerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const currentRef = useRef(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── frame loading + drawing ─────────────────────────────────────────── */
  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const frames = framesRef.current;
    // nearest loaded frame at or below the requested one, else any loaded
    let img: HTMLImageElement | undefined;
    for (let i = index; i >= 0 && !img; i--) img = frames[i]?.complete ? frames[i] : undefined;
    for (let i = index + 1; i < frames.length && !img; i++) img = frames[i]?.complete ? frames[i] : undefined;
    if (!img) return;

    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    const { dw, dh, ox, oy } = cover(W, H, focalFor(index, mobile));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(img, ox, oy, dw, dh);
  };

  useEffect(() => {
    if (reduce) return;
    const n = sequence.frameCount;
    const frames: (HTMLImageElement | undefined)[] = new Array(n);
    framesRef.current = frames;
    let cancelled = false;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return resolve();
          frames[i] = img;
          // repaint if this frame is the one (or closer to the one) on screen
          if (Math.abs(i - currentRef.current) <= 2 || i === 0) draw(currentRef.current);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = sequence.frame(i, mobile);
      });

    // frame 0 first, then the rest 4 at a time
    (async () => {
      await load(0);
      const queue = Array.from({ length: n - 1 }, (_, k) => k + 1);
      const worker = async () => {
        while (queue.length && !cancelled) await load(queue.shift()!);
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile, reduce]);

  /* ── scroll timeline ─────────────────────────────────────────────────── */
  useGSAP(
    () => {
      if (reduce || !sectionRef.current) return;
      const { framesEnd, introStart } = sequence.phases;
      const last = sequence.frameCount - 1;

      // The live portrait layer (push-in, parallax) shows only on the last
      // frame, which is the same image, so the handoff is invisible.
      const setPortrait = (i: number) => {
        if (portraitRef.current) portraitRef.current.style.visibility = i >= last ? "visible" : "hidden";
      };
      setPortrait(0);

      const state = { f: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        state,
        {
          f: last,
          duration: framesEnd,
          onUpdate: () => {
            const i = Math.round(state.f);
            if (i !== currentRef.current) {
              currentRef.current = i;
              draw(i);
              setPortrait(i);
            }
          },
        },
        0,
      )
        .to(hintRef.current, { opacity: 0, duration: 0.12 }, 0.02)
        .fromTo(shadeRef.current, { opacity: 0 }, { opacity: 1, duration: introStart + 0.1 - framesEnd }, framesEnd)
        .fromTo(
          pushRef.current,
          { scale: 1, y: 0 },
          { scale: sequence.zoom, y: -sequence.parallaxPx, duration: 1 - framesEnd, ease: "none" },
          framesEnd,
        );

      if (subjectLayerRef.current) {
        tl.fromTo(subjectLayerRef.current, { y: 0 }, { y: -sequence.parallaxPx, duration: 1 - framesEnd }, framesEnd);
      }

      const lines = textRef.current?.querySelectorAll<HTMLElement>("[data-line]");
      if (lines?.length) {
        tl.fromTo(
          lines,
          { opacity: 0, y: 16 },
          // total stagger is capped so the timeline still ends at 1 (introStart + 0.1 + 0.1)
          { opacity: 1, y: 0, duration: 0.1, stagger: { amount: 1 - introStart - 0.1 }, ease: "power2.out" },
          introStart,
        );
      }

      draw(0);
      const onResize = () => draw(currentRef.current);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: wrapRef, dependencies: [reduce, mobile] },
  );

  /* ── pointer parallax on the portrait (desktop, fine pointer) ────────── */
  useEffect(() => {
    if (reduce || mobile) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      const px = sequence.parallaxPx;
      const bg = bgLayerRef.current;
      const subj = subjectLayerRef.current;
      // background trails the subject → depth
      const k = subj ? sequence.portrait.bgDepth : 1;
      if (bg) bg.style.translate = `${cur.x * px * k}px ${cur.y * px * k}px`;
      if (subj) subj.style.translate = `${cur.x * px}px ${cur.y * px}px`;
      raf = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce, mobile]);

  const portraitSrc = mobile ? sequence.portrait.mobile : sequence.portrait.desktop;
  const subject = sequence.portrait.subject;
  const objectPosition = `${(mobile ? sequence.face.x : 0.5) * 100}% 50%`;
  /** Intro lines start hidden and are faded in by the timeline. */
  const hidden = reduce ? undefined : { opacity: 0 };

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ height: reduce ? undefined : `${100 + sequence.scrollVh}svh` }}
    >
    <section
      ref={sectionRef}
      aria-label="About intro"
      className={`${reduce ? "relative" : "sticky top-0"} h-svh w-full overflow-hidden bg-[#0b0a0d] text-[#f2eef0]`}
    >
      {/* Frames. Bleeds 16px like the portrait layers so the last frame and
          the live portrait share the exact same geometry. */}
      {!reduce && <canvas ref={canvasRef} aria-hidden className="absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)]" />}

      {/* Portrait: takes over from the canvas on the last frame (static under reduced motion) */}
      <div ref={portraitRef} className="absolute inset-0" style={reduce ? undefined : { visibility: "hidden" }}>
        <div ref={pushRef} className="absolute inset-0 will-change-transform">
          <div ref={bgLayerRef} className="absolute -inset-4">
            <img src={portraitSrc} alt={sequence.portrait.alt} className="h-full w-full object-cover" style={{ objectPosition }} decoding="async" />
          </div>
          {subject && (
            <div ref={subjectLayerRef} className="pointer-events-none absolute -inset-4">
              <img
                src={mobile ? subject.mobile : subject.desktop}
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
                style={{ objectPosition }}
                decoding="async"
              />
            </div>
          )}
        </div>
      </div>

      {/* Shade (fades in after the pan). Desktop: a full-width left → right
          darkening, near-black under the text and still ~30% in the middle,
          as in the reference. Phones: from the bottom, under the text. */}
      <div ref={shadeRef} aria-hidden className="pointer-events-none absolute inset-0" style={reduce ? undefined : { opacity: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 md:hidden" />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(0 0 0 / 0.72) 0%, rgb(0 0 0 / 0.62) 20%, rgb(0 0 0 / 0.5) 32%, rgb(0 0 0 / 0.32) 50%, rgb(0 0 0 / 0.12) 78%, rgb(0 0 0 / 0) 95%)",
          }}
        />
      </div>

      {/* Scroll hint */}
      {!reduce && (
        <div ref={hintRef} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">Keep scrolling</span>
          <span className="relative h-9 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-1/3 bg-brand [animation:scroll-cue_2.2s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
          </span>
        </div>
      )}

      {/* About intro */}
      {/* Phones: bottom, over the bottom shade. Desktop: matches the reference
          layout, sized in vw so it holds its proportions at any width: bracket
          box from 3.75vw to ~32vw, vertically centred. */}
      <div ref={textRef} className="absolute inset-0 flex items-end md:items-center">
        <div className="w-full px-4 pb-10 md:w-auto md:px-0 md:pb-0 md:pl-[3.75vw]">
          <div className="relative max-w-xl p-6 md:w-[max(28.5vw,23rem)] md:max-w-none md:px-[max(2vw,1.5rem)] md:py-[max(2.1vw,1.5rem)]">
            {/* Corner brackets */}
            {(["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map(
              (pos) => (
                <span key={pos} data-line aria-hidden className={`absolute h-8 w-8 border-brand/60 ${pos}`} style={hidden} />
              ),
            )}

            <p data-line className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-brand md:mb-[1.2vw] md:text-[clamp(10px,0.6vw,13px)]" style={hidden}>
              ✦ {aboutIntro.kicker} ✦
            </p>

            <h2 data-line className="mb-5 text-3xl font-bold leading-[1.08] text-white sm:text-4xl md:mb-[1.3vw] md:leading-[1.02] md:text-[clamp(1.75rem,2.6vw,3.75rem)]" style={hidden}>
              {/* Desktop: two fixed lines, as in the reference (headings use balanced wrapping otherwise) */}
              <span className="md:block md:whitespace-nowrap">{aboutIntro.headline.before}</span>{" "}
              <span className="md:block md:whitespace-nowrap">
                <em className="font-normal text-brand" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  {aboutIntro.headline.emphasis}
                </em>{" "}
                {aboutIntro.headline.after}
              </span>
            </h2>

            <p data-line className="mb-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base md:mb-[1.5vw] md:max-w-[max(23vw,18rem)] md:leading-[1.55] md:text-[clamp(0.8125rem,0.82vw,1.15rem)]" style={hidden}>
              {aboutIntro.line}
            </p>

            <div data-line aria-hidden className="mb-6 h-px w-24 bg-gradient-to-r from-brand to-transparent md:mb-[1.4vw] md:w-[4.2vw]" style={hidden} />

            <ul data-line className="mb-8 flex flex-wrap items-center gap-3 md:mb-[1.6vw] md:gap-[0.6vw]" style={hidden}>
              {aboutIntro.disciplines.map((d, i) => (
                <li key={d} className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 md:gap-[0.6vw] md:text-[clamp(9px,0.5vw,11px)]">
                  {i !== 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-brand" />}
                  {d}
                </li>
              ))}
            </ul>

            <p data-line style={hidden}>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white md:text-[clamp(10px,0.56vw,12px)]">{aboutIntro.status}</span>{" "}
              <span aria-hidden className="text-brand">✦</span>
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
