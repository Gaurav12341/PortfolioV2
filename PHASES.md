# PHASES.md — Gaurav Raj Portfolio v2

> **For Claude Code.** This is the build plan for upgrading my existing portfolio (currently at `http://localhost:3000`) into a modern, professional, high-quality site that I'll share with recruiters, hiring managers, and LinkedIn.
> Work **one phase at a time**. At the end of each phase: run the app, take screenshots at 1440px and 390px wide, commit with a clear message, and **stop so I can review** before starting the next phase. If something in this plan conflicts with what you find in the repo, tell me first instead of guessing.

---

## 0. Ground rules (read first, apply to every phase)

**Who the site is for:** recruiters and engineering managers hiring for **Software Engineer / Backend / SDE-2 / Applied AI** roles. Within 5 seconds of landing they should know: who I am, what I build, that I'm credible, and how to contact me or download my résumé.

**Positioning line (use everywhere):** *Backend & Applied AI Engineer — I build distributed systems and RAG pipelines that hold up under load.*

**Inspiration, not a clone.** The layout idea comes from a friend's creator portfolio (manndamani.com). Mine is an **engineer's** portfolio, so it must look and read differently:
- Don't reuse their copy (for example "Let's Make Something Awesome Together", "I'd rather let the work do the talking").
- Don't use a logo that looks like theirs. Keep my own mark.
- Swap the creator signals (show reels, Vimeo walls, view counts) for engineering signals: architecture diagrams, metrics, evals, code.

**Content truth rules (strict):**
- Use **only the verified facts and numbers in §11**. Never invent metrics, user counts, or company names.
- Work projects are under NDA. **No real screenshots, internal product or module names, or internal URLs.** Use generic names such as "enterprise analytics dashboard" or "identity service".
- SupportRAG runs in a **dev environment on AKS**. Never call it "production" and never quote p50/p95 latency.

**Tooling rules:**
- Only free tools and libraries. No paid APIs, no paid asset packs.
- Prefer what the repo already uses. Assumed stack is Next.js (App Router) + TypeScript + Tailwind (Phase 0 confirms it).
- Approved libraries you may add if missing: `framer-motion` (or `motion`), `gsap` + `ScrollTrigger`, `lenis`, `lucide-react`, `simple-icons` (tech logos), `@calcom/embed-react`, `geist` (font), `sharp` (build-time image processing).
- Every animation must respect `prefers-reduced-motion` and give a static fallback.
- All animation loops (canvas, video, rAF) pause when off-screen (IntersectionObserver) and when the tab is hidden.

**Quality bar (checked in Phase 9):** Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95, SEO 100. LCP < 2.0 s, CLS < 0.05. No console errors. Works on Chrome, Safari, and Firefox, on desktop and mobile.

---

## Phase 0 — Audit & setup

1. Read the whole repo. Write `docs/AUDIT.md` covering: framework and versions, folder structure, every section component and its file, animation libraries in use, asset folders and their sizes (flag anything over 500 KB), the current fonts and colours, and the custom cursor implementation.
2. Run the dev server. Screenshot every section at 1440px and 390px into `docs/screens/before/`.
3. List current problems you can see. Known ones:
   - The hero background video (person using a mouse) looks amateur.
   - SupportRAG is missing from the projects section.
   - The scroll image sequence has only ~27 real frames (`AboutSection_00001…00027.jpg`). Frames 28–46 repeat a generated image under a black blur overlay.
   - On the booking section, the info card (white/pale text on pink) is nearly unreadable, and the hero image is copyrighted anime character art, which has to go.
   - The nav has only a hamburger, a logo, and a theme toggle, with no visible links or résumé button.
4. Create a branch `portfolio-v2`. Create `public/_incoming/` for the assets I'll drop in (see §10), and add it to `.gitignore` except for a README listing the expected files.
5. **Stop and show me AUDIT.md.**

---

## Phase 1 — Design system & foundations

