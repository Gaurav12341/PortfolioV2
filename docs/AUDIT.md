# Phase 0: Audit (portfolio-v2)

_Date: 2026-11-22 · Branch: `portfolio-v2` · Screenshots were taken at 1440×900 and 390×844 (dark theme) and later deleted: only markdown is kept in the repo_

---

## 1. Framework & versions

| Thing | Version / value |
|---|---|
| Framework | **Next.js 15.5.14** (App Router, `next dev --turbopack`) ✅ matches the plan's assumption |
| React | 19.1.2 |
| Language | TypeScript 5 (`ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` in `next.config.ts` ⚠️) |
| Styling | **Tailwind CSS 4.2** (`@tailwindcss/postcss`, CSS-first `@theme inline` in `globals.css`), `tw-animate-css`, shadcn/ui (`components.json`) |
| Package manager | **bun** (`bun.lock`) |
| Animation | `motion` / `framer-motion` 12.35 (15 files import `framer-motion`, 2 import `motion/react`; `framer-motion` is a transitive dep, not declared in package.json), `gsap` 3.14 + `ScrollTrigger` + `@gsap/react`, `lenis` 1.3.18 |
| Already installed from the approved list | `motion`, `gsap`, `lenis`, `lucide-react`, `@calcom/embed-react` |
| Missing from the approved list | `geist`, `simple-icons`, `sharp` (Next pulls in sharp itself for image optimization) |
| Installed but unused / heavy | `three`, `ogl`, `@paper-design/shaders-react`, `recharts`, `embla-carousel*`, `cmdk`, `vaul`, `react-day-picker`, `input-otp`, `rough-notation`, `@tabler/icons-react`, `react-resizable-panels`, plus ~20 Radix packages. Pruning candidates for Phase 9. |
| Other | `resend` (contact form at `/api/collab`), `react-icons` (footer social icons), `next-themes` |

## 2. Folder structure

```
src/
  app/            layout.tsx, page.tsx ("use client", the whole home page), globals.css,
                  icon.tsx (next/og favicon), manifest.ts, sitemap.ts, api/collab/route.ts,
                  TEMPLATE-SEO-PAGE.tsx (template leftover)
  components/
    common/       analytics, console-log, phone-reveal, phrase-reveal, preloader, structured-data
    layout/       navbar, footer, theme-switcher (1,196 lines)
    sections/
      about/      about-me (= HERO), about-scroll-section (frame sequence), about-section
      home/       achievements, cal-booking, collab-section, collab-modal, timeline-demo
      showreel/   index (projects carousel), project-card, project-modal, count-up, grain, …
    ui/           shadcn primitives + custom-cursor + timeline
  data/projects.ts
  hooks/          use-asset-loader, use-mobile
  lib/            constants (BASE_URL, CAL_USERNAME, email, b64 phone), seo, utils
  providers/      lenis-provider, theme-provider
```
There is no `content/` folder yet (Phase 10 wants content in `content/*.ts`).

## 3. Sections, in page order (`src/app/page.tsx`)

| # | Section | id | File | Notes |
|---|---|---|---|---|
| 0 | Preloader | n/a | `components/common/preloader.tsx` | Multilingual "hello" word cycle; blocks the page until assets load (bad for LCP) |
| 1 | **Hero** | `#hero` | `sections/about/about-me.tsx` | Giant "GAURAV RAJ" (Archivo Black) behind an autoplaying `heropage-nobg.webm` (an illustrated man flipping a mouse) |
| 2 | Projects | `#projects` | `sections/showreel/index.tsx` + `project-card` / `project-modal` | Full-screen carousel, 5 cards, 10 s autoplay, gradient backdrops, modal case study |
| 3 | About scroll sequence | `#about` | `sections/about/about-scroll-section.tsx` | 47-frame canvas scrub, `h-[800vh]` (!), GSAP pin; ends in text overlay "I'd rather let the work do the talking." |
| 4 | About details | inside `#about` | `sections/about/about-section.tsx` | Photo card + "Results that speak loudly" metric cards |
| 5 | Experience | `#experience` | `sections/home/timeline-demo.tsx` + `ui/timeline.tsx` | 3 roles (Honeywell SE I, Honeywell intern, Corizo intern) |
| 6 | Collab | n/a | `sections/home/collab-section.tsx` + `collab-modal.tsx` | "Me / You" split with a spinning "Let's collaborate" ring → Resend contact form |
| 7 | Achievements | n/a | `sections/home/achievements.tsx` | Achievements / Education / Beyond Work cards |
| 8 | Booking | `#contact` | `sections/home/cal-booking.tsx` | Cal.com **popup only** (`gaurav-raj-ergsgy/30min`), Itachi art |
| 9 | Footer | n/a | `components/layout/footer.tsx` | Big CTA, magnetic button, socials (GitHub, LinkedIn, LeetCode) |

