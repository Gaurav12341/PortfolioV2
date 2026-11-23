"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "motion/react";
import { IconX } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

/** The form (with zod + react-hook-form) loads on first hover/focus/click, not with the page. */
const loadModal = () => import("@/components/sections/home/collab-modal");
const CollabModal = dynamic(loadModal, { ssr: false });

/**
 * The collab mark (taken from the old "Together we build" screen): a dark
 * puck with an ✕ that turns into a + on hover, a pulse ring, and the CTA
 * spelled out on an orbiting ring. Opens the collaboration form.
 *
 * Loops run only while it's on screen, and not at all under reduced motion.
 */
export function CollabMark({ label = "Let's collaborate ✦ Click to start ✦" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  /** Mount the modal only once it has been opened (it stays mounted for its exit animation). */
  const [used, setUsed] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduce = useReducedMotionSafe();
  const live = inView && !reduce;
  /* the form is portalled to <body>: a transformed parent (the footer's
     magnetic wrapper) would otherwise trap its fixed overlay inside the button */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <motion.button
        ref={ref}
        type="button"
        onPointerEnter={loadModal}
        onFocus={loadModal}
        onClick={() => {
          setUsed(true);
          setOpen(true);
        }}
        aria-label="Open the collaboration form"
        aria-haspopup="dialog"
        className="group relative flex size-36 cursor-pointer items-center justify-center rounded-full md:size-44"
        initial={reduce ? false : { opacity: 0, scale: 0, rotate: -180 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover={reduce ? undefined : { scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* orbiting CTA text */}
        {/* Both loops are CSS animations paused unless `live` (on screen, motion
            allowed): an infinite motion animation keeps running once started. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-[collab-orbit_16s_linear_infinite] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
          style={{ animationPlayState: live ? "running" : "paused" }}
        >
          <svg viewBox="0 0 100 100" className="size-full">
            <defs>
              <path id="collab-ring" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text className="fill-accent-text font-mono uppercase" style={{ fontSize: "7px", letterSpacing: "2.5px" }}>
              <textPath href="#collab-ring">{label}</textPath>
            </text>
          </svg>
        </span>

        {/* pulse ring (hidden when not live) */}
        <span
          aria-hidden
          className="pointer-events-none absolute size-16 animate-[collab-pulse_2.4s_ease-out_infinite] rounded-full border border-brand md:size-20"
          style={{ animationPlayState: live ? "running" : "paused", visibility: live ? "visible" : "hidden" }}
        />

        {/* puck: dark in both themes so the crimson glows */}
        <span className="relative flex size-16 items-center justify-center md:size-20">
          <span
            aria-hidden
            className="absolute inset-0 animate-[collab-glow_3s_ease-in-out_infinite] rounded-full border border-brand/40 bg-[#0b0a0d]/90 shadow-[0_0_20px_rgb(225_29_72/0.2)] backdrop-blur-sm"
            style={{ animationPlayState: live ? "running" : "paused" }}
          />
          {/* ✕ turns 45° into a + on hover: a join/add metaphor */}
          <IconX
            aria-hidden
            size={28}
            stroke={2.25}
            className="relative text-[#fb3b64] drop-shadow-[0_0_10px_rgb(251_59_100/0.5)] transition-transform duration-500 ease-out group-hover:rotate-45 group-focus-visible:rotate-45"
          />
        </span>
      </motion.button>

      {mounted && used && createPortal(<CollabModal isOpen={open} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
