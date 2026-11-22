"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "@/components/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { timeline } from "@/content/about";

/**
 * Experience (PHASES.md · Phase 6.5). Most recent first. A crimson line
 * draws down the rail as the list scrolls through the viewport (scaleY only);
 * under reduced motion it is simply fully drawn.
 */
export function ExperienceTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="w-full py-24 md:py-32">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal className="lg:sticky lg:top-28">
            <h2 id="experience-title" className="text-h2 font-semibold">
              Experience
            </h2>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Two years of backend work at Honeywell, from an AKS internship to owning deployment tooling across 50+
              healthcare networks.
            </p>
          </Reveal>
        </div>

        <ol ref={listRef} className="relative lg:col-span-8">
          {/* rail + drawn line */}
          <span aria-hidden className="absolute left-[5px] top-2 bottom-2 w-px bg-line-strong" />
          <motion.span
            aria-hidden
            className="absolute left-[5px] top-2 bottom-2 w-px origin-top bg-brand"
            style={reduce ? undefined : { scaleY: progress }}
          />

          {timeline.map((t) => (
            <li key={t.when} className="relative pb-14 pl-10 last:pb-0">
              <span
                aria-hidden
                className="absolute left-0 top-1.5 size-[11px] rounded-full border-2 border-brand bg-background"
              />
              <Reveal>
                <p className="font-mono text-xs text-muted-foreground">{t.when}</p>
                <h3 className="mt-2 text-h3 font-semibold">{t.role}</h3>
                <p className="mt-0.5 text-sm font-medium text-accent-text">{t.org}</p>
                <p className="mt-4 max-w-[62ch] leading-relaxed text-muted-foreground">{t.body}</p>
                {t.highlights.length > 0 && (
                  <ul className="mt-5 grid gap-2">
                    {t.highlights.map((h) => (
                      <li
                        key={h}
                        className="w-fit rounded-xl border border-line bg-surface-solid/70 px-3.5 py-2 font-mono text-[13px] text-foreground"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
