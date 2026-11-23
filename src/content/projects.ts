import type { DiagramSpec } from "@/components/diagram/types";

/**
 * Work case studies. Source of truth: PROJECTS.md (supersedes PHASES.md
 * §4d/§11). Rules: only numbers written there; Honeywell work is under NDA
 * (no product or internal module names, no screenshots); SupportRAG ≠
 * Production RAG; honest verbs ("projected" for forecasts).
 */

export const platformContext =
  "At Honeywell I work on a 15+ microservice clinical communication platform running on-prem across 50+ hospital networks. I personally built and own 4 of its core services (API Gateway, User/Organization Management, Rules Engine, Clinical Notifications), plus the installer, the field-engineer RAG assistant and the agentic PDLC workflow.";

export type Metric = {
  value: string;
  label: string;
  detail?: string;
  /** Show a "projected" tag (forecast, not measured). */
  projected?: boolean;
};

export type WorkProject = {
  slug: string;
  title: string;
  /** Short label for nav dots / next-project links. */
  short: string;
  kicker: string;
  oneLiner: string;
  role: string;
  context: string;
  problem: string;
  metrics: Metric[];
  badges?: string[];
  hardParts: { title: string; body: string }[];
  stack: string[];
  diagram: DiagramSpec;
  /** Production RAG: Cloud ⇄ Air-gapped toggle. */
  variants?: { cloud: DiagramSpec; airgap: DiagramSpec };
  beforeAfter?: {
    title: string;
    before: { label: string; value: number; display: string };
    after: { label: string; value: number; display: string };
    delta: string;
  };
};

/* Shared grid for every diagram: 5 columns in an 800-wide viewBox. */
const C = [80, 240, 400, 560, 720] as const;

/* ── 2. Agentic PDLC (flagship) ───────────────────────────────────────── */

const L1 = 70; // lane centre lines
const L2 = 198;
const L3 = 326;
const BUS = 452;

