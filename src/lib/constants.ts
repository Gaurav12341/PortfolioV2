/** Production URL. Change it here if the site moves (e.g. to the bare domain). */
export const BASE_URL = "https://portfolio.gaurav-raj.in";
/** BASE_URL without the scheme, for share cards and email footers. */
export const SITE_HOST = new URL(BASE_URL).host;

// Set up on Cal.com with a "30min" event type.
export const CAL_USERNAME: string | null = "gaurav-raj-ergsgy";

export const CONTACT_EMAIL = "graj.work2706@gmail.com";

/** Served from public/resume.pdf (source: public/_incoming/). */
export const RESUME_PATH = "/resume.pdf";

export const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com/Gaurav12341" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/gaurav-raj-405a96237/" },
  { name: "LeetCode", href: "https://leetcode.com/u/Gaurav2706/" },
] as const;

/** Public source repo, linked from the footer. */
export const SOURCE_URL = "https://github.com/Gaurav12341/PortfolioV2";
