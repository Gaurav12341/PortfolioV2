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

/**
 * Experience timeline (Phase 6.5). Dates confirmed by Gaurav (Nov 2026).
 * Facts from aboutme.md §5 + PHASES.md §11. NDA rule: no internal product or
 * module names. Each point may lead with a `figure`, shown bold in mono.
 */
type Point = { figure?: string; text: string };
type Role = {
  when: string;
  org: string;
  role: string;
  body: string;
  groups: { title?: string; points: Point[] }[];
  stack: string[];
};

export const timeline: Role[] = [
  {
    when: "Aug 2024 - now",
    org: "Honeywell",
    role: "Software Engineer I",
    body: "Backend services in .NET 8 for 50+ healthcare networks, many of them on-prem or air-gapped, and the AI systems that run on top of them.",
    groups: [
      {
        title: "Backend",
        points: [
          { figure: "67%", text: "faster deploys (~2 h to 40 min): a .NET 8 platform orchestrating 15+ services, with resumable stages for slow or interrupted on-prem links" },
          { figure: "40%+", text: "higher availability through Kafka orchestration, zero-downtime updates and service recovery" },
          { figure: "50%", text: "shorter release cycles and 60% less manual effort from CI/CD automation, ~80 engineering hours saved a month" },
          { figure: "20s→<3s", text: "on a 50K-record analytics dashboard, with GraphQL filtering, pagination and Redis caching behind .NET REST and gRPC services" },
          { text: "Rebuilt Keycloak SSO as an automated .NET workflow, shipped with zero known release defects" },
        ],
      },
      {
        title: "AI",
        points: [
          { figure: "150", text: "field engineers on a RAG assistant that runs in the cloud and air-gapped (Vertex AI / Gemini, Ollama, pgvector, FAISS, Chroma), answers in under 5 s" },
          { text: "NL-to-SQL agent (Python, FastAPI, PostgreSQL, few-shot prompting) so non-technical users pull their own KPI reports" },
          { figure: "~$6K", text: "saved in one release by an agentic PDLC pipeline: requirements to Playwright-tested code, wired to Jira and GitHub over MCP, now used by several teams" },
        ],
      },
    ],
    stack: [".NET 8", "C#", "Kafka", "PostgreSQL", "Redis", "Kubernetes", "Python", "FastAPI", "React"],
  },
  {
    when: "Jan - Jul 2024",
    org: "Honeywell",
    role: "Software Engineer Intern",
    body: "Backend services on Azure AKS: scaling, monitoring and delivery. Earned the Dashing Debut award.",
    groups: [
      {
        points: [
          { figure: "1M+", text: "daily requests kept steady by tuning Dockerized services and Kubernetes scaling" },
          { figure: "5+", text: "microservices brought under Prometheus monitoring, plus incident resolution on them" },
          { text: "GitHub Actions CI/CD for the same services" },
        ],
      },
    ],
    stack: ["Docker", "Kubernetes", "Azure AKS", "Prometheus", "GitHub Actions"],
  },
  {
    when: "Feb - May 2023",
    org: "Corizo",
    role: "Web Development Intern",
    body: "Built a real-time full-stack app with Node.js, MongoDB and REST APIs, with a responsive UI and a Git-based delivery workflow.",
    groups: [],
    stack: [],
  },
  {
    when: "2020 - 2024",
    org: "SRM Institute of Science & Technology",
    role: "B.Tech, Computer Science & Engineering",
    body: "Software Engineering specialisation. CGPA 9.44 / 10.",
    groups: [],
    stack: [],
  },
];
