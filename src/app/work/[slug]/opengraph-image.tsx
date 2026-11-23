import { getProject, workProjects } from "@/content/projects";
import { SITE_HOST } from "@/lib/constants";
import { renderShareCard } from "../../_brand/share-card";

/** Per-case-study share card: title, one-liner and the first measured metrics. */
export const alt = "Case study by Gaurav Raj";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return workProjects.map((p) => ({ slug: p.slug }));
}

/** Cut at a word boundary, never mid-word. */
const clip = (s: string, n: number) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
};
/** First sentence if it fits, otherwise a clipped one-liner. */
const summary = (s: string, n: number) => {
  const first = s.match(/^.+?[.!?](\s|$)/)?.[0].trim();
  return first && first.length <= n ? first : clip(s, n);
};

export default async function WorkOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return renderShareCard({ eyebrow: SITE_HOST, title: "Gaurav Raj", chips: [] });

  const chips = p.metrics
    .filter((m) => !m.projected)
    .slice(0, 2)
    /* the card font has no "≤" glyph */
    .map((m) => clip(`${m.value} ${m.label}`.replace(/≤\s*/g, "max "), 36));

  return renderShareCard({
    eyebrow: `Case study · ${p.kicker}`,
    title: p.title,
    titleSize: p.title.length > 26 ? 76 : 92,
    sub: summary(p.oneLiner, 120),
    chips,
  });
}
