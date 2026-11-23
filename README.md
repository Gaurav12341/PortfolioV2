# Gaurav Raj · Portfolio

Personal site of Gaurav Raj, Backend & AI Engineer: **https://portfolio.gaurav-raj.in**

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4, with GSAP/ScrollTrigger, Lenis
and Motion for animation. Deployed on Vercel.

## Run it

```bash
bun install
bun dev          # http://localhost:3000
bun run build    # production build (fails on type or lint errors)
```

Create `.env.local` for the collab form (and optional Google Analytics):

```bash
RESEND_API_KEY=      # resend.com, gaurav-raj.in verified as a sending domain
NEXT_PUBLIC_GA_ID=   # optional
```

## Docs (kept locally, not in the repo)

- `docs/CONTENT.md`: where every piece of copy, metric and link lives, and how to edit it
- `docs/SEQUENCE.md`: rebuilding the scroll-sequence frames and portraits
- `docs/LIGHTHOUSE.md`: performance, accessibility and QA results
- `docs/AUDIT.md`: the starting-point audit
- `PHASES.md`: the build plan and content rules
