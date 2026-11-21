import type { DiagramSpec } from "@/components/diagram/types";

/**
 * SupportRAG featured project (PHASES.md · Phase 3).
 * Rules: numbers only from PHASES.md §11; it's a DEV deployment on AKS —
 * never call it "production", never quote p50/p95.
 */
export const supportRag = {
  eyebrow: "Featured project",
  title: "SupportRAG",
  meta: "Personal project · Oct 2026 · Open code on GitHub",
  summary:
    "A citation-grounded troubleshooting copilot over ~5,400 pages of Kubernetes, PostgreSQL, Kafka and GitHub Actions docs. It refuses with “No documented fix found” when the docs don't have the answer.",
  why: "Built to go deeper than my work RAG on retrieval quality, guardrails and measurable evaluation.",
  evalNote:
    "108-question reference set · LLM-as-judge from a different model family, validated against hand labels (29/30 agreement) · Wilson CIs · failure taxonomy (retrieval miss, generation error, verifier false refusal, unsafe claim).",

  video: {
    mp4: "/videos/supportrag.mp4",
    webm: "/videos/supportrag.webm",
    poster: "/videos/supportrag-poster.jpg",
    label: "supportrag · dev",
    title: "SupportRAG demo: a cited answer, access levels, and a refusal",
  },

  /** `value` is animated by CountUp; `from` is shown before it, static. */
  metrics: [
    {
      from: "57.5%",
      value: "82.5%",
      label: "answer accuracy",
      detail: "Same 400 questions · baseline: dense-only retrieval, plain prompt, basic guardrails",
    },
    {
      value: "78.9%",
      label: "one-shot holdout",
      detail: "30/38 · 95% CI 63.7–88.9%",
    },
    {
      value: "82",
      suffix: "/ 82",
      label: "unanswerable questions refused",
      detail: "Says “no documented fix” instead of guessing",
    },
    {
      value: "~82 ms",
      label: "retrieval per answered query",
      detail: "$0 running cost · ~5.2k tokens per answered query",
    },
  ],

  stack: ["Python", "FastAPI", "Gradio", "Qdrant", "BM25 / RRF", "bge-small", "Groq (gpt-oss)", "Qwen2.5", "Docker", "AKS (dev)", "JWT"],

  links: {
    repo: "https://github.com/Gaurav12341/SupportRAG",
    evals: "https://github.com/Gaurav12341/SupportRAG#results",
  },

  /** "What I tried and turned off" — reasons from the repo's docs/DECISIONS.md. */
  decisions: [
    {
      name: "Cross-encoder reranker",
      why: "Moved some questions up and others down with no clear win, and added seconds of CPU time to every search.",
    },
    {
      name: "bge-m3 embeddings",
      why: "Better retrieval scores, but end-to-end answers didn't change, and it's a far heavier model to index and serve on CPU.",
    },
    {
      name: "Heading-aware chunking",
      why: "Produced many more, smaller chunks; several from one page crowded the top-10 results and recall went down.",
    },
    {
      name: "HyDE / query rewriting",
      why: "Slightly better recall, but no more evidence reaching the answer context — not worth an extra LLM call per question.",
    },
    {
      name: "Contextual chunk prefix",
      why: "Evidence in context stayed the same while ranking quality dipped. Mixed result, so it stayed off.",
    },
    {
      name: "Recursive chunking",
      why: "Also tried alongside the other chunking variants; recall fell, so plain fixed-size chunks stayed.",
    },
    {
      name: "Agentic retry loop",
      why: "Built and measured on the dev set: no gain, plus extra tokens for every retried question. Switched off.",
    },
  ],
  kept: "Kept: a stronger writer and a wider context window.",
} as const;

/* ── Pipeline diagram ─────────────────────────────────────────────────── */

const ROW1 = 70;
const ROW2 = 250;
const ROW3 = 380;
const M = (i: number) => 40 + i * 84; // mobile column y