const pdlcDiagram: DiagramSpec = {
  summary:
    "Agentic PDLC workflow in three swimlanes over an integration bus. Requirements: a release brief becomes an MRS, PRS, epics and stories in Jira, with a human review gate after each artifact. Development: GitHub Copilot pulls the story through Jira MCP, builds with custom skills and instructions, and opens a PR for human review. Testing: a Rovo Test agent writes scenarios, Copilot turns them into Playwright scripts, tests run and results link back to Jira while Outlook notifies stakeholders. The bus underneath is MCP, Atlassian REST tokens, Confluence, SharePoint and Outlook COM automation.",
  viewBox: "0 0 800 494",
  nodeW: 140,
  nodeH: 52,
  minWidth: 720,
  lanes: [
    { id: "req", label: "1 · Requirements", sub: "Atlassian Rovo + GitHub Copilot", y: 0, h: 118 },
    { id: "dev", label: "2 · Development", sub: "GitHub Copilot", y: 128, h: 118 },
    { id: "test", label: "3 · Testing", sub: "Rovo + Copilot + Playwright", y: 256, h: 118 },
    { id: "bus", label: "Integration bus", y: 392, h: 100, tone: "bus" },
  ],
  rails: { xs: [160, 320, 480, 640], from: 392, to: 8 },
  nodes: [
    // Lane 1 (→)
    { id: "brief", label: "Brief", sub: "source docs", kind: "source", x: C[0], y: L1, note: "A release brief comes in from SharePoint / Confluence sources." },
    { id: "mrs", label: "MRS agent", sub: "Rovo · Claude", kind: "agent", x: C[1], y: L1, note: "Custom Rovo agent on Claude models. Drafts the MRS; a human approves it before anything moves on." },
    { id: "prs", label: "PRS agent", sub: "Rovo · Claude", kind: "agent", x: C[2], y: L1, note: "Custom Rovo agent on Claude models. Turns the approved MRS into a PRS. Human review gate again." },
    { id: "stories", label: "Story agent", sub: "epics · AC", kind: "agent", x: C[3], y: L1, note: "Custom Rovo agents on Claude models write epics and stories with acceptance criteria." },
    { id: "jira", label: "Jira", sub: "created here", kind: "queue", x: C[4], y: L1, note: "Epics and stories are created directly in Jira." },
    // Lane 2 (←)
    { id: "story", label: "Jira MCP", sub: "pulls story", kind: "gateway", x: C[4], y: L2, note: "GitHub Copilot pulls the story through the Jira MCP server." },
    { id: "copilot", label: "Copilot", sub: "Sonnet / Opus", kind: "agent", x: C[3], y: L2, note: "Copilot (Claude Sonnet / Opus) with custom skills + custom instructions that encode repo conventions and architecture rules." },
    { id: "pr", label: "Code + PR", sub: "GitHub", kind: "service", x: C[2], y: L2, note: "Code lands as a pull request on GitHub." },
    { id: "review", label: "Code review", sub: "human gate", kind: "human", x: C[1], y: L2, note: "A human reviews every PR." },
    // Lane 3 (→)
    { id: "rovo", label: "Rovo Test", sub: "scenarios", kind: "agent", x: C[0], y: L3, note: "The Rovo Test agent writes test scenarios / a test plan from the story." },
    { id: "pw", label: "Copilot", sub: "Playwright TS", kind: "agent", x: C[1], y: L3, note: "Copilot turns the scenarios into Playwright (TypeScript) scripts." },
    { id: "run", label: "Web tests", sub: "automated run", kind: "service", x: C[2], y: L3, note: "The automated web tests run." },
    { id: "results", label: "Results", sub: "linked in Jira", kind: "queue", x: C[3], y: L3, note: "Results link back to the Jira story: requirement → story → PR → test." },
    { id: "notify", label: "Stakeholders", sub: "Outlook email", kind: "human", x: C[4], y: L3, note: "Stakeholders are notified by email." },
    // Bus
    { id: "mcp", label: "MCP", sub: "Copilot↔Jira", kind: "gateway", x: C[0], y: BUS, note: "MCP connects GitHub Copilot to Jira and GitHub." },
    { id: "tokens", label: "API tokens", sub: "Atlassian REST", kind: "gateway", x: C[1], y: BUS, note: "Atlassian API tokens for Jira + Confluence REST, instead of org-level apps." },
    { id: "confluence", label: "Confluence", sub: "requirements", kind: "source", x: C[2], y: BUS, note: "Requirement documents." },
    { id: "sharepoint", label: "SharePoint", sub: "source docs", kind: "source", x: C[3], y: BUS, note: "Source documents for the brief." },
    { id: "outlook", label: "Outlook", sub: "COM automation", kind: "service", x: C[4], y: BUS, note: "Notifications and approval emails via COM automation, because MS Graph access wasn't available." },
  ],
  edges: [
    { from: "brief", to: "mrs" },
    { from: "mrs", to: "prs", gate: true },
    { from: "prs", to: "stories", gate: true },
    { from: "stories", to: "jira", gate: true },
    { from: "jira", to: "story" },
    { from: "story", to: "copilot" },
    { from: "copilot", to: "pr" },
    { from: "pr", to: "review" },
    { from: "review", to: "rovo" },
    { from: "rovo", to: "pw" },
    { from: "pw", to: "run" },
    { from: "run", to: "results" },
    { from: "results", to: "notify" },
  ],
  steps: [
    {
      title: "Brief in",
      body: "A release brief comes in from SharePoint and Confluence sources.",
      highlight: ["brief", "sharepoint", "confluence", "rails", "lane:req"],
    },
    {
      title: "MRS → PRS, human-approved",
      body: "Requirements agents draft the MRS, then the PRS. A human approves each one before the next agent runs.",
      highlight: ["brief", "mrs", "prs", "brief->mrs", "mrs->prs", "tokens"],
    },
    {
      title: "Epics and stories land in Jira",
      body: "Epic and Story agents create epics and stories with acceptance criteria directly in Jira.",
      highlight: ["prs", "stories", "jira", "prs->stories", "stories->jira", "tokens"],
    },
    {
      title: "Copilot builds against the story",
      body: "Copilot pulls the story via Jira MCP and builds with custom skills and instructions, then opens a PR for human review.",
      highlight: ["jira", "story", "copilot", "pr", "review", "jira->story", "story->copilot", "copilot->pr", "pr->review", "mcp"],
    },
    {
      title: "Rovo writes the test scenarios",
      body: "The Rovo Test agent writes test scenarios from the story.",
      highlight: ["review", "rovo", "review->rovo"],
    },
    {
      title: "Copilot generates Playwright",
      body: "Copilot turns the scenarios into Playwright scripts that automate the web tests.",
      highlight: ["rovo", "pw", "run", "rovo->pw", "pw->run"],
    },
    {
      title: "Results flow back",
      body: "Results link back to the Jira story, and Outlook (COM) notifies stakeholders.",
      highlight: ["run", "results", "notify", "run->results", "results->notify", "outlook", "rails"],
    },
  ],
};

