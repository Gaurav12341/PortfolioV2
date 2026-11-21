import { SplitText } from "@/components/motion";
import { hero } from "@/content/hero";
import { GraphLoader } from "./graph-loader";
import { HeroCtas } from "./hero-ctas";

/**
 * Typographic hero over the live SystemGraph canvas (PHASES.md · Phase 2).
 *
 * Server component: all text is in the initial HTML, and entrance motion is
 * CSS keyframes (`rise-in`, `.anim-fade-up`) so it plays on first paint
 * without waiting for hydration. The H1 is the LCP element.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh w-full items-center overflow-hidden"
    >
      {/* Background graph. The mask keeps the area behind the text calm. */}
      <GraphLoader className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,rgb(0_0_0/0.18)_0%,rgb(0_0_0/0.55)_55%,#000_100%)] md:[mask-image:radial-gradient(ellipse_42%_58%_at_27%_52%,rgb(0_0_0/0.12)_0%,rgb(0_0_0/0.5)_55%,#000_100%)]" />

      {/* Soft fade into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-background"
      />

      <div className="container-page pb-24 pt-32 md:pt-36">
        <div className="max-w-3xl">
          {/* Status */}
          <p
            className="anim-fade-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface-solid/70 py-1.5 pl-3 pr-4 font-mono text-xs text-muted-foreground backdrop-blur-sm"
            style={{ "--d": "0s" } as React.CSSProperties}
          >
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {hero.status}
          </p>

          <SplitText
            as="h1"
            text={hero.name}
            immediate
            delay={0.05}
            stagger={0.09}
            className="text-display font-semibold"
          />
          {/* id for aria-labelledby (SplitText owns its own aria-label) */}
          <span id="hero-title" className="sr-only">
            {hero.name}, {hero.title}
          </span>

          <h2
            className="anim-fade-up mt-4 text-h3 font-medium text-foreground md:mt-5"
            style={{ "--d": "0.25s" } as React.CSSProperties}
          >
            {hero.title}
          </h2>

          <p
            className="anim-fade-up mt-5 max-w-xl text-lead text-muted-foreground"
            style={{ "--d": "0.35s" } as React.CSSProperties}
          >
            {hero.summary}
          </p>

          <div className="anim-fade-up mt-9" style={{ "--d": "0.45s" } as React.CSSProperties}>
            <HeroCtas />
          </div>

          <ul
            aria-label="Highlights"
            className="anim-fade-up mt-10 flex flex-wrap gap-2.5"
            style={{ "--d": "0.6s" } as React.CSSProperties}
          >
            {hero.proof.map((p) => (
              <li
                key={p.value}
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface-solid/70 px-3 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-sm"
              >
                {"tag" in p ? (
                  <>
                    <span>{p.tag}</span>
                    <span aria-hidden className="text-accent-text">
                      ·
                    </span>
                    <span className="font-semibold text-foreground">{p.value}</span>
                  </>
                ) : (
                  <>
                    <span className="text-foreground/70 line-through decoration-foreground/30">{p.before}</span>
                    <span aria-label="to" className="text-accent-text">
                      →
                    </span>
                    <span className="font-semibold text-foreground">{p.value}</span>
                    <span>{p.label}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="anim-fade-up absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex [@media(max-height:700px)]:hidden"
        style={{ "--d": "1s" } as React.CSSProperties}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </span>
        <span className="relative h-9 w-px overflow-hidden bg-line-strong">
          <span className="absolute inset-x-0 top-0 h-1/3 bg-brand [animation:scroll-cue_2.2s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
        </span>
      </div>
    </section>
  );
}
