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

/**
 * Scroll sequence (PHASES.md · Phase 5). The stage is CSS-sticky inside a
 * tall wrapper (robust with Lenis and flex parents); ScrollTrigger only
 * scrubs the timeline across the wrapper.
 *
 *  0 → 0.70  the 28 illustrated frames scrub on a pinned canvas
 *  0.70 → 0.85  the portrait is revealed with a crisp clip-path (circle
 *               from the face, or a wipe with an accent line). No blur.
 *  0.85 → 1  slow push-in + parallax on the portrait (scroll and pointer),
 *            the about intro fades in, then the pin releases.
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
  const revealRef = useRef<HTMLDivElement>(null);
  const pushRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const subjectLayerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
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
    const { dw, dh, ox, oy } = cover(W, H, 0.5);
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
      const section = sectionRef.current;
      const { framesEnd, revealEnd } = sequence.phases;
      const faceFocal = mobile ? sequence.face.x : 0.5;

      const facePx = () => {
        const W = section.clientWidth;
        const H = section.clientHeight;
        // portrait layers bleed 16px past each edge (room for parallax)
        const g = cover(W + 32, H + 32, faceFocal);
        const x = -16 + g.ox + sequence.face.x * g.dw + sequence.align.x;
        const y = -16 + g.oy + sequence.face.y * g.dh + sequence.align.y;
        const r = Math.hypot(Math.max(x, W - x), Math.max(y, H - y));
        return { x, y, r };
      };

      const setReveal = (p: number) => {
        const el = revealRef.current;
        if (!el) return;
        if (sequence.reveal === "wipe") {
          el.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
          if (lineRef.current) {
            lineRef.current.style.left = `${p * 100}%`;
            lineRef.current.style.opacity = p > 0 && p < 1 ? "1" : "0";
          }
          return;
        }
        const { x, y, r } = facePx();
        const R = p * r;
        el.style.clipPath = p >= 1 ? "none" : `circle(${R}px at ${x}px ${y}px)`;
        const ring = ringRef.current;
        if (ring) {
          ring.style.width = ring.style.height = `${R * 2}px`;
          ring.style.left = `${x - R}px`;
          ring.style.top = `${y - R}px`;
          ring.style.opacity = p > 0 && p < 1 ? String(Math.min(1, (1 - p) * 3)) : "0";
        }
      };
      setReveal(0);

      const state = { f: 0, p: 0 };
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
          f: sequence.frameCount - 1,
          duration: framesEnd,
          onUpdate: () => {
            const i = Math.round(state.f);
            if (i !== currentRef.current) {
              currentRef.current = i;
              draw(i);
            }
          },
        },
        0,
      )
        .to(hintRef.current, { opacity: 0, duration: 0.12 }, 0.02)
        .to(state, { p: 1, duration: revealEnd - framesEnd, ease: "power1.inOut", onUpdate: () => setReveal(state.p) }, framesEnd)
        .fromTo(
          pushRef.current,
          { scale: 1, y: 0 },
          { scale: sequence.zoom, y: -sequence.parallaxPx, duration: 1 - framesEnd, ease: "none" },
          framesEnd,
        );

      if (subjectLayerRef.current) {
        tl.fromTo(subjectLayerRef.current, { y: 0 }, { y: -sequence.parallaxPx, duration: 1 - revealEnd }, revealEnd);
      }

      const lines = textRef.current?.querySelectorAll<HTMLElement>("[data-line]");
      if (lines?.length) {
        tl.fromTo(
          lines,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.1, stagger: 0.035, ease: "power2.out" },
          revealEnd - 0.02,
        );
      }

      draw(0);
      const onResize = () => {
        draw(currentRef.current);
        setReveal(state.p);
      };
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
      {/* Frames */}
      {!reduce && <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />}

      {/* Portrait (revealed by clip-path; static under reduced motion) */}
      <div ref={revealRef} className="absolute inset-0" style={reduce ? undefined : { clipPath: "circle(0px at 50% 50%)" }}>
        <div ref={pushRef} className="absolute inset-0 will-change-transform">
          <div
            className="absolute inset-0"
            style={{ transform: `translate(${sequence.align.x}px, ${sequence.align.y}px) scale(${sequence.align.scale})` }}
          >
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
        {/* Legibility: the intro sits on the portrait's dark left side */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent" />
      </div>

      {/* Reveal edge: thin accent ring (circle) or line (wipe) */}
      {!reduce && sequence.reveal === "circle" && (
        <div ref={ringRef} aria-hidden className="pointer-events-none absolute rounded-full border-[1.5px] border-brand opacity-0" />
      )}
      {!reduce && sequence.reveal === "wipe" && (
        <div ref={lineRef} aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-brand opacity-0" />
      )}

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
      <div ref={textRef} className="absolute inset-0 flex items-end md:items-center">
        <div className="container-page pb-16 md:pb-0">
          <div className="max-w-xl">
            <h2 data-line className="text-h2 font-bold text-white" style={reduce ? undefined : { opacity: 0 }}>
              {aboutIntro.headline}
            </h2>
            <p data-line className="mt-5 max-w-lg text-lead text-white/75" style={reduce ? undefined : { opacity: 0 }}>
              {aboutIntro.line}
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