/* ── 3. Field Engineer RAG (cloud ⇄ air-gapped) ───────────────────────── */

function ragDiagram(mode: "cloud" | "airgap"): DiagramSpec {
  const air = mode === "airgap";
  return {
    summary: `Field engineer RAG assistant, ${air ? "air-gapped on-prem" : "cloud"} variant. Docs are embedded into a vector store. A field engineer asks through the assistant UI; the API retrieves passages in under a second; a relevance-score gate decides whether to answer or decline; ${air ? "a local Ollama model (7B–32B)" : "Gemini on Vertex AI"} writes a grounded answer with sources.`,
    viewBox: "0 0 800 480",
    nodeW: 140,
    nodeH: 52,
    minWidth: 700,
    nodes: [
      { id: "docs", label: "Docs", sub: "manuals · TI", kind: "source", x: C[1], y: 60, note: "Installation and configuration manuals, release notes and Technical Info (TI) documents." },
      { id: "embed", label: "Embed", sub: "embeddings", kind: "model", x: C[2], y: 60, note: "Docs are chunked and embedded once, ahead of time." },
      { id: "store", label: "Vector store", sub: "pgvector·FAISS", kind: "db", x: C[3], y: 60, note: "pgvector / FAISS / Chroma." },
      { id: "eng", label: "Engineer", sub: "150+ in field", kind: "human", x: C[0], y: 200, note: "Field engineers installing and configuring the platform at hospital sites." },
      { id: "ui", label: "Assistant UI", sub: "web · installer", kind: "client", x: C[1], y: 200, note: "Chat UI for field engineers, also built into the on-prem installer." },
      { id: "api", label: "API", sub: "Python", kind: "service", x: C[2], y: 200 },
      { id: "retr", label: "Retriever", sub: "sub-second", kind: "service", x: C[3], y: 200, note: "Embeds the question and retrieves passages in under a second." },
      { id: "gate", label: "Score gate", sub: "answer/decline", kind: "guard", x: C[4], y: 200, note: "Relevance-score thresholds decide whether to answer at all." },
      air
        ? { id: "llm", label: "Ollama", sub: "7B–32B local", kind: "llm", x: C[4], y: 340, note: "Local models on hospital hardware. No internet needed." }
        : { id: "llm", label: "Gemini", sub: "Vertex AI", kind: "llm", x: C[4], y: 340, note: "Cloud LLM on Vertex AI." },
      { id: "answer", label: "Answer", sub: "with sources", kind: "client", x: C[3], y: 340, note: "Grounded answer with its sources, end to end in under 5 s." },
      { id: "net", label: "Internet", sub: air ? "not available" : "cloud API", kind: "gateway", x: C[4], y: 440, muted: air, note: air ? "Air-gapped: no internet on site." : "Cloud variant calls Vertex AI." },
    ],
    edges: [
      { from: "docs", to: "embed" },
      { from: "embed", to: "store" },
      { from: "eng", to: "ui" },
      { from: "ui", to: "api" },
      { from: "api", to: "retr" },
      { from: "store", to: "retr" },
      { from: "retr", to: "gate" },
      { from: "gate", to: "llm" },
      { from: "llm", to: "answer" },
      { from: "net", to: "llm", style: "dashed", muted: air },
    ],
    steps: [
      {
        title: "Docs ingested and embedded",
        body: "Installation and configuration manuals, release notes and TI documents are chunked, embedded and stored ahead of time.",
        highlight: ["docs", "embed", "store", "docs->embed", "embed->store"],
      },
      {
        title: "Question retrieved, sub-second",
        body: "The engineer's question is embedded and matched against the store in under a second.",
        highlight: ["eng", "ui", "api", "retr", "store", "eng->ui", "ui->api", "api->retr", "store->retr"],
      },
      {
        title: "Answer or decline",
        body: "Relevance-score thresholds decide whether there's enough evidence to answer. If not, it declines.",
        highlight: ["retr", "gate", "retr->gate"],
      },
      {
        title: "Grounded answer",
        body: air
          ? "A local Ollama model writes the answer with its sources, under 5 seconds end to end."
          : "Gemini on Vertex AI writes the answer with its sources, under 5 seconds end to end.",
        highlight: ["gate", "llm", "answer", "gate->llm", "llm->answer", ...(air ? [] : ["net", "net->llm"])],
      },
      {
        title: "Same pipeline, offline",
        body: "The same pipeline runs fully air-gapped on-prem, swapping the cloud LLM for local 7B–32B models.",
        highlight: ["llm", "net", "net->llm", "answer"],
      },
    ],
  };
}

