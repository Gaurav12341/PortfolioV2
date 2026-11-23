import { track } from "@vercel/analytics";

/** Where a résumé download started, so the dashboard can compare buttons. */
export type ResumeSource = "nav" | "hero" | "contact" | "footer";

/** Vercel Analytics custom event. A no-op locally and if analytics is off. */
export function trackResumeDownload(from: ResumeSource) {
  try {
    track("resume_download", { from });
  } catch {
    /* analytics must never break a download */
  }
}
