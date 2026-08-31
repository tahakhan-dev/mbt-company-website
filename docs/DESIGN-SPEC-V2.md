# DESIGN SPEC — V2 public layer

**Status:** governing document for the V2 overhaul. Committed before any component
code, per the operating rules. Technique IDs (`T1`…) refer to `RND-NOTES.md`.
Copy strings come from `COPY-V2.md`. Backend, admin, analytics, data model, and the
free-tier envelope are untouched except the additive changes in §8.

---

## 0 · The one idea

**Noise in. Growth out.** A business drowns in operational noise — tickets,
spreadsheets, order flows, 2am alerts. MBT builds the AI layer that turns that noise
into structure, structure into recovered hours, hours into growth. The homepage *is*
that transformation, told once, in seven acts, on a single scroll spine.

The persistent Signal Field (V1's one great asset) becomes the narrator (T4, T18):
one WebGL canvas, fixed behind the page, whose **state** is keyed to the act —
chaos (1) → converging (2) → engineered lattice (3–4) → calm supporting glow (5–6) →
serene ordered grid (7). It never disappears; it matures. On devices without WebGL or
with reduced motion: the existing designed poster per act-state (static gradients),
same narrative.

**Reading spine:** every act answers one visitor question, in order:
1. What is this? → 2. Why do they exist? → 3. What exactly do they do? →
4. What changes for my business? → 5. Can I trust it? → 6. Who are they? →
7. What's the next step? — This mapping is Gate N's answer key.

## 1 · Design language (both themes)

- **Grammar kept from V1 law:** double-bezel cards, island nav, ONE warm CTA per
  screen, eyebrow tags, mono metadata, custom easing (`--ease-swift`
  cubic-bezier(0.32,0.72,0,1) + expo.out family), console-zero.
- **New sitewide moves:** exposed hairline grid moments at act boundaries (T12),
  act numerals `01–07` in mono (T13), blueprint dot-grid texture on "engineering"
  stages (T30), designed product-composition covers instead of vapor gradients (T26),
  editorial type-only viewports (T9).
- **Nav "Book a call" pill** becomes ghost style; the warm amber lives on exactly one
  element per viewport (hero CTA, act-7 CTA, sticky mobile CTA — never two at once).
  Fixes the V1 double-warm violation (AUDIT §4).
- **Icons:** existing ultra-light stroke set; no emojis; no new icon family.

### 1a · Taste-skill pre-flight law (adopted mid-build when the real plugin landed)

The owner installed github.com/leonxlnx/taste-skill; its pre-flight is binding on
the public surface (admin/product UI is out of its scope). Amendments over the
original spec:
- **Zero em/en-dashes** in any visible string (prose punctuation: periods,
  commas, colons, middots). Arrows (→) remain for before→after notation.
- **Eyebrow restraint:** max one eyebrow per three sections; home keeps 3 of 7
  (Acts 1, 5, 7); no decorative dot; no section-numbering eyebrows in content
  (the act indicator owns wayfinding).
- **Hero stack:** exactly eyebrow + headline (≤2 lines) + subtext (≤20 words) +
  CTA pair. No scroll cue, no trust strip in the hero.
- **One label per CTA intent** sitewide (portfolio intent = "See the work").
- **Zigzag cap:** never three consecutive image/text splits; act 5's third row
  is a full-bleed feature.
- **Logo walls carry real vendored brand marks** (simple-icons, currentColor),
  logos only, no category labels.
- **Bidirectional motion contract (owner requirement):** every scroll-driven
  animation plays forward on scroll-down and reverses on scroll-up. Scrubbed
  acts are bidirectional by construction; entrance reveals play/reverse on
  leave-back; counters reset and replay. `once` behavior is reserved for
  load-in moments only.
- **Documented deviations (owner mandate wins):** generated product-artifact
  covers and the Act 4 before/after stage depict abstract product UI (the
  brief demands these scenes; image-gen is unavailable; compositions use
  abstract bars, never fake-precise text, and are replaceable via Cloudinary);
  seeded metrics are fictional sample content flagged `sample: true`.

## 2 · Theme system

Strategy: `next-themes` (`attribute="class"`, `defaultTheme="system"`,
`enableSystem`, its built-in pre-hydration inline script = zero flash), class `dark`
on `<html>`. Semantic tokens are **runtime CSS custom properties** defined on `:root`
(light) and `.dark` (dark); Tailwind v4 maps them via `@theme inline` so every
existing utility keeps working. Admin subtree renders inside a hard `dark` wrapper —
admin look unchanged, no toggle there.

**Theme toggle** (island nav, T14): sun/moon icon with morphing rays→crater paths
(transform/opacity per path), and a ~250ms token crossfade — a transient
`theme-fade` class on `<html>` adds `transition: background-color .25s var(--ease-swift), color .25s, border-color .25s, fill .25s, stroke .25s` to themed
surfaces, removed on `transitionend`. (No View-Transition clip reveal for theme —
route transitions own that API; two uses collide.) Persisted by next-themes
(localStorage), honored on the static preview.

### Dark — "Aurora Obsidian, refined" (T24 ladder)

| Token | Value | Notes |
|---|---|---|
| `--void` (page) | `#05070c` | unchanged |
| `--surface` | `#0b0e16` | card inner |
| `--raised` | `#111624` | elevated |
| `--lift` | `#161d2f` | NEW 4th step: hover/active |
| `--ink` | `#eef2f8` | 15.8:1 on void |
| `--ink-mute` | `#9aa6b8` | 7.6:1 |
| `--ink-faint` | `#76839b` | 5.3:1 (AA, kept from V1 fix) |
| `--hairline` | `rgba(255,255,255,.08)`; strong `.12` | |
| aurora | cyan `#22d3ee` / teal `#2dd4bf` / violet `#8b5cf6` | glows/strokes/gradients ONLY (T25) |
| `--cta` | `#f5b14c` (hover `#f7c06e`) | the single warm |
| grain | 3% noise overlay | existing asset |

### Light — "Porcelain Editorial" (mandated palette + T29 depth model)

| Token | Value | Notes |
|---|---|---|
| `--void` (page) | `#F7F7F4` | porcelain base |
| `--surface` | `#FFFFFF` | raised white |
| `--raised` | `#FFFFFF` | + shadow ladder below |
| `--lift` | `#F2F1EC` | pressed/hover tint |
| `--ink` | `#0B0E16` | 17.4:1 on base |
| `--ink-mute` | `#55607A` | 6.6:1 |
| `--ink-faint` | `#6B7690` | 4.9:1 (AA on #F7F7F4 and #FFF) |
| `--hairline` | `rgba(11,14,22,.08)`; strong `.14` | |
| aurora | cyan `#0E7490` / teal `#0F766E` / violet `#4F46E5` | 4.5:1+ as text on base |
| `--cta` | `#B45309` (hover `#92400E`) | amber, 4.6:1 w/ white text |
| shadows | `0 1px 2px rgba(11,14,22,.04), 0 12px 40px -12px rgba(11,14,22,.10)` | ultra-diffused, replaces dark's inset highlight |
| grain | 2% noise overlay | lighter |

Per-theme variants required: Signal Field uniforms (particle/line colors, bloom
strength), act-boundary gradient washes, noise opacity, cover compositions
(`lib/covers`), scroll indicator, favicon-safe logo contrast. **OG images stay dark
brand** — an OG render has no client theme; documented deviation.

Contrast law: every text/bg pair in BOTH themes computed ≥4.5:1 (≥3:1 only for
≥24px decorative display), verified in Gate T.

## 3 · Typography

Faces kept (self-hosted, licensed): **Space Grotesk** display · **Instrument Sans**
body (+ real italic for editorial accents) · **Geist Mono** numerals/eyebrows/meta.
(Fontshare remains egress-blocked; swap path in `lib/fonts.ts` untouched.)

| Role | Size | Weight/tracking | Use |
|---|---|---|---|
| `display-hero` | `clamp(3.2rem, 1.4rem + 7.2vw, 7.75rem)` | 500, `-0.045em`, lh 0.98 | Act 1, Act 7 (T31) |
| `display-act` | `clamp(2.4rem, 1.2rem + 4.4vw, 5rem)` | 500, `-0.035em`, lh 1.04 | act headlines |
| `manifesto` | `clamp(1.75rem, 1rem + 2.6vw, 3.25rem)` | 480, `-0.02em`, lh 1.22 | Act 2 lines |
| `title` | `clamp(1.35rem, 1.05rem + 1vw, 1.9rem)` | 500 | card/case titles |
| `body` | `1.0625rem` / `1.125rem` lg | 400, lh 1.65 | prose |
| `meta` | `0.8125rem` | mono 500, `+0.18em`, uppercase | eyebrows, act numerals |
| `stat` | `clamp(2.2rem, 1rem + 3.4vw, 4rem)` | mono 500 | claim numbers |

Act numerals render as `02 / 07` mono meta. Hero/act display always SplitText masked
lines (`mask:"lines"`, transform-only), `disableBelow(768)` stays for LCP.

## 4 · Motion core (rebuild)

**Allowed animated properties: `transform`, `opacity`, `clip-path` (wipes only).
`filter`/`box-shadow`/`backdrop-filter` never animate.** (AUDIT §1 root causes 1–2.)

- `Reveal` rebuilt: variants `rise` (y 28→0 + fade), `mask` (clip-path inset bottom
  → 0 + y), `scale-in` (0.96→1 + fade); `clearProps` after; `once: true`.
  List/grid consumers go through **`ScrollTrigger.batch`** (new `RevealGroup`).
- **Server-first reveal pattern:** sections stay Server Components; reveal targets are
  marked with `data-reveal` attributes and orchestrated by ONE small client component
  per act (cuts the V1 pattern of shipping whole sections as client JS — AUDIT §2).
- Lenis: unchanged single instance on the GSAP ticker; add anchor-link handling
  (`lenis.scrollTo` for `#hash`), overlay pause (existing stop/start), and
  `ScrollTrigger.refresh()` after `document.fonts.ready`. Scrubs use `scrub: 0.5–1`.
- Pins: `pinType: "transform"` default under Lenis; acts 1/3/4 own the only pins.
- **View Transitions (route-level):** Next 16.3 ships experimental `viewTransition`;
  enable behind verification in Gate R — cross-fade + 12px rise, ≤400ms, custom
  easing. If the flag misbehaves with the App Router setup, fallback = existing GSAP
  enter fade upgraded to a curtain (fixed `--surface` panel wipes up ≤400ms). Theme
  toggle deliberately does NOT use the API (§2).
- **Caching decision (verified against current docs + V1 Gate B evidence):** marketing
  routes are already fully static+ISR via `unstable_cache` + tag/layout purge
  (`lib/data/revalidate.ts` — empirically load-bearing on 16.3, see CLAUDE.md).
  Next 16.3's `"use cache"`/Cache Components remains experimental-flagged; migrating
  would re-open the Gate B revalidation proof for zero visitor-visible gain. **V2
  keeps the V1 caching architecture unchanged**; recorded as a deliberate deviation
  from the brief's suggestion, with this justification.
- Reduced motion: every act renders its **final** state statically (no pins, no
  scrubs, content instantly visible, poster field). Same narrative, zero choreography.
- Mobile (<768): no pins except Act 1 (shortened 130vh); Act 3 becomes a snap-scroll
  vertical list; Act 4 becomes stacked before/after cards with a static arrow morph;
  parallax off; SplitText off (LCP).

## 5 · The seven acts — storyboard & scroll timeline

Desktop scroll budget ≈ 1150vh total. Notation: `[pin Nvh]` = pinned distance;
beats give property → value at scrub %, all transform/opacity/clip-path.

### Act 1 — SIGNAL `01/07` · "What is this?" · [pin 240vh]
- **Stage:** full-viewport field in chaos state; headline + subline + the ONE warm CTA
  ("Book a 5-minute growth call") + ghost "See the work"; mono scroll cue.
- **Beats:** 0–15% headline lines mask-in (load, not scroll); scrub 0→55%:
  `fieldState.progress` chaos→lattice (existing shader morph, re-graded per theme);
  35–55% headline exits (per-line y -110% mask), claim line **"Noise in. Growth
  out."** mask-in + mono caption "This is what we do with operational chaos."; CTA
  persists (it's the act's fixed anchor, bottom-left).
- **Exit (T1):** 78–100%: angular clip frame `polygon(12% 0, 76% 0, 90% 92%, 0 96%)`
  → full rect on the incoming Act 2 panel — the manifesto surface wipes over the hero.
- **Light theme:** field particles ink-navy on porcelain, lines cyan-700; wash =
  radial porcelain-white; **Dark:** V1 aurora grading + deeper bloom on lock-in.

### Act 2 — WHY WE EXIST `02/07` · manifesto · ~190vh, no pin
- **Stage (T9):** type-only viewport; 5 manifesto lines (COPY-V2 §3), `manifesto`
  scale, max-w 28ch, hairline left rule w/ act numeral.
- **Line illumination scrub:** each line splits to words; per-line ScrollTrigger
  (start "top 78%", end "top 45%", scrub 0.6) drives word `opacity 0.22 → 1` with
  ±3-word overlapping stagger — an ink-fill reading wave. Opacity floor 0.22 is
  decorative-scan-safe: any mid-scrub state keeps the *read* line ≥AA because
  illumination completes before the line passes 45% viewport (the read zone).
  Last line's key phrase gets an aurora gradient text clip as it completes.
- **Exit (T20):** gradient morph — fixed conic aurora wash crossfades from
  ink-neutral to engineering-cyan as Act 3's rail slides up (y 6vh → 0).

### Act 3 — THE SYSTEM `03/07` · ten services · [pin 460vh]
- **Stage:** pinned split. Left column: act headline + running index `NN/10` (mono,
  tabular) + per-service one-liner. Right: **stacked deck** (T22 grammar): service
  cards stacked with 14px y-offsets/scale 0.965 decrement (3 visible); scrub advances
  deck — top card exits y -18% + rot -1.6° + fade, next promotes to full scale.
  Blueprint dot-grid stage floor (T30).
- Each card: double-bezel, service number, name, 3 mono capability chips, micro
  before→after line ("Inbox triage 4h/day → 12min review").
- **Progress:** left rail 10-tick track fills with scrub; ticks clickable
  (lenis.scrollTo the matching scrub offset).
- **Order (COPY-V2 §5):** the 4 new "operations" services lead (chatbots, BPA,
  e-commerce, WordPress/CMS), then the V1 six — leads with what SMB visitors buy.
- **Exit:** deck's last card expands to a full-bleed panel (scale + clip inset→0)
  that becomes Act 4's "before" wall — a pin hand-off, no gap.

### Act 4 — THE TRANSFORMATION `04/07` · before→after · [pin 320vh]
- **Stage (T22/T26):** center: one continuous composition — "your Tuesday" — built
  from our tokens as a designed product artifact (ticket queue, spreadsheet grid,
  alert toasts vs. calm dashboard: automation runs ticking green, unified numbers,
  quiet inbox). Two DOM layers, **before** and **after**; scrub crossfades via
  clip-path vertical split sweep (inset right→left) + micro item transforms
  (tickets file themselves into rows at 20–45%).
- **Claim beats (T23):** four claims own scrub ranges (~18% each), pinned center-left,
  mask-in/out: "40+ hours/month back" · "Answers in seconds, not days" ·
  "Orders that move themselves" · "Every number on one screen" (stats in `stat` mono,
  counters allowed — count on enter of each range).
- **Exit (T2):** mask-window — the calm dashboard shrinks into a framed card that
  docks as Act 5's first proof artifact (matched-position hand-off, FLIP transform).

### Act 5 — PROOF `05/07` · ~260vh, no pin
- Eyebrow "Signals from the field". 3 featured case rows (T10): designed cover
  compositions (per-service palette, product-artifact style — no vapor), parallax
  0.88×/1× differential, metric stat right; covers tilt ±3° on hover (T3).
- Logo strip relocates here (from V1's post-hero slot) as "Teams we've moved" +
  testimonial pair on staggered rise. One metrics line (3 counters max) folded into
  the row rhythm — not a counter band.
- Light theme: white cards + diffused shadows on porcelain; skewY(-2.5deg) seam caps
  the act (T28).

### Act 6 — THE PEOPLE `06/07` · ~150vh
- Editorial split: left manifesto-scale line "Small team. Senior hands. No handoffs.";
  right: 4 portraits (existing monogram system restyled as duotone porcelain/obsidian
  tiles w/ hairline frames), y-parallax stagger, role meta in mono. Founder pull-quote
  with oversized quotation glyph.

### Act 7 — FIVE MINUTES `07/07` · ~180vh + footer
- Field state: serene ordered grid, slow breath (opacity 0.5→0.65, 8s alternate).
- `display-hero` line: "Five minutes. Bring your worst bottleneck." then CTA block:
  the warm **"Book a 5-minute growth call"** (magnetic w/ elastic release, T15) +
  risk-reversal microcopy: "No pitch — you leave with a plan." · "Reply within one
  business day." Ghost alt: "Or write to us".
- 3 objection-killer mini-FAQ rows (accordion moved from home FAQ; rest of FAQ →
  /contact). Footer follows (V1 footer restyled to themes).

### Sitewide act indicator
- Desktop: fixed left rail — 7 hairline ticks + current numeral `03` mono +
  act label on hover; fills with page progress (transform scaleY on a track).
- Mobile: 2px top progress bar (transform scaleX), no labels.
- `aria-hidden` decorative; live act announced via visually-hidden `aria-live` only
  on act change. Hidden on non-home routes (progress bar only remains).

## 6 · Inner pages (V2 pass)

- **Service pages ×10:** hero w/ per-service designed artifact, **Before→After block**
  (mandated): two-column "Life before / Life after" w/ 3 concrete beats each +
  micro-metric; deliverables, process fit, related proof, final CTA band. Same acts
  grammar, no pins (one `mask` reveal rhythm).
- **/work:** filter row (kept logic), V2 covers, zero-empty-filter rule re-verified
  with 12+ studies.
- **Case study pages:** hero cover art, situation→system→signal structure (copy pass),
  fact `<dl>` kept, next-case curtain hand-off (T11).
- **/about:** manifesto reprise + team + values; **/contact:** 2-step form kept,
  restyled; full FAQ lands here. Legal pages: token pass only.
- **404**: kept, re-themed.

## 7 · Performance & quality budgets (Gate S/T targets)

| Budget | Target |
|---|---|
| Initial marketing JS (gz, excl. lazy 3D chunk) | **<160KB** — via server-first reveal pattern (§4), SplitText only on routes that split, chunk audit |
| LCP throttled mobile | ≤1.8s (hero headline is LCP; SplitText disabled <768) |
| CLS | <0.02 · INP <200ms |
| 10s scroll trace @4× CPU, both themes | no long-task cluster >100ms; **<10% dropped frames** (V1: 28.4%) |
| 3D | DPR ≤1.5, idle-mounted, paused off-screen, zero per-frame allocs, disposed on unmount (V1 mechanisms kept) |
| Below-fold | `content-visibility:auto` + `contain-intrinsic-size` on non-pinned acts 5–7 + footer |
| A11y | AA both themes; reduced-motion narrative parity; keyboard: deck/act-rail focusable |
| Console | zero, both themes |

## 8 · Data & backend deltas (the ONLY backend-adjacent changes)

1. `lib/schemas/project.ts`: add `sample: z.boolean().default(false)`. Seed marks all
   seeded studies `sample: true`; admin lists render a neutral "Sample" badge;
   public rendering ignores the field entirely.
2. `scripts/seed-content.ts`: +4 services (slugs `ai-chatbots-customer-automation`,
   `business-process-automation`, `ecommerce-engineering`, `wordpress-cms-engineering`
   — existing 6 slugs unchanged), +6 case studies (12 total, every service covered by
   ≥1 via `serviceSlugs`), settings hero copy → COPY-V2 winner. Idempotent upserts,
   same stable-ID scheme; `npm run seed` refreshes live content.
3. No rules/auth/analytics/collections changes. Write-budget math unaffected (content
   writes are one-off).

## 9 · Execution order (each act verified before the next)

theme tokens+provider+toggle → motion core → Act 1 → 2 → 3 (needs 10 services in
seed first) → 4 → 5 (needs 12 studies) → 6 → 7 + indicator → inner pages → speed
pass → gates. Gate T screenshots per act in both themes at 1440/768/390; Gate N runs
on the finished home only.