/* ── 4. Real-time alert pipeline ──────────────────────────────────────── */

const alertsDiagram: DiagramSpec = {
  summary:
    "Real-time alert pipeline. Device events are published to Kafka topics and consumed by the Rules Engine. Failed consumers retry, and queue diagnostics flag stuck messages. The Rules Engine hands off over gRPC to the Notifier service, then through the API Gateway to SignalR, which pushes alerts to the React web dashboard and the mobile app within 3 seconds worst case.",
  viewBox: "0 0 800 400",
  nodeW: 140,
  nodeH: 52,
  minWidth: 700,
  nodes: [
    { id: "src", label: "Event source", sub: "devices", kind: "source", x: C[0], y: 60, note: "Device and system events." },
    { id: "kafka", label: "Kafka topics", sub: "15+ services", kind: "queue", x: C[1], y: 60, note: "The platform's 15+ services communicate over Kafka." },
    { id: "rules", label: "Rules Engine", sub: "consumer grp", kind: "service", x: C[2], y: 60, note: "One of my services. Evaluates each event." },
    { id: "notif", label: "Notifier", sub: ".NET 8", kind: "service", x: C[3], y: 60, note: "Clinical Notifications, one of my services." },
    { id: "gw", label: "API Gateway", sub: "routing", kind: "gateway", x: C[4], y: 60, note: "One of my services." },
    { id: "retry", label: "Retry + diag", sub: "stuck queues", kind: "guard", x: C[2], y: 200, note: "Failed consumers retry; queue diagnostics flag stuck messages." },
    { id: "signalr", label: "SignalR", sub: "push ≤ 3 s", kind: "service", x: C[4], y: 200, note: "Real-time push to connected clients." },
    { id: "web", label: "Web", sub: "React/Redux", kind: "client", x: C[3], y: 340, note: "React / Redux / TypeScript dashboard." },
    { id: "mobile", label: "Mobile app", sub: "alerts", kind: "client", x: C[4], y: 340 },
  ],
  edges: [
    { from: "src", to: "kafka" },
    { from: "kafka", to: "rules" },
    { from: "rules", to: "notif", label: "gRPC" },
    { from: "notif", to: "gw" },
    { from: "gw", to: "signalr" },
    { from: "signalr", to: "web" },
    { from: "signalr", to: "mobile" },
    { from: "rules", to: "retry", style: "async" },
    { from: "retry", to: "kafka", style: "async" },
  ],
  steps: [
    { title: "Event published", body: "A device or system event is published to a Kafka topic.", highlight: ["src", "kafka", "src->kafka"] },
    { title: "Rules Engine evaluates", body: "The Rules Engine consumes the event and decides what alert it means.", highlight: ["kafka", "rules", "kafka->rules"] },
    {
      title: "Retry, don't drop",
      body: "A failed consumer retries, and queue diagnostics flag stuck messages — ~40% fewer failed or stuck deliveries.",
      highlight: ["rules", "retry", "kafka", "rules->retry", "retry->kafka"],
    },
    { title: "gRPC hand-off", body: "The Rules Engine hands off to the Notifier over gRPC between .NET 8 services.", highlight: ["rules", "notif", "gw", "rules->notif", "notif->gw"] },
    {
      title: "Pushed in ≤ 3 s",
      body: "SignalR pushes the alert to the web dashboard and mobile app within 3 seconds, worst case.",
      highlight: ["gw", "signalr", "web", "mobile", "gw->signalr", "signalr->web", "signalr->mobile"],
    },
    {
      title: "Live during releases",
      body: "Zero-downtime service updates keep the pipeline running while new versions roll out.",
      highlight: ["rules", "notif", "gw", "signalr"],
    },
  ],
};

