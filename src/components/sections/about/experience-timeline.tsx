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
              Two years of backend and AI work at Honeywell: .NET services across 50+ healthcare networks, and the RAG
              and agent tools built on top of them.
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
            <li key={t.when} className="relative pb-16 pl-10 last:pb-0">
              <span
                aria-hidden
                className="absolute left-0 top-1.5 size-[11px] rounded-full border-2 border-brand bg-background"
              />
              <Reveal>
                <p className="font-mono text-xs text-muted-foreground">{t.when}</p>
                <h3 className="mt-2 text-h3 font-semibold">{t.role}</h3>
                <p className="mt-0.5 text-sm font-medium text-accent-text">{t.org}</p>
                <p className="mt-4 max-w-[62ch] leading-relaxed text-muted-foreground">{t.body}</p>

                {t.groups.map((g, gi) => (
                  <div key={g.title ?? gi} className="mt-7">
                    {g.title && <h4 className="font-mono text-xs text-accent-text">{g.title}</h4>}
                    <ul className={`${g.title ? "mt-3" : ""} max-w-[66ch] divide-y divide-line border-y border-line`}>
                      {g.points.map((p) => (
                        <li key={p.text} className="py-3 text-[15px] leading-relaxed text-muted-foreground">
                          {p.figure && (
                            <span className="mr-2 font-mono font-semibold tracking-tight text-foreground">{p.figure}</span>
                          )}
                          {p.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {t.stack.length > 0 && (
                  <p className="mt-5 font-mono text-xs leading-relaxed text-muted-foreground">
                    <span className="sr-only">Stack: </span>
                    {t.stack.join(" · ")}
                  </p>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
