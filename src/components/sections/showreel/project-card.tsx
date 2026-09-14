"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Timer, ShieldCheck } from "lucide-react";
import type { ProjectData } from "@/data/projects";
import { CARD_VARIANTS } from "./constants";
import { padIndex } from "./utils";
import { ScrambleText } from "./scramble-text";
import { StatChip } from "./stat-chip";

const STAT_ICONS = [TrendingUp, Users, Timer, ShieldCheck];

interface ProjectCardProps {
  item: ProjectData;
  index: number;
  total: number;
  direction: number;
  onOpen: () => void;
}

/**
 * HUD overlay for one project slide — title, one-liner, tech stack, and
 * headline metrics. Sits above the gradient backdrop rendered by the parent.
 */
export function ProjectCard({
  item,
  index,
  total,
  direction,
  onOpen,
}: ProjectCardProps) {
  return (
    <motion.div
      key={item.title}
      custom={direction}
      variants={CARD_VARIANTS}
      initial="enter"
      animate="active"
      exit="exit"
      className="absolute inset-0 z-10 cursor-pointer"
      onClick={onOpen}
    >
      {/* Ghost index watermark */}
      <motion.span
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 0.06, x: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="pointer-events-none absolute bottom-0 right-6 select-none font-mono font-black leading-none text-white"
        style={{ fontSize: "clamp(160px, 26vw, 340px)", lineHeight: 0.85 }}
      >
        {padIndex(index)}
      </motion.span>

      {/* ── TOP HUD ── */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-8 pt-7 md:px-14">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-mono text-[10px] font-semibold tracking-[0.4em] text-white/35 uppercase"
          >
            Selected Work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="font-mono text-xl font-black uppercase tracking-tight text-white md:text-2xl"
          >
            Projects
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24 }}
          className="flex items-center gap-2 pt-1"
        >
          <span className="mr-2 font-mono text-[10px] font-semibold tracking-[0.3em] text-white/35 uppercase">
            {padIndex(index)} / {padIndex(total - 1)}
          </span>
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scaleX: i === index ? 1 : 0.5,
                opacity: i === index ? 1 : 0.2,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-[2px] w-8 origin-left rounded-full bg-white"
            />
          ))}
        </motion.div>
      </div>

      {/* ── BOTTOM HUD ── */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-8 pb-10 md:px-14">
        <div className="flex max-w-xl flex-col gap-4">
          <h3
            className="font-mono font-black uppercase leading-tight tracking-wider text-white"
            style={{
              fontSize: "clamp(1.6rem, 4.2vw, 3.25rem)",
              textShadow: "0 4px 40px rgba(0,0,0,0.95)",
            }}
          >
            <ScrambleText
              text={item.title}
              trigger
              className="whitespace-normal"
            />
          </h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5 }}
            className="max-w-md text-sm text-white/70 md:text-base"
          >
            {item.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap gap-1.5"
          >
            {item.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/50"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {item.stats.map((stat, i) => (
              <StatChip
                key={stat.label}
                icon={STAT_ICONS[i % STAT_ICONS.length]}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                trigger
              />
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-white"
          >
            Tap to read the case study →
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
