"use client";

import React, { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Clock, Video, Globe, User } from "lucide-react";
import PhraseAnimation from "@/components/common/phrase-reveal";
import { CAL_USERNAME, CONTACT_EMAIL } from "@/lib/constants";

const CalBooking = () => {
  const containerRef = useRef(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, {
    once: true,
    margin: "0px 0px -80px 0px",
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax Logic
  const yImage = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const yCalendar = useTransform(scrollYProgress, [0, 1], [60, -60]);

  useEffect(() => {
    if (!CAL_USERNAME) return;
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  const handleOpenCal = async () => {
    if (!CAL_USERNAME) return;
    const cal = await getCalApi({ namespace: "30min" });
    cal("modal", { calLink: `${CAL_USERNAME}/30min` });
  };

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col overflow-hidden px-4 py-10 md:px-8 md:py-16 lg:h-[calc(100vh-6rem)] lg:py-0"
    >
      {/* Box 3 — Heading, compact top band */}
      <div
        ref={headerRef}
        className="container relative z-10 mx-auto shrink-0 px-6 pt-4 text-center lg:pt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-3 w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary uppercase tracking-widest"
        >
          Book time
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <PhraseAnimation phrase="Let's  Make  Something " />
            <span className="block bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              <PhraseAnimation
                phrase="Awesome  Together"
                className="text-primary"
              />
            </span>
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-lg"
        >
          Schedule a 30-minute call to discuss your project and process.
        </motion.div>
      </div>

      {/* Content area — fills whatever height remains under the heading */}
      <div className="relative mx-auto mt-6 w-full max-w-7xl flex-1 lg:mt-0 lg:min-h-0">
        {/* Box 2 — Big image, right-anchored, fills the available height */}
        <motion.div
          style={{ y: yImage }}
          className="relative z-0 mx-auto w-full max-w-[380px] lg:absolute lg:inset-y-4 lg:right-4 lg:mx-0 lg:w-auto lg:max-w-none"
        >
          <img
            src={"/ichigo2.png"}
            alt="Profile photo"
            className="mx-auto block h-auto w-full object-contain lg:mx-0 lg:h-full lg:w-auto"
          />
        </motion.div>

        {/* Top/bottom fade so the image blends into the section */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-24 bg-gradient-to-b from-background to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-24 bg-gradient-to-t from-background to-transparent lg:block" />

        {/* Box 1 — Calendar card, bottom-left */}
        <motion.div
          style={{ y: yCalendar }}
          className="relative z-20 mx-auto mt-8 w-full max-w-sm lg:absolute lg:bottom-6 lg:left-0 lg:mx-0 lg:mt-0 lg:w-[320px]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
            {/* Glass sheen + soft glow accents */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />

            <div className="relative flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10">
                <User size={18} className="text-white" />
              </div>

              <div>
                <p className="text-sm text-white/60">Gaurav Raj</p>
                <p className="text-lg font-semibold text-white">
                  30 min meeting
                </p>
              </div>

              <div className="flex flex-col gap-2.5 text-sm text-white/70">
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-white/50" />
                  30m
                </div>
                <div className="flex items-center gap-2.5">
                  <Video size={15} className="text-white/50" />
                  Cal Video
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe size={15} className="text-white/50" />
                  Asia/Kolkata
                </div>
              </div>

              {CAL_USERNAME ? (
                <button
                  type="button"
                  onClick={handleOpenCal}
                  className="mt-1 w-full rounded-xl border border-primary/40 bg-primary/15 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/25"
                >
                  View Availability
                </button>
              ) : (
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-1 w-full rounded-xl border border-dashed border-white/20 px-4 py-2.5 text-center text-sm text-white/70 transition-colors hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalBooking;
