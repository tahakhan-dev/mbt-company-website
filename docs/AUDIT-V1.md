# AUDIT — V1 public marketing layer

**Date:** 2026-08-30 · **Build audited:** commit `360259c` (local prod build, Next 16.3.3) ·
**Verdict being tested:** owner's V2 brief — "dated/template-like, janky scroll, weak
animation, no scroll narrative, slow, no theming."

**Audit result: the verdict stands on every count.** Evidence below, with file paths.
The backend (admin, leads, analytics, seeding, data model, rules) is explicitly out of
scope and protected; nothing in this audit touches it.

Method: eyes-on scroll-through of the local prod build at 1440×900 (14-frame sequence,
`tests/helpers/shot.mjs`), a Chrome performance trace of a full home-page scroll at
**4× CPU throttle** (`tests/helpers/trace-scroll.mjs`, evidence in
`docs/evidence/v1-home-scroll-4x.{trace,summary}.json`), bundle forensics against
`.next` output, and a line-level pass over every public component with the
`design-taste-frontend` / `high-end-visual-design` review checklists (at audit time the
real taste-skill plugin was not yet installed; a locally-authored equivalent was
used and disclosed here. Mid-build the owner supplied github.com/leonxlnx/taste-skill,
which was installed and whose `redesign-existing-projects` + pre-flight checklists
were then applied retroactively; the resulting fixes are recorded in
DESIGN-SPEC-V2 §1a and the compliance commit).

---

## 1 · Performance trace — the "janky scroll" is measurable

Full home scroll, local prod build, 1440×900, **4× CPU throttle**, wheel-driven so the
real Lenis→GSAP path is exercised (10s scroll, 11,561px):

| Metric | Measured | V2 budget | Status |
|---|---|---|---|
| Frame intervals > 26ms (≈dropped at 60Hz) | **28.4%** | < 10% | ❌ ~3× over |
| Frame intervals > 50ms (severe) | 2.9% | ~0 | ❌ |
| Mean frame interval | 22.9ms (~44fps) | ≤ 16.7ms | ❌ |
| Long tasks (>50ms) | 4 (58, 54, 52, 51ms) | no clusters >100ms | ⚠️ passes the letter, fails the spirit — see below |

Attribution: every long task is dominated by **compositor `Commit`** (36–46ms of each),
not script. That is the signature of scroll-synchronized **paint invalidation** — the
page is re-rasterizing layers on scroll instead of transforming pre-painted ones. The
long tasks cluster in the first ~2.3s of the scroll: the hero pin → ProcessStory pin
region, exactly where the blur-filter scrubs (below) live. No single >100ms task, but a
sustained 28% dropped-frame rate at 4× is precisely what "feels janky on a mid laptop"
looks like in a trace.

### Root causes, by file

1. **`components/motion/Reveal.tsx:40–49` — scroll-animates `filter: blur(8px)→0`.**
   This is the sitewide entrance primitive; nearly every section runs it. CSS filters
   force full re-raster of the element every frame — banned outright by V2 §7
   ("transform/opacity only"). Worst possible primitive to have made global.
2. **`components/marketing/home/ProcessStory.tsx:88–91` — pinned scrub animates
   `filter: blur(3px)` per step swap** inside a `scrub: true` timeline. Continuous
   re-raster for the entire pinned distance (~300vh).
3. **`components/marketing/SiteNav.tsx` — `backdrop-blur` island floats over animating
   content.** Legitimate on a fixed element per the design law, but every frame where
   content moves under it forces backdrop re-filtering; V1 keeps full-opacity animated
   sections sliding directly beneath it. (V2: keep the island but stop animating
   large painted regions under it; give it a solid-ish fallback surface at scroll.)
4. **No `content-visibility: auto` anywhere** — all nine home sections paint on first
   render and stay live; below-fold sections contribute to every commit.
   (`app/(marketing)/page.tsx` renders all sections eagerly with no containment.)
