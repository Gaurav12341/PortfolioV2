"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projectsData, type ProjectData } from "@/data/projects";
import { Grain } from "./grain";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";

/**
 * Persistent gradient backdrop for a single slide. Mounted once and never
 * destroyed — only opacity toggles, matching the HUD card's transition.
 */
function ProjectBackdrop({
  item,
  isActive,
}: {
  item: ProjectData;
  isActive: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
      style={{
        zIndex: isActive ? 2 : 1,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.7s ease-in-out",
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 45%)",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/50" />
    </div>
  );
}

export default function ProjectsShowcase() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [locked, setLocked] = useState(false);
  const [modal, setModal] = useState<ProjectData | null>(null);
  const [lastNav, setLastNav] = useState(0);

  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const total = projectsData.length;

  // 10-second autoplay — pauses while modal is open, resets on manual nav
  useEffect(() => {
    if (modal) return;
    const id = setInterval(() => {
      setDir(1);
      setActive((prev) => (prev + 1) % total);
    }, 10000);
    return () => clearInterval(id);
  }, [modal, total, lastNav]);

  const navigate = useCallback(
    (step: number) => {
      if (locked) return;
      const next = active + step;
      if (next < 0 || next >= total) return;
      setDir(step);
      setActive(next);
      setLastNav(Date.now());
      setLocked(true);
      if (lockTimer.current) clearTimeout(lockTimer.current);
      lockTimer.current = setTimeout(() => setLocked(false), 700);
    },
    [active, locked, total],
  );

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (modal) return;
      suppressClick.current = false;
      dragStart.current = { x: e.clientX, y: e.clientY };
    },
    [modal],
  );

  const handleDragEnd = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStart.current || modal) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragStart.current = null;

      const SWIPE_THRESHOLD = 50;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        suppressClick.current = true;
        navigate(dx < 0 ? 1 : -1);
      }
    },
    [modal, navigate],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") navigate(-1);
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <>
      <Grain />

      <ProjectModal item={modal} onClose={() => setModal(null)} />

      <section
        id="projects"
        className="relative h-dvh md:h-screen w-full select-none overflow-hidden bg-black scroll-mt-24"
        style={{ touchAction: "pan-y" }}
        aria-label="Projects"
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
      >
        {projectsData.map((item, i) => (
          <ProjectBackdrop key={item.id} item={item} isActive={i === active} />
        ))}

        <AnimatePresence custom={dir} mode="wait">
          <ProjectCard
            key={active}
            item={projectsData[active]}
            index={active}
            total={total}
            direction={dir}
            onOpen={() => {
              if (suppressClick.current) return;
              setModal(projectsData[active]);
            }}
          />
        </AnimatePresence>

        {/* Prev / Next + dot navigation */}
        <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            disabled={active === 0}
            whileHover={active === 0 ? {} : { scale: 1.1 }}
            whileTap={active === 0 ? {} : { scale: 0.92 }}
            className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronLeft size={18} />
          </motion.button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <motion.button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  if (i !== active) {
                    setDir(i > active ? 1 : -1);
                    setActive(i);
                    setLastNav(Date.now());
                  }
                }}
                animate={{
                  width: i === active ? 20 : 6,
                  opacity: i === active ? 1 : 0.35,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-1.5 rounded-full bg-white"
              />
            ))}
          </div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
            disabled={active === total - 1}
            whileHover={active === total - 1 ? {} : { scale: 1.1 }}
            whileTap={active === total - 1 ? {} : { scale: 0.92 }}
            className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>

        <AnimatePresence>
          {active === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] font-semibold tracking-[0.4em] text-white/25 uppercase"
            >
              Scroll to Explore ↓
            </motion.p>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
