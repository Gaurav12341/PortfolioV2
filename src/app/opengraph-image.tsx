import { SITE_HOST } from "@/lib/constants";
import { renderShareCard } from "./_brand/share-card";

/**
 * Site share card (PHASES.md Phase 8). Facts from PHASES.md §11 only.
 * LinkedIn caches previews: check with the LinkedIn Post Inspector before
 * the first share.
 */
export const alt = "Gaurav Raj, Backend & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderShareCard({
    eyebrow: SITE_HOST,
    title: "Gaurav Raj",
    uppercase: true,
    lead: "Backend & AI Engineer",
    sub: "Distributed systems and RAG pipelines that hold up under load.",
    chips: ["67% faster deploys", "~150 engineers on my RAG", "SupportRAG 57.5→82.5%"],
  });
}
