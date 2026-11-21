"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { DiagramStory } from "@/components/diagram/DiagramStory";
import { BeforeAfter } from "@/components/diagram/BeforeAfter";
import { CountUp, Reveal, RevealItem, SplitText } from "@/components/motion";
import { DevTodo } from "@/components/common/dev-todo";
import { workProjects, type WorkProject } from "@/content/projects";
import { VariantToggle, type RagMode } from "./variant-toggle";

/**
 * Case-study page: Context → Problem → Approach (scroll-synced diagram) →
 * Impact → Hard parts → Stack → My role (PROJECTS.md).
 */
export function CaseStudy({ project: p }: { project: WorkProject }) {
  const [mode, setMode] = React.useState<RagMode>("cloud");
  const spec = p.variants ? p.variants[mode] : p.diagram;
  const idx = workProjects.findIndex((x) => x.slug === p.slug);
  const next = workProjects[(idx + 1) % workProjects.length];

  return (
    <article className="pb-24 pt-28 md:pt-36">
      <div className="container-page">
        <Link
          href="/#projects"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          All work projects
        </Link>

        {/* Header */}
        <header className="mt-8 max-w-4xl">
          <p className="anim-fade-up font-mono text-xs uppercase tracking-[0.2em] text-accent-text">
            Case study {String(idx + 1).padStart(2, "0")} · {p.kicker}
          </p>
          <SplitText as="h1" text={p.title} immediate className="mt-4 text-h1 font-semibold" />
          <p className="anim-fade-up mt-6 text-lead text-muted-foreground" style={{ "--d": "0.2s" } as React.CSSProperties}>
            {p.oneLiner}
          </p>
          {p.badges && (
            <ul className="anim-fade-up mt-5 flex flex-wrap gap-2" style={{ "--d": "0.3s" } as React.CSSProperties}>
              {p.badges.map((b) => (
                <li key={b} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-accent-text">
                  {b}
                </li>
              ))}
            </ul>
          )}
        </header>
        <DevTodo items={p.todos} className="mt-6 max-w-3xl" />

        {/* Context / Problem */}
        <Reveal stagger={0.08} className="mt-14 grid gap-4 md:grid-cols-2">
          <RevealItem className="rounded-2xl border border-line bg-surface-solid/70 p-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Context</h2>
            <p className="mt-3 text-base leading-relaxed">{p.context}</p>
          </RevealItem>
          <RevealItem className="rounded-2xl border border-line bg-surface-solid/70 p-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Problem</h2>
            <p className="mt-3 text-base leading-relaxed">{p.problem}</p>
          </RevealItem>
        </Reveal>

        {/* Approach */}
        <section className="mt-20" aria-labelledby="approach">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-text">Approach</p>
            <h2 id="approach" className="mt-3 text-h2 font-semibold">
              How it works, step by step
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Scroll through the steps; the diagram follows. Hover or tap a stage for details.
            </p>
          </Reveal>
          <div className="mt-8">
            <DiagramStory spec={spec} toolbar={p.variants ? <VariantToggle mode={mode} onChange={setMode} /> : undefined} />
          </div>
        </section>

        {/* Impact */}
        <section className="mt-20" aria-labelledby="impact">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-text">Impact</p>
            <h2 id="impact" className="mt-3 text-h2 font-semibold">
              What changed
            </h2>
          </Reveal>
          <Reveal as="ul" stagger={0.07} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {p.metrics.map((m) => (
              <RevealItem as="li" key={m.label} className="rounded-2xl border border-line bg-surface-solid/80 p-5">
                <p className="flex items-baseline gap-2 font-mono">
                  <CountUp value={m.value} className="text-3xl font-semibold tracking-tight" />
                  {m.projected && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      projected
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-sm font-medium">{m.label}</p>
                {m.detail && <p className="mt-0.5 text-xs text-muted-foreground">{m.detail}</p>}
              </RevealItem>
            ))}
          </Reveal>
          {p.beforeAfter && (
            <Reveal className="mt-4 max-w-2xl">
              <BeforeAfter {...p.beforeAfter} />
            </Reveal>
          )}
        </section>

        {/* Hard parts */}
        <Reveal className="mt-20">
          <details className="group rounded-3xl border border-line bg-surface-solid/60" open>
            <summary className="flex cursor-pointer list-none items-center gap-4 rounded-3xl p-5 md:p-7 [&::-webkit-details-marker]:hidden">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-accent-text">
                <Wrench className="size-5" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block text-h3 font-semibold">Hard parts</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">What made this tricky, and how I handled it</span>
              </span>
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" aria-hidden />
            </summary>
            <ul className="grid gap-3 px-5 pb-6 md:grid-cols-2 md:px-7">
              {p.hardParts.map((h) => (
                <li key={h.title} className="rounded-2xl border border-line bg-background/60 p-4">
                  <p className="font-medium">{h.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
                </li>
              ))}
            </ul>
          </details>
        </Reveal>

        {/* Stack + role */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-line bg-surface-solid/70 p-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="rounded-full border border-line bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="rounded-2xl border border-line bg-surface-solid/70 p-6" delay={0.05}>
            <h2 className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <UserRound className="size-3.5" aria-hidden /> My role
            </h2>
            <p className="mt-3 text-base leading-relaxed">{p.role}</p>
          </Reveal>
        </div>

        <p className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" aria-hidden />
          Details generalised for privacy; no proprietary code or UI shown.
        </p>

        {/* Next */}
        <Link
          href={`/work/${next.slug}`}
          className="group mt-16 flex items-center justify-between gap-6 rounded-3xl border border-line bg-surface-solid/60 p-6 transition-colors hover:border-brand/40 md:p-8"
        >
          <span>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Next case study</span>
            <span className="mt-2 block text-h3 font-semibold">{next.title}</span>
          </span>
          <ArrowRight className="size-6 shrink-0 text-accent-text transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
