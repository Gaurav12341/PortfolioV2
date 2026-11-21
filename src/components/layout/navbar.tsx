"use client";

import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Download, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "./theme-toggle";
import { getLenis, scrollToTarget } from "@/lib/scroll";
import { CONTACT_EMAIL, RESUME_PATH, SOCIAL_LINKS } from "@/lib/constants";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof NAV_LINKS)[number]["id"];

/** Tracks which nav section currently crosses the middle band of the viewport. */
function useActiveSection(pathname: string): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      // Case-study pages live under Work.
      setActive(pathname.startsWith("/work/") ? "work" : null);
      return;
    }
    const els = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;

    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        // Last section in document order that crosses the band wins.
        const current = [...NAV_LINKS].reverse().find((l) => visible.get(l.id));
        setActive((current?.id as SectionId) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return active;
}

function ResumeButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <a
      href={RESUME_PATH}
      download="Gaurav-Raj-Resume.pdf"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-fg transition-[filter,transform] hover:brightness-110 active:scale-[0.97]",
        className,
      )}
    >
      Résumé
      <Download aria-hidden className="size-3.5" />
    </a>
  );
}

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  const active = useActiveSection(pathname);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Pause smooth scrolling while the mobile sheet is open.
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  const go = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    // On other routes (case studies) section anchors live on the home page.
    if (!onHome) {
      router.push(target === "#top" ? "/" : `/${target}`);
      return;
    }
    // Let the sheet release its scroll lock before scrolling.
    if (wasOpen) requestAnimationFrame(() => requestAnimationFrame(() => scrollToTarget(target)));
    else scrollToTarget(target);
    history.replaceState(null, "", target === "#top" ? location.pathname : target);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border border-line bg-surface-solid/85 py-1.5 pl-3 pr-1.5 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl"
      >
        <a href="#top" onClick={(e) => go(e, "#top")} className="rounded-lg" aria-label="Gaurav Raj, back to top">
          <Logo />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id} className="relative">
                <a
                  href={`#${link.id}`}
                  onClick={(e) => go(e, `#${link.id}`)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </a>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-muted"
                    transition={reduce ? { duration: 0 } : { duration: DURATION.fast, ease: EASE }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <ResumeButton className="hidden md:inline-flex" />

          {/* Mobile menu */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              aria-label="Open menu"
              className="inline-flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted md:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </Dialog.Trigger>

            <AnimatePresence>
              {open && (
                <Dialog.Portal forceMount>
                  <Dialog.Content forceMount asChild aria-describedby={undefined}>
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                      transition={{ duration: DURATION.fast, ease: EASE }}
                      className="fixed inset-0 z-[60] flex flex-col bg-background px-6 pb-8 pt-5"
                    >
                      <Dialog.Title className="sr-only">Menu</Dialog.Title>

                      <div className="flex items-center justify-between">
                        <a href="#top" onClick={(e) => go(e, "#top")} aria-label="Gaurav Raj, back to top">
                          <Logo withName />
                        </a>
                        <Dialog.Close
                          aria-label="Close menu"
                          className="inline-flex size-10 items-center justify-center rounded-full border border-line"
                        >
                          <X className="size-5" aria-hidden />
                        </Dialog.Close>
                      </div>

                      <ul className="mt-14 flex flex-col">
                        {NAV_LINKS.map((link, i) => (
                          <motion.li
                            key={link.id}
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: DURATION.base, ease: EASE, delay: 0.05 + i * 0.06 }}
                            className="border-b border-line"
                          >
                            <a
                              href={`#${link.id}`}
                              onClick={(e) => go(e, `#${link.id}`)}
                              aria-current={active === link.id ? "location" : undefined}
                              className="flex items-baseline gap-4 py-5"
                            >
                              <span className="font-mono text-xs text-muted-foreground">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span
                                className={cn(
                                  "text-h1 font-semibold",
                                  active === link.id && "text-accent-text",
                                )}
                              >
                                {link.label}
                              </span>
                            </a>
                          </motion.li>
                        ))}
                      </ul>

                      <div className="mt-auto flex flex-col gap-6">
                        <ResumeButton className="w-fit px-5 py-3 text-base" onClick={() => setOpen(false)} />
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                          {SOCIAL_LINKS.map((s) => (
                            <a
                              key={s.name}
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                            >
                              {s.name}
                              <ArrowUpRight aria-hidden className="size-3.5" />
                            </a>
                          ))}
                        </div>
                        <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-sm text-muted-foreground">
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