/* ── 5. On-prem installer ─────────────────────────────────────────────── */

const installerDiagram: DiagramSpec = {
  summary:
    "On-prem installer. It validates prerequisites, then installs in resumable stages: every service is installed and configured, and dynamic polling plus health checks confirm it. If a step fails, a retry and recovery loop resumes from the last checkpoint. A RAG assistant for field engineers is built into the installer.",
  viewBox: "0 0 800 260",
  nodeW: 140,
  nodeH: 52,
  minWidth: 700,
  nodes: [
    { id: "start", label: "Start", sub: "on-prem server", kind: "client", x: C[0], y: 60, note: "A hospital server, often on a slow or unreliable network." },
    { id: "prereq", label: "Prereq check", sub: "validation", kind: "guard", x: C[1], y: 60, note: "Validates prerequisites before touching anything." },
    { id: "stage", label: "Stages", sub: "checkpoints", kind: "service", x: C[2], y: 60, note: "Staged install with resumable checkpoints." },
    { id: "config", label: "Services", sub: "15+ installed", kind: "service", x: C[3], y: 60, note: "Installs and configures all 15+ services." },
    { id: "health", label: "Health", sub: "dynamic polling", kind: "service", x: C[4], y: 60, note: "Dynamic service polling + health checks." },
    { id: "rag", label: "Assistant", sub: "built-in RAG", kind: "llm", x: C[0], y: 200, note: "The field-engineer RAG assistant, built into the installer." },
    { id: "retry", label: "Retry", sub: "resume ckpt", kind: "guard", x: C[2], y: 200, note: "On failure, retry and resume from the last checkpoint instead of starting over." },
    { id: "done", label: "Done", sub: "~40 min", kind: "client", x: C[4], y: 200, note: "Down from about 2 hours." },
  ],
  edges: [
    { from: "start", to: "prereq" },
    { from: "prereq", to: "stage" },
    { from: "stage", to: "config" },
    { from: "config", to: "health" },
    { from: "health", to: "done" },
    { from: "config", to: "retry", style: "async", label: "fail" },
    { from: "retry", to: "stage", style: "async" },
    { from: "rag", to: "prereq", style: "dashed" },
  ],
  steps: [
    { title: "Validate first", body: "Prerequisites are validated before anything is installed.", highlight: ["start", "prereq", "start->prereq"] },
    { title: "Staged, resumable install", body: "The install runs in stages, each with a resumable checkpoint.", highlight: ["prereq", "stage", "prereq->stage"] },
    { title: "Services installed + configured", body: "All 15+ services are installed and configured.", highlight: ["stage", "config", "stage->config"] },
    {
      title: "Fail, retry, resume",
      body: "When a site drops mid-install, the retry and recovery loop resumes from the last checkpoint instead of starting over.",
      highlight: ["config", "retry", "stage", "config->retry", "retry->stage"],
    },
    { title: "Health-checked", body: "Dynamic service polling and health checks confirm each service is actually up.", highlight: ["config", "health", "config->health"] },
    {
      title: "Done in ~40 minutes",
      body: "About 2 hours down to 40 minutes, rolled out to 50+ hospital networks. The RAG assistant is built in for field engineers.",
      highlight: ["health", "done", "health->done", "rag", "rag->prereq"],
    },
  ],
};

