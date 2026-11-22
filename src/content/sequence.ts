/**
 * Scroll sequence config (PHASES.md · Phase 5). Tweak alignment here
 * without touching the component.
 *
 * Source frames live in public/_incoming/frames (git-ignored); the build
 * commands in docs/SEQUENCE.md regenerate public/sequence/. To use a reshoot,
 * drop the new frames in, rerun the commands and update `frameCount`.
 */
export const sequence = {
  /** Frames f_000 … f_{frameCount-1}. */
  frameCount: 28,
  frame: (i: number, mobile: boolean) =>
    `/sequence/${mobile ? "m/" : ""}f_${String(i).padStart(3, "0")}.webp`,

  portrait: {
    desktop: "/sequence/portrait.webp",
    mobile: "/sequence/m/portrait.webp",
    /**
     * Background-removed subject for the two-layer parallax. When null, the
     * portrait uses a single-layer parallax instead (still subtle, no seams).
     * Off: the rembg cut-out was incomplete (see docs/SEQUENCE.md).
     */
    subject: null as null | { desktop: string; mobile: string },
    /** With a subject layer, the background moves this fraction of the subject's distance. */
    bgDepth: 0.65,
    alt: "Illustrated portrait of Gaurav Raj seated on a stone throne",
  },

  /**
   * Where the face sits in the 1920×1080 portrait, as 0–1 fractions. The
   * circular reveal grows from here, and phones crop around it.
   */
  face: { x: 0.7, y: 0.24 },

  /** Fine-tune the portrait against frame 27 (px offset + scale). */
  align: { x: 0, y: 0, scale: 1 },

  /** "circle" grows from the face; "wipe" sweeps left → right with an accent line. */
  reveal: "circle" as "circle" | "wipe",

  /** Scroll distance while pinned, in viewport heights (plan: ~150vh). */
  scrollVh: 150,

  /** Timeline split (fractions of the pinned scroll). */
  phases: { framesEnd: 0.7, revealEnd: 0.85 },

  /** Parallax strength on the portrait (px) and its slow push-in. */
  parallaxPx: 12,
  zoom: 1.04,
} as const;
