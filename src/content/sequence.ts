/**
 * Scroll sequence config (PHASES.md · Phase 5). Tweak alignment here
 * without touching the component.
 *
 * Source frames live in public/_incoming/frames (git-ignored); the build
 * commands in docs/SEQUENCE.md regenerate public/sequence/. To use a reshoot,
 * drop the new frames in, rerun the commands and update `frameCount`.
 */
export const sequence = {
  /**
   * Frames f_000 … f_{frameCount-1}. 0–27 are the illustrated hand-sign
   * sequence; 28–46 pan into the portrait (scripts/make-pan-frames.cjs), and
   * the last frame is the portrait itself.
   */
  frameCount: 47,
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
   * Where the face sits in the 1920×1080 portrait, as 0–1 fractions. Phones
   * crop around it: during the pan frames the crop eases from centre to here.
   */
  face: { x: 0.7, y: 0.24 },

  /** First frame of the pan into the portrait (phones start re-centring here). */
  panStart: 28,

  /** Scroll distance while pinned, in viewport heights. */
  scrollVh: 200,

  /**
   * Timeline split (fractions of the pinned scroll): frames scrub until
   * framesEnd, where the live portrait layer takes over from the canvas;
   * the intro text starts at introStart.
   */
  phases: { framesEnd: 0.75, introStart: 0.8 },

  /** Parallax strength on the portrait (px) and its slow push-in. */
  parallaxPx: 12,
  zoom: 1.04,
} as const;
