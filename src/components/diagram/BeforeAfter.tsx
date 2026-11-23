"use client";

import * as React from "react";
import { useInView } from "motion/react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_CSS } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Bar = { label: string; value: number; display: string };

type Props = {
  title: string;
  before: Bar;
  after: Bar;
  /** Caption under the bars, e.g. "67% faster". */
  delta?: string;
  className?: string;
};

/**
 * Before/after comparison for performance stories (PHASES.md · Phase 4b).
 * The "after" bar starts at full "before" length and shrinks to its real
 * proportion when scrolled into view. "Replay" runs it again. Reduced
 * motion shows the final state.
 */
export function BeforeAfter({ title, before, after, delta, className }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotionSafe();
  const [run, setRun] = React.useState(0);
  const [shrunk, setShrunk] = React.useState(false);

  React.useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShrunk(true);
      return;
    }
    setShrunk(false);
    const t = setTimeout(() => setShrunk(true), 250);
    return () => clearTimeout(t);
  }, [inView, reduce, run]);

  const ratio = Math.max(0.04, after.value / before.value);

  return (
    <div ref={ref} className={cn("rounded-2xl border border-line bg-surface-solid/80 p-4 md:p-5", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Replay comparison"
        >
          <RotateCcw className="size-3" aria-hidden /> Replay
        </button>
      </div>

      <dl className="space-y-2.5">
        <div className="flex items-center gap-3">
          <dt className="w-14 shrink-0 font-mono text-[11px] text-muted-foreground">{before.label}</dt>
          <dd className="relative h-7 flex-1 overflow-hidden rounded-md bg-muted">
            <div className="absolute inset-y-0 left-0 w-full rounded-md bg-foreground/15" />
            <span className="absolute inset-y-0 left-2.5 flex items-center font-mono text-xs font-semibold text-foreground">
              {before.display}
            </span>
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="w-14 shrink-0 font-mono text-[11px] text-accent-text">{after.label}</dt>
          <dd className="relative h-7 flex-1 overflow-hidden rounded-md bg-muted">
            <div
              className="absolute inset-y-0 left-0 rounded-md bg-brand"
              style={{
                width: `${(shrunk ? ratio : 1) * 100}%`,
                transition: shrunk ? `width 1.1s ${EASE_CSS}` : "none",
              }}
            />
            <span className="absolute inset-y-0 left-2.5 flex items-center font-mono text-xs font-semibold text-brand-fg">
              {after.display}
            </span>
          </dd>
        </div>
      </dl>
      {delta && <p className="mt-3 text-sm font-medium text-foreground">{delta}</p>}
    </div>
  );
}