5. **`components/motion/MotionProvider.tsx` — Lenis wired correctly to the GSAP ticker
   (this part is right and stays), but nothing uses `ScrollTrigger.batch()`;** every
   `Reveal` creates its own ScrollTrigger (dozens on the home page), each with its own
   callback dispatch. Fine on M-series; measurable at 4×.

## 2 · Payload — "slow" is real on the JS axis

| Metric | Measured | V2 budget | Status |
|---|---|---|---|
| Initial marketing JS, home (gz, excl. lazy 3D chunk) | **244KB** | < 160KB | ❌ +84KB |
| LCP desktop trace (unthrottled) | 0.7s | ≤ 1.8s throttled-mobile target | re-verify in V2 |
| CLS | 0.005 | < 0.02 | ✅ carries over |

Where the 244KB goes (gz, from `.next` chunk analysis): ~70KB React/Next runtime,
~53KB scroll/motion stack (GSAP + ScrollTrigger + SplitText + Lenis + glue) **loaded
eagerly in the layout for every marketing route** via `components/motion/MotionProvider.tsx`
+ `lib/gsap.ts`, ~39KB + ~34KB route/framework chunks, remainder small. The 3D chunk is
correctly absent from initial HTML (verified in V1 Gate D; keep that mechanism).
V2 must: defer SplitText to the routes that split text, stop shipping admin-adjacent
glue to marketing routes, and audit what Turbopack hoists into the shared chunk.

## 3 · Narrative — there is none

`app/(marketing)/page.tsx` renders nine independent, same-shaped sections in a column:
Hero → LogoMarquee → ServicesBento → ProcessStory → FeaturedWork → MetricsBand →
Testimonials → TeamPreview → FaqStrip → FinalCta. Each opens with the identical grammar
(eyebrow pill → huge heading → body → cards) on the identical background. Scroll long
enough and the rhythm is a metronome — **nothing builds, hands off, or pays off**:

- No act structure; no section knows about its neighbors. Transitions between sections
  are literal empty padding (`py-24`–`py-40` gaps of flat void).
- The one genuinely narrative asset — the hero's chaos→lattice Signal Field morph
  (`components/three/SignalField.tsx`, `lib/three/field-state.ts`) — completes in
  170vh and is never referenced again. The metaphor (noise → structure) is exactly the
  company's story and V1 spends it in the first screen.
- No scroll progress/act indicator anywhere; the visitor has no sense of position in a
  story (V2 mandates one).
- The claim beats live in separate sections (MetricsBand counters, Testimonials) rather
  than being sequenced into a before→after argument.

**Fresh-eyes test (the Gate N standard):** from the scroll-through alone a stranger
learns "AI software house, ships AI products, has process, has case studies" — but not
*why they exist*, *how growth happens for the client*, or *what the next step costs*
(5 minutes). That is a copy + structure failure, not a polish failure.

## 4 · Template tells & dated patterns, by section

Screenshots: scroll-through frames s1–s14 (audit run, 1440×900).