**Tokens** (CSS variables in `globals.css`, mapped into the Tailwind theme):

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F3E9E6` (soft blush, keep the current vibe) | `#0B0A0D` |
| `--surface` | `#FFFFFF` at 60% + backdrop blur | `#15131A` |
| `--text` | `#141216` | `#F2EEF0` |
| `--muted` | `#5E5660` | `#A39BA6` |
| `--accent` | `#E11D48` (crimson) | `#FB3B64` |
| `--line` | `rgba(20,18,22,.08)` | `rgba(255,255,255,.08)` |

- Body text must have ≥ 4.5:1 contrast on its background in **both** themes. Verify it, and fix the booking card that currently fails.
- **Type:** Geist Sans for UI and headings, Geist Mono for tech labels, metrics, and diagram nodes. Headings tight (`tracking-tight`, weight 600–700). Fluid sizes with `clamp()`. Drop Poppins.
- **Grid:** keep the faint background grid. It reads as "engineering paper" and suits the theme.
- **Motion primitives** (`components/motion/`): `Reveal` (fade + 12px rise, staggered), `SplitText` (line-by-line reveal for headings), `CountUp` (numbers on enter), `Magnetic` (subtle pull on buttons). One shared easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Durations 0.4–0.8 s. Nothing bouncy.
- **Smooth scroll:** Lenis, synced with GSAP ScrollTrigger. Disable it when reduced motion is on.
- **Cursor:** keep the custom cursor but make it subtler (small dot plus a lagging ring that grows over links). Hide it on touch devices and under reduced motion.
- **Nav:** a floating pill at the top with logo · Work · About · Contact · **Résumé** (accent button that downloads the PDF) · theme toggle. On mobile, collapse into the hamburger with a full-screen sheet. Highlight the active section while scrolling.
- **Theme:** default to the system preference and remember the choice. No flash of the wrong theme on load.

---

## Phase 2 — Hero rebuild (replaces the mouse video)

**Decision:** drop the video entirely. Build a **typographic hero over a live "system graph" canvas**. It loads instantly, stays sharp on any screen, and visually says "distributed systems + AI" before anyone reads a word. A stock or AI video says nothing about me and costs a few MB.

**Layout (desktop):**
- Small status pill: `● Open to SDE-2 / Backend / Applied AI roles · Bengaluru`
- H1 (SplitText reveal): **Gaurav Raj**
- H2: *Backend & Applied AI Engineer*
- One line: *I build distributed systems and RAG pipelines that hold up under load — .NET, Kafka, Kubernetes, Python.*
- CTAs: `View work` (primary, scrolls to work) · `Download résumé` (secondary) · `Book a call` (text link)
- A row of 3 proof chips in mono: `Production RAG · 150 field engineers` · `Agentic PDLC · ~$6K saved/release` · `20s → <3s dashboard queries`
- A small scroll cue at the bottom.

**Background canvas: `components/hero/SystemGraph.tsx`**
- A 2D canvas (no Three.js needed) covering the hero, drawn at device pixel ratio.
- 14–20 nodes in loose clusters, each a small rounded rect or dot with an optional faint mono label (`producer`, `orders.topic`, `consumer-grp`, `api-gw`, `postgres`, `redis`, `qdrant`, `llm`). Thin edges between them in `--line`.
- "Packets" (2–3px accent dots) travel along edges in sequence, as if messages are flowing through a pipeline. About 6–10 packets at once, with occasional bursts.
- Nodes drift slowly (a few px of sine wobble). The cursor gently bends nearby edges or lights up the nearest node. Keep it subtle.
- Overall opacity is low (graph at about 35%) so the text stays dominant. A radial fade keeps the centre behind the text calm.
- Pause off-screen and in hidden tabs. Under reduced motion, render one static frame.
- Mobile: about 8 nodes, no cursor interaction, lower frame budget (cap at 30 fps).

**Acceptance:** the H1 text is the LCP element. The hero is interactive in under 1 s on a mid-range phone. The canvas never drops the main thread below 50 fps on desktop.

---

## Phase 3 — Featured project: SupportRAG (with demo video)

