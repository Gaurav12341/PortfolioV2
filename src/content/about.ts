/**
 * About copy (PHASES.md · Phases 5–6). Edit here, not in components.
 * Facts come only from PHASES.md §11 and the verified list in docs/AUDIT.md
 * decisions. Keep em-dashes out of visible copy.
 */

/** Lines shown at the end of the scroll sequence (Phase 5). */
export const aboutIntro = {
  headline: "I like systems that stay boring at 3 a.m.",
  line: "Backend engineer at Honeywell, ~2 years in: .NET microservices, Kafka, Kubernetes, PostgreSQL. Now building applied AI on top: RAG, evals and agent workflows.",
} as const;

export const about = {
  /**
   * PHASES.md Phase 6 headline options. Option 1 already closes the scroll
   * sequence, so the About section uses option 2 to avoid repeating it.
   */
  headlineOptions: [
    "I like systems that stay boring at 3 a.m.",
    "Backend engineer who measures before he optimizes.",
    "I build things that keep working when the traffic doesn't behave.",
  ],
  headline: "Backend engineer who measures before he optimizes.",

  /** Three short paragraphs, under 120 words in total. */
  story: [
    "I'm a backend engineer at Honeywell, about two years in. Most days that means .NET microservices, Kafka, Kubernetes, PostgreSQL and Redis, deployed across 50+ healthcare networks, many of them on-prem.",
    "Lately I build applied AI on that base: a RAG assistant that ~150 field engineers use in production, an agent pipeline that takes a brief to tested code, and the evals that tell me whether any of it is right.",
    "How I work: measure first, fix what the numbers point at, then verify it stays fixed.",
  ],

  /**
   * Layered depth stage at the top of About (the "Option A" demo): the
   * cut-out stands in front of the nameplate. Source + rebuild commands:
   * docs/SEQUENCE.md → "Other portraits".
   */
  depth: {
    subject: { desktop: "/images/portrait-full.webp", mobile: "/images/portrait-full-sm.webp", width: 788, height: 1400 },
    alt: "Illustrated full-body portrait of Gaurav Raj in a black shirt and trousers",
    nameplate: "Gaurav Raj",
    caption: ["Software Engineer I, Honeywell", "Bengaluru"],
    /** Pointer travel (px) for a depth-1 layer, and the scroll push-in. */
    pointerPx: 14,
    zoom: 1.05,
  },

  /** CountUp animates the first number in `value`. */
  stats: [
    { value: "2+", unit: "yrs", label: "building backend systems" },
    { value: "150", label: "field engineers on my production RAG" },
    { from: "20s", value: "<3s", label: "dashboard queries, 50K records" },
    { value: "~$6K", label: "saved by the agentic PDLC pipeline in one release" },
  ],

  /** simple-icons export names; items without one render as text only. */
  stack: [
    {
      group: "Backend",
      items: [
        { name: ".NET / C#", icon: "siDotnet" },
        { name: "Python", icon: "siPython" },
        { name: "FastAPI", icon: "siFastapi" },
        { name: "GraphQL", icon: "siGraphql" },
        { name: "REST", icon: "siOpenapiinitiative" },
      ],
    },
    {
      group: "Data & streaming",
      items: [
        { name: "Kafka", icon: "siApachekafka" },
        { name: "PostgreSQL", icon: "siPostgresql" },
        { name: "MongoDB", icon: "siMongodb" },
        { name: "Redis", icon: "siRedis" },
        { name: "Qdrant", icon: "siQdrant" },
      ],
    },
    {
      group: "Cloud & DevOps",
      items: [
        { name: "Docker", icon: "siDocker" },
        { name: "Kubernetes", icon: "siKubernetes" },
        { name: "AKS" },
        { name: "CI/CD", icon: "siGithubactions" },
      ],
    },
    {
      group: "AI",
      items: [
        { name: "RAG" },
        { name: "LLM evals" },
        { name: "Claude Agent SDK", icon: "siClaude" },
        { name: "MCP", icon: "siModelcontextprotocol" },
        { name: "Groq" },
      ],
    },
  ],

  principles: [
    { title: "Measure first", body: "Profile before changing anything. The fix goes where the numbers point." },
    { title: "Design for failure", body: "Retries, resumable steps and a recovery path, because on-prem networks drop mid-deploy." },
    { title: "Ship small, verify always", body: "Small changes, a human gate where it matters, and a test that proves the fix held." },
  ],

  recognition: [
    "Top Performer of the Month",
    "Bronze & Win Together awards: zero-defect releases, SSO modernization",
    "Dashing Debut award",
    "3 Bravo awards",
    "Six Sigma Green Belt",
    "Claude Academy: Claude Code in Action, MCP Advanced Topics, Human-Agent Teams",
    "Google Cohort Hackathon",
    "McKinsey Forward Program",
  ],

  currently: "Exploring agent evals and retrieval quality.",

  offKeyboard:
    "Off the keyboard: badminton (2nd runner-up, district under-18), singing and guitar, anime, and volunteering with NGOs.",
} as const;

/** Experience timeline (Phase 6.5). Dates confirmed by Gaurav (Nov 2026). */
export const timeline = [
  {
    when: "Aug 2024 - now",
    org: "Honeywell",
    role: "Software Engineer I",
    body: "Own .NET 8 services and deployment tooling across 50+ healthcare networks. Built the production RAG assistant for ~150 field engineers and the agentic PDLC pipeline.",
    highlights: [
      "Deploys ~2 h → 40 min (67%) across 15+ services, with resumable stages",
      "40%+ availability through Kafka orchestration and zero-downtime updates",
      "Release cycles cut 50%, ~80 engineering hours saved a month",
    ],
  },
  {
    when: "Jan - Jul 2024",
    org: "Honeywell",
    role: "Software Engineer Intern",
    body: "Tuned Dockerized services and Kubernetes scaling on AKS for 1M+ daily requests, and added Prometheus monitoring across 5+ microservices. Earned the Dashing Debut award.",
    highlights: [],
  },
  {
    when: "Feb - May 2023",
    org: "Corizo",
    role: "Web Development Intern",
    body: "Built a real-time full-stack app with Node.js, MongoDB and REST APIs, with a responsive UI and a Git-based delivery workflow.",
    highlights: [],
  },
  {
    when: "2020 - 2024",
    org: "SRM Institute of Science & Technology",
    role: "B.Tech, Computer Science & Engineering",
    body: "Software Engineering specialisation. CGPA 9.44 / 10.",
    highlights: [],
  },
] as const;
