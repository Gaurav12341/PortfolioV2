"use client";

import React, { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives Lenis from GSAP's ticker and keeps ScrollTrigger in sync with the
 * smoothed scroll position, so pinned/scrubbed triggers don't jitter. Also
 * publishes the instance to lib/scroll for nav links.
 */
function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      setLenis(null);
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
    };
  }, [lenis]);

  return null;
}

/**
 * Smooth scrolling, unless the user prefers reduced motion (then native
 * scrolling, no Lenis at all). Touch devices keep native momentum
 * (syncTouch: false).
 */
const LenisWrapper = ({ children }: { children?: React.ReactNode }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      {enabled && (
        <ReactLenis root autoRaf={false} options={{ syncTouch: false }}>
          <LenisGsapSync />
        </ReactLenis>
      )}
      {children}
    </>
  );
};

export default LenisWrapper;
