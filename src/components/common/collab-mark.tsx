"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "motion/react";
import dynamic from "next/dynamic";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { SharinganEye, type SharinganHandle } from "@/components/common/sharingan-eye";

/** The form (with zod + react-hook-form) loads on first hover/focus/click, not with the page. */
const loadModal = () => import("@/components/sections/home/collab-modal");
const CollabModal = dynamic(loadModal, { ssr: false });
/** The form closes with a 0.88s circle wipe toward the centre; start the eye's
    reverse once that has mostly cleared the button. */
const CLOSE_REVERSE_DELAY_MS = 350;

/**
 * The collab mark: a Sharingan eye with a pulse ring and the CTA spelled out
 * on an orbiting ring. Opens the collaboration form.
 *
 * Eye: mouse hover (or keyboard focus) plays the Sharingan → Mangekyō
 * transform, leaving reverses it; click / Enter / Space opens the form right
 * away. On touch there's no hover, so each tap toggles the transform and the
 * form opens once it finishes.
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

  const eye = useRef<SharinganHandle>(null);
  /** Pointer type of the press that leads to the next click ("" = keyboard). */
  const pressType = useRef("");
  const hovered = useRef(false);
  const openForm = () => {
    setUsed(true);
    setOpen(true);
  };
  /* While the form is open it covers the button, which reads as the pointer
     leaving: hold the eye transformed until the form closes, then reverse it
     as the form's circle wipe uncovers the button (same on mouse and touch). */
  const openRef = useRef(false);
  openRef.current = open;
  useEffect(() => {
    if (open || !used) return;
    const t = window.setTimeout(() => {
      const b = ref.current;
      if (b && !b.matches(":hover") && !b.matches(":focus-visible")) eye.current?.go(0);
    }, CLOSE_REVERSE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [open, used]);

  return (
    <>
      <motion.button
        ref={ref}
        type="button"
        onPointerEnter={(e) => {
          void loadModal();
          if (e.pointerType === "touch") return;
          hovered.current = true;
          eye.current?.go(1);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "touch") return;
          hovered.current = false;
          if (!openRef.current && !e.currentTarget.matches(":focus-visible")) eye.current?.go(0);
        }}
        onFocus={(e) => {
          void loadModal();
          if (e.currentTarget.matches(":focus-visible")) eye.current?.go(1);
        }}
        onBlur={() => {
          if (!openRef.current && !hovered.current) eye.current?.go(0);
        }}
        onPointerDown={(e) => {
          pressType.current = e.pointerType;
        }}
        onClick={(e) => {
          const touch = pressType.current === "touch" && e.detail > 0;
          pressType.current = "";
          if (!touch) return openForm();
          // tap 1 plays, tap 2 reverses; the form opens when the eye settles
          const to = eye.current?.target() === 1 ? 0 : 1;
          if (eye.current) eye.current.go(to, openForm);
          else openForm();
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

        {/* the eye fills the inner circle (same box as the old puck: no layout shift) */}
        <SharinganEye ref={eye} reduce={reduce} preload={inView} className="size-16 md:size-20" />
      </motion.button>

      {mounted && used && createPortal(<CollabModal isOpen={open} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
