"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, GraduationCap, Sparkles } from "lucide-react";
import PhraseAnimation from "@/components/common/phrase-reveal";
import { Card } from "@/components/ui/card";

interface HighlightGroup {
  icon: React.ElementType;
  title: string;
  items: { label: string; detail?: string }[];
}

const groups: HighlightGroup[] = [
  {
    icon: Trophy,
    title: "Achievements",
    items: [
      { label: "Top Performer of the Month", detail: "Honeywell" },
      {
        label: "Bronze & “Win Together” Recognitions",
        detail: "Honeywell",
      },
      {
        label: "“Dashing Debut” Award",
        detail: "AKS reliability work as an intern",
      },
      {
        label: "3 Bravo Awards",
        detail: "Cumulative recognitions at Honeywell",
      },
      {
        label: "McKinsey Forward Program",
        detail: "Google Cohort Hackathon · GitHub Copilot Training (Microsoft-led)",
      },
    ],
  },
  {
    icon: GraduationCap,
    title: "Education",
    items: [
      {
        label: "B.Tech, Computer Science & Engineering",
        detail: "SRM Institute of Science & Technology · 2020–2024 · CGPA 9.44/10",
      },
      {
        label: "Class 10, PCM + Computer Science",
        detail: "DAV Public School, Bokaro Steel City · 94.00%",
      },
    ],
  },
  {
    icon: Sparkles,
    title: "Beyond Work",
    items: [
      {
        label: "Badminton",
        detail: "2nd runner-up, district-level Under-18 championship",
      },
      {
        label: "Singing & Guitar",
        detail: "School competition wins; now performs for friends and small crowds",
      },
      { label: "Anime & Tech Reading" },
      { label: "Volunteering with NGOs" },
    ],
  },
];

const Achievements = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -100px 0px",
  });
  const headerInView = useInView(headerRef, {
    once: true,
    margin: "0px 0px -60px 0px",
  });

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="relative flex w-full flex-col items-center justify-center py-24 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-50" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-20 opacity-50" />

      <div
        ref={headerRef}
        className="container relative z-10 mb-16 px-6 text-center mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-4 w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary uppercase tracking-widest"
        >
          Highlights
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <PhraseAnimation phrase="Beyond    the" className="" />
            <span className="block bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              <PhraseAnimation phrase="Codebase" className="text-primary" />
            </span>
          </h3>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
          className="mx-auto mt-6 h-px max-w-xs bg-linear-to-r from-primary/60 via-primary/20 to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          Recognition, education, and a few things I do when I&apos;m not at
          a keyboard.
        </motion.div>
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {groups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.15 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Card className="h-full border-border/60 bg-card/60 px-6 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                    <group.icon size={16} />
                  </div>
                  <h4 className="text-lg font-semibold">{group.title}</h4>
                </div>
                <ul className="flex flex-col gap-4">
                  {group.items.map((item) => (
                    <li key={item.label} className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                      {item.detail && (
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {item.detail}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Achievements;
