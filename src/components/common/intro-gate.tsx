"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import Preloader from "./preloader";
import { getLenis } from "@/lib/scroll";

export const INTRO_KEY = "gr-intro-seen";

/**
 * Runs before first paint (inlined in <head>). Decides whether the intro
 * plays this visit:
 *  - skipped if it already played in this browser session, or under
 *    prefers-reduced-motion → <html data-intro="skip"> (CSS hides it)
 *  - otherwise <html class="is-intro">: page scroll locked and the hero's
 *    CSS entrance animations held until the curtain lifts.
 */
export const introBootScript = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem('${INTRO_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='skip'}else{d.classList.add('is-intro')}}catch(e){document.documentElement.dataset.intro='skip'}})();`;

/** Mounts the Preloader for the first visit of a session and releases the page after. */
export function IntroGate() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "skip") setShow(false);
    else getLenis()?.stop();
  }, []);

  const release = useCallback(() => {
    const d = document.documentElement;
    d.classList.remove("is-intro"); // hero entrance starts as the curtain lifts
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode */
    }
    window.scrollTo(0, 0);
    getLenis()?.start();
  }, []);

  const done = useCallback(() => setShow(false), []);

  return <AnimatePresence>{show && <Preloader onExitStart={release} onComplete={done} />}</AnimatePresence>;
}