This is the strongest proof for AI roles. It gets its own **featured section** above the work projects.

> **Don't mix these up:** SupportRAG is my **personal, advanced RAG project** (public docs, eval harness, dev on AKS). It is **not** the production RAG system I built at work for field engineers. That one is a separate work case study in Phase 4 (project 2). Never mix their facts or numbers.

**Asset prep** (I'll download the demo from Google Drive into `public/_incoming/supportrag-demo.mp4`). Then run:
```bash
# 1080p H.264, web-optimized (moov atom at front for instant start)
ffmpeg -i public/_incoming/supportrag-demo.mp4 -vf "scale='min(1920,iw)':-2" -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k public/videos/supportrag.mp4
# WebM/VP9 alternative (smaller on Chrome/Firefox)
ffmpeg -i public/_incoming/supportrag-demo.mp4 -vf "scale='min(1920,iw)':-2" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -c:a libopus -b:a 64k public/videos/supportrag.webm
# Poster frame (pick a frame showing an answer with citations; adjust -ss)
ffmpeg -ss 00:00:05 -i public/videos/supportrag.mp4 -frames:v 1 -q:v 3 public/videos/supportrag-poster.jpg
```
If `supportrag.mp4` comes out over ~15 MB, tell me. We'll either shorten it or host it on a free CDN (Cloudinary free tier) instead of `public/`.

**Video player: `components/media/DemoVideo.tsx`**
- `<video>` with WebM and MP4 sources, poster, `playsInline`, `preload="metadata"`.
- Autoplays **muted** and loops only while ≥ 50% in view, and pauses when scrolled away. Under reduced motion it never autoplays and shows a big play button instead.
- Custom controls in a glass bar that appears on hover/focus and stays visible on touch: **play/pause**, **mute/unmute** (unmuting is a user action, so the browser allows sound), a scrubbable progress bar, time, and fullscreen.
- Keyboard: `Space`/`K` play/pause, `M` mute, `←/→` seek 5 s, `F` fullscreen. Every control has an `aria-label`. Visible focus rings.
- Framed in a browser-window mock (three dots + `supportrag · dev` label) with soft shadow and rounded corners.

**Section layout:**
- Eyebrow `Featured project` → title **SupportRAG** → one line: *A citation-grounded troubleshooting copilot over 5,400 pages of Kubernetes, PostgreSQL, Kafka and GitHub Actions docs. It refuses when the docs have no fix.*
- Left (or top on mobile): the DemoVideo.
- Right: 4 metric cards with CountUp:
  - `57.5% → 82.5%` answer accuracy (same 400 questions, vs. dense-only baseline)
  - `78.9%` one-shot holdout (30/38, 95% CI 63.7–88.9%)
  - `82 / 82` unanswerable questions correctly refused
  - `~82 ms` retrieval per answered query · `$0` running cost
- Below: the **pipeline diagram** built with the shared `ArchDiagram` component from Phase 4: Ingest → Clean/Dedup → PII & secret masking → 500-token chunks + access labels → bge-small embeddings → Qdrant + BM25 → RRF fusion with access filter → parent-section expansion → schema-constrained writer (Groq gpt-oss-120b) → claim checker (gpt-oss-20b) → output guardrails → FastAPI + Gradio UI with citations. Local Qwen2.5 appears as a failsafe branch.
- An "Engineering decisions" accordion: *what I tried and turned off* (cross-encoder reranker, bge-m3, heading-aware chunking, HyDE, contextual chunk prefix, agentic retry loop) and *why*. Hiring managers love evidence of ablations.
- Stack chips: Python · FastAPI · Qdrant · BM25/RRF · Groq · Docker · AKS (dev) · JWT.
- Buttons: `GitHub repo` (github.com/Gaurav12341/SupportRAG) · `Read the eval write-up` (link to README section).

---

## Phase 4 — Work case studies with animated architecture diagrams

My Honeywell work can't show real UI, so **the diagram is the hero image** of each case study.

### 4a. Shared component: `components/diagram/ArchDiagram.tsx`
Data-driven, with one JSON or TS spec per project:
```ts
type Node = { id: string; label: string; kind: 'service'|'queue'|'db'|'cache'|'client'|'llm'|'gateway'|'agent'|'human'; x: number; y: number; note?: string };
type Edge = { from: string; to: string; label?: string; style?: 'sync'|'async'|'dashed' };
type Step = { title: string; body: string; highlight: string[] /* node/edge ids */ };
type DiagramSpec = { nodes: Node[]; edges: Edge[]; steps: Step[]; viewBox: string };
```
- Rendered as **SVG** (crisp at any zoom, accessible, no images). Nodes are rounded cards with a lucide icon per `kind` and a mono label. Edges are smooth paths: async edges dashed with the dashes animating, sync edges solid.
- **Packets:** small accent dots travel along highlighted edges (SVG `offset-path` or framer-motion path animation).
- **Scroll-synced storytelling (desktop):** the diagram is sticky on one side while the step text scrolls on the other. Each step highlights its nodes and edges, dims the rest to 25%, and fires packets along the active path.
- **Mobile:** the diagram sits on top and the steps become a swipeable/tappable stepper below it.
- Hover/tap a node to see a tooltip with its `note`.
- Reduced motion: no packets. Highlighting switches instantly.
- Accessibility: `role="img"`, an `aria-label` summary, and a visually hidden ordered list of the steps.

### 4b. Optional component: `components/diagram/BeforeAfter.tsx`
Two animated bars or timelines for performance stories (for example a 20 s bar shrinking to < 3 s) with a toggle.

### 4c. Case-study card + detail
- **Work grid:** cards show title, a one-line outcome, a headline metric, and stack chips. A mini, non-animated version of the diagram is the card thumbnail.
- **Detail** (route `/work/[slug]` with shared-element transition, or a full-screen modal — pick whichever fits the current routing). Sections: **Context** → **Problem** → **Constraints** → **Approach** (the scroll-synced ArchDiagram) → **Impact** (metric cards) → **Stack** → **My role** → **What I'd do next**.
- Add a small NDA note at the bottom of each detail: *"Details generalized; no proprietary code or UI shown."*

### 4d. Projects to build (facts in §11; ask me for any field marked ❓)
1. **Dashboard query performance:** GraphQL filtering + pagination and Redis caching on an enterprise analytics/user-management dashboard. 50K records, **20 s → < 3 s**. Diagram: Client → API gateway → GraphQL service → Redis (cache hit path) / PostgreSQL (miss path). Use BeforeAfter.
2. **Production RAG assistant for field engineers (work):** used by **~150 field engineers** in production. This is a different system from SupportRAG. ❓ I'll give you the specifics: what it answers, data sources, retrieval stack, LLM, guardrails, and the impact metric. Draft the skeleton now: field engineer → chat UI → API → retriever over internal manuals/docs → LLM → cited answer, plus a feedback loop. Label it **Production** (allowed here, unlike SupportRAG).
3. **MongoDB → PostgreSQL migration:** **5+ microservices** migrated, schemas redesigned, factory pattern to abstract data access. Diagram: services → repository factory → Mongo adapter / Postgres adapter, with a migration/backfill step and a cutover step.
4. **End-to-end agentic PDLC workflow (flagship work case study).** Make this the **first and largest card** in the work grid, with the richest detail page.
   - **One-liner:** *Designed and built a human-in-the-loop agent pipeline that takes a product idea from requirements to tested code, with agents in GitHub Copilot and Atlassian Rovo wired to Jira, Confluence, GitHub, SharePoint and Outlook.*
   - **Impact cards:** `~$6K saved in one release` · `24 stories` · `60+ test cases` · `Adopted by multiple teams`.
   - **Diagram (use a 3-lane swimlane layout plus an integration bus underneath):**
     - **Lane 1: Requirements (Atlassian Rovo agents + GitHub Copilot).** Input idea/brief → **MRS** agent → **PRS** agent → **Epic** agent → **Story** agent → stories created in Jira. A human review gate sits between each artifact.
     - **Lane 2: Development (GitHub Copilot).** Jira story pulled via MCP → Copilot with **custom skills + custom instructions** (repo conventions, architecture rules) → code + PR on GitHub → human code review.
     - **Lane 3: Testing.** **Rovo Test agent** generates test scenarios from the story → **GitHub Copilot** turns the scenarios into **Playwright** scripts → automated web tests run → results linked back to the Jira story.
     - **Integration bus** (bottom band; packets flow up into the lanes): **MCP** (GitHub Copilot ↔ Jira/GitHub) · **Atlassian API tokens** (Jira, Confluence REST) · **Confluence** (requirement docs) · **SharePoint** (source docs) · **Outlook via COM automation** (notifications/approvals by email).
   - **Scroll story steps:** 1) brief in → requirements chain → 2) human approves MRS/PRS → 3) epics and stories land in Jira → 4) Copilot builds against the story with skills and instructions → 5) Rovo test agent writes scenarios → 6) Copilot generates Playwright scripts → 7) tests run and results flow back to Jira, with Outlook notifying stakeholders.
   - **"Hard parts" accordion** (good interview material): connecting tools without admin access (API tokens, COM for Outlook instead of MS Graph), keeping humans in control at every gate, making agent output consistent via custom instructions/skills, traceability from requirement → story → code → test.
   - Stack chips: GitHub Copilot (agents, skills, custom instructions) · Atlassian Rovo · MCP · Jira · Confluence · SharePoint · Outlook (COM) · Playwright · Atlassian REST API.
   - ❓ Ask me: the exact number of agents per lane, whether Claude was part of it (an older résumé line says "GitHub Copilot, Claude and Jira MCP"), and whether "adopted by multiple teams" needs a number.