| Where | File | What reads as template/dated |
|---|---|---|
| Hero | `components/marketing/home/Hero.tsx` + `SignalField.tsx` | Particle-constellation network = **the** stock "AI company" visual of 2023–2025; left-text/right-particles is the default composition of a thousand AI landers. The morph mechanic is good; the *look* of dots+lines is the cliché. Two warm elements in the first viewport (nav "Book a call" + hero CTA, both amber) violate the one-warm-CTA law. Scroll cue is a timid 1px tick. |
| Logo marquee | `components/marketing/home/LogoMarquee.tsx` | Infinite logo marquee immediately under the hero — the single most common trust-band pattern alive. Placement, not existence, is the tell. |
| Services | `components/marketing/home/ServicesBento.tsx` | Bento grid of equal-weight dark cards w/ icon+title+blurb; hover = slight lift. Six near-identical cells read as a pricing-page fragment. No hierarchy, no lead cell, no motion story. Capped at 6 services; V2 needs 10 with a rail/deck. |
| Process | `components/marketing/home/ProcessStory.tsx` | Left sticky heading + right stack of gray cards with mono chips — the standard "how we work" two-column of every dev-shop template (screenshot s5). The pin exists but steps just fade/blur through; no transformation is depicted. |
| Work | `components/marketing/home/FeaturedWork.tsx` | Alternating rows; fine bones, but the generated gradient covers are visibly empty vapor (screenshot s7) — "abstract gradient card" = placeholder tell. Needs designed, per-case-study cover compositions. |
| Metrics | `components/marketing/home/MetricsBand.tsx` | Four counters in a row, count-up on enter. Counters-in-a-row is a 2018 agency pattern; numbers without narrative context. |
| Testimonials | `components/marketing/home/Testimonials.tsx` | 1 wide + 2 stacked quote cards; static, same card grammar as everything else. |
| Team | `components/marketing/home/TeamPreview.tsx` | Monogram-avatar grid — reads as "no photos yet" placeholder. |
| FAQ | `components/marketing/home/FaqStrip.tsx` | Default accordion. |
| Final CTA | `components/marketing/home/FinalCta.tsx` | Breathing gradient orb + centered pill — closest to premium of the nine, but arrives with no earned momentum because nothing built toward it. |
| Sitewide | `app/globals.css` | Single dark theme only. No `next-themes`, no light tokens, no toggle, nothing per-theme in 3D/charts/OG. An entire V2 pillar simply absent. |
| Sitewide | `components/motion/Reveal.tsx` | One reveal grammar (rise+fade+blur) reused for everything = uniform, forgettable motion. No masked line reveals outside the hero, no clip-path, no parallax layers with distinct velocities. |
| Typography | `lib/fonts.ts`, `--text-hero` in `app/globals.css` | Hero clamp caps at 5.5rem — timid against the "viewport-scaled display type" bar; Space Grotesk everywhere for display+eyebrows+numbers flattens the voice (no true editorial contrast between display and body). |

## 5 · Copy audit (feeds COPY-V2)

- Hero: "Ship AI products your users actually use." — competent, generic; promises
  nothing measurable, and is about *products*, not the visitor's *business*.
- CTAs: "Book a free AI strategy call" / "Book a call" / "Start a project" vary by
  surface (`Hero.tsx`, `SiteNav.tsx`, `FinalCta.tsx`, `StickyCta.tsx`, contact page) —
  V2 unifies on **"Book a 5-minute growth call"** everywhere.
- No risk-reversal microcopy anywhere near a CTA.
- Section headings are fine one-by-one ("Proof, not promises.") but don't ladder into
  one argument.

## 6 · What V1 got right (protected in V2)

- The chaos→structure Signal Field concept + its capability gating/poster fallback
  (`components/three/HeroVisual.tsx`) — **keep, refine, re-art-direct** (Act 1).
- Lenis⟷GSAP ticker wiring, reduced-motion kill-switch, route-scroll reset
  (`components/motion/MotionProvider.tsx`) — keep the architecture, extend it.
- Island nav interaction model (morph hamburger, focus trap) — keep, restyle + theme.
- Double-bezel card system, aurora token discipline, console-zero, a11y record
  (AA contrast, `inert`, real `<dl>`s) — keep as floor, not ceiling.
- Everything behind `/admin`, `/api`, `lib/`, `scripts/` — untouched by V2 except the
  documented additive changes (10 services, `sample` flag, settings-driven hero copy).

## 7 · Remediation map (audit finding → V2 workstream)

| Finding | Fix lives in |
|---|---|
| blur-filter scrubs (`Reveal.tsx`, `ProcessStory.tsx`) | Motion core rebuild — transform/opacity only, `ScrollTrigger.batch`, masked/clip reveals |
| 28.4% dropped frames | Motion core + per-act choreography budgets + `content-visibility` below fold |
| 244KB initial JS | Speed pass — SplitText route-gating, chunk audit, defer non-critical glue |
| No narrative | Seven-act homepage (DESIGN-SPEC-V2 §acts) |
| Template tells per §4 | Act-by-act redesign to spec; ten-service rail; designed covers |
| No theming | Dual-theme token system (Porcelain Editorial light + refined Aurora Obsidian dark) |
| Copy | COPY-V2 five-minute voice, single CTA, risk-reversal |
