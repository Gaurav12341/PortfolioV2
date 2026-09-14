"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ProjectData } from "@/data/projects";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";

interface ProjectModalProps {
  item: ProjectData | null;
  onClose: () => void;
}

export function ProjectModal({ item, onClose }: ProjectModalProps) {
  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-gradient-to-br outline-none ${
            item?.gradient ?? "from-slate-900 via-slate-950 to-black"
          }`}
        >
          <DialogPrimitive.Title className="sr-only">
            {item?.title ?? "Project"}
          </DialogPrimitive.Title>

          {item && (
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-24 md:px-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
                Case Study
              </p>
              <h2
                className="mt-3 font-mono font-black uppercase leading-tight tracking-wider text-white"
                style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)" }}
              >
                {item.title}
              </h2>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-8">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Problem
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-white/80 md:text-lg">
                    {item.problem}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Approach
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-white/80 md:text-lg">
                    {item.approach}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Outcome
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-white md:text-lg">
                    {item.outcome}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />

          <p
            className="absolute left-6 top-5 font-mono text-base font-bold tracking-widest text-white uppercase whitespace-nowrap"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}
          >
            {item?.title}
          </p>

          <DialogPrimitive.Close
            onClick={onClose}
            className="fixed right-5 top-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <X size={16} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
