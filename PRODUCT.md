# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters, hiring managers, and engineering leads evaluating Gaurav Raj for mid-level Software Engineer / Backend / SDE-2 / Applied AI roles — primarily targeting Bengaluru, with openness to Hyderabad and Pune, remote/hybrid depending on the role. They are scanning quickly for evidence of production backend/distributed-systems ownership and want to decide fast whether to reach out.

Secondary: engineering peers, collaborators, or technical contacts researching his work (e.g. before an interview or a professional connection).

## Product Purpose

A personal portfolio site for Gaurav Raj, a Software Engineer I at Honeywell (~2 years experience), presenting him primarily as a backend/distributed-systems engineer who also ships production applied-AI systems. Success means a qualified visitor (recruiter/hiring manager) comes away convinced of his backend credibility and takes a contact action (message, resume download, or interview request).

## Positioning

**Backend/distributed-systems engineer who is fluent in applied AI — not an "AI-first" engineer.** The differentiator a generic "AI engineer" portfolio cannot truthfully claim: production ownership of microservices, deployment platforms, and messaging/queue systems running in real enterprise and air-gapped, on-premise environments across 50+ healthcare networks — with applied AI (RAG, NL-to-SQL, agents) built as reliable production workflows on top of that infrastructure, not as notebook experiments.

- Primary framing (default, all pages except an explicit AI/ML/LLM-titled context): "Backend Software Engineer building distributed systems and cloud platforms — with hands-on experience shipping production AI/RAG systems on top of them."
- Short tagline: "Software Engineer | Distributed Systems & Cloud Platforms"
- Secondary framing (AI-context pages/sections only): "Applied AI engineer who ships — RAG pipelines, AI agents, and retrieval systems wired into real backend infrastructure, not just notebooks."

## Operating Context

Visitors typically skim first (hero, tagline, headline metrics) then optionally go deep into case-study pages framed as problem → approach → outcome. The site needs a contact path (form-gated, per the constraint below), a resume download, and case-study depth for the 5 project stories drawn from real Honeywell/Corizo work. Company-confidential specifics in those stories are generalized, never fabricated.

## Capabilities and Constraints

- **Framing rule:** backend-first identity on every page/section by default; only flip to AI-first framing when the context is explicitly an AI/ML/LLM-titled role or page.
- **Truthfulness rule:** every claim must be interview-defensible. Do not invent achievements, testimonials, benchmarks, or client stories.
- **Depth-of-claim rule:** AWS, Vue.js, Next.js, and RabbitMQ may be listed as "worked with"/"familiar with" but must never anchor a project story implying deep production ownership — those are: Kafka, GCP/Vertex AI, Azure AKS, FastAPI, .NET 8/ASP.NET Core, ReactJS/Redux (Honeywell production), pgvector/FAISS/Chroma.
- **Privacy constraint:** the phone number must never appear as plaintext on a public page — gate it behind a contact form or click-to-reveal. Prefer a mailto/obfuscated email link over plaintext email to reduce spam.
- **Voice constraint:** confident, concrete, metrics-driven; no buzzword salad ("passionate", "ninja", "rockstar"); plain language about what was built, what changed, what was used.
- **Template debt (existing codebase, not product truth but must be resolved before ship):** this repo is a Next.js template currently wired to placeholder content — Unsplash/Picsum images, `public/ichigo.png`, placeholder testimonials/showreel entries, a 47-frame "scroll scrub" that is currently a slideshow of seeded Picsum images rather than a true frame sequence, missing favicon/OG image/logo. None of this placeholder content may be presented as real evidence.
- **Contact method (decided):** a gated contact form is the site's contact path; no plaintext phone or email on the page.
- **Open-to-work section (decided):** the site includes an explicit "open to work" / role-targeting callout (target roles/locations per Users, above).
- **Beyond-work section (decided):** the site includes a "beyond work"/hobbies section; content is still pending from the user (see Evidence on Hand).

## Brand Commitments

- Name: Gaurav Raj.
- Domain: https://portfolio.gaurav-raj.in
- LinkedIn: https://www.linkedin.com/in/gaurav-raj-405a96237/
- Voice: confident, concrete, metrics-driven, not hype-y (see Capabilities and Constraints).

## Evidence on Hand

**Confirmed work history:**
- Honeywell — Software Engineer I (Aug 2024–Present): air-gapped/cloud RAG pipelines (Vertex AI/Gemini, Ollama, pgvector, FAISS, Chroma) for 150+ field engineers, sub-5s retrieval; NL-to-SQL AI agent over NurseCall schemas; AI-assisted engineering workflow automation (GitHub/Jira MCP, TypeScript, Playwright); release cycles cut 50%, manual effort cut 60% (~80 eng-hours/month saved); C#/.NET 8 REST and gRPC services connecting React/TypeScript dashboards to real-time healthcare analytics; distributed-system availability improved 40%+ via Kafka orchestration; deployment time cut 67% (~2h → 40min) across 50+ healthcare networks via a .NET 8 platform orchestrating 15+ services; Keycloak SSO modernization with zero known release defects.
- Honeywell — Bachelor Intern Software Engineer (Jan–Jul 2024): AKS reliability for 1M+ daily requests ("Dashing Debut" award); observability across 5+ microservices via Prometheus, GitHub Actions CI/CD.
- Corizo — Web Development Intern (Feb–May 2023): real-time full-stack app (Node.js, MongoDB, HTML/CSS, JavaScript, REST APIs).

**Case-study candidates (problem → approach → outcome, generalized where confidential):**
1. Air-Gapped RAG Assistant for Field Engineers
2. NL-to-SQL Reporting Agent
3. Zero-Downtime Deployment Platform (15+ services, 50+ healthcare networks)
4. Distributed Messaging Reliability (Kafka)
5. Secure SSO Modernization (Keycloak)

**Education:** B.Tech CSE (Software Engineering), SRM Institute of Science & Technology, 2020–2024, CGPA 9.44/10.

**Achievements:** Top Performer of the Month, Honeywell Bronze and "Win Together" recognitions, "Dashing Debut" award, 3 Bravo Awards, McKinsey Forward Program, Google Cohort Hackathon, GitHub Copilot Hands-on Training (Microsoft-led).

**Explicit absences — do not fabricate, must come from the user before ship:**
- Personal bio/story paragraph (why software, narrative hook)
- Headshot/photo
- GitHub profile link / public repos to showcase
- Hobbies/interests content for the "beyond work" section (section is confirmed to ship; content not yet provided)
- Testimonials or quotes from managers/colleagues
- Resume PDF link/download target

## Product Principles

1. Backend/distributed-systems identity leads everywhere; applied AI work is presented as one of the things he builds, not the headline — flip only for explicitly AI/ML/LLM-titled contexts.
2. Every claim must be interview-defensible and metrics-backed; never invent achievements, testimonials, or imply production depth on tools marked "familiar with" only (AWS, Vue.js, Next.js, RabbitMQ).
3. Real work is generalized when confidential, never fabricated — the 5 documented case studies are the ceiling for project depth until more evidence is provided.
4. Protect personal contact information by construction: no plaintext phone number anywhere; prefer a form or obfuscated/mailto link over plaintext email.
5. Ship truthfully incomplete rather than fake-complete: template placeholder media, testimonials, and copy must never be passed off as real content — replace or clearly omit until genuine assets exist.
