"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { DURATION, EASE, RISE } from "@/lib/motion";

type Tag = "div" | "section" | "ul" | "ol" | "li" | "span" | "p" | "header" | "footer";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds before this element (or its first child, in stagger mode) reveals. */
  delay?: number;
  /** Seconds between `<RevealItem>` children. Turns on stagger mode. */
  stagger?: number;
  as?: Tag;
  /** Fraction of the element that must be visible before it reveals. */
  amount?: number;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: RISE },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

/**
 * Fade + 12px rise when scrolled into view (once).
 *
 * - `<Reveal>` animates itself.
 * - `<Reveal stagger={0.08}>` animates each `<RevealItem>` child in sequence.
 *
 * Under prefers-reduced-motion the content renders statically.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  stagger,
  as = "div",
  amount = 0.2,
}: RevealProps) {
  const reduce = useReducedMotionSafe();

  if (reduce) {
    const Static = as as React.ElementType;
    return <Static className={className}>{children}</Static>;
  }

  const MotionTag = motion[as] as typeof motion.div;
  const variants: Variants =
    stagger !== undefined
      ? { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }
      : {
          hidden: { opacity: 0, y: RISE },
          show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE, delay } },
        };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** A child of `<Reveal stagger>`; it inherits the parent's trigger. */
export function RevealItem({
  children,
  className,
  as = "div",
}: Pick<RevealProps, "children" | "className" | "as">) {
  const reduce = useReducedMotionSafe();

  if (reduce) {
    const Static = as as React.ElementType;
    return <Static className={className}>{children}</Static>;
  }

  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
