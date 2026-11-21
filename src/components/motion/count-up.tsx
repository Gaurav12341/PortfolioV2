"use client";

import * as React from "react";
import { useInView } from "motion/react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type CountUpProps = {
  /**
   * The final display string, e.g. "82.5%", "20s", "5+", "$0", "~82 ms".
   * The first number in it is animated; everything else is kept as-is.
   */
  value: string;
  /** Seconds. */
  duration?: number;
  className?: string;
};

const NUMBER = /\d+(?:\.\d+)?/;

/**
 * Counts the first number in `value` up from 0 when it enters the viewport.
 * The server renders the final value (good for SEO/no-JS); reduced motion
 * never animates.
 */
export function CountUp({ value, duration = 1.4, className }: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotionSafe();
  const [display, setDisplay] = React.useState(value);

  React.useEffect(() => {
    const match = value.match(NUMBER);
    if (!inView || reduce || !match || match.index === undefined) return;

    const raw = match[0];
    const target = parseFloat(raw);
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const before = value.slice(0, match.index);
    const after = value.slice(match.index + raw.length);

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart, no overshoot
      setDisplay(`${before}${(target * eased).toFixed(decimals)}${after}`);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className} aria-label={value} role="text">
      <span aria-hidden className="tabular-nums">
        {display}
      </span>
    </span>
  );
}
