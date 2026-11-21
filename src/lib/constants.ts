export const BASE_URL = "https://portfolio.gaurav-raj.in";

export const OG_IMAGE = `${BASE_URL}/og-image.png`;

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

// Base64-encoded so the raw number isn't sitting in plaintext in the page
// source for scrapers — decoded client-side only when the user clicks
// "reveal". See PhoneReveal component.
export const PHONE_NUMBER_B64 = "KzkxODk2OTc4NjYyNw==";
