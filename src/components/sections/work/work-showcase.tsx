"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, MousePointerClick, UserRound } from "lucide-react";
import { ArchDiagram } from "@/components/diagram/ArchDiagram";
import { BeforeAfter } from "@/components/diagram/BeforeAfter";
import { CountUp, Reveal } from "@/components/motion";
import { platformContext, workProjects, type WorkProject } from "@/content/projects";
import { cn } from "@/lib/utils";
import { VariantToggle, type RagMode } from "./variant-toggle";
import { HandNote } from "@/components/common/hand-note";

/**
 * Work case studies carousel (PHASES.md · Phase 4, options B + C + D):
 *  B: each slide is split: story on the left, the project's live
 *     architecture diagram on the right, metric strip under the text.
 *  C: before/after bars where there are before/after numbers (installer).
 *  D: "My role" and "Hard parts" snippets on every slide.
 * Every slide links to its full case study at /work/[slug].
 *
 * No autoplay (people read these). Arrow keys work while the carousel has
 * focus; swipe works on touch, except inside the scrollable diagram.
 */
export default function WorkShowcase() {
  const [active, setActive] = React.useState(0);
  const total = workProjects.length;
  const drag = React.useRef<{ x: number; y: number } | null>(null);

  const go = React.useCallback(
    (i: number) => setActive(((i % total) + total) % total),
    [total],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("input, textarea")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  };

  return (
    <section
      id="projects"
      aria-roledescription="carousel"
      aria-label="Work projects"
      className="relative w-full scroll-mt-[88px] py-20 md:py-28"
      onKeyDown={onKeyDown}
    >
      <div className="container-page">
        {/* Header + shared platform context */}
        <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-text">Work · Honeywell</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          <span className="font-mono text-xs text-muted-foreground">Details generalised for privacy</span>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="relative mt-4 w-fit">
            <h2 className="text-h1 font-bold">Work Projects</h2>
            <HandNote className="absolute -right-5 top-2 translate-x-full -rotate-2">
              <span aria-hidden>↙ </span>systems I built at Honeywell
            </HandNote>
          </div>
          <p className="mt-5 max-w-3xl text-lead text-muted-foreground">{platformContext}</p>
        </Reveal>

        {/* Tabs + prev/next */}
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Work projects" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {workProjects.map((p, i) => (
              <button
                key={p.slug}
                id={`tab-${p.slug}`}
                role="tab"
                aria-selected={i === active}
                aria-controls={`slide-${p.slug}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => go(i)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  i === active
                    ? "border-transparent bg-foreground text-background"
                    : "border-line text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="mr-2 font-mono text-[11px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {p.short}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="font-mono text-xs tabular-nums text-muted-foreground" aria-live="polite">
              {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <NavButton label="Previous case study" onClick={() => go(active - 1)}>
              <ChevronLeft className="size-4" aria-hidden />
            </NavButton>
            <NavButton label="Next case study" onClick={() => go(active + 1)}>
              <ChevronRight className="size-4" aria-hidden />
            </NavButton>
          </div>
        </div>

        {/* Slides: stacked in one grid cell so the stage keeps the height of
            the tallest slide and switching never shifts the page. */}
        <div
          className="mt-6 grid"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(e) => {
            if ((e.target as HTMLElement).closest("[data-no-swipe], a, button")) return;
            drag.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            const d = drag.current;
            drag.current = null;
            if (!d) return;
            const dx = e.clientX - d.x;
            const dy = e.clientY - d.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(active + (dx < 0 ? 1 : -1));
          }}
        >
          {workProjects.map((p, i) => (
            <Slide key={p.slug} project={p} index={i} active={i === active} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Slide({ project: p, index, active }: { project: WorkProject; index: number; active: boolean }) {
  const [mode, setMode] = React.useState<RagMode>("cloud");
  const spec = p.variants ? p.variants[mode] : p.diagram;

  return (
    <article
      id={`slide-${p.slug}`}
      role="tabpanel"
      aria-labelledby={`tab-${p.slug}`}
      aria-hidden={!active}
      inert={!active}
      className={cn(
        "col-start-1 row-start-1 rounded-3xl border border-line bg-surface-solid/60 p-5 backdrop-blur-sm transition-[opacity,transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-8 lg:p-10",
        active ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0",
      )}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
        {/* ── Left: the story ── */}
        <div className="flex flex-col lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-text">
            {String(index + 1).padStart(2, "0")} · {p.kicker}
          </p>
          <h3 className="mt-3 text-[clamp(1.75rem,1.2rem+1.5vw,2.5rem)] font-semibold leading-[1.08] tracking-tight">{p.title}</h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.oneLiner}</p>

          {p.badges && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.badges.map((b) => (
                <li key={b} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-accent-text">
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* Metric strip */}
          <ul className="mt-6 grid grid-cols-2 gap-2.5">
            {p.metrics.slice(0, 4).map((m) => (
              <li key={m.label} className="rounded-xl border border-line bg-background/60 px-3.5 py-3">
                <p className="flex items-baseline gap-2 font-mono">
                  <CountUp key={active ? "on" : "off"} value={m.value} className="text-xl font-semibold tracking-tight text-foreground md:text-2xl" />
                  {m.projected && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      projected
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{m.label}</p>
              </li>
            ))}
          </ul>

          {/* D: My role */}
          <div className="mt-6 flex gap-3 rounded-xl border border-line bg-background/60 p-3.5">
            <UserRound className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-foreground">My role. </span>
              <span className="text-muted-foreground">{p.role}</span>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-auto lg:pt-8">
            <Link
              href={`/work/${p.slug}`}
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Read the case study
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <span className="font-mono text-xs text-muted-foreground">
              {p.stack.slice(0, 3).join(" · ")}
              {p.stack.length > 3 && ` +${p.stack.length - 3}`}
            </span>
          </div>
        </div>

        {/* ── Right: live architecture (B) + before/after (C) ── */}
        <div className="flex flex-col gap-4 lg:col-span-8">
          <div className="rounded-2xl border border-line bg-background/50 p-3 md:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <MousePointerClick className="size-3.5" aria-hidden />
                Architecture · hover a stage
              </p>
              {p.variants && <VariantToggle mode={mode} onChange={setMode} />}
            </div>
            <ArchDiagram spec={spec} mini={!active} />
          </div>
          {p.beforeAfter && <BeforeAfter key={active ? "on" : "off"} {...p.beforeAfter} />}
          {/* D: Hard parts */}
          <div className="rounded-2xl border border-line bg-background/50 p-4 md:p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Hard parts</p>
            <ul className="mt-3 space-y-2.5">
              {p.hardParts.slice(0, 3).map((h) => (
                <li key={h.title} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  <span>
                    <span className="font-medium text-foreground">{h.title}. </span>
                    <span className="text-muted-foreground">{h.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </article>
  );
}

function NavButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-foreground transition-colors hover:bg-muted active:scale-95"
    >
      {children}
    </button>
  );
}
