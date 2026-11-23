# Lighthouse & QA (Phase 9)

Run on 2026-11-23 against a local production build (`next build` + `next start`),
Lighthouse 12 (default simulated throttling: mobile = slow 4G + 4× CPU slowdown).
Only this summary is kept in the repo; rerun the commands below for full reports.

## Scores

| | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Target (PHASES §0) | ≥ 90 (mobile) | ≥ 95 | n/a | 100 | < 2.0 s | < 0.05 | n/a |
| **Desktop** (2 runs) | **96–97** | 100 | 100 | 100 | 0.4–1.0 s | 0.03 | 120–140 ms |
| **Mobile** (3 runs) | **60–76** | 100 | 100 | 100 | 1.6 s or 4.7 s* | 0.023 | 840–950 ms |
| Mobile, before Phase 9 | 44 | 100 | 96 | 100 | 15.9 s | 0.023 | 1,630 ms |

\* The LCP element is always the hero summary paragraph, with a real render delay of
about 0.55 s. Lighthouse's simulation charges whatever script ran before that paint to
LCP, so the same build reads 1.6 s or 4.7 s from run to run.

**Open:** mobile Performance is below 90. The remaining cost is main-thread time
(TBT ~900 ms): React hydrating a large, animation-heavy page, plus the burst of work
when the intro curtain lifts (hero entrance, GSAP ScrollTrigger refresh, Lenis start).
With the intro skipped, mobile measured 61–64 *before* the LCP fix, so the intro alone
is not the cause.

## What Phase 9 changed

- **Cal.com booker** loads only when it is ~600 px from view (`LoadOnView` + `next/dynamic`).
  It was ~700 KB of third-party JS on first load and delayed the `load` event the
  preloader waits for.
- **Collab form** (zod + react-hook-form) loads on first hover/focus/click of the collab mark.
- **Scroll-sequence frames** start downloading after `load` + idle, or when the section
  nears the viewport, instead of during hydration.
- **Hero LCP:** the summary paragraph rises without fading (`.anim-rise-up`). Chrome
  doesn't count `opacity: 0` elements as painted, so the old fade-in delayed LCP.
- **Vercel Analytics** renders only on Vercel builds (`process.env.VERCEL`); elsewhere its
  script 404'd (console error, Best Practices 96).
- **Preloader:** static layers are memoised so per-percent updates don't re-render them;
  the live region announces "Loading" once instead of every percent.
- **Loops off-screen:** the collab mark's orbit, pulse and glow are CSS animations paused
  unless on screen and motion is allowed (the motion versions kept running once started).
  The About "Let me Flex!" cursor loop unmounts off-screen.
- **Images:** SupportRAG poster JPG (83 KB) → WebP (45 KB). `next.config` serves AVIF/WebP.
- **Accessibility:** logo links use visible text + sr-only suffix instead of a mismatched
  `aria-label` (Lighthouse `label-content-name-mismatch`).
- **Build:** type and lint errors now fail the build (`ignoreBuildErrors` /
  `ignoreDuringBuilds` removed; both pass).

## QA checks

- **Keyboard:** 53 focusable elements; all have an accessible name and a visible focus
  ring; order is skip link → nav → hero → work → contact → footer. Skip link targets `#main`.
- **Images:** every `<img>` has `alt`.
- **Reduced motion:** no intro, no Lenis, static portrait (no pin, no canvas), no SVG
  packet animations; zero running animations at the top and bottom of the page.
- **Layouts:** full-page captures at 390 / 768 / 1280 / 1440 px, light and dark: no
  horizontal overflow at any width.
- **Console:** no errors. Two warnings come from Cal.com's own embed script.
- **Safari (code review; no WebKit run here):** video is `muted` + `playsInline`; every
  `backdrop-filter` ships with `-webkit-backdrop-filter`; canvases scale by DPR (capped
  at 2); no `offset-path`; `requestIdleCallback` has a `setTimeout` fallback (Safari < 18).
  Still to do on a real iPhone/Mac: video autoplay, the scroll sequence, the Cal booker.

## Rerun

```bash
# build beside a running `next dev` without touching .next
NEXT_DIST_DIR=.next-build npm run build
NEXT_DIST_DIR=.next-build npx next start -p 3123
npx lighthouse http://localhost:3123/ --chrome-flags="--headless=new" --view                     # mobile
npx lighthouse http://localhost:3123/ --chrome-flags="--headless=new" --preset=desktop --view    # desktop
```

Building into `.next-build` makes Next add `.next-build/types/**/*.ts` to
`tsconfig.json`; revert that line if it appears.