export const supportRagDiagram: DiagramSpec = {
  summary:
    "SupportRAG pipeline. Offline: documents are parsed, cleaned, masked for PII and secrets, chunked with access labels, embedded with bge-small and indexed in Qdrant plus BM25. Per question: hybrid search with an access filter, RRF fusion, parent-section expansion, a schema-constrained writer, a claim checker, output guardrails, and a FastAPI plus Gradio UI that shows citations. A local Qwen2.5 model is the failsafe writer.",
  viewBox: "0 0 1200 430",
  nodeW: 160,
  nodeH: 56,
  nodes: [
    // offline ingestion (left → right)
    { id: "ingest", label: "Parse docs", sub: "~5,400 pages", kind: "source", x: 100, y: ROW1, note: "Kubernetes, PostgreSQL, Kafka and GitHub Actions docs." },
    { id: "clean", label: "Clean", sub: "+ exact dedup", kind: "service", x: 300, y: ROW1, note: "Cleans pages and drops exact duplicates before anything is indexed." },
    { id: "mask", label: "Mask", sub: "PII + secrets", kind: "guard", x: 500, y: ROW1, note: "Regex masking of secrets and PII at ingestion, so they can never be retrieved." },
    { id: "chunk", label: "Chunk", sub: "500 tok + access", kind: "service", x: 700, y: ROW1, note: "500-token chunks tagged with product, license and a 3-level access label." },
    { id: "embed", label: "Embed", sub: "bge-small", kind: "model", x: 900, y: ROW1, note: "Small, local embedding model. Free to run on CPU." },
    { id: "index", label: "Index", sub: "Qdrant + BM25", kind: "db", x: 1100, y: ROW1, note: "bge-small vectors in Qdrant (with an embedding-model mismatch check) plus a BM25 keyword index." },
    // per question (right → left)
    { id: "q", label: "Question", sub: "JWT user", kind: "human", x: 1100, y: ROW3, w: 150, note: "JWT login (salted scrypt). A rule-based prompt-injection guard and a follow-up question rewriter run first; the user's role and license decide what they can read." },
    { id: "fuse", label: "RRF fuse", sub: "+ access filter", kind: "service", x: 1100, y: ROW2, note: "The role/license access filter is applied to BOTH dense and BM25 searches before ranking; reciprocal rank fusion merges them. A poisoned-chunk scanner drops injected text." },
    { id: "expand", label: "Expand", sub: "parent section", kind: "service", x: 900, y: ROW2, note: "Hits are widened to their parent section so the writer sees full context." },
    { id: "writer", label: "Writer", sub: "gpt-oss-120b", kind: "llm", x: 700, y: ROW2, note: "Groq gpt-oss-120b, JSON-schema constrained: returns kind, coverage and per-point citations." },
    { id: "failsafe", label: "Qwen2.5", sub: "local failsafe", kind: "llm", x: 700, y: ROW3, w: 150, note: "Local model on the failsafe path." },
    { id: "check", label: "Claim check", sub: "gpt-oss-20b", kind: "llm", x: 500, y: ROW2, note: "gpt-oss-20b labels every claim supported / partial / unsupported against the cited passages." },
    { id: "guard", label: "Guardrails", sub: "output safety", kind: "guard", x: 300, y: ROW2, note: "Secret masking and destructive-command warnings before anything is shown." },
    { id: "ui", label: "API + UI", sub: "FastAPI · Gradio", kind: "client", x: 100, y: ROW2, note: "Answer with clickable citations — or “No documented fix found.”" },
  ],
  edges: [
    { from: "ingest", to: "clean" },
    { from: "clean", to: "mask" },
    { from: "mask", to: "chunk" },
    { from: "chunk", to: "embed" },
    { from: "embed", to: "index" },
    { from: "index", to: "fuse", label: "hybrid search" },
    { from: "q", to: "fuse" },
    { from: "fuse", to: "expand" },
    { from: "expand", to: "writer" },
    { from: "writer", to: "check" },
    { from: "expand", to: "failsafe", style: "dashed" },
    { from: "failsafe", to: "check", style: "dashed" },
    { from: "check", to: "guard" },
    { from: "guard", to: "ui" },
  ],
  steps: [
    {
      title: "Ingest",
      body: "~5,400 public doc pages are parsed, cleaned and deduplicated, with PII and secrets masked before anything is stored.",
      highlight: ["ingest", "clean", "mask", "ingest->clean", "clean->mask"],
    },
    {
      title: "Index",
      body: "500-token chunks get an access label, are embedded with bge-small, and land in Qdrant alongside a BM25 index.",
      highlight: ["mask", "chunk", "embed", "index", "mask->chunk", "chunk->embed", "embed->index"],
    },
    {
      title: "Retrieve",
      body: "Dense and BM25 search both run with the user's access filter; RRF merges them and hits expand to their parent section. ~82 ms per answered query.",
      highlight: ["q", "index", "fuse", "expand", "q->fuse", "index->fuse", "fuse->expand"],
    },
    {
      title: "Write + verify",
      body: "A schema-constrained writer drafts cited steps; a smaller model checks every claim against the passages. Local Qwen2.5 is the failsafe.",
      highlight: ["expand", "writer", "check", "failsafe", "expand->writer", "writer->check", "expand->failsafe", "failsafe->check"],
    },
    {
      title: "Guard + serve",
      body: "Output guardrails run last, then the UI shows the answer with citations — or refuses when the docs have no fix.",
      highlight: ["check", "guard", "ui", "check->guard", "guard->ui"],
    },
  ],
  mobile: {
    viewBox: "0 0 420 1010",
    nodeW: 190,
    pos: {
      ingest: [140, M(0)],
      clean: [140, M(1)],
      mask: [140, M(2)],
      chunk: [140, M(3)],
      embed: [140, M(4)],
      index: [140, M(5)],
      fuse: [140, M(6)],
      q: [330, M(6)],
      expand: [140, M(7)],
      writer: [140, M(8)],
      failsafe: [330, M(8) + 42],
      check: [140, M(9)],
      guard: [140, M(10)],
      ui: [140, M(11)],
    },
  },
};
