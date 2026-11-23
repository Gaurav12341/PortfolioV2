"use client";

import { useEffect, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useTheme } from "next-themes";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

/** Brand colours per theme, matching --accent in globals.css. */
const BRAND = { light: "#e11d48", dark: "#fb3b64" } as const;
/** No linkReady by then → show the fallback link. */
const TIMEOUT_MS = 15000;
/** Wait after a date click: long enough on the first pick to see whether Cal
    scrolled itself, short on later picks (the slot list just has to render). */
const FIRST_SETTLE_MS = 900;
const SETTLE_MS = 300;
/** Stop this far above the slot list so the "Mon 24th" day header shows. */
const HEADER_PX = 64;

type Status = "loading" | "ready" | "failed";

/**
 * Inline Cal.com booker (PHASES.md · Phase 7). Themed to the site and
 * re-initialised when the theme or the chosen topic changes (the topic
 * prefills the notes field). Skeleton until Cal reports linkReady; the
 * "Open booking page" fallback if it fails or never loads.
 *
 * Scrolling: the iframe grows to its full height inside our own scroll box.
 * Cal scrolls to the time slots itself only on the first date pick, and the
 * embed takes no scroll commands, so we copy it: Cal fires __routeChanged on
 * every date pick; the first time, we note where Cal scrolled our box to
 * (the slot list); on later picks we scroll the box back there ourselves.
 */
export function CalInline({ calLink, notes }: { calLink: string; notes?: string }) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const namespace = "contact";
  const [status, setStatus] = useState<Status>("loading");
  const reduce = useReducedMotionSafe();
  const boxRef = useRef<HTMLDivElement>(null);
  /** where the slot list starts inside the box, learned from Cal's own scroll */
  const slotsTop = useRef<number | null>(null);
  /** current iframe height, from __dimensionChanged */
  const frameH = useRef(0);
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;
  const href = `https://cal.com/${calLink}${notes ? `?notes=${encodeURIComponent(notes)}` : ""}`;

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    const timer = window.setTimeout(() => alive && setStatus((s) => (s === "ready" ? s : "failed")), TIMEOUT_MS);
    slotsTop.current = null;
    boxRef.current?.scrollTo({ top: 0 });

    const onRoute = () => {
      const box = boxRef.current;
      if (!box) return;
      const start = box.scrollTop;
      window.setTimeout(() => {
        if (!alive) return;
        if (Math.abs(box.scrollTop - start) > 40) {
          slotsTop.current = box.scrollTop; // Cal scrolled itself: remember the spot
          return;
        }
        const list = slotsTop.current;
        if (list == null) return;
        if (frameH.current < list + 120) return; // no slot list, e.g. a month change
        const top = Math.max(0, list - HEADER_PX);
        if (Math.abs(box.scrollTop - top) < 8) return;
        box.scrollTo({ top, behavior: reduceRef.current ? "auto" : "smooth" });
      }, slotsTop.current == null ? FIRST_SETTLE_MS : SETTLE_MS);
    };

    (async () => {
      try {
        const cal = await getCalApi({ namespace });
        if (!alive) return;
        cal("ui", {
          theme,
          hideEventTypeDetails: false,
          layout: "month_view",
          cssVarsPerTheme: { light: { "cal-brand": BRAND.light }, dark: { "cal-brand": BRAND.dark } },
        });
        cal("on", { action: "linkReady", callback: () => alive && setStatus("ready") });
        cal("on", { action: "linkFailed", callback: () => alive && setStatus("failed") });
        cal("on", { action: "__routeChanged", callback: onRoute });
        cal("on", {
          action: "__dimensionChanged",
          callback: (e) => {
            frameH.current = Number(e.detail.data.iframeHeight) || frameH.current;
          },
        });
      } catch {
        if (alive) setStatus("failed");
      }
    })();

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [theme, notes]);

  return (
    /* Our box scrolls; the iframe is full height with scrolling="no", so
       there is exactly one scrollbar. data-lenis-prevent keeps the wheel here. */
    <div
      ref={boxRef}
      data-lenis-prevent
      className="relative h-full overflow-y-auto overscroll-contain [scrollbar-color:var(--line-strong)_transparent] [scrollbar-width:thin]"
    >
      {status !== "failed" && (
        <Cal
          key={`${theme}-${notes ?? ""}`}
          namespace={namespace}
          calLink={calLink}
          config={{
            layout: "month_view",
            theme,
            ...(notes ? { notes } : {}),
            iframeAttrs: { scrolling: "no" },
          }}
          className={`w-full [&_iframe]:block transition-opacity duration-500 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {status === "loading" && <BookerSkeleton />}

      {status === "failed" && (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="max-w-xs text-sm text-muted-foreground">
            The calendar didn&apos;t load here. You can still pick a slot on Cal.com.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
          >
            Open booking page
          </a>
        </div>
      )}
    </div>
  );
}

/** Shaped like the month view: details column, then a 7×5 date grid. */
function BookerSkeleton() {
  return (
    <div role="status" className="absolute inset-0 grid animate-pulse gap-8 p-6 md:grid-cols-[13rem_1fr] md:p-8">
      <div aria-hidden className="hidden space-y-3 md:block">
        <div className="size-10 rounded-full bg-foreground/10" />
        <div className="h-3 w-24 rounded bg-foreground/10" />
        <div className="h-5 w-36 rounded bg-foreground/10" />
        <div className="h-3 w-28 rounded bg-foreground/10" />
        <div className="h-3 w-20 rounded bg-foreground/10" />
      </div>
      <div aria-hidden>
        <div className="mb-6 h-5 w-40 rounded bg-foreground/10" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-foreground/[0.06]" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading the booking calendar</span>
    </div>
  );
}
