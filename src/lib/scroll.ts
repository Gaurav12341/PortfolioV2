import type Lenis from "lenis";

/**
 * Module-level handle on the Lenis instance so nav links, back-to-top, etc.
 * can scroll smoothly without sitting inside the Lenis React context.
 * Null when Lenis is disabled (reduced motion).
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Height of the floating nav plus breathing room, used as the scroll offset. */
export const NAV_OFFSET = 88;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function scrollToTarget(target: string | number) {
  if (typeof window === "undefined") return;
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

  if (target === 0 || target === "#top") {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior });
    return;
  }

  const el =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, { offset: -NAV_OFFSET });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior });
  }
}
