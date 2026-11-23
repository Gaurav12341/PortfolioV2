"use client";

import * as React from "react";
import { useInView } from "motion/react";
import { DURATION, EASE_CSS } from "@/lib/motion";

type SplitTextProps = {
  /** Plain text to split. Meant for headings, not paragraphs. */
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Seconds before the first line starts. */
  delay?: number;
  /** Seconds between lines (or words, in `immediate` mode). */
  stagger?: number;
  /**
   * Play on first paint with pure CSS keyframes, before React hydrates.
   * Use for above-the-fold headings (the hero H1 is the LCP element).
   * Staggers per word, since lines can't be measured before paint.
   */
  immediate?: boolean;
};

/**
 * Line-by-line heading reveal: each line slides up from behind a mask.
 *
 * Scroll mode measures words after layout and groups them by rendered line,
 * so wrapping stays natural at every width. Screen readers get the plain
 * text via aria-label (the split spans are aria-hidden). Reduced motion is
 * handled by the global CSS media query (animations/transitions collapse to
 * ~0ms), so server and client markup always match.
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
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [lineOf, setLineOf] = React.useState<number[] | null>(null);
  const words = React.useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  React.useLayoutEffect(() => {
    if (immediate) return;
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
  }, [immediate, words]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => {
        const style: React.CSSProperties = immediate
          ? {
              animation: `rise-in ${DURATION.slow}s ${EASE_CSS} ${delay + i * stagger}s both`,
            }
          : {
              transform: inView ? "translateY(0)" : "translateY(110%)",
              transition: `transform ${DURATION.slow}s ${EASE_CSS} ${
                delay + (lineOf?.[i] ?? 0) * stagger
              }s`,
            };

        return (
          <React.Fragment key={`${word}-${i}`}>
            <span
              aria-hidden
              className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom"
            >
              <span data-word className="inline-block will-change-transform" style={style}>
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
