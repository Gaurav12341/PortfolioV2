"use client";

import * as React from "react";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  mp4: string;
  webm?: string;
  poster: string;
  /** Label in the fake browser chrome, e.g. "supportrag · dev". */
  label: string;
  /** Accessible name for the player. */
  title: string;
  className?: string;
};

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

/**
 * Demo video in a browser-window frame with custom glass controls.
 *
 * - Autoplays muted + loops only while ≥50% visible; pauses when scrolled
 *   away or the tab is hidden. If the viewer pauses it themselves, it stays
 *   paused (no auto-resume).
 * - Reduced motion: never autoplays; shows a big play button.
 * - Controls: play/pause, mute, scrubbable progress, time, fullscreen. They
 *   show on hover/focus, while paused, and always on touch screens.
 * - Keyboard (when the player is focused): Space/K play-pause, M mute,
 *   ←/→ seek 5 s, F fullscreen.
 */
export function DemoVideo({ mp4, webm, poster, label, title, className }: Props) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();

  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [buffered, setBuffered] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [scrubbing, setScrubbing] = React.useState(false);
  const userPaused = React.useRef(false);
  const inView = React.useRef(false);

  const play = React.useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      await v.play();
    } catch {
      /* autoplay blocked; the big play button stays visible */
    }
  }, []);

  // Autoplay while ≥50% visible (unless reduced motion or user paused).
  React.useEffect(() => {
    const v = videoRef.current;
    const wrap = wrapRef.current;
    if (!v || !wrap) return;

    const sync = () => {
      const canAuto = inView.current && !document.hidden && !reduce && !userPaused.current;
      if (canAuto && v.paused) {
        v.muted = true;
        setMuted(true);
        play();
      } else if ((!inView.current || document.hidden) && !v.paused) {
        v.pause();
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.intersectionRatio >= 0.5;
        sync();
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(wrap);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduce, play]);

  // Metadata can finish loading before React hydrates and attaches
  // onLoadedMetadata, which left the duration at 0:00. Read it on mount too.
  React.useEffect(() => {
    const v = videoRef.current;
    if (v && v.readyState >= 1 && Number.isFinite(v.duration)) setDuration(v.duration);
  }, []);

  // Fullscreen state
  React.useEffect(() => {
    const onFs = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      play();
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    // A user gesture, so browsers allow sound from here on.
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration);
  };

  const toggleFullscreen = async () => {
    const frame = frameRef.current;
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!frame || !v) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (frame.requestFullscreen) {
      await frame.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    } else {
      v.webkitEnterFullscreen?.(); // iOS Safari
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest("button")) {
      // Let buttons handle Space/Enter themselves.
      if (e.key === " " || e.key === "Enter") return;
    }
    switch (e.key.toLowerCase()) {
      case " ":
      case "k":
        e.preventDefault();
        togglePlay();
        break;
      case "m":
        e.preventDefault();
        toggleMute();
        break;
      case "arrowleft":
        e.preventDefault();
        seekBy(-5);
        break;
      case "arrowright":
        e.preventDefault();
        seekBy(5);
        break;
      case "f":
        e.preventDefault();
        toggleFullscreen();
        break;
    }
  };

  // Scrubbing
  const seekToClientX = (clientX: number) => {
    const bar = barRef.current;
    const v = videoRef.current;
    if (!bar || !v || !Number.isFinite(v.duration)) return;
    const r = bar.getBoundingClientRect();
    const t = Math.min(Math.max(0, (clientX - r.left) / r.width), 1) * v.duration;
    v.currentTime = t;
    setTime(t);
  };

  const progress = duration ? (time / duration) * 100 : 0;
  const showBigPlay = !playing && (!started || reduce);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div
        ref={frameRef}
        tabIndex={0}
        role="region"
        aria-label={`${title}. Video player. Space or K to play or pause, M to mute, arrow keys to seek, F for fullscreen.`}
        onKeyDown={onKey}
        className={cn(
          "group/player relative overflow-hidden rounded-2xl border border-line bg-[#0b0a0d] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.45)]",
          fullscreen && "flex flex-col rounded-none border-0",
        )}
      >
        {/* Browser chrome */}
        <div
          className={cn(
            "flex h-9 items-center gap-2 border-b border-white/10 bg-[#15131a] px-3.5",
            fullscreen && "hidden",
          )}
          aria-hidden
        >
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto rounded-md bg-white/5 px-3 py-0.5 font-mono text-[11px] text-white/60">
            {label}
          </span>
          <span className="w-[42px]" />
        </div>

        <div className={cn("relative aspect-video w-full", fullscreen && "flex-1")}>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full cursor-pointer object-contain"
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            onClick={togglePlay}
            onPlay={() => {
              setPlaying(true);
              setStarted(true);
            }}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => !scrubbing && setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
            onProgress={(e) => {
              const v = e.currentTarget;
              if (v.buffered.length && v.duration) {
                setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
              }
            }}
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            aria-label={title}
          >
            {webm && <source src={webm} type="video/webm" />}
            <source src={mp4} type="video/mp4" />
          </video>

          {/* Big play button */}
          {showBigPlay && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play demo video"
              className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-brand-fg shadow-[0_10px_40px_-8px_var(--accent)] transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="ml-1 size-8" fill="currentColor" aria-hidden />
            </button>
          )}

          {/* Glass control bar */}
          <div
            className={cn(
              "absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/55 px-2 py-1.5 text-white backdrop-blur-md transition-opacity duration-300",
              "opacity-0 group-hover/player:opacity-100 group-focus-within/player:opacity-100 [@media(hover:none)]:opacity-100",
              (!playing || scrubbing) && "opacity-100",
            )}
          >
            <CtrlButton label={playing ? "Pause" : "Play"} onClick={togglePlay}>
              {playing ? (
                <Pause className="size-4" fill="currentColor" aria-hidden />
              ) : (
                <Play className="size-4" fill="currentColor" aria-hidden />
              )}
            </CtrlButton>
            <CtrlButton label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
              {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
            </CtrlButton>

            {/* Progress / scrubber */}
            <div
              ref={barRef}
              role="slider"
              tabIndex={0}
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(time)}
              aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
              className="group/bar relative mx-1 flex h-8 flex-1 cursor-pointer touch-none items-center"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setScrubbing(true);
                seekToClientX(e.clientX);
              }}
              onPointerMove={(e) => scrubbing && seekToClientX(e.clientX)}
              onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
                setScrubbing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Home" || e.key === "End") {
                  e.preventDefault();
                  e.stopPropagation();
                  const v = videoRef.current;
                  if (v) v.currentTime = e.key === "Home" ? 0 : Math.max(0, v.duration - 0.1);
                }
              }}
            >
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20 transition-[height] group-hover/bar:h-1.5">
                <div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: `${buffered}%` }} />
                <div className="absolute inset-y-0 left-0 bg-brand" style={{ width: `${progress}%` }} />
              </div>
              <div
                className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/bar:opacity-100 group-focus-visible/bar:opacity-100"
                style={{ left: `${progress}%` }}
              />
            </div>

            <span className="min-w-[78px] text-right font-mono text-[11px] tabular-nums text-white/80">
              {fmt(time)} / {fmt(duration)}
            </span>
            <CtrlButton label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen}>
              {fullscreen ? <Minimize className="size-4" aria-hidden /> : <Maximize className="size-4" aria-hidden />}
            </CtrlButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function CtrlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
    >
      {children}
    </button>
  );
}
