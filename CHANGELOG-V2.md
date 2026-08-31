# CHANGELOG — V2 public-layer overhaul

**Scope law:** public layer only. Backend, admin CMS, analytics, lead
pipeline, seeding mechanics, Firestore rules, and the free-tier envelope are
untouched except the additive deltas in DESIGN-SPEC-V2 §8 (the `sample` flag,
4 new services, 6 new case studies, settings copy).

Process (in the mandated order): `docs/AUDIT-V1.md` (why V1 failed, with a
4×-CPU scroll trace) → `docs/RND-NOTES.md` (T1–T32 named techniques from live
research) → `docs/DESIGN-SPEC-V2.md` + `docs/COPY-V2.md` committed **before
any component code** → build → gates R/S/T/N/X → preview redeploy. Skills in
force: superpowers, ui-ux-pro-max, and the real leonxlnx/taste-skill plugin
(its pre-flight is codified in SPEC §1a).

## Themes

- Dual themes via next-themes (class strategy, system default, zero flash —
  verified pre-hydration in both directions). Dark = Aurora Obsidian refined
  (4-step surface ladder, aurora reserved for glows/strokes/gradients).
  Light = **Porcelain Editorial** (#F7F7F4 base, #0B0E16 ink, black/8
  hairlines, cyan-700/teal-700/violet-600 accents, amber-700 CTA, diffused
  shadow ladder instead of inset highlights, 2% grain).
- Sun/moon toggle in the island nav; ~250ms token crossfade; preference
  persists; admin stays hard-dark (exempt by design).
- Every text/bg pair AA in both themes (Lighthouse a11y 100 ×2; measured
  token fixes recorded in the spec).

## Motion core

- Law: animate **transform/opacity only** (clip-path for wipes); never
  blur/box-shadow/filter/backdrop on the scroll path. Single Lenis on the
  GSAP ticker; ScrollTrigger.batch for lists; fonts-ready refresh; View
  Transitions for routes (native API when present, ≤400ms, GSAP fallback).
- **Bidirectional contract (owner requirement):** scroll-down plays the
  story forward, scroll-up reverses it — scrubbed acts are reversible by
  construction; entrance reveals reverse on leave-back; counters reset and
  replay; the manifesto de-illuminates; the act-2 wipe retracts.
- Reduced motion: same narrative, statically rendered, poster field, zero
  choreography.

## The seven-act home

1. **Signal** — pinned hero; scroll scrubs the field's chaos→lattice morph;
   headline hands off to "Noise in. Growth out."
2. **Why we exist** — type-only manifesto; per-word illumination wave
   (AA-safe two-layer build); panel wipe entrance.
3. **The system** — pinned deck of the TEN services with live readout,
   clickable tick rail, blueprint stage floor.
4. **The transformation** — pinned before→after product artifact with a
   traveling-seam window sweep and four claim beats ("40+ hours/month
   back" · "Answers in seconds, not days" · "Orders that move themselves" ·
   "Every number on one screen").
5. **Proof** — case rows with prerendered product-artifact covers, logo
   marquee (real vendored simple-icons marks), testimonial pair, counters.
6. **The people** — "Small team. Senior hands. No handoffs." + duotone
   monogram tiles + founder quote.
7. **Five minutes** — serene field returns; hero-scale promise; the single
   warm CTA + risk-reversal ("No pitch. You leave with a plan." · reply
   promise); three objection-killer FAQs.

Sitewide act rail (numeral, 7 ticks, label, `aria-live` announcements) +
mobile progress bar. One warm CTA per screen, everywhere.

## Services & work

- **Ten services** (adds AI Chatbots & Customer Automation · Business
  Process Automation · E-commerce Engineering · WordPress & CMS
  Engineering), operations-first order.
- Every service page carries a mandated **Life before / Life after** block
  (3 concrete beats each + a micro-metric) plus deliverables, process,
  related proof, and a CTA band in the 5-minute voice.
- **12 case studies** (every service covered; every filter non-empty),
  seeded idempotently and flagged `sample: true` — admin shows a "Sample"
  badge; the public never reveals it.

## Copy

5-minute-promise voice sitewide: hero winner "Five minutes to a faster
business." (5 candidates recorded in COPY-V2); CTA everywhere = **"Book a
5-minute growth call"**; risk-reversal microcopy; zero em/en dashes in any
visible string (taste law), arrows only for before→after notation.

## Performance (the headline war)

V1's sandbox scroll trace dropped **98%** of frames; the final V2 tree drops
**4.5% (dark) / 3.1% (light) with zero long tasks** on the same 4×-CPU
software-raster rig. The fixes that mattered, each measured in
`docs/evidence/v2-home-scroll-4x-runs.json`:

- the WebGL field renders only while acts 1/7 are on stage (visibility-gated
  compositor exit; posters live inside the acts);
- `.aurora-orb` is paint-free (a blur or mask there re-rasters every frame);
- covers ship as prerendered JPEGs (`scripts/render-covers.mts`) — inline-SVG
  first raster cost 50–90ms per cover on the main thread;
- film grain fades out while scrolling (a fixed translucent full-viewport
  layer re-blends every frame);
- act 4 sweeps via paired transforms in a clipped stage (no clip-path scrub,
  no off-stage layer widening the document);
- act 3's scrub mutates DOM directly (no per-frame React state);
- the exit-intent chunk waits for 12s AND a 3s scroll-quiet window;
- ParallaxMedia scrubs translate only; poster orbs are static.

Lighthouse: desktop 100/100/100/100; mobile 88 perf with 100 a11y/BP/SEO,
CLS 0, trace-observed LCP 132ms. Deviations recorded honestly: initial JS
258KB gz vs the <160KB wish (stack floor), and the simulated slow-4G LCP
(font/CSS transfer, not render).

## Gates

- **R** regression: lint/typecheck/build clean, 30/30 unit, **26/26 e2e**
  run alone against real Firestore.
- **S** smoothness: both themes under budget with evidence saved.
- **T** themes: 25/25 assertions (resolution, zero flash, persistence) +
  full capture set, both themes, desktop + mobile.
- **N** narrative: fresh-context judge answered all six visitor questions
  from scroll screenshots alone (`docs/evidence/gate-n-verdict.md`) — and
  caught the dead act-indicator bug, since fixed.
- **X** spec-vs-build diff + taste pre-flight
  (`docs/evidence/gate-x-diff.md`) — PASS with 14 documented deviations,
  each deliberate and reasoned.

## Deployment state

Firebase Hosting preview refreshed (public static mirror, noindex, tracking
disabled): https://burger-builder-85ba4.web.app. Per the standing owner
rules: **no git push** (all work committed locally, delivered in the
handover zip) and **no Netlify deploy** (config ships prepared-but-unused;
the owner runs production per README).
