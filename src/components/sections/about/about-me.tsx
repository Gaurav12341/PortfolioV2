"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Archivo_Black } from "next/font/google";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const displayFont = Archivo_Black({ subsets: ["latin"], weight: "400" });

const AboutMe = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Parallax Logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={containerRef}
      className="relative h-dvh md:h-screen w-full overflow-hidden flex flex-col items-center justify-end"
    >
      {/* Background Noise Texture for Awwwards feel */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      {/* <Image
        src="/bg-hero.png"
        fill
        priority
        quality={85}
        className="absolute inset-0 object-cover"
        alt="Hero background"
        sizes="100vw"
      /> */}

      {/* Giant name in the background, behind the video */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden"
      >
        <span
          className={`${displayFont.className} bg-gradient-to-b from-primary via-primary/60 to-primary/10 bg-clip-text uppercase leading-[0.82] tracking-tight text-transparent`}
          style={{ fontSize: "clamp(4rem, 17vw, 14rem)" }}
        >
          Gaurav
        </span>
        <span
          className={`${displayFont.className} bg-gradient-to-b from-primary via-primary/60 to-primary/10 bg-clip-text uppercase leading-[0.82] tracking-tight text-transparent`}
          style={{ fontSize: "clamp(4rem, 17vw, 14rem)" }}
        >
          Raj
        </span>
      </motion.div>

      <motion.div
        style={{
          y: yImage,
        }}
        className="relative z-20 flex items-end group"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-500" />

        <video
          src="/heropage-nobg.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="relative w-[155vw] md:w-[75vw] lg:w-[52vw] h-[92vh] md:h-[92dvh] object-contain object-bottom rounded-3xl"
        />
      </motion.div>

      {/* Mobile: Vertical Side Label (editorial, clears navbar + video) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-30 text-foreground"
      >
        <div className="flex items-center gap-4 [writing-mode:vertical-rl] rotate-180">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
            Software Engineer
          </span>
          <span className="w-1 h-1 bg-foreground rounded-full" />
          <span className="text-sm font-bold">Backend Engineering</span>
          <span className="w-1 h-1 bg-foreground rounded-full" />
          <span className="text-sm font-bold">Distributed Systems</span>
          <span className="w-1 h-1 bg-foreground rounded-full" />
          <span className="text-sm font-bold">Applied AI</span>
        </div>
      </motion.div>

      {/* Bottom Info Strip (desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="hidden md:flex absolute bottom-10 z-30 w-full px-10 flex-row justify-between items-center text-foreground"
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono uppercase text-gray-500 dark:text-gray-400">
            Focus
          </p>
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="hover:text-primary transition-colors cursor-pointer">
              Backend Engineering
            </span>
            <span className="w-1 h-1 bg-foreground rounded-full" />
            <span className="hover:text-primary transition-colors cursor-pointer">
              Distributed Systems
            </span>
            <span className="w-1 h-1 bg-foreground rounded-full" />
            <span className="hover:text-primary transition-colors cursor-pointer">
              Applied AI
            </span>
          </div>
        </div>

        <div className="hidden md:block">
          <p className="text-xs font-mono text-right text-gray-500 dark:text-gray-400">
            Social
          </p>
          <div className="flex items-center gap-4 text-sm font-bold">
            <Link href={"https://github.com/Gaurav12341"} target="_blank">
              <span className="hover:text-primary transition-colors cursor-pointer">
                GitHub
              </span>
            </Link>
            <span className="w-1 h-1 bg-foreground rounded-full" />
            <Link
              href={"https://www.linkedin.com/in/gaurav-raj-405a96237/"}
              target="_blank"
            >
              <span className="hover:text-primary transition-colors cursor-pointer">
                LinkedIn
              </span>
            </Link>
            <span className="w-1 h-1 bg-foreground rounded-full" />
            <Link href={"https://leetcode.com/u/Gaurav2706/"} target="_blank">
              <span className="hover:text-primary transition-colors cursor-pointer">
                LeetCode
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// Helper Component for Stats
const StatCard = ({
  position,
  label,
  value,
  delay,
}: {
  position: string;
  label: string;
  value: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className={`absolute ${position} z-30`}
    >
      <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-xl shadow-2xl hover:bg-white/10 transition-colors duration-300 w-32 md:w-40">
        <h3 className="text-3xl font-bold  mb-1">{value}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-300 uppercase tracking-wider font-mono">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export default AboutMe;
