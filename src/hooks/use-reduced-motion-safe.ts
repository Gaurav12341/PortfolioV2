"use client";

import { useEffect, useState } from "react";

/**
 * prefers-reduced-motion, but always `false` on the server and on the first
 * client render, so markup never mismatches during hydration. Updates right
 * after mount and when the OS setting changes.
 *
 * CSS-driven motion is also killed globally by the media query in
 * globals.css, so the first frame is safe either way.
 */
export function useReducedMotionSafe() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}
