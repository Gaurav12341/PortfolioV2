"use client";

import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { Magnetic } from "@/components/motion";
import { scrollToTarget } from "@/lib/scroll";
import { trackResumeDownload } from "@/lib/analytics";
import { RESUME_PATH } from "@/lib/constants";
import { hero } from "@/content/hero";

export function HeroCtas() {
  const { primary, secondary, tertiary } = hero.ctas;

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToTarget(href);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
      <Magnetic>
        <a
          href={primary.href}
          onClick={(e) => go(e, primary.href)}
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-brand-fg shadow-[0_10px_30px_-10px_var(--accent)] transition-[filter,transform] hover:brightness-110 active:scale-[0.97]"
        >
          {primary.label}
          <ArrowDown
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
          />
        </a>
      </Magnetic>

      <Magnetic>
        <a
          href={RESUME_PATH}
          download="Gaurav-Raj-Resume.pdf"
          onClick={() => trackResumeDownload("hero")}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong bg-surface-solid/70 px-6 text-[15px] font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-surface-solid active:scale-[0.97]"
        >
          {secondary.label}
          <Download aria-hidden className="size-4" />
        </a>
      </Magnetic>

      <a
        href={tertiary.href}
        onClick={(e) => go(e, tertiary.href)}
        className="group -my-2.5 ml-1 inline-flex items-center gap-1.5 py-2.5 text-[15px] font-medium text-foreground underline decoration-line-strong decoration-1 underline-offset-[6px] transition-colors hover:decoration-brand"
      >
        {tertiary.label}
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </a>
    </div>
  );
}