## 4. Assets (`public/`)

| Path | Size | Used by | Flag |
|---|---|---|---|
| `_incoming/supportrag-demo.mp4` | **29.3 MB** | n/a (Phase 3 source) | git-ignored ✅ |
| `heropage.mp4` | **3.1 MB** | nothing | ⚠️ unused, >500 KB |
| `heropage-nobg.webm` | **1.8 MB** | hero | ⚠️ >500 KB, goes away in Phase 2 |
| `bg/1.png` (2263×2105) | **1.9 MB** | collab section | ⚠️ >500 KB, PNG |
| `ichigo.png` | **722 KB** | nothing | ⚠️ unused, >500 KB, copyrighted character |
| `reference/about-scroll-frames/meItachi46.jpg` | **632 KB** | nothing | ⚠️ >500 KB |
| `ichigo2.png` (1152×648) | 445 KB | booking | copyrighted character (Itachi) |
| `pngegg.png` | 456 KB | nothing | unused (pngegg = stock-clipart site) |
| `bg/2.png` | 401 KB | collab section | PNG |
| `about-sequence/` (47 JPG, 1920×1080) | 4.3 MB | about scroll | all frames 1920×1080 ✅ consistent |
| `reference/about-scroll-frames/` | 4.2 MB | nothing | duplicate of the sequence; frames 0–27 byte-identical |
| `md-red-logo.svg` | 0.2 KB | nav, footer, favicon, manifest | see §8 logo note |

The page also pulls `https://grainy-gradients.vercel.app/noise.svg` (hero noise texture), which **now returns HTTP 402**. That's the only console error.

## 5. Fonts & colours (current)

- **Fonts:** Poppins 300–800 is applied to every element (`* { font-family: var(--font-poppins) }`). Cormorant Garamond is loaded as `--font-accent`. Archivo Black is loaded inside the hero. `'DM Mono'` and `'DM Serif Display'` are referenced inline in the about sequence and collab section, but **never loaded**, so they silently fall back to system mono/Georgia. `--font-geist-*` vars are referenced in `@theme` but not defined.
- **Colours:** shadcn neutral tokens in OKLCH. Light `--background: #eddad4` (blush). Dark `oklch(0.145 0 0)`. Accent `--primary: oklch(59.71% 0.23 23.86)` (≈ crimson red) in both themes. Many hard-coded `text-white/xx`, `bg-white/5` and `text-gray-500` classes ignore the theme.
- **Theme:** `next-themes` with `attribute="class"` and `defaultTheme="dark"` (plus `enableSystem`). The plan wants **system** as the default.

## 6. Custom cursor (`components/ui/custom-cursor.tsx`)

- Rendered **outside** `ThemeProvider` in `layout.tsx`.
- `mousemove` → `setState` on every move, so React re-renders the cursor on every pointer event. Motion springs animate a 2px white dot and a 32px ring with `mix-blend-difference`. Over links the ring grows to an 80px white disc with an arrow icon; it supports `data-cursor-text`.
- It injects `* { cursor: none !important }`, which hides the native cursor everywhere, including inside text inputs.
- It skips touch devices (`pointer: coarse`) but **ignores `prefers-reduced-motion`**.

## 7. Animation / motion inventory

- Lenis (`syncTouch:false`) is driven by the GSAP ticker and synced with ScrollTrigger ✅ (good foundation). No reduced-motion handling.
- `html { scroll-behavior: smooth }` coexists with Lenis, which can make jumps fight each other.
- Easing is inconsistent: `[0.76,0,0.24,1]`, `[0.16,1,0.3,1]`, `[0.22,1,0.36,1]`, plus springs with bounce.
- **Zero `prefers-reduced-motion` handling** anywhere in the codebase.
- The hero video, projects autoplay and preloader run regardless of visibility. There are no IntersectionObserver or visibility pauses.

## 8. Problems found

### Confirmed from your list
1. **Hero video looks amateur.** Confirmed. It's an illustrated man flipping a mouse in front of the giant name, and it covers the name ("GAU▢RAV R▢J"). 1.8 MB, autoplay, no reduced-motion fallback.
2. **SupportRAG is missing** from projects. Confirmed.
3. **Scroll sequence.** Confirmed, but the facts differ from the plan. See ❗A below.
4. **Booking section.** Confirmed: low-contrast `text-white/60` card on `bg-white/5` (it would be white-on-blush in light mode), Itachi (Naruto) art, and the "Let's Make Something Awesome Together" copy. Booking is a popup only.
5. **Nav** has only a hamburger, logo and theme toggle. Confirmed. The menu takes ~1.7 s to open (two chained animations) and has no résumé link.