/* ── Projects (display order from PROJECTS.md) ────────────────────────── */

export const workProjects: WorkProject[] = [
  {
    slug: "agentic-pdlc",
    title: "Agentic PDLC Workflow",
    short: "Agentic PDLC",
    kicker: "Flagship · Work",
    oneLiner:
      "A human-in-the-loop agent pipeline that takes a product release from requirements to tested code. Agents in GitHub Copilot and Atlassian Rovo are wired into Jira, Confluence, GitHub, SharePoint and Outlook.",
    role: "Designed, built, managed and maintained it end to end. Built for cross-domain reuse so other teams can adopt it and log their own savings.",
    context:
      "A product release moves through requirements, development and testing, and the material for each step lives in different tools: SharePoint, Confluence, Jira, GitHub and Outlook.",
    problem:
      "Each hand-off (brief → requirements → stories → code → tests) was manual. The goal was to let agents do the drafting while a human stays in control of every artifact.",
    metrics: [
      { value: "~$6K", label: "saved in one release", detail: "Initial effort estimate vs. the actual, earlier delivery" },
      { value: "24", label: "stories generated", detail: "Plus a detailed MRS and 3 epics" },
      { value: "60+", label: "test cases generated" },
      { value: "$24K+", label: "per year", detail: "Across ~4 lite releases a year", projected: true },
    ],
    badges: ["Adopted by multiple teams"],
    hardParts: [
      {
        title: "Connecting tools without admin rights",
        body: "Atlassian API tokens and MCP instead of org-level apps, and COM automation for Outlook instead of MS Graph.",
      },
      { title: "Keeping humans in control", body: "An approval gate after every generated artifact." },
      { title: "Consistent agent output", body: "Custom instructions and skills encode the team's conventions." },
      { title: "Traceability", body: "Requirement → story → PR → test case, all linked in Jira." },
      { title: "Reusability", body: "Built domain-agnostic so other teams can plug in their own releases." },
    ],
    stack: [
      "GitHub Copilot (agents, skills, custom instructions)",
      "Claude Sonnet / Opus (in Copilot + Rovo agents)",
      "Atlassian Rovo",
      "MCP",
      "Jira",
      "Confluence",
      "SharePoint",
      "Outlook (COM)",
      "Playwright (TypeScript)",
      "Atlassian REST API",
    ],
    diagram: pdlcDiagram,
  },
  {
    slug: "production-rag",
    title: "Field Engineer RAG Assistant",
    short: "Field Engineer RAG",
    kicker: "Work · Production",
    oneLiner:
      "A production RAG assistant used by 150+ field engineers, running both in the cloud and air-gapped on-prem, with answers end to end in under 5 seconds.",
    role: "Main engineer.",
    context:
      "Field engineers install and configure the platform at hospital sites, often on networks with no internet. They need fast, grounded answers from installation and configuration manuals, release notes and Technical Info (TI) documents.",
    problem:
      "Answers had to be quick enough to use mid-install, grounded in the docs rather than guessed, and available even with no internet at all.",
    metrics: [
      { value: "150+", label: "field engineers in production" },
      { value: "<5 s", label: "end to end", detail: "Question to grounded answer" },
      { value: "<1 s", label: "retrieval", detail: "Sub-second" },
      { value: "Offline", label: "fully air-gapped", detail: "Same pipeline, local models" },
    ],
    hardParts: [
      {
        title: "No internet on site",
        body: "The same pipeline runs fully air-gapped, swapping cloud Gemini for local Ollama models (7B–32B).",
      },
      { title: "Knowing when not to answer", body: "Relevance-score thresholds decide whether the assistant answers or declines." },
      { title: "Fast enough to use mid-install", body: "Sub-second retrieval keeps the whole answer under 5 seconds, and the assistant is built right into the installer." },
    ],
    stack: ["Python", "Vertex AI", "Gemini", "Ollama", "pgvector", "FAISS", "Chroma", "Embeddings", "Docker / Kubernetes"],
    diagram: ragDiagram("cloud"),
    variants: { cloud: ragDiagram("cloud"), airgap: ragDiagram("airgap") },
  },
  {
    slug: "realtime-alerts",
    title: "Real-Time Alert Pipeline",
    short: "Real-Time Alerts",
    kicker: "Work · Production",
    oneLiner:
      "Fault-tolerant event streaming that delivers clinical alerts to web and mobile within 3 seconds worst case, with ~40% fewer failed or stuck message deliveries.",
    role: "Main engineer on my 4 services. The platform's 15+ services communicate over Kafka.",
    context:
      "The platform's 15+ services talk over Kafka, and clinical alerts have to reach web and mobile clients quickly and reliably.",
    problem:
      "Deliveries could fail or get stuck in queues, and releases couldn't be allowed to interrupt the alert path.",
    metrics: [
      { value: "~40%", label: "fewer failed / stuck deliveries" },
      { value: "≤3 s", label: "alert delivery", detail: "Worst case, not average" },
      { value: "Zero", label: "downtime during updates", detail: "Service updates keep the pipeline live" },
    ],
    hardParts: [
      { title: "Failures without losing alerts", body: "Failed consumers retry, and queue diagnostics flag stuck messages." },
      { title: "A hard latency ceiling", body: "3 seconds is the maximum delay to web and mobile clients, not an average." },
      { title: "Releasing without going dark", body: "Zero-downtime service updates keep the pipeline live during releases." },
    ],
    stack: ["Kafka", ".NET 8 / C#", "gRPC", "SignalR", "React / Redux / TypeScript", "Prometheus"],
    diagram: alertsDiagram,
  },
  {
    slug: "installer-platform",
    title: "On-Prem Installer & Orchestration Platform",
    short: "On-Prem Installer",
    kicker: "Work · Production · Sole owner",
    oneLiner:
      "A .NET 8 installer that deploys and configures all 15+ services on hospital servers, and cut deployment time by 67% (about 2 hours → 40 minutes) across 50+ hospital networks.",
    role: "Sole owner.",
    context: "Every hospital site runs the platform's 15+ services on its own on-prem servers.",
    problem: "On-prem sites are slow, inconsistent and sometimes get interrupted mid-install, and manual installs took hours.",
    metrics: [
      { value: "67%", label: "faster deployments", detail: "About 2 h → 40 min" },
      { value: "50+", label: "hospital networks", detail: "Rolled out" },
      { value: "15+", label: "services per install" },
    ],
    hardParts: [
      {
        title: "Sites that drop mid-install",
        body: "Every stage is a resumable checkpoint, so a failure retries and resumes instead of starting over.",
      },
      { title: "Knowing it actually worked", body: "Dynamic service polling and health checks confirm each service is up." },
      { title: "Help on site", body: "The field-engineer RAG assistant is built into the installer." },
    ],
    stack: [".NET 8 / C#", "Windows Services", "Health checks", "Kubernetes YAML provisioning", "RAG assistant"],
    diagram: installerDiagram,
    beforeAfter: {
      title: "Deployment time",
      before: { label: "Before", value: 120, display: "~2 h" },
      after: { label: "After", value: 40, display: "40 min" },
      delta: "67% faster, across 50+ hospital networks",
    },
  },
];

export const getProject = (slug: string) => workProjects.find((p) => p.slug === slug);
