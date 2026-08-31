# Gate X — spec-vs-build diff & taste pre-flight (V2)

Verdict: **PASS with documented deviations.** Every §5 act, both themes, all ten
services, 12 case studies, and the narrative spine are built and verified
(Gate N transcript: cold-reader answered all six questions from the scroll
alone). Deviations below are deliberate, each with a reason; none change the
narrative, the copy voice, or the visual grammar.

## A · Spec conformance by section

| Spec § | Status | Notes |
|---|---|---|
| 0 · One idea / reading spine | ✓ | Gate N PASS (fresh-context judge, screenshots only). |
| 1 · Design language | ✓ | Bezels, island nav, single warm CTA per screen, mono meta, custom easing, console-zero (probe clean). |
| 1a · Taste pre-flight law | ✓ | See §B. Visible-dash scan across all 20 routes: 0 after switching the `<title>` separator to a middot. |
| 2 · Theme system | ✓ | Gate T: 25/25 assertions (system default, zero flash both directions, toggle persists, admin hard-dark). |
| 3 · Typography | ✓ | Token scale in `globals.css`; SplitText masked lines; `disableBelow(768)`. |
| 4 · Motion core | ✓* | transform/opacity/clip-wipes only. *Deviations 1–3 below. |
| 5 · Seven acts | ✓* | All acts + indicator built; *deviations 4–9 below. |
| 6 · Inner pages | ✓ | Before→After on all 10 service pages (Gate T captures); /work zero empty filters at 12 studies; about/contact/legal/404 re-themed. |
| 7 · Budgets | ✓* | Traces (median, 4× CPU, software raster): dark **5.9%** / light **9.1%** dropped, **0 long tasks** in 12 of 13 runs. CLS 0. LH desktop 100×4; mobile a11y/BP/SEO 100. *Deviations 10–12. |
| 8 · Data deltas | ✓ | `sample: true` flag + admin badge (public never renders it); 4 new services; 12 studies; idempotent seed. |
| 9 · Execution order | ✓ | Followed; gates run in order R → S → T → N → X. |

## B · Taste pre-flight (public surface)

- **Zero visible em/en dashes** — rendered-HTML scan of all 20 routes: clean
  (arrows `→` retained for before→after notation, per the law's carve-out).
  Admin surfaces are out of scope and keep table-placeholder dashes.
- **Eyebrows** — home: 3 of 7 acts (1, 5, 7), within the ≤⌈7/3⌉ cap; no dots;
  no numbering-eyebrows (the act rail owns wayfinding). Inner pages ≤3 each.
- **Hero stack** — eyebrow, ≤2-line headline, ≤20-word subline, CTA pair.
  No scroll cue, no trust strip.
- **One label per CTA intent** — booking = "Book a 5-minute growth call"
  (nav/hero/act 7/inner CTA bands); portfolio = "See the work".
- **Zigzag cap** — act 5's third row is full-bleed 21/9; no 3-in-a-row splits.
- **Logo wall** — vendored simple-icons paths, `currentColor`, logos only.
- **Quotes** — testimonial pull-quotes ≤3 rendered lines; attribution in mono.
- **Documented deviations (owner mandate wins)** — Act 4 stage + generated
  covers depict abstract product artifacts (bars/blocks, never fake-precise
  text); all seeded metrics are fictional and flagged `sample: true`.

## C · Deviations register (all deliberate)

1. **Reveals reverse by default** (`once: false`) — spec §4 said `clearProps`
   + once; the owner's bidirectional-motion contract supersedes it: every
   scroll entrance reverses on scroll-up (spec §1a records the contract).
2. **Server-first reveal pattern partially applied** — the seven acts are
   client components (they ARE the choreography); static sections and inner
   pages stay server components. Consequence is deviation 10.
3. **Act 1 pins via `position: sticky`** instead of a ScrollTrigger pin —
   no pin-spacer reflow, same beats, simpler under Lenis.
4. **Act 1 exit** — the spec'd angular clip polygon became a straight
   full-rect wipe by Act 2's panel (calmer; angular frame read as noise).
5. **Act 2 illumination** — the 0.22-opacity word floor was replaced by a
   two-layer build (AA base layer + scrubbed lit overlay) after Lighthouse
   flagged 1.62:1 mid-scrub contrast. Same reading-wave, always ≥AA.
6. **Act 3 → 4 and act 4 → 5 hand-offs simplified** — no full-bleed card
   expansion, no FLIP dock of the dashboard into act 5's first cover. Both
   were cut in the Gate S pass (continuous scale/FLIP scrubs re-raster
   layers in software raster); the acts hand off by adjacency instead.
7. **Act 4 sweep is a paired-transform window** (wrapper `xPercent` +
   counter-translate) rather than a clip-path split — visually identical,
   repaint-free (Gate S evidence).
8. **Act 7 field breath dropped; FAQ is a static `<dl>`** — the 8s opacity
   breath violated the paint-free law for a fixed layer; disclosure
   accordions hid the objection-killers (answers now always visible).
9. **Field lifecycle** — the fixed canvas renders only while acts 1/7 are
   on stage (visibility-gated); the designed posters live INSIDE acts 1 and
   7. Spec's "never disappears; it matures" is expressed by poster + dim
   tweens; the always-on canvas cost ~4pp of frames (Gate S bisect).
   Theme toggle icon is a sun/moon crossfade, not morphing ray paths.
   Act indicator: labels render always (not hover); indicator (and mobile
   bar) mount on home only — inner routes have no scroll-progress bar.
   **Fixed this gate:** the indicator queried `[data-act]` through its
   scoped GSAP context and always saw zero sections (stuck at `01`, no
   dots/labels/SR announcements) — now queries `document` directly;
   verified advancing 01→03→04→06 with correct labels + `aria-live`.
10. **Initial marketing JS 258KB gz vs <160KB budget** — stack floor
    (React 19 + Next 16 runtime + GSAP core ≈ 210KB before app code);
    recorded in TEST-REPORT with the chunk audit.
11. **`content-visibility: auto` removed** — negligible gain measured, and
    it breaks beyond-viewport capture; below-fold cost is handled by lazy
    images, deferred chunks, and the field lifecycle instead.
12. **Act-rail dots are `tabIndex={-1}`** inside an `aria-hidden` container —
    spec asked for keyboard-focusable rail; focusable controls inside
    `aria-hidden` are an a11y defect, so the rail stays decorative
    (SR users get the `aria-live` act announcements; all content is in
    normal document flow).
13. **OG images stay dark-brand** (no client theme at render time) — spec §2
    already records this.
14. **Known capture artifact (environment, not app)** — in this container,
    headless Chromium under software raster intermittently skips glyph
    raster for display-face runs ≥~100px in `reducedMotion: reduce`
    contexts (isolation: DOM/layout/opacity verified correct; same text
    paints at 60px, other faces paint at 124px, and the interactive path
    paints the identical headlines in both themes). Real-browser paths and
    the live preview are unaffected; flaked evidence captures were re-shot.
