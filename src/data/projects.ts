export interface ProjectStat {
  value: number;
  suffix?: string;
  label: string;
}

export interface ProjectData {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  stats: ProjectStat[];
  problem: string;
  approach: string;
  outcome: string;
  /** Tailwind gradient stops used for the card backdrop. */
  gradient: string;
}

export const projectsData: ProjectData[] = [
  {
    id: "air-gapped-rag",
    title: "Air-Gapped RAG Assistant",
    summary:
      "Retrieval-augmented AI system for disconnected, on-prem field environments.",
    stack: ["Vertex AI", "Gemini", "Ollama", "pgvector", "FAISS", "Chroma"],
    stats: [
      { value: 150, suffix: "+", label: "field engineers" },
      { value: 5, suffix: "s", label: "avg retrieval" },
    ],
    problem:
      "Field engineers working in disconnected, on-prem healthcare networks had no fast way to search internal documentation without internet access.",
    approach:
      "Built a retrieval-augmented generation pipeline that runs entirely offline — combining Vertex AI/Gemini and Ollama for generation with pgvector, FAISS, and Chroma for vector search, deployable on air-gapped infrastructure.",
    outcome:
      "Delivered sub-5-second retrieval to 150+ field engineers across on-prem healthcare networks, with zero dependency on external connectivity.",
    gradient: "from-indigo-900 via-slate-900 to-black",
  },
  {
    id: "nl-to-sql-agent",
    title: "NL-to-SQL Reporting Agent",
    summary:
      "An AI agent that lets non-technical users query operational data in plain English.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Few-shot Prompting"],
    stats: [{ value: 100, suffix: "%", label: "self-serve reporting" }],
    problem:
      "Non-technical operations staff depended on engineers to write ad-hoc SQL every time they needed a KPI report, creating a constant backlog.",
    approach:
      "Built an AI agent over the NurseCall schemas using few-shot prompting to translate plain-English questions into safe, validated SQL queries.",
    outcome:
      "Removed a manual reporting bottleneck, letting operations teams self-serve KPI reports without writing SQL.",
    gradient: "from-emerald-900 via-slate-900 to-black",
  },
  {
    id: "zero-downtime-deploy",
    title: "Zero-Downtime Deployment Platform",
    summary:
      ".NET 8 orchestration platform coordinating 15+ services across 50+ healthcare networks.",
    stack: [".NET 8", "Windows Services", "CI/CD"],
    stats: [
      { value: 67, suffix: "%", label: "faster deployment" },
      { value: 50, suffix: "+", label: "healthcare networks" },
      { value: 15, suffix: "+", label: "services orchestrated" },
    ],
    problem:
      "Multi-service deployments across 50+ on-prem healthcare networks took roughly 2 hours each, with no recovery path when a slow or unstable connection interrupted the rollout.",
    approach:
      "Built a .NET 8 platform that orchestrates 15+ services through resumable stages, with automatic recovery for slow or interrupted on-prem environments.",
    outcome:
      "Cut deployment time from ~2 hours to ~40 minutes (67% faster) across 50+ production healthcare networks.",
    gradient: "from-rose-950 via-slate-900 to-black",
  },
  {
    id: "distributed-messaging",
    title: "Distributed Messaging Reliability",
    summary:
      "Kafka-based orchestration work that raised distributed-system availability.",
    stack: ["Kafka", "ZooKeeper", "Microservices"],
    stats: [{ value: 40, suffix: "%+", label: "availability improvement" }],
    problem:
      "Distributed services communicating over Kafka were vulnerable to update-time outages and slow recovery after failures.",
    approach:
      "Redesigned Kafka orchestration with zero-downtime update flows and resilient, automatic service recovery paths.",
    outcome:
      "Improved distributed-system availability by 40%+ in production.",
    gradient: "from-amber-950 via-slate-900 to-black",
  },
  {
    id: "sso-modernization",
    title: "Secure SSO Modernization",
    summary:
      "Rebuilt Keycloak-based SSO as an automated, certificate-validated .NET workflow.",
    stack: ["Keycloak", ".NET", "OAuth2 / JWT"],
    stats: [{ value: 0, label: "known release defects" }],
    problem:
      "The existing Keycloak-based SSO setup relied on manual, error-prone certificate handling during releases.",
    approach:
      "Modernized secure SSO as a scalable, automated .NET workflow with certificate validation built into the release pipeline.",
    outcome: "Contributed to zero known release defects across the rollout.",
    gradient: "from-cyan-950 via-slate-900 to-black",
  },
];
