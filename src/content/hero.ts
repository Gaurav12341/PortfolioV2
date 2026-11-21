/**
 * Hero copy. Edit text here; components read from this file.
 * Numbers must come from PHASES.md §11 (verified facts) only.
 */
export const hero = {
  status: "Open to SDE-2 / Backend / Applied AI roles · Bengaluru",
  name: "Gaurav Raj",
  title: "Backend & Applied AI Engineer",
  summary:
    "I build distributed systems and RAG pipelines that hold up under load — .NET, Kafka, Kubernetes, Python.",
  ctas: {
    primary: { label: "View work", href: "#work" },
    secondary: { label: "Download résumé" },
    tertiary: { label: "Book a call", href: "#contact" },
  },
  /** Mono proof chips: [before, after, label]. `before` may be empty. */
  proof: [
    { before: "20s", after: "<3s", label: "dashboard queries" },
    { before: "57.5%", after: "82.5%", label: "RAG accuracy" },
    { before: "", after: "5+", label: "services migrated to Postgres" },
  ],
} as const;
