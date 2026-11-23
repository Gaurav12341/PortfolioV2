import { CountUp, Reveal, RevealItem } from "@/components/motion";
import { about } from "@/content/about";
import { AboutDepth } from "./about-depth";
import { StackBand } from "./stack-band";

/**
 * About (PHASES.md · Phase 6). Opens on the layered full-body portrait with
 * the headline, then story + numbers, principles + recognition, and the
 * grouped stack full width. All copy lives in content/about.ts.
 */
export default function AboutSection() {
  const a = about;

  return (
    <div className="relative w-full pb-8 md:pb-12">
      <AboutDepth />

      <div className="container-page mt-16 md:mt-24">
        {/* Story + numbers */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal className="max-w-[62ch] space-y-5">
              <p className="text-lead text-foreground">{a.story[0]}</p>
              {a.story.slice(1).map((p) => (
                <p key={p} className="text-base leading-relaxed text-muted-foreground md:text-[17px]">
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-line bg-surface-solid/70 px-4 py-3 text-sm">
                <span className="font-mono text-xs text-accent-text">Currently</span>
                <span className="text-foreground">{a.currently}</span>
              </p>
            </Reveal>
          </div>

          <Reveal
            as="ul"
            stagger={0.07}
            className="grid grid-cols-2 gap-x-6 gap-y-8 self-start border-t border-line pt-8 lg:col-span-5 lg:mt-1.5"
          >
            {a.stats.map((s) => (
              <RevealItem as="li" key={s.label}>
                <p className="flex flex-wrap items-baseline gap-x-1.5 font-mono font-semibold tracking-tight">
                  {"from" in s && (
                    <span className="text-base font-normal text-muted-foreground line-through decoration-muted-foreground/50">
                      {s.from}
                    </span>
                  )}
                  <CountUp value={s.value} className="text-3xl text-foreground lg:text-[34px]" />
                  {"unit" in s && <span className="text-lg text-foreground">{s.unit}</span>}
                </p>
                <p className="mt-2 text-sm leading-snug text-muted-foreground">{s.label}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>

        {/* Principles + recognition */}
        <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h3 className="text-h3 font-semibold">How I work</h3>
            <ol className="mt-5 divide-y divide-line border-y border-line">
              {a.principles.map((p) => (
                <li key={p.title} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <span className="font-medium text-foreground">{p.title}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground md:text-base">{p.body}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.05}>
            <h3 className="text-h3 font-semibold">Recognition</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {a.recognition.map((r) => (
                <li
                  key={r}
                  className="rounded-xl border border-line bg-surface-solid/70 px-3.5 py-1.5 text-sm text-foreground"
                >
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{a.offKeyboard}</p>
          </Reveal>
        </div>
      </div>

      <StackBand groups={a.stack} />
    </div>
  );
}
