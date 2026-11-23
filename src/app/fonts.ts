import { Archivo, JetBrains_Mono, Victor_Mono } from "next/font/google";

/**
 * Type system: "Spec sheet".
 *
 * - Archivo (variable weight + width): everything readable. The hero name is
 *   set uppercase at 125% width as a nameplate; headings run slightly wide
 *   (112%); body text stays at normal width.
 * - JetBrains Mono: data only (metrics, diagram labels, stack, status chips).
 * - Victor Mono italic: only the 2–3 handwritten-feel margin notes. Not
 *   preloaded, since the notes are decorative asides.
 */
export const brandSans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-brand-sans",
});

export const brandMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-brand-mono",
});

export const noteFont = Victor_Mono({
  subsets: ["latin"],
  style: "italic",
  weight: ["500"],
  display: "swap",
  preload: false,
  variable: "--font-note",
});
