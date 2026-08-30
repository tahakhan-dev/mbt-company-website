# R&D NOTES — reference study for V2

**Date:** 2026-08-30 · **Access record:** this build sandbox's egress allowlist permits
Google/Firebase APIs, `github.com`/`raw.githubusercontent.com`, npm, and the Claude
WebSearch lane — **every direct site visit below returned `EGRESS_BLOCKED` from the
network proxy** (attempted via WebFetch, one by one: higgsfield.ai, zentry.com,
igloo.inc, lusion.co, obys.agency, cuberto.com, activetheory.net, locomotive.ca,
exoape.com, unseen.co, linear.app, stripe.com, vercel.com, apple.com,
awwwards.com, pinterest.com). Research therefore ran **live through WebSearch**
(case studies, Awwwards write-ups, Codrops/CSS-Tricks breakdowns, published design-token
teardowns) plus **actual source code fetched from GitHub** where implementations are
public. Each entry states its evidence basis. Pinterest is the one mandated source with
no usable secondary route (image-only content); noted honestly in §17.

Numbered techniques carry IDs (`T1`…) referenced by `DESIGN-SPEC-V2.md`.

---

## 1 · zentry.com — Awwwards SOTM (evidence: GSAP forum thread + published course clone source, fetched from GitHub)

Fetched the actual hero implementation from the public course repo
([adrianhajdin/award-winning-website](https://github.com/adrianhajdin/award-winning-website) `src/components/Hero.jsx`):

- **T1 — Angular clip-path frame scrub.** The hero canvas sits in a frame whose
  `clip-path` scrubs from `polygon(14% 0, 72% 0, 88% 90%, 0 95%)` (+ asymmetric
  border-radius `0% 0% 40% 10%`) to a full rectangle, `scrub: true`,
  `start: "center center"`. Clip-path on a composited layer animates without
  re-raster → our act-boundary wipe primitive. **→ Act 1 exit, Act 3→4 hand-off.**
- **T2 — Mask-window transition:** next scene revealed inside a small clipped window
  that scales to full viewport ([GSAP forum breakdown](https://gsap.com/community/forums/topic/45211-recreating-zentry%E2%80%99s-interactive-mask-animation-with-gsap/)). **→ Act 4→5 boundary.**
- **T3 — 3D perspective hover on framed panels** (rotateX/Y from pointer, transform
  only). **→ Act 5 case-study covers, restrained (±3°).**
- Their gaming maximalism (video walls, custom glyphs) is off-voice for us — noted,
  rejected.

## 2 · igloo.inc — Awwwards Site of the Year (evidence: [Awwwards case study](https://www.awwwards.com/igloo-inc-case-study.html), [webgpu.com teardown](https://www.webgpu.com/showcase/igloo-inc-procedural-crystals/))

- **T4 — One continuous scroll-driven camera**: the entire site is a single scrubbed
  journey (GSAP-eased scroll → camera), not sections with separate effects. The lesson
  is structural: **one spine, everything keyed to it**. **→ our seven acts hang off one
  master scroll timeline + `fieldState.progress`, extended to multi-act range.**
- **T5 — Text effects computed in the shader** (SDF offset scrambles), never DOM
  relayout per frame. Our equivalent: hero headline effects via transform/opacity on
  pre-split spans only; anything per-frame lives in the Signal Field shader uniforms.
  **→ Act 1.**
- **T6 — Heavy visuals, LCP ≈ 1s**: KTX2-compressed assets, idle-time shader compile,
  `prefers-reduced-motion` fallbacks. Proof the V2 budgets are compatible with a
  signature 3D moment. **→ speed pass: idle-mount 3D (kept from V1), DPR clamp ≤1.5.**

## 3 · lusion.co — Awwwards SOTM May (evidence: [Awwwards case study](https://www.awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html))

- **T7 — Data-in-texture tricks** (binary frame counters decoded via readPixels;
  16-bit keyframe vertex animation): research-grade, rejected for budget — but their
  *restraint lesson* stands: one continuously-alive scene beats many small gimmicks.
- **T8 — Velocity-reactive scene energy**: scene intensity follows scroll/pointer
  velocity, so the page feels alive only when the user acts. We already track pointer
  inertia in `SignalField`; V2 adds scroll-velocity → field turbulence uniform.
  **→ Act 1 + sitewide field backdrop.**

## 4 · exoape.com — Awwwards SOTM May 2022 (evidence: [Awwwards write-up](https://www.awwwards.com/exo-ape-wins-site-of-the-month-may-2022.html))

- **T9 — Editorial display type as the hero visual** (Lausanne; "timeless design,
  contemporary interaction"): the headline *is* the artwork; imagery sits behind/after
  type. **→ Act 2 manifesto: type-only viewport, no cards.**
- **T10 — Slow-parallax full-bleed media with copy pinned longer than imagery** —
  differential scroll speeds (media 0.85×, copy 1×) create depth with pure transforms.
  **→ Act 5 case-study rows; Act 6 team imagery.**
- **T11 — Case-study "continue" transitions**: next-project footer slides up as current
  page exits — a curtain hand-off. **→ inner work pages + View-Transition fallback
  curtain.**

## 5 · obys.agency — SOTM Sep 2021 for Grids (evidence: [Awwwards](https://www.awwwards.com/grids-by-obys-wins-site-of-the-month-september-2021.html), [Codrops profile](https://tympanus.net/codrops/2026/03/06/obys-the-small-studio-designing-big-digital-narratives/))

- **T12 — "Storytelling lives inside systems":** visible grid discipline — hairline
  column rules, baseline-locked type, numbered sections (01/07…) — makes a narrative
  feel engineered, not decorated. **→ sitewide: hairline 12-col rules exposed at act
  boundaries; act numerals `01–07` in mono; the act indicator itself.**
- **T13 — Typography as UI**: oversized numerals/act labels double as navigation
  affordances. **→ act indicator + Act 3 service index.**
- **T14 — A designed "mode toggle" as a delight moment** (their crazy-mode switch).
  **→ our sun/moon theme toggle gets real choreography (icon morph + radial theme
  crossfade), not a bare icon swap.**

## 6 · cuberto.com — Awwwards profile (evidence: [Cuberto's own mouse-follower source on GitHub](https://github.com/Cuberto/mouse-follower), [Codrops magnetic buttons](https://tympanus.net/codrops/2020/08/05/magnetic-buttons/))

- **T15 — Magnetic pull with GSAP-spring release**: translate toward pointer within a
  radius, elastic return on leave — transform-only. V1's dependency-free `Magnetic`
  already does 80% of this; V2 adds the elastic overshoot release and applies it to the
  single warm CTA only. **→ Act 7 + island nav CTA.**
- Custom gooey cursors: rejected — cursor theatrics fight the "calm confidence" bar and
  cost a constant rAF loop.

## 7 · locomotive.ca — Agency of the Year (evidence: [their own Medium post](https://medium.com/@LocomotiveMTL/should-i-use-locomotive-scroll-on-my-project-7fc8fa38bcc5))

- **T16 — Locomotive Scroll v5 is now built on Lenis** — direct validation of our
  single-Lenis architecture. Keep exactly one instance, GSAP-ticker-driven.
- **T17 — Their own honesty about scroll-hijack costs** (perf, a11y, habit shock):
  smoothing stays subtle (lerp ~0.1 equivalent), native scrollbar keeps working,
  reduced-motion kills smoothing entirely. **→ motion core acceptance criteria.**

## 8 · activetheory.net (evidence: [webgpu.com showcase](https://www.webgpu.com/showcase/active-theory-portfolio/), [Webby write-up](https://www.webbyawards.com/crafted-with-code/active-theory/))

- **T18 — Scene-state machine**: their Hydra engine treats the site as one 3D
  environment with state-based scene switching (even a spacebar environment toggle).
  Our cheap DOM analogue: the Signal Field is a persistent backdrop whose *state*
  (chaos / lattice / grid / constellation-of-logos) is keyed per act — one canvas,
  many meanings. **→ Acts 1, 3 backdrop, 5 constellation, 7 calm grid.**
- **T19 — Draco/compressed assets + lazy video → LCP 1.3s** with a full WebGL world:
  again, heavy ≠ slow when loading is staged. **→ speed pass.**

## 9 · unseen.co — SOTM Feb 2023 (evidence: [Awwwards](https://www.awwwards.com/unseen-studio-by-unseen-studio-wins-sotm-february-2023.html), [Chipsa technical teardown](https://chipsa.design/publications/legendy-veb-dizaina-texniceskii-razbor-rabot-studii-unseen))

- **T20 — Scene-per-page with render-target crossfades** (fragment-shader mask blends
  between scenes). Full version rejected (multi-scene cost); the DOM translation is a
  **gradient-morph act boundary**: two fixed radial/conic washes whose opacity/position
  crossfade as acts change — transform/opacity only. **→ Act 2→3 and 6→7 boundaries.**
- **T21 — Liquid pointer deformation on media** — rejected (per-frame uv distortion on
  DOM images needs canvas per image; over budget).

## 10 · apple.com product pages (evidence: [CSS-Tricks breakdown](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/), [GSAP Vault tutorial](https://gsapvault.com/blog/scroll-image-sequence-tutorial))

- **T22 — The pinned product stage**: a sticky viewport-height stage; scroll advances
  the *state* of one continuously-visible object while copy beats enter/exit around it.
  Apple uses canvas image sequences; our free-tier version drives a **DOM/SVG state
  morph** (the before→after dashboard) with the same pin+scrub grammar.
  **→ Act 4 — this is the act's core mechanic.**
- **T23 — Copy beats mapped to scrub ranges** (each claim owns a % range of the pin,
  fading through a fixed anchor point). **→ Act 4 claim beats ("40+ hrs/month back",
  etc.), Act 1 headline hand-off.**

## 11 · linear.app (evidence: [published DESIGN.md teardown](https://github.com/voltagent/awesome-design-md/blob/main/design-md/linear.app/DESIGN.md))

- **T24 — Four-step surface ladder in white-opacity, not color** (#010102 floor →
  #0f1011 → #141516 → #18191a): elevation = luminance steps + hairlines, zero shadows.
  **→ dark-theme token refinement (our void/surface/raised ladder gets a fourth step
  for hover states).**
- **T25 — One chromatic accent, deployed scarcely** (their #5e6ad2 on brand, focus,
  one CTA per section): validates our one-warm-CTA law; V2 tightens the aurora family
  to *glows and strokes only*, amber reserved absolutely.
- **T26 — Real product UI as hero imagery** in hairline frames — nothing abstract.
  **→ Act 4 stage + Act 5 covers become designed "product" compositions (dashboard
  tiles, chat threads, pipeline boards) built from our own tokens — no more vapor
  gradients.**

## 12 · stripe.com (evidence: [Kevin Hufnagl teardown of stripe's minigl](https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/), [bram.us](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/))

- **T27 — Mesh gradient: FBM simplex noise + sinusoidal UV warp in a ~10KB WebGL
  canvas.** We won't add a second canvas; instead the *palette logic* (multi-stop mesh,
  slow warp) informs the light theme's aurora washes as pre-rendered CSS
  radial/conic layers animated by transform. **→ light-theme act boundaries.**
- **T28 — `skewY(-12deg)` section cap with `overflow:hidden`**: the diagonal seam is a
  container transform, not geometry. **→ Act 5→6 boundary (light theme especially).**

## 13 · vercel.com (evidence: [Geist docs](https://vercel.com/geist/introduction), [Setproduct blueprint-grid guide](https://www.setproduct.com/blog/complete-guide-to-blueprint-grid-design), [DesignMD token teardown](https://designmd.cc/benchmarks/vercel))

- **T29 — Near-white monochrome canvas (#fafafa) with hairline borders and tonal
  depth (#fafafa → #ebebeb → #171717)** — the strongest published model for our
  **Porcelain Editorial** light theme: depth via tonal steps + ultra-diffused shadows,
  never gray boxes.
- **T30 — Blueprint grid texture** (faint line/dot grid behind content, mono metadata
  labels 11–13px caps): technical credibility texture that reads in both themes.
  **→ Act 3 rail background, Act 4 stage floor, styleguide.**
- **T31 — Display type at -0.04em/-0.06em tracking, lh ~1.1**: tight editorial
  headline setting. **→ type scale in DESIGN-SPEC-V2.**

## 14 · higgsfield.ai (evidence: WebSearch corpus — [uxdev.org review](https://uxdev.org/blog/higgsfield-ai-video-generator); direct visit blocked)

- **T32 — Cinematic grading + motion-rich preview cards** (Gen-Z-paced, mobile-native
  flow). Takeaway for us: proof cards should *move on intent* (hover/focus scrub of a
  designed cover), not autoplay. **→ Act 5 covers get a 2-layer parallax + tilt on
  hover, nothing looping.**

## 15 · Awwwards SOTD stream, August 2026 (evidence: WebSearch of the live SOTD list)

Winners this month: HOBRO DIGITAL (Aug 30), Decathlon Yestalgia, Sharplink, "AI in
Design Report 2026", MIU MIU, /zeroz, Kononenko Architecture, Cipher, LIKOVA, et al.
Recurring currents worth stealing (corroborated across the month's write-ups):
**scroll-based movement everywhere, morphing desktop-to-mobile choreography, fintech
sites pairing UX-first structure with one immersive signature moment** — i.e. exactly
the "one spine + restrained theatrics" architecture V2 specs. No technique on the list
contradicts the plan; nothing newer supersedes T1–T31.

## 16 · Ten-site minimum check

Sites researched with usable technical depth: zentry, igloo, lusion, exoape, obys,
cuberto, locomotive, activetheory, unseen, apple, linear, stripe, vercel, higgsfield
(14) + the SOTD stream survey. **≥10 satisfied with named techniques.**

## 17 · Honesty ledger

- Direct DOM/scroll inspection of the reference sites was impossible from this sandbox
  (every visit `EGRESS_BLOCKED`; recorded above). Evidence basis per entry is a live
  WebSearch source or fetched public source code — not memory alone.
- Pinterest boards: blocked and image-only, no secondary text route → substituted by
  the screenshot-driven taste audit in `AUDIT-V1.md` §4 plus the per-site studies
  above. This is the one mandated source with no live substitute.
- The V2 brief references skills `taste-skill:redesign-existing-projects` and
  `superpowers-chrome:browsing`; neither exists in this session. Used instead:
  `taste-skill:design-taste-frontend`, `taste-skill:high-end-visual-design` (installed
  equivalents) and the sandboxed Playwright/Chromium harness for all live-browser work
  against our own site.
