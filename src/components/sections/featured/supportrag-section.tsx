"use client";

import * as React from "react";
import { ArrowUpRight, ChevronDown, FlaskConical } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { CountUp, Reveal, RevealItem, SplitText } from "@/components/motion";
import { ArchDiagram } from "@/components/diagram/ArchDiagram";
import { DemoVideo } from "@/components/media/DemoVideo";
import { supportRag, supportRagDiagram } from "@/content/supportrag";
import { cn } from "@/lib/utils";

/**
 * Featured project: SupportRAG (PHASES.md · Phase 3).
 * Demo video + metric cards, the pipeline diagram with a step switcher,
 * the "tried and turned off" accordion, stack and links.
 */
export default function SupportRagSection() {
  const [step, setStep] = React.useState<number | null>(null);
  const p = supportRag;

  return (
    <section
      id="supportrag"
      aria-labelledby="supportrag-title"
      className="relative w-full scroll-mt-[88px] py-24 md:py-32"
    >
      <div className="container-page">
        {/* Header */}
        <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-text">
            {p.eyebrow}
          </span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          <span className="font-mono text-xs text-muted-foreground">{p.meta}</span>
        </Reveal>

        <div id="supportrag-title">
          <SplitText as="h2" text={p.title} className="mt-4 text-h1 font-semibold" />
        </div>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-3xl text-lead text-muted-foreground">{p.summary}</p>
        </Reveal>

        {/* Video + metrics */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7" amount={0.3}>
            <DemoVideo
              mp4={p.video.mp4}
              webm={p.video.webm}
              poster={p.video.poster}
              label={p.video.label}
              title={p.video.title}
            />
          </Reveal>

          <Reveal
            as="ul"
            stagger={0.08}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-rows-2"
          >
            {p.metrics.map((m) => (
              <RevealItem
                as="li"
                key={m.label}
                className="flex flex-col justify-center rounded-2xl border border-line bg-surface-solid/80 p-5 backdrop-blur-sm lg:p-4 xl:p-5"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 font-mono">
                  {"from" in m && m.from && (
                    <>
                      <span className="text-base text-muted-foreground line-through decoration-muted-foreground/50">
                        {m.from}
                      </span>
                      <span className="text-accent-text" aria-label="to">
                        →
                      </span>
                    </>
                  )}
                  <CountUp value={m.value} className="text-3xl font-semibold tracking-tight text-foreground lg:text-[26px] xl:text-3xl" />
                  {"suffix" in m && m.suffix && (
                    <span className="text-2xl font-semibold text-foreground lg:text-xl xl:text-2xl">{m.suffix}</span>
                  )}
                </div>
                <p className="mt-1.5 text-sm font-medium text-foreground">{m.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.detail}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>

        {/* Pipeline diagram */}
        <Reveal className="mt-8 rounded-3xl border border-line bg-surface-solid/60 p-4 backdrop-blur-sm md:p-8" amount={0.15}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-h3 font-semibold">How it works</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Hover or tap a stage for details. Pick a step to trace it.
              </p>
            </div>
            <div
              role="tablist"
              aria-label="Pipeline steps"
              className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
            >
              <StepTab active={step === null} onClick={() => setStep(null)}>
                All
              </StepTab>
              {supportRagDiagram.steps.map((s, i) => (
                <StepTab key={s.title} active={step === i} onClick={() => setStep(i)}>
                  <span className="mr-1.5 font-mono text-[10px] opacity-60">{i + 1}</span>
                  {s.title}
                </StepTab>
              ))}
            </div>
          </div>

          <ArchDiagram spec={supportRagDiagram} activeStep={step} className="mx-auto mt-6 max-w-md md:mt-8 md:max-w-none" />

          <p aria-live="polite" className="mt-6 min-h-[3rem] max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {step === null ? (
              <>
                <span className="font-medium text-foreground">Offline</span>, docs are cleaned, masked, chunked and
                indexed. <span className="font-medium text-foreground">Per question</span>, hybrid search feeds a
                writer whose every claim is checked before it&apos;s shown.
              </>
            ) : (
              <>
                <span className="font-medium text-foreground">{supportRagDiagram.steps[step].title}.</span>{" "}
                {supportRagDiagram.steps[step].body}
              </>
            )}
          </p>
        </Reveal>

        {/* Engineering decisions */}
        <Reveal className="mt-8">
          <details className="group rounded-3xl border border-line bg-surface-solid/60 backdrop-blur-sm open:pb-2">
            <summary className="flex cursor-pointer list-none items-center gap-4 rounded-3xl p-5 md:p-7 [&::-webkit-details-marker]:hidden">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-accent-text">
                <FlaskConical className="size-5" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block text-h3 font-semibold">Engineering decisions</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  What I tried, measured, and turned off — {p.decisions.length} experiments
                </span>
              </span>
              <ChevronDown
                className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <ul className="grid gap-3 px-5 pb-5 md:grid-cols-2 md:px-7">
              {p.decisions.map((d) => (
                <li key={d.name} className="rounded-2xl border border-line bg-background/60 p-4">
                  <p className="flex items-center gap-2 font-mono text-[13px] font-semibold text-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      off
                    </span>
                    {d.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.why}</p>
                </li>
              ))}
            </ul>
          </details>
        </Reveal>

        {/* Stack + links */}
        <Reveal className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <ul aria-label="Stack" className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-line bg-surface-solid/70 px-3 py-1 font-mono text-xs text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <a
              href={p.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <FaGithub className="size-4" aria-hidden />
              GitHub repo
            </a>
            <a
              href={p.links.evals}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line-strong px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Read the eval write-up
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StepTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-transparent bg-foreground text-background"
          : "border-line text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
