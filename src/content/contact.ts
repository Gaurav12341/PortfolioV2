/**
 * Booking / contact copy (PHASES.md · Phase 7). Edit here, not in the
 * component. Keep em-dashes out of visible copy.
 */
export const contact = {
  heading: "Hiring for backend or AI? Let's talk.",
  sub: "Pick a 30-minute slot, or reach me directly. I reply within a day.",
  badge: "Available for Backend, AI & Full-stack roles",

  /**
   * Swap for the laptop illustration when it arrives: drop the WebP in
   * public/images/ and change these paths + the size. Build commands:
   * docs/SEQUENCE.md → "Other portraits".
   */
  portrait: {
    src: "/images/portrait-anime.webp",
    srcSmall: "/images/portrait-anime-sm.webp",
    width: 800,
    height: 1200,
    alt: "Illustrated portrait of Gaurav Raj in a black tee and dark overshirt",
    /** object-position for the crop inside the card */
    focus: "50% 22%",
  },

  /** Clicking one prefills the notes field in the Cal.com booking form. */
  topics: ["Full-time role", "Referral", "AI collab", "Just saying hi"],

  /** Cal.com event slug (event type must exist on the account). */
  calEvent: "30min",
} as const;