5. **Kafka event reliability:** ❓ I'll give you the specifics (retries, DLQ, idempotency, ordering, the metric). Draft the diagram skeleton now: producers → topic partitions → consumer group → retry topic → DLQ → monitoring.
6. **API Gateway security / SSO modernization:** ❓ specifics to come. Skeleton: client → API gateway (authN/Z, rate limit) → identity provider (SSO/OIDC) → downstream services.
7. **NL-to-SQL agent:** ❓ specifics to come. Skeleton: user question → schema retriever → LLM SQL writer → validator/guard (read-only, allow-listed tables) → database → answer + SQL shown.

For ❓ projects: build the card and diagram with clearly marked `TODO` text, and **list exactly which facts you need from me**. Don't fill in numbers.

---

## Phase 5 — Fix the scroll portrait sequence (About intro)

**Decision:** don't interpolate between the real frames and the AI portrait. RIFE/FILM interpolation only works between frames with similar pose, lighting and background. Going from a real photo to a generated image produces a ghosted, morphing cross-dissolve, which is basically what the black blur is hiding now. Instead:

**New sequence = real frames 1–27 (scrubbed) → crisp mask reveal → generated portrait with 2.5D depth parallax.** No black blur anywhere.

1. **Remove** frames 28–46 and the black blur overlay code.
2. **Optimize the real frames** (and check they share the same resolution and crop):
   ```bash
   mkdir -p public/sequence
   ffmpeg -start_number 1 -i public/_incoming/frames/AboutSection_%05d.jpg -frames:v 27 -vf "scale=1600:-2" -c:v libwebp -quality 78 public/sequence/f_%03d.webp
   ```
   Also make a 900px-wide set for mobile (`public/sequence/m/`). Pick the set by viewport.
