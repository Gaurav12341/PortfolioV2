"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { toast } from "sonner";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconCheck,
  IconCopy,
  IconDownload,
} from "@tabler/icons-react";
import { Magnetic, Reveal, RevealItem, SplitText } from "@/components/motion";
import { contact } from "@/content/contact";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { CAL_USERNAME, CONTACT_EMAIL, RESUME_PATH, SOCIAL_LINKS } from "@/lib/constants";
import { CalInline } from "./cal-inline";

const linkedin = SOCIAL_LINKS.find((l) => l.name === "LinkedIn")!.href;
const github = SOCIAL_LINKS.find((l) => l.name === "GitHub")!.href;

const btn =
  "group inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition-[transform,background-color,border-color,color,filter] duration-200 active:scale-[0.98]";
const btnQuiet = `${btn} border-line-strong bg-surface-solid text-foreground hover:border-brand hover:text-accent-text`;

/**
 * Booking / contact (PHASES.md · Phase 7). Two columns on desktop: portrait,
 * availability, topic chips and direct links on the left; the inline Cal.com
 * booker on the right. Stacked on phones with the booker right after the
 * chips, so the main action isn't buried. Copy lives in content/contact.ts.
 */
export default function ContactSection() {
  const reduce = useReducedMotionSafe();
  const [topic, setTopic] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  /* slow float + parallax on the portrait card, scroll-driven (no loops) */
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast.success("Email copied", { description: CONTACT_EMAIL });
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const p = contact.portrait;

  return (
    <div className="relative w-full overflow-hidden py-24 md:py-32">
      <div className="container-page">
        <div className="max-w-3xl">
          <SplitText as="h2" text={contact.heading} className="text-h2 font-semibold text-balance" />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-lead text-muted-foreground">{contact.sub}</p>
          </Reveal>
        </div>

        {/* The left column is `contents` on phones, so its items join this grid
            and the links can drop below the booker (order-last). On desktop it
            is a column that sets the row height; the booker card fills that
            height and scrolls inside. */}
        <div className="mt-12 grid grid-cols-1 gap-y-8 md:mt-16 lg:grid-cols-12 lg:gap-x-12">
          <div className="contents lg:col-span-5 lg:flex lg:flex-col lg:gap-8">
            <motion.div ref={cardRef} className="relative" style={reduce ? undefined : { y: cardY }}>
              <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-brand/20 blur-3xl" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface-solid lg:aspect-[5/4]">
                <motion.picture className="absolute inset-x-0 -inset-y-[6%] block" style={reduce ? undefined : { y: imgY }}>
                  <source media="(max-width: 767px)" srcSet={p.srcSmall} />
                  {/* eslint-disable-next-line @next/next/no-img-element -- art-directed crop inside a parallax card */}
                  <img
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                    style={{ objectPosition: p.focus }}
                  />
                </motion.picture>
              </div>
            </motion.div>

            <Reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface-solid/70 px-3.5 py-1.5 text-sm text-foreground">
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand/60" />
                  <span className="relative size-2 rounded-full bg-brand" />
                </span>
                {contact.badge}
              </p>
            </Reveal>

            <Reveal as="div" delay={0.05}>
              <fieldset>
                <legend className="text-sm font-medium text-foreground">What&apos;s it about?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {contact.topics.map((t) => {
                    const on = topic === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTopic(on ? null : t)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] ${
                          on
                            ? "border-brand bg-brand text-brand-fg"
                            : "border-line-strong bg-surface-solid/70 text-foreground hover:border-brand hover:text-accent-text"
                        }`}
                      >
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span
                              initial={{ width: 0, opacity: 0 }}
                              animate={{ width: "auto", opacity: 1 }}
                              exit={{ width: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="inline-flex overflow-hidden"
                            >
                              <IconCheck size={14} stroke={2.5} aria-hidden />
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {t}
                      </button>
                    );
                  })}
                </div>
                <p aria-live="polite" className="mt-3 min-h-5 text-xs text-muted-foreground">
                  {topic ? `"${topic}" goes into your booking notes.` : "Pick one and it goes into your booking notes."}
                </p>
              </fieldset>
            </Reveal>

            <Reveal as="ul" stagger={0.06} className="order-last grid grid-cols-2 gap-3 lg:order-none">
              <RevealItem as="li">
                <button type="button" onClick={copyEmail} className={btnQuiet} aria-label={`Copy email address ${CONTACT_EMAIL}`}>
                  {copied ? <IconCheck size={18} aria-hidden /> : <IconCopy size={18} aria-hidden />}
                  {copied ? "Copied" : "Email"}
                </button>
              </RevealItem>
              <RevealItem as="li">
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className={btnQuiet}>
                  <IconBrandLinkedin size={18} aria-hidden />
                  LinkedIn
                </a>
              </RevealItem>
              <RevealItem as="li">
                <a href={github} target="_blank" rel="noopener noreferrer" className={btnQuiet}>
                  <IconBrandGithub size={18} aria-hidden />
                  GitHub
                </a>
              </RevealItem>
              <RevealItem as="li">
                <Magnetic className="block">
                  <a
                    href={RESUME_PATH}
                    download
                    className={`${btn} border-brand bg-brand text-brand-fg hover:brightness-110`}
                  >
                    <IconDownload size={18} aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5" />
                    Résumé PDF
                  </a>
                </Magnetic>
              </RevealItem>
            </Reveal>
          </div>

          {/* ── right: inline booker ── */}
          {/* absolute card: the left column alone decides the height on desktop */}
          <Reveal className="relative h-[640px] lg:col-span-7 lg:h-auto" delay={0.1}>
            <div className="absolute inset-0 overflow-hidden rounded-3xl border border-line bg-surface-solid shadow-[0_30px_60px_-30px_rgb(60_10_30/0.25)]">
              {CAL_USERNAME ? (
                <CalInline calLink={`${CAL_USERNAME}/${contact.calEvent}`} notes={topic ?? undefined} />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
                  Booking isn&apos;t set up yet. Use the email button instead.
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
