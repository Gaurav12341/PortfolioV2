# Editing the site's content

Nearly all copy, numbers and links live in `src/content/*.ts` and `src/lib/constants.ts`.
Edit those files and the components pick the changes up. You don't need to touch the
components. Push to `main` (or your production branch) and Vercel redeploys in about a
minute.

**Content rules (from PHASES.md §0):** use only verified numbers (§11), no internal
product or module names or screenshots (NDA), and SupportRAG is "dev environment on
AKS", never "production". Keep em-dashes out of visible copy. Role labels follow the
order Backend → AI → Full-stack.

## Where things live

| What you want to change | File | Key |
|---|---|---|
| Domain, Cal.com username, contact email, social links, résumé path, source repo | `src/lib/constants.ts` | `BASE_URL`, `CAL_USERNAME`, `CONTACT_EMAIL`, `SOCIAL_LINKS`, `RESUME_PATH`, `SOURCE_URL` |
| Hero: status line, name, title, summary, buttons, proof chips | `src/content/hero.ts` | `hero` |
| Text over the portrait at the end of the scroll sequence | `src/content/about.ts` | `aboutIntro` |
| About section: headline, story, stats, stack, principles, recognition, "currently", hobbies | `src/content/about.ts` | `about` |
| Experience timeline (roles, dates, bullet points, stack) | `src/content/about.ts` | `timeline` |
| SupportRAG: summary, video, metrics, decisions, links, architecture diagram | `src/content/supportrag.ts` | `supportRag`, `supportRagDiagram` |
| Work case studies (cards + `/work/[slug]` pages): text, metrics, diagrams | `src/content/projects.ts` | `workProjects`, `platformContext` |
| Contact: heading, availability badge, portrait, topic chips, Cal event | `src/content/contact.ts` | `contact` |
| Scroll-sequence timing and frames | `src/content/sequence.ts` | `sequence` (see `docs/SEQUENCE.md`) |

### Copy that still lives in components

| What | File |
|---|---|
| Page title and description (Google, browser tab), OG/Twitter text | `src/app/layout.tsx` (`TITLE`, `DESCRIPTION`) |
| Share-card images (site and per case study) | `src/app/opengraph-image.tsx`, `src/app/work/[slug]/opengraph-image.tsx` |
| Footer closing line and short bio | `src/components/layout/footer.tsx` |
| Nav links | `src/components/layout/navbar.tsx` (`NAV_LINKS`) |
| Preloader greetings | `src/components/common/preloader.tsx` (`GREETINGS`) |
| Collab form email template | `src/app/api/collab/route.ts` |
| JSON-LD (what Google knows about you) | `src/components/common/structured-data.tsx` |

## Common tasks

**Update a metric.** Find the number in `src/content/` (search for it), change it, and
keep the `label` truthful. Animated counters (`CountUp`) animate the first number in
`value`, so `"~$6K"` and `"<3s"` both work.

**Add a case study.** Copy one object in `workProjects` (`src/content/projects.ts`),
give it a new `slug`, and fill in every field. The tab, the `/work/<slug>` page, its
share card and the sitemap entry are generated from it.

**Replace the résumé.** Overwrite `public/resume.pdf` and keep the filename. Download
buttons and the download tracking already point at it.

**Change the portrait or the scroll frames.** Follow `docs/SEQUENCE.md`. Put the new
`portrait-generated.jpg` in `public/_incoming/`, run `node scripts/make-pan-frames.cjs`,
then the two ffmpeg export commands.

**Change availability.** `hero.status` and `contact.badge`, plus the "Open to
Opportunities" line in `aboutIntro.status`.

**Move to a different domain.** Change `BASE_URL` in `src/lib/constants.ts`. Metadata,
sitemap, robots, JSON-LD, share cards and the email footer all derive from it. Then add
the domain in Vercel (Settings → Domains).

## Environment variables

Set these in `.env.local` for local dev and in Vercel → Project → Settings →
Environment Variables for production:

| Name | Needed for | Notes |
|---|---|---|
| `RESEND_API_KEY` | Collab form emails | resend.com (free tier); `gaurav-raj.in` must be verified as a sending domain. Without it the form shows an error with your email address. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics (optional) | Leave unset to ship no GA tag. Vercel Analytics needs no variable. |

## Checking your change

```bash
bun dev                      # http://localhost:3000
npx tsc --noEmit             # types
npx eslint src               # lint
```

A production build (`bun run build`) also runs types and lint and fails on errors.
Vercel runs the same build, so a broken change never replaces the live site.