3. **Scrub:** `<canvas>` pinned with GSAP ScrollTrigger over about 150vh. Map scroll progress 0 → 0.7 to frames 1 → 27 with smoothing (`scrub: 0.5`). Preload frame 1 eagerly and the rest progressively. Draw with `object-fit: cover` maths so nothing stretches.
4. **Transition (progress 0.7 → 0.85):** reveal the generated portrait with a **clip-path mask**. Default is a circle expanding from the face; alternative is a vertical wipe with a 1px accent line. Frame 27 and the portrait must be aligned (face roughly the same position and scale). Add an alignment offset config and let me tweak it.
5. **Depth parallax on the portrait (progress 0.85 → 1):**
   - I'll create `portrait-depth.png` with the free **Depth Anything V2** Hugging Face Space and `portrait-subject.png` (background removed with `rembg` locally or Photopea).
   - **Default:** two-layer parallax. The subject layer and background layer move at different speeds on scroll and mouse (max ±12px), plus a slow 1.00 → 1.04 scale. Simple and robust.
   - **Stretch (only if the default looks good and perf allows):** a small WebGL fragment shader that displaces UVs by the depth map. Same subtle motion, with a fallback to the two-layer version.
6. The About heading and intro line fade in over the portrait at the end. Then the pin releases into the About content.
7. Reduced motion: show the final portrait statically. No pinning.

