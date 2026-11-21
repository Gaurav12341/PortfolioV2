"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";
import { DURATION, EASE_CSS } from "@/lib/motion";

type SplitTextProps = {
  /** Plain text to split. Meant for headings, not paragraphs. */
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Seconds before the first line starts. */
  delay?: number;
  /** Seconds between lines. */
  stagger?: number;
  /** Reveal on mount instead of on scroll-into-view (use for the hero). */
  immediate?: boolean;
};

/**
 * Line-by-line heading reveal. Words are measured after layout and grouped
 * by their rendered line, so wrapping stays natural at every width; each
 * line slides up from behind a mask.
 *
 * Screen readers get the plain text via aria-label (the split spans are
 * aria-hidden). Reduced motion renders plain text.
 */
export function SplitText({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.08,
  immediate = false,
}: SplitTextProps) {
  const Tag = as as React.ElementType;
  const ref = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [lineOf, setLineOf] = React.useState<number[] | null>(null);
  const words = React.useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  React.useLayoutEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const spans = el.querySelectorAll<HTMLElement>("[data-word]");
      let line = -1;
      let lastTop = -Infinity;
      const result: number[] = [];
      spans.forEach((s) => {
        const top = (s.parentElement as HTMLElement).offsetTop;
        if (top > lastTop + 2) {
          line += 1;
          lastTop = top;
        }
        result.push(line);
      });
      setLineOf(result);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduce, words]);

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const play = immediate || inView;

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => {
        const line = lineOf?.[i] ?? 0;
        return (
          <React.Fragment key={`${word}-${i}`}>
            <span
              aria-hidden
              className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom"
            >
              <span
                data-word
                className="inline-block will-change-transform"
                style={{
                  transform: play ? "translateY(0)" : "translateY(110%)",
                  transition: `transform ${DURATION.slow}s ${EASE_CSS} ${delay + line * stagger}s`,
                }}
              >
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </Tag>
  );
}