### New findings
6. ❗ **Stock photo of a different person.** `about-section.tsx` shows an **Unsplash portrait of a woman** labelled "Gaurav Raj · Software Engineer I, Honeywell". A recruiter seeing this would lose trust immediately. I think this has to go now, regardless of phase.
7. ~~Metric inconsistencies~~ **Retracted:** the code says 50+ and 67%. The screenshot caught the count-up animation mid-way (48, 63).
8. **NDA leak:** "NurseCall schemas" (an internal product/module name) appears in `data/projects.ts` and `timeline-demo.tsx`.
9. **Borrowed copy** beyond the booking heading: "I'd rather let the work do the talking" (about sequence; the plan explicitly bans it) and "Results that speak loudly".
10. **Preloader blocks first paint.** The page is a single `"use client"` component and the hero only appears after the preloader slides away. LCP was flagged on the logo.
11. **About sequence is `800vh` tall.** That's eight screens of scrolling for 47 frames, and it preloads all 47 JPGs (4.3 MB) before rendering anything (black "Loading images…" box).
12. **Projects carousel autoplays every 10 s** and hijacks the global arrow keys (← → ↑ ↓ change the slide anywhere on the page, even when the carousel is off-screen). The prev/next buttons have no `aria-label`.
13. **Analytics** loads GA with the placeholder ID `G-XXXXXXXXXX` when `NEXT_PUBLIC_GA_ID` is unset.
14. **Dead weight:** `heropage.mp4`, `ichigo.png`, `pngegg.png` and `public/reference/` are unused (~8.5 MB in the repo). `layout.tsx` preconnects to ImageKit, which nothing uses any more.
15. **Template leftovers:** README still describes "Creative Portfolio template", `TEMPLATE-SEO-PAGE.tsx`, three SEO-*.md files, `og-image.png` referenced but missing from `public/`.
16. **Build safety off:** TypeScript and ESLint errors are ignored at build time.
17. A Next.js dev-tools badge ("N") sits bottom-left in dev, which is normal and not shipped.

### ❗ Conflicts between PHASES.md and the repo (need your call)

**A. The "real frames" aren't real photos (Phase 5).** Frames `00000–00027` are an **illustrated anime animation**: a hand wearing a Sharingan ring, Akatsuki clouds, gears. Frame 27 is a near-black motion-blur transition with no face in it. Frames 28–46 de-blur into an illustration of you in an **Akatsuki cloak** on a throne (`00046.jpg`). Also, numbering starts at `00000`, so there are 28 frames (0–27), not 27.
- That makes the whole sequence Naruto-derivative imagery, the same copyright problem the plan raises for the Itachi booking art.
- The Phase 5 face-alignment step (frame 27 → portrait) can't work, because frame 27 has no face.
- **My recommendation:** drop this sequence entirely and use a static or parallax portrait (or the reshoot route the plan already mentions: 3–4 s of real phone footage). Tell me which way you want to go.

**B. Facts outside §11.** The current site (and `PRODUCT.md`) uses many numbers that aren't in §11: 150+ field engineers / <5 s retrieval, 67% (2 h → 40 min) deploys across 50+ networks with 15+ services, 40%+ availability, 50% release cycles / 60% manual effort / ~80 eng-hours, 1M+ daily requests, "Dashing Debut", "3 Bravo Awards", McKinsey Forward. Under the strict rule I'd have to **remove** all of them. Are they verified (add them to §11) or should they go?

**C. The `md-red-logo.svg`.** It's a red ring with a triangle, the nav `alt` text is **"Md Logo"**, and the file is named `md-…`. "MD" reads like **M**ann **D**amani. The plan says to keep *your own* mark and not use one that looks like theirs. Is this your logo, or was it carried over? If it's carried over, I'll design a simple "GR" monogram in Phase 1.

**D. "SupportRAG (Oct 2026)" vs §11 says "personal, dev on AKS".** No conflict, just confirming that I'll label it "Personal project · Oct 2026 · dev on AKS".

### Tooling gap
- **ffmpeg is not installed** on this machine (it's needed for Phases 3 and 5). Install it with `winget install Gyan.FFmpeg` (free), or tell me to use `ffmpeg-static` via npm as a dev-only dependency.
- `supportrag-demo.mp4` is 29.3 MB raw. I'll know the compressed size after Phase 3 encoding.

### Still needed from you (by phase)
| Item | Needed for |
|---|---|
| `resume.pdf` | Phase 1 (nav button) |
| Answers to ❗A–C above | Phases 1, 4, 5, 6 |
| ffmpeg install (or OK for `ffmpeg-static`) | Phase 3 |
| Agent roles for the 4-agent workflow; Kafka, SSO and NL-to-SQL facts | Phase 4 |
| Portrait assets (`portrait-*.png`) | Phases 5 & 7 |
| Timeline dates (SRM years) | Phase 6 |
