"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconArrowUp,
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLeetcode,
  IconBrandLinkedin,
  IconDownload,
} from "@tabler/icons-react";
import { Logo } from "@/components/brand/logo";
import { CollabMark } from "@/components/common/collab-mark";
import { Magnetic, Reveal, SplitText } from "@/components/motion";
import { RESUME_PATH, SOCIAL_LINKS, SOURCE_URL } from "@/lib/constants";
import { scrollToTarget } from "@/lib/scroll";
import { trackResumeDownload } from "@/lib/analytics";

const NAV = [
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
] as const;

const SOCIAL_ICONS = {
  GitHub: IconBrandGithub,
  LinkedIn: IconBrandLinkedin,
  LeetCode: IconBrandLeetcode,
} as const;

const linkCls =
  "group inline-flex w-fit items-center gap-2 text-[15px] text-foreground/80 transition-colors duration-200 hover:text-accent-text";

/**
 * Footer (PHASES.md Phase 8): the closing line with the collab mark, sitemap,
 * links elsewhere, and a bottom bar with the source link and back-to-top.
 * Section links work from case-study pages too (they go to /#id there).
 */
export default function Footer() {
  const onHome = usePathname() === "/";
  const year = new Date().getFullYear();

  const goTo = (e: React.MouseEvent, id: string) => {
    if (!onHome) return; // let the link navigate to /#id
    e.preventDefault();
    scrollToTarget(`#${id}`);
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-line pt-24 pb-8 md:pt-32">
      {/* one static glow; no looping blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]"
      />

      <div className="container-page">
        {/* closing line + collab mark */}
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
          <SplitText
            as="h2"
            text="Let's build something reliable."
            className="max-w-[14ch] text-[clamp(3rem,1.6rem+6vw,7rem)] font-semibold leading-[0.95] tracking-[-0.035em]"
          />
          <Magnetic
            className="block shrink-0 self-end md:self-auto"
            strength={10}
          >
            <CollabMark />
          </Magnetic>
        </div>

        {/* columns */}
        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-12 md:grid-cols-12">
          <Reveal className="col-span-2 flex flex-col gap-5 md:col-span-5">
            <Link href="/" aria-label="Gaurav Raj, home" className="w-fit">
              <Logo withName />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Backend &amp; AI Engineer at Honeywell, Bengaluru.
              Distributed systems and RAG pipelines that hold up under load.
            </p>
          </Reveal>

          <Reveal className="md:col-span-3" delay={0.05}>
            <nav aria-label="Footer">
              <h3 className="font-mono text-xs text-muted-foreground">
                Sitemap
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {NAV.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/#${n.id}`}
                      onClick={(e) => goTo(e, n.id)}
                      className={linkCls}
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <Reveal className="md:col-span-4" delay={0.1}>
            <h3 className="font-mono text-xs text-muted-foreground">
              Elsewhere
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SOCIAL_LINKS.map((s) => {
                const Icon = SOCIAL_ICONS[s.name];
                return (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkCls}
                    >
                      <Icon size={18} aria-hidden />
                      {s.name}
                      <IconArrowUpRight
                        size={14}
                        aria-hidden
                        className="opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href={RESUME_PATH}
                  download="Gaurav-Raj-Resume.pdf"
                  onClick={() => trackResumeDownload("footer")}
                  className={linkCls}
                >
                  <IconDownload size={18} aria-hidden />
                  Résumé PDF
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        {/* bottom bar */}
        <div className="mt-16 flex flex-col-reverse items-start gap-4 border-t border-line pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Gaurav Raj</p>
          <p className="font-mono">
            Built with Next.js ·{" "}
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-text hover:decoration-current"
            >
              source on GitHub
            </a>
          </p>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-1.5 text-foreground transition-[border-color,color,transform] duration-200 hover:border-brand hover:text-accent-text active:scale-[0.97]"
          >
            Back to top
            <IconArrowUp
              size={14}
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
