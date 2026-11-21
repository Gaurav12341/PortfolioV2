"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArchDiagram } from "./ArchDiagram";
import type { DiagramSpec } from "./types";
import { cn } from "@/lib/utils";

/**
 * Scroll-synced architecture story (PHASES.md · Phase 4a).
 *
 * Desktop: the diagram is sticky on the right while the step text scrolls on
 * the left; whichever step crosses the middle of the viewport is active, and
 * the diagram highlights its nodes/edges and dims the rest.
 *
 * Mobile: diagram on top, then a tappable stepper (prev / next / dots).
 */
export function DiagramStory({
  spec,
  toolbar,
}: {
  spec: DiagramSpec;
  /** Optional controls rendered above the diagram (e.g. a variant toggle). */
  toolbar?: React.ReactNode;
}) {
  const [active, setActive] = React.useState(0);
  const stepRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  // Desktop: activate the step crossing the viewport's middle band.
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    if (!mq.matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [spec]);

  const steps = spec.steps;
  const step = steps[active];

  return (
    <div>
      {/* ── Desktop: sticky diagram + scrolling steps ── */}
      <div className="hidden gap-10 lg:grid lg:grid-cols-12">
        <ol className="col-span-5 pb-[30vh] pt-[10vh]">
          {steps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-index={i}
              className="flex min-h-[55vh] items-center"
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "w-full rounded-2xl border p-6 text-left transition-[opacity,border-color,background-color] duration-500",
                  i === active
                    ? "border-brand/40 bg-surface-solid opacity-100"
                    : "border-transparent opacity-40 hover:opacity-70",
                )}
              >
                <span className="font-mono text-xs text-accent-text">
                  {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </span>
                <span className="mt-2 block text-h3 font-semibold">{s.title}</span>
                <span className="mt-2 block text-base leading-relaxed text-muted-foreground">{s.body}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="col-span-7">
          <div className="sticky top-28 rounded-3xl border border-line bg-surface-solid/70 p-5 backdrop-blur-sm">
            {toolbar && <div className="mb-4">{toolbar}</div>}
            <ArchDiagram spec={spec} activeStep={active} />
          </div>
        </div>
      </div>

      {/* ── Mobile / tablet: diagram + stepper ── */}
      <div className="lg:hidden">
        <div className="rounded-3xl border border-line bg-surface-solid/70 p-4">
          {toolbar && <div className="mb-3">{toolbar}</div>}
          <ArchDiagram spec={spec} activeStep={active} />
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-surface-solid/80 p-5" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-accent-text">
              {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous step"
                disabled={active === 0}
                onClick={() => setActive((a) => Math.max(0, a - 1))}
                className="inline-flex size-9 items-center justify-center rounded-full border border-line disabled:opacity-30"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next step"
                disabled={active === steps.length - 1}
                onClick={() => setActive((a) => Math.min(steps.length - 1, a + 1))}
                className="inline-flex size-9 items-center justify-center rounded-full border border-line disabled:opacity-30"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
          <p className="mt-2 text-lg font-semibold">{step.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          <div className="mt-4 flex gap-1.5" role="tablist" aria-label="Steps">
            {steps.map((s, i) => (
              <button
                key={s.title}
                role="tab"
                aria-selected={i === active}
                aria-label={`Step ${i + 1}: ${s.title}`}
                onClick={() => setActive(i)}
                className={cn("h-1.5 rounded-full transition-all", i === active ? "w-6 bg-brand" : "w-1.5 bg-foreground/20")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
