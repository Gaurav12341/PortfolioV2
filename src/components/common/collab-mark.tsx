"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "motion/react";
import { IconX } from "@tabler/icons-react";
import CollabModal from "@/components/sections/home/collab-modal";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

/**
 * The collab mark (taken from the old "Together we build" screen): a dark
 * puck with an ✕ that turns into a + on hover, a pulse ring, and the CTA
 * spelled out on an orbiting ring. Opens the collaboration form.
 *
 * Loops run only while it's on screen, and not at all under reduced motion.
 */
export function CollabMark({ label = "Let's collaborate ✦ Click to start ✦" }: { label?: string }) {
  const [open, setOpen] = useState(false);
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
        onClick={() => setOpen(true)}
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
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
          animate={live ? { rotate: 360 } : undefined}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="size-full">
            <defs>
              <path id="collab-ring" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text className="fill-accent-text font-mono uppercase" style={{ fontSize: "7px", letterSpacing: "2.5px" }}>
              <textPath href="#collab-ring">{label}</textPath>
            </text>
          </svg>
        </motion.span>

        {/* pulse ring */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute size-16 rounded-full border border-brand md:size-20"
          animate={live ? { scale: [1, 1.7], opacity: [0.6, 0] } : { opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />

        {/* puck: dark in both themes so the crimson glows */}
        <span className="relative flex size-16 items-center justify-center md:size-20">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-brand/40 bg-[#0b0a0d]/90 backdrop-blur-sm"
            animate={
              live
                ? {
                    boxShadow: [
                      "0 0 20px rgb(225 29 72 / 0.2)",
                      "0 0 40px rgb(225 29 72 / 0.45)",
                      "0 0 20px rgb(225 29 72 / 0.2)",
                    ],
                  }
                : undefined
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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

      {mounted && createPortal(<CollabModal isOpen={open} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
