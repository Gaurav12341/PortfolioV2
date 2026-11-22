/**
 * Hero copy. Edit text here; components read from this file.
 * Numbers must come from PHASES.md §11 (verified facts) only.
 */
export const hero = {
  status: "Open to Backend, AI & Full-stack roles · Bengaluru",
  name: "Gaurav Raj",
  title: "Backend & AI Engineer",
  summary:
    "I build distributed systems and RAG pipelines that hold up under load — .NET, Kafka, Kubernetes, Python.",
  ctas: {
    primary: { label: "View work", href: "#work" },
    secondary: { label: "Download résumé" },
    tertiary: { label: "Book a call", href: "#contact" },
  },
  /**
   * Mono proof chips. `tag` chips read "tag · value"; delta chips read
   * "before → value label".
   */
  proof: [
    { tag: "Production RAG", value: "150 field engineers" },
    { tag: "Agentic PDLC", value: "~$6K saved/release" },
    { before: "20s", value: "<3s", label: "dashboard queries" },
  ],
} as const;
