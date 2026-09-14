import React from "react";
import { Timeline } from "@/components/ui/timeline";
import PhraseAnimation from "@/components/common/phrase-reveal";

function ExperienceEntry({
  tagline,
  bullets,
}: {
  tagline: string;
  bullets: string[];
}) {
  return (
    <div>
      <h3 className="text-xs font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
        <PhraseAnimation phrase={tagline} />
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5 text-xs text-muted-foreground md:text-base">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2.5">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExperienceTimeline() {
  const data = [
    {
      title: "Aug 2024 — Present",
      content: (
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            Honeywell — Software Engineer I
          </p>
          <ExperienceEntry
            tagline="From Ambiguous Problems to Production"
            bullets={[
              "Built cloud and air-gapped RAG pipelines (Vertex AI/Gemini, Ollama, pgvector, FAISS, Chroma) delivering under-5-second retrieval for 150+ field engineers.",
              "Built an NL-to-SQL AI agent (Python, FastAPI, PostgreSQL, few-shot prompting) over NurseCall schemas, letting non-technical users self-serve KPI reports.",
              "Automated AI-assisted engineering workflows (GitHub/Jira MCP, TypeScript, Playwright), improving regression coverage and delivery consistency.",
              "Cut release cycles by 50% and manual effort by 60%, saving ~80 engineering hours/month, via CI/CD and deployment automation.",
              "Delivered backend integration through C#/.NET 8 REST and gRPC services connecting React/TypeScript dashboards to real-time healthcare analytics.",
              "Improved distributed-system availability by 40%+ through Kafka orchestration, zero-downtime updates, and resilient service recovery.",
              "Reduced deployment time by 67% (~2 hours → 40 minutes) across 50+ healthcare networks, building a .NET 8 platform orchestrating 15+ services with resumable, recoverable rollout stages.",
              "Modernized secure Keycloak SSO as a scalable .NET workflow — contributed to zero known release defects.",
            ]}
          />
        </div>
      ),
    },
    {
      title: "Jan 2024 — Jul 2024",
      content: (
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            Honeywell — Bachelor Intern Software Engineer
          </p>
          <ExperienceEntry
            tagline="Reliability at Scale, from Day One"
            bullets={[
              "Improved AKS reliability for 1M+ daily requests by optimizing Dockerized services and Kubernetes scaling — earned the 'Dashing Debut' award.",
              "Strengthened observability across 5+ microservices via Prometheus monitoring, incident resolution, and GitHub Actions CI/CD.",
            ]}
          />
        </div>
      ),
    },
    {
      title: "Feb 2023 — May 2023",
      content: (
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            Corizo — Web Development Intern
          </p>
          <ExperienceEntry
            tagline="Where It Started"
            bullets={[
              "Built a real-time full-stack app (Node.js, MongoDB, HTML/CSS, JavaScript, REST APIs) with a responsive UI and Git-based delivery workflow.",
            ]}
          />
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip mt-10">
      <Timeline
        data={data}
        badge="Experience"
        headingLine1="The   Journey"
        headingLine2="So Far"
        subtitle="From a first internship to production systems running across 50+ healthcare networks."
      />
    </div>
  );
}
