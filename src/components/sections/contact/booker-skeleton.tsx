"use client";

import { useEffect, useState } from "react";

const SHIMMER_MS = 1600;
/** After this long, offer the Cal.com page instead of just waiting. */
const SLOW_MS = 6000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * When the booker first started loading. The skeleton is mounted up to three
 * times in a row (before the booker is near, while Cal's chunk downloads,
 * until Cal reports ready); sharing one clock keeps the shimmer and the
 * "slow" timer continuous across those hand-offs instead of restarting.
 */
let startedAt: number | null = null;

/**
 * Loader for the Cal.com booker, laid out like Cal's own stacked month view
 * (details, month header, weekday row, date grid) so the swap doesn't jump.
 * One light sweep moves across it (transform only); reduced motion leaves it
 * still. Fades out via `leaving`, then calls `onLeft`.
 */
export function BookerSkeleton({
  href,
  leaving = false,
  onLeft,
}: {
  /** Cal.com booking page, offered if loading is slow */
  href?: string;
  leaving?: boolean;
  onLeft?: () => void;
}) {
  /* month name is client-only: server and visitor can be in different months */
  const [month, setMonth] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const now = performance.now();
    startedAt ??= now;
    const elapsed = now - startedAt;
    setPhase(elapsed % SHIMMER_MS);
    setMonth(new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }));
    if (elapsed >= SLOW_MS) return setSlow(true);
    const t = window.setTimeout(() => setSlow(true), SLOW_MS - elapsed);
    return () => window.clearTimeout(t);
  }, []);

  const [m, y] = month?.split(" ") ?? [];

  return (
    <div
      role="status"
      onTransitionEnd={(e) => e.target === e.currentTarget && leaving && onLeft?.()}
      className={`absolute inset-0 overflow-hidden px-6 pt-6 transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div aria-hidden>
        {/* event details: avatar, name, title, duration / location / time zone */}
        <div className="size-6 rounded-full bg-foreground/10" />
        <div className="mt-3.5 h-3 w-20 rounded bg-foreground/10" />
        <div className="mt-4 h-5 w-44 rounded bg-foreground/[0.13]" />
        <div className="mt-5 space-y-4">
          {[12, 24, 28].map((w) => (
            <div key={w} className="flex items-center gap-2.5">
              <div className="size-4 rounded-full bg-foreground/10" />
              <div className="h-3 rounded bg-foreground/10" style={{ width: `${w * 0.25}rem` }} />
            </div>
          ))}
        </div>

        {/* month header */}
        <div className="mt-12 flex items-center justify-between">
          <p className="h-5 text-base font-semibold text-foreground/35">
            {month ? (
              <>
                {m} <span className="font-normal">{y}</span>
              </>
            ) : null}
          </p>
          <div className="flex gap-5 pr-2">
            <div className="h-3 w-2 rounded-sm bg-foreground/10" />
            <div className="h-3 w-2 rounded-sm bg-foreground/10" />
          </div>
        </div>

        {/* weekday row between hairlines, then the date grid */}
        <div className="mt-3 grid grid-cols-7 border-y border-line py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-foreground/30">
          {WEEKDAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-foreground/[0.05]" />
          ))}
        </div>
      </div>

      {/* light sweep (one transformed layer; reduced motion stops it) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-[booker-shimmer_1.6s_ease-in-out_infinite] bg-[linear-gradient(100deg,transparent_30%,rgb(255_255_255/0.06)_50%,transparent_70%)]"
        style={{ animationDelay: `-${phase}ms` }}
      />

      {/* status: what's happening, and a way out if it's slow */}
      <div className="absolute inset-x-0 bottom-5 flex justify-center px-4">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-solid/90 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground shadow-sm backdrop-blur-sm">
          <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-brand" />
          {slow && href ? (
            <>
              Still loading ·{" "}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-2.5 py-2.5 text-accent-text underline-offset-2 hover:underline"
              >
                Open on Cal.com ↗
              </a>
            </>
          ) : (
            "Loading availability…"
          )}
        </p>
      </div>
    </div>
  );
}