**If I later reshoot** (3–4 s of the full motion on my phone, steady, same light), the pipeline above should just accept more frames. Keep the frame count configurable.

---

## Phase 6 — About section upgrade

Turn it from "okay" into the section that makes a manager want to talk to me.

1. **Headline**, specific rather than generic. Options to show me: *"I like systems that stay boring at 3 a.m."* / *"Backend engineer who measures before he optimizes."* / *"I build things that keep working when the traffic doesn't behave."*
2. **Short story** (3 short paragraphs, under 120 words in total): who I am (backend at Honeywell, ~2 years), what I do (.NET microservices, Kafka, Kubernetes, PostgreSQL, Redis), where I'm heading (applied AI: RAG, evals, agent workflows), and how I work (measure → fix → verify).
3. **Stat row** (CountUp): `2+ yrs` building backend systems · `150` field engineers on my production RAG · `20s → <3s` dashboard latency · `~$6K` saved by my agentic PDLC pipeline in one release.
4. **Stack, grouped** with simple-icons logos and mono labels: Backend (.NET/C#, Python, FastAPI, GraphQL, REST) · Data & streaming (Kafka, PostgreSQL, MongoDB, Redis, Qdrant) · Cloud & DevOps (Docker, Kubernetes, AKS, CI/CD) · AI (RAG, LLM evals, Claude Agent SDK, MCP, Groq). A slow marquee on desktop, a wrapped grid on mobile.
5. **Timeline** (vertical, with a line that draws on scroll): SRM Institute of Science & Technology → Honeywell intern → Honeywell Software Engineer, with 1–2 lines each. ❓ I'll confirm dates.
6. **Recognition strip:** Top Performer of the Month · Bronze & Win Together awards (zero-defect releases, SSO modernization) · Six Sigma Green Belt · Claude Academy badges (Claude Code in Action, MCP Advanced Topics, Human-Agent Teams) · Google Cohort Hackathon.
7. **"How I work":** 3 principle cards with one line each (for example *Measure first*, *Design for failure*, *Ship small, verify always*).
8. A **"Currently"** line: *Exploring agent evals and retrieval quality* (editable in a content file).

---

## Phase 7 — Booking / Contact restyle

**Problems now:** a low-contrast ghost card, copyrighted anime art, borrowed heading copy, and a popup-only booking button.

**New layout (2 columns on desktop, stacked on mobile):**
- **Heading** (my own copy): **"Hiring for backend or applied AI? Let's talk."** Sub: *Pick a 30-minute slot, or reach me directly. I reply within a day.*
- **Left column:**
  - My **anime-style portrait** (`public/images/portrait-anime.webp`, which I'll generate; see Appendix A) in a tall rounded card, with a subtle accent glow behind it and slow float/parallax.
  - Badge: `● Available for SDE-2 / Backend / Applied AI roles`.
  - Topic chips (they prefill the Cal.com notes field): `Full-time role` · `Referral` · `Applied AI collab` · `Just saying hi`.
  - Direct links as solid, readable buttons: **Email** (click copies the address, with a toast), **LinkedIn**, **GitHub**, **Résumé PDF**.
- **Right column:** an **inline Cal.com embed** (`@calcom/embed-react`, `30min` event) in a surface card, about 640px tall, themed to match:
  - Pass `config={{ theme: currentTheme }}` and set the brand colour to `--accent` (Cal embed UI config: `cssVarsPerTheme` / `styles.branding.brandColor`). Re-init when the theme toggles.
  - Show a skeleton loader until the embed is ready. If it fails to load, fall back to the "Open booking page" button.
- Every text element passes WCAG AA contrast in both themes.

---

## Phase 8 — Footer, SEO, sharing

- **Footer:** big "Let's build something reliable." line, social links, `© 2026 Gaurav Raj`, a "Built with Next.js · source on GitHub" note, and a back-to-top button.
- **Metadata:** title `Gaurav Raj — Backend & Applied AI Engineer`, plus a description, canonical URL, and `theme-color` per theme.
- **OG/Twitter image:** generate with `next/og` (1200×630): name, title, 3 proof chips, accent graph motif. Check the preview looks right (LinkedIn caches it, so get it right before sharing).
- JSON-LD `Person` schema (name, jobTitle, worksFor, alumniOf, sameAs: LinkedIn/GitHub).
- `sitemap.xml`, `robots.txt`, favicon set from my logo.
- Résumé at `/resume.pdf` (file from `_incoming/`). Track downloads with Vercel Analytics (free) or Umami.

---

## Phase 9 — Performance, accessibility, QA

- Images: `next/image` everywhere possible, AVIF/WebP, correct `sizes`. Lazy-load everything below the fold. No asset over 300 KB except the video.
- Fonts: `next/font` with `display: swap`. Preload only the hero weights.
- Code-split heavy components (SystemGraph, ArchDiagram, DemoVideo, Cal embed) with `dynamic()`, and load them on view.
- Run Lighthouse (mobile + desktop) and fix until the targets in §0 pass. Save the reports to `docs/lighthouse/`.
- Accessibility: keyboard-only walkthrough of the whole page (visible focus, logical order, a skip-to-content link), screen-reader labels on all icon buttons, alt text on all images, reduced motion verified.
- Playwright screenshot pass at 390, 768, 1280 and 1440 px, light + dark, into `docs/screens/after/`. Compare against `before/` and send me a summary.
- Test Safari specifically (video autoplay, canvas DPR, `offset-path`, backdrop-blur).

---

## Phase 10 — Deploy

- Deploy on **Vercel Hobby** (free). Set the production URL in metadata.
- Optional: a custom domain (I'll decide). Otherwise use `gauravraj.vercel.app` or similar.
- After deploy: re-run Lighthouse on the live URL, test the OG preview with LinkedIn Post Inspector, and test the Cal booking end to end.
- Write `docs/CONTENT.md` explaining how I can edit copy, projects and metrics later without touching components (all content in `content/*.ts`).

---

## 10. Assets I will provide (in `public/_incoming/`)

| File | Source | Used in |
|---|---|---|
| `supportrag-demo.mp4` | my Google Drive (downloaded manually) | Phase 3 |
| `frames/AboutSection_00001…00027.jpg` | existing real frames | Phase 5 |
| `portrait-generated.png` | existing generated portrait | Phase 5 |
| `portrait-subject.png`, `portrait-depth.png` | rembg/Photopea + Depth Anything V2 (HF Space) | Phase 5 |
| `portrait-anime.png` | generated with the Appendix A prompt | Phase 7 |
| `resume.pdf` | my latest résumé | Phases 1, 8 |
| Facts for the ❓ items | me | Phases 4, 6 |

## 11. Verified facts (the only numbers you may use)

- **Me:** Gaurav Raj, Software Engineer at Honeywell, Bengaluru. ~2 years. .NET, distributed systems, Kafka, Kubernetes, RAG/AI apps. SRM Institute of Science & Technology.
- **Dashboard performance:** GraphQL filtering + pagination, Redis caching, 50K records, 20 s → under 3 s.
- **Migration:** 5+ microservices MongoDB → PostgreSQL, schemas redesigned, factory design pattern for data access.
- **Agentic PDLC workflow (work):** human-in-the-loop pipeline. Requirements agents (MRS, PRS, Epic, Story) in Atlassian Rovo + GitHub Copilot. Development with GitHub Copilot custom skills + custom instructions. Testing with a Rovo Test agent generating test scenarios and GitHub Copilot generating Playwright scripts for automated web testing. Integrations: MCP (GitHub Copilot ↔ Jira/GitHub), Atlassian API tokens, Jira, Confluence, SharePoint, Outlook via COM automation. ~$6K saved in one release, 24 stories, 60+ test cases, adopted by multiple teams.
- **Production RAG (work):** used by ~150 field engineers in production. Everything else ❓, so ask me. Separate from SupportRAG.
- **SupportRAG** (personal, Oct 2026, dev on AKS): ~5,400 public doc pages. Hybrid dense + BM25 with RRF in Qdrant. Access filters on both searches. Groq gpt-oss-120b writer + gpt-oss-20b claim checker, local Qwen2.5 failsafe. Accuracy 57.5% → 82.5% on the same 400 questions. Holdout 78.9% (30/38, 95% CI 63.7–88.9%). 82/82 unanswerable refused. 108-question reference set, LLM-judge with 29/30 hand-label agreement. ~82 ms retrieval per answered query. $0 cost. **Never** "production", **never** p50/p95.
- **Recognition:** Top Performer of the Month; Bronze and Win Together awards (zero-defect releases, SSO modernization, cross-functional delivery); Six Sigma Green Belt; Claude Academy badges (Claude Code in Action, MCP Advanced Topics, Human-Agent Teams); Google Cohort Hackathon.
- Anything else → ask me.

---

## Appendix A — Anime portrait prompt (for the booking section)

**Tool (free):** Google Gemini (image generation/editing with a reference photo). Alternatives: ChatGPT free tier image generation, or Microsoft Copilot / Bing Image Creator. Upload 1–2 clear, front-lit photos of my face (chest-up, neutral background).

**Prompt:**
> Transform the person in the reference photo into an original modern anime illustration, keeping his real facial features recognizable: face shape, eyes, eyebrows, nose, jawline, hairstyle and hair length, skin tone, and any facial hair exactly as in the photo. Style: clean, high-end Japanese anime key-visual look, crisp line art, cel shading with soft gradient highlights, cinematic rim light. Pose: chest-up, three-quarter view turned slightly to the left, calm confident expression, eyes looking just past the camera. Outfit: plain black crew-neck tee under an open dark charcoal overshirt. No logos, symbols, headbands or accessories. Lighting: warm key light from the front-right, a crimson (#E11D48) rim light on hair and shoulder edges, deep plum shadows. Background: a flat, plain soft blush colour (#EBD9D5) with no objects, so it's easy to cut out. A few faint diagonal speed-line strokes on the left side only. Colour palette limited to blush, crimson, charcoal, plum and natural skin tones. Vertical 2:3 composition with the head in the upper third and space above the hair. Ultra-detailed, sharp, 2048×3072. No text, no watermark, no signature, and not a resemblance to any existing anime character.

**Follow-ups if needed:**
- "Keep everything the same but make the face resemble the reference photo more closely, especially the eyes and jawline."
- "Same image, dark-mode version: background #0B0A0D, crimson rim light stronger."
- Then remove the background (rembg / Photopea), export as PNG with transparency, and convert to WebP at about 1200px tall.

## Appendix B — Free tools used

ffmpeg (video/frames) · DaVinci Resolve (optional video edits) · Google Gemini / ChatGPT free / Bing Image Creator (images) · rembg or Photopea (background removal) · Depth Anything V2 on Hugging Face Spaces (depth map) · Squoosh (image compression) · Excalidraw (sketching diagrams before coding) · Lucide + Simple Icons (icons) · Geist via `next/font` · Cal.com free · Vercel Hobby · Vercel Analytics / Umami.
