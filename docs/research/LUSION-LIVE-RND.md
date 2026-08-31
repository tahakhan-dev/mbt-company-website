# Lusion.co — Live R&D Study

## Method and date

Conducted **2026-08-31** against the live production site at `https://lusion.co`, using a real
Chromium instance driven through the Playwright MCP tools. Two viewports were studied: desktop
**1440×900** and mobile **390×844** (CSS pixels, DPR 1). Screenshots were captured at CSS-pixel
scale and saved to `docs/research/lusion/`; every file is indexed in the table at the end of this
document and laid out visually in `LUSION-SCREEN-CONTACT-SHEET.md`.

One methodological note that is itself a finding: **the window never scrolls.** `html` and `body`
are `overflow: hidden`; a fixed `#ui` layer hosts the DOM while `#page-container` is translated
with a `matrix()` transform by a custom virtual scroller. Programmatic `scrollTo` does nothing —
only real (trusted) wheel events move the page, and the scroller applies heavy easing, momentum,
and **scene snapping**: inside the homepage's long 3D narrative our probes consistently settled at
discrete positions ~5,370 px apart, and near the end of the sequence a single momentum burst
"fast-forwarded" tens of thousands of virtual pixels to the next resting point. Scroll beats below
are therefore the site's own snap points, not arbitrary offsets. Virtual page lengths measured:
homepage ≈ **51,554 px** (desktop) / 47,411 px (mobile); about ≈ 25,738 px; projects index ≈
10,746 px; project detail pages have essentially **no vertical travel** — they scroll horizontally
(see below).

Per the brief, no Lusion asset, shader, geometry, media, or font file was downloaded or extracted;
all observations come from rendered screenshots, DOM/CSS inspection, and request metadata.

## Homepage, beat by beat

**Loading (home-desktop-00-loading.png).** A pure black screen with a small centered white
progress bar and an enormous numeric counter in the lower-left corner (caught at "092"). The
loader is typographic and quiet — no logo animation, no spinner — and it doubles as a promise of
craft: the number is the percentage of the WebGL payload arriving.

**Beat 1 — Hero (offset 0, home-desktop-01.png).** The page opens *light*: a lavender-tinted
off-white ground (`#f0f1fa`) that frames a dark, rounded-corner (20 px radius) canvas "stage"
filling most of the viewport. Inside the stage, dozens of glossy jack-like plastic crosses in
exactly three material colors — cobalt blue, black, white — tumble under physics and react to the
pointer. The DOM chrome sits *on the light frame, not on the canvas*: LUSION wordmark top-left, a
three-line mission statement in the top center ("We create 3D visual storytelling and interactive
web experiences that help brands stand out"), and three pill controls top-right (a circular audio
toggle, a dark "LET'S TALK" pill — the single warm CTA — and a light "MENU" pill). Small `+`
registration marks and a centered "SCROLL TO EXPLORE" caption run along the bottom edge. The
composition is a proscenium: light mat, dark stage, one accent color.

**Beat 2 — Reel (~2,400, home-desktop-02.png).** The stage hands off to a second dark rounded
panel, a muted violet, holding an angled isometric collage of the studio's project screen
recordings drifting slowly. "PLAY" and "REEL" in giant white caps are split by an oval play
button. The page around the panel stays light; darkness is always *contained in a card* until the
narrative section takes over.

**Beat 3 — Featured Work (~5,600, home-desktop-03.png).** A fully light editorial section: a
"Featured Work" heading with a short mono subline, then a two-column grid of rounded autoplaying
video cards (Synthetic Human, Meta: Spatial Fusion, spOOOce, Digital Design Days…). Each card
carries a tiny uppercase mono meta line ("WEB • DESIGN • DEVELOPMENT • 3D") and a very large
grotesk title beneath. In the accessibility tree every title character exists four times — the
titles are built from per-character spans for scramble/stagger hover animations, and the meta
lines visibly display scramble glyphs (`concept • web [$0y.`) mid-animation. A "See all projects"
link closes the section.

**Beats 4–10 — the "goal" narrative (~9,000 → ~47,000).** One section (`#home-goal`) accounts for
~40,000 of the 51,000 virtual pixels — **roughly 80 % of the homepage scroll is a single pinned,
full-bleed WebGL film**, broken into acts that the scroller snaps between:

- *Act 1 (home-desktop-04/05).* Hard cut to full black. An astronaut floats toward camera, arms
  spread, lit by a faint chromatic-aberration halo. The framing goes from waist-up to full-body as
  scroll progresses; the only DOM left is the nav pills and a thin progress tick on the right edge.
- *Act 2 (home-desktop-06).* Giant white display caps overlay the scene: "STEP INTO A NEW WORLD
  AND LET YOUR IMAGINATION RUN WILD" — the site's thesis, printed over the astronaut.
- *Act 3 (home-desktop-07).* The camera pulls far back; the astronaut becomes a tiny figure
  suspended in a huge dark void ringed by an iridescent lens ring — a breathing beat of pure scale
  contrast.
- *Act 4 (home-desktop-08/09).* A wireframe voxel/data-cube world glitches into existence around
  the figure — white/teal shards, scan-line noise, motion blur — deepening into a tunnel.
- *Act 5 (home-desktop-10).* The same cube-world shifts to a green/yellow palette with several
  astronauts drifting through it; light bloom intensifies.
- *Act 6 (home-desktop-11).* Whiteout burst into a *bright cobalt blue* world: motion-blurred
  ribbons and glass shapes streak past — the single loudest color moment on the page.
- *Act 7 (home-desktop-12).* The payoff: the camera settles and the whole blue world turns out to
  be playing *inside a monitor on a stand* against a navy room — the astronaut falls through
  shattering glass inside the screen. The metaphor lands the studio's pitch: wild imagined worlds,
  delivered on real screens.

**Beat 11 — CTA (~49,700, home-desktop-13.png).** Still black: the astronaut reappears as a
mascot with an LED-matrix smiley face, surrounded by floating 90s sticker confetti (lips, hearts,
skeleton, 8-ball, lightning bolts). A tiny mono kicker asks "IS YOUR BIG IDEA READY TO GO WILD?"
above a giant "Let's work together!" in the display grotesk. The white band of the footer is
already visible below — the film ends and the page becomes a document again.

**Beat 12 — Footer + next-page teaser (bottom, home-desktop-14.png).** A white footer: Bristol
street address, social links, general/new-business email addresses, and a "Subscribe to our
newsletter" field. Beneath it, a dark band reads "KEEP SCROLLING TO LEARN MORE — ABOUT US — NEXT
PAGE →": continuing to scroll pushes into the next route, making the whole site feel like one
continuous reel rather than discrete pages.

**Light vs dark.** The page is light at both ends (hero frame, reel frame, featured grid, footer)
and dark for the entire middle narrative plus the CTA. Darkness is introduced *inside rounded
cards* first (hero stage, reel panel) so the full-bleed black of the goal section feels like a
card that grew to swallow the page — a deliberate, staged handoff rather than a theme flip. The
body background itself stays white/off-white throughout; every dark moment is canvas or card.

**Typography scale.** Two families do everything: **Aeonik** (grotesk; Regular, Medium, an Italic
used as an accent) for display and body, and a mono pair (**IBM Plex Mono** plus a small custom
**LusionMono**) for meta lines, HUD labels, and eyebrow text. The scale contrast is extreme:
11–12 px uppercase mono labels sit directly against 90–200 px display setting (the "PROJECTS"
index heading spans nearly the full 1440 px viewport). There is no intermediate hierarchy —
either whisper or shout — and that binary is a large part of the site's voice.

## Inner pages

**About (about-desktop-01…06).** The about page inverts the homepage's framing: it opens *dark*
and full-bleed. First frame: a particle cloud (the astronaut dissolved into thousands of dots)
above a screen-wide "LUSION" in display caps. Scrolling reveals a monochrome moonscape — a tiny
astronaut standing in a crater under a vertical light beam, debris suspended mid-air — overlaid
with "WE ARE LUSION / A CREATIVE / *PRODUCTION STUDIO*" left and "*CRAFTING UNIQUE / DIGITAL
EXPERIENCES*" right (italic lines as accents). Deeper, a TEAM section renders each member as a
dotted-particle portrait bust (first: Edan Kwan, cofounder & creative director) amid matrix-rain
glyphs, with mono HUD ornaments (`[[ 001 ]]`, tick rulers), a giant pixel-block initial letter,
and a cobalt circular arrow button to advance through people. The page then slams to a flat
**cobalt blue** services section: four white rounded cards — STRATEGY / CREATIVE / TECH /
PRODUCTION — each with a pixel-glyph icon, a dotted-rule list of services, and its own title
mirrored upside-down at the card's foot like a print artifact. The About page is where the studio
shows *range*: cinematic monochrome, data-glitch, then flat Swiss card layout, all in one scroll.

**Projects index (projects-desktop-01…03).** Light and editorial, almost a magazine index: a
viewport-wide "PROJECTS" headline with the count ("19") as a superscript numeral and a large
diagonal arrow, then a two-column grid of rounded, autoplaying video thumbnails — every tile is
motion, no static imagery — each with mono meta and a big title. The page ends with the same
"Let's work together!" CTA re-staged *light*: black display text on off-white, surrounded by flat
confetti geometry in the token palette (cobalt, green `#c1ff00`, red, purple, greys), plus a
"CONTINUE TO SCROLL" pill. Same CTA, two costumes — dark theatrical on home, flat graphic here.

**Project detail (proj-synthetic-human-*, proj-porsche-*, proj-spatial-fusion-*).** A strict,
reused template with one big move: **each project tints the entire page in its own pastel** —
violet for Synthetic Human, dusty pink for Porsche: Dream Machine, lilac for Meta: Spatial Fusion
— driven by per-project CSS custom properties (`--project-details-*` exist as themable tokens in
the root stylesheet). Layout: left column with the project title in Aeonik, two short paragraphs
of case copy, a mono SERVICES list, a LINKS list, and one white pill CTA ("LAUNCH PROJECT" or
"WATCH VIDEO"); right side, a large rounded media panel bleeding off the right edge. A "BACK" pill
appears in the header and "SCROLL TO EXPLORE »" sits bottom-right. Crucially, **the page scrolls
horizontally**: wheel input advances a filmstrip of rounded panels — full-bleed render stills,
device mockups (laptop, tablet, phone) playing the shipped site, photographs of installations, and
design-system boards (logo construction, color swatches, icon sets, button states, type
specimens). The filmstrip ends with "NEXT PROJECT →", chaining cases the way the homepage chains
routes. Media is never pasted raw: it is always matted inside a rounded panel on the tinted
ground, or framed inside a physical device render.

## Menu and route transitions

**Desktop menu (menu-desktop.png).** Not a full-screen takeover. Clicking MENU (label swaps to
CLOSE) drops a compact stack of floating cards anchored under the pill: a white nav card (HOME /
ABOUT US / PROJECTS / CONTACT, the active route marked with a dot), a white newsletter card with
an email field, and a black LABS card with a pixel glyph linking to labs.lusion.co. A large cyan
squiggle ornament draws itself behind the page content while the menu is open. Hovering a nav item
fills it with a lavender pill and reveals an arrow.

**Mobile menu (menu-mobile.png).** The same card stack, but now a genuine full-screen takeover on
a flat cobalt (`#0016ec`-family) ground: white nav card, white LET'S TALK card, black LABS card.
The desktop dropdown and the mobile takeover are the same components at two densities.

**Route transition (transition-about-1/2/3).** Observed by clicking "About us" in the open menu:
(1) the clicked item highlights (lavender pill + arrow); (2) the menu cards fade and slide away
while the underlying page remains; (3) a **full-black cover wipes in, on which a blocky pixel "L"
mark assembles block by block** — the same visual language as the loading counter — holding for
roughly 1–1.5 s while the next route's scene loads; (4) the new page reveals with its own intro
(About fades up from the particle cloud). Click-to-settled measured ≈ 2 s. So: an overlay/cover
transition (SPA — the Astro-bundled app and the WebGL context persist), not a morph of one canvas
scene into the next; the L-cover masks the scene swap and doubles as a branded beat.

## Mobile adaptation: recomposed vs scaled

- **Recomposed:** The nav collapses to wordmark + a single dot-circle button (LET'S TALK and MENU
  fold into the menu screen). The hero headline moves from center-top to under the logo, and the
  stage card becomes portrait. The reel panel shrinks to a media band with a repeating
  "PLAY REEL ▶▶▶" marquee row — a different component, not a squeezed one. The featured grid drops
  to one column and titles move below cards with an arrow prefix. The footer stacks and the
  newsletter moves above the address block. The menu becomes the full-screen takeover described
  above.
- **Scaled (kept):** The entire goal narrative survives on mobile with the same acts, same
  shaders, glitch tunnel, stickers, and CTA — recropped for portrait rather than simplified. The
  oversized act text is *allowed to bleed off the viewport edges* ("A NE[W] / LET / RU[N]" visible
  as fragments at 390 px) — scale is prioritized over containment; the astronaut stays centered
  and legibility of the fragments is accepted as a stylistic cost.
- Virtual scroll, snapping, and the next-page teaser behave identically; total virtual length is
  slightly shorter (~47,400 px).

## Technical findings

- **Renderer:** one full-viewport `<canvas>` with `data-engine="three.js r158"`, WebGL2 context.
  Two auxiliary 2D canvases exist: a 45×45 one (cursor/audio widget) and a hidden full-size one.
  All 3D across all routes lives in this single persistent canvas; DOM UI floats above it.
- **Post-processing:** requests for `smaa-search.png` / `smaa-area.png` (SMAA antialiasing) and an
  `LDR_RGB1_0.png` LUT reveal an AA + color-grading composite pass on top of the scenes.
- **Fonts:** exactly six self-hosted woff2 files, ~0.18 MB total: Aeonik Regular / Medium /
  RegularItalic, IBM Plex Mono Regular / Medium, and LusionMono. `document.fonts` shows only these
  three families.
- **Design tokens (root custom properties):** off-white `#f0f1fa`, dark-white `#e4e6ef`, black,
  white, blue `#1a2ffb`, dark-blue `#071bdf`, header blue `#0016ec`, green `#c1ff00`, red
  `#ff4c41`, purple `#8832f7`, grey-blue `#2b2e3a`, error `#e90000`; a 12-column grid with 2vw
  gap; `--global-border-radius: 20px` (the ubiquitous card radius); base paddings
  `max(5vw, 40px)` / `clamp(30px, 4vw, 50px)`; and a family of `--project-details-*` variables
  that project pages override to tint themselves.
- **Backgrounds:** `body` remains white/off-white at every scroll position sampled; all darkness
  is canvas scenes or dark cards. The light/dark alternation is content-level, not theme-level.
- **Audio:** a full UI soundscape of 16 small `.ogg` files — hover_0–2, click_0–1, focus_0–2,
  page_0–1, glass_broken, cinematic_0/2/3 loops, generic ambience + generic_end — with a dedicated
  audio toggle button in the header (waveform icon when active, minus when muted).
- **Payload shape:** app is built on **Astro** (single hoisted `/_astro/*.js` bundle); heavy
  assets ship from a separate CDN host (`lusion.dev`). Geometry uses a **custom `.buf` binary
  format** (e.g. `assets/models/plant.buf`) rather than glTF/Draco/KTX2. Project media are short
  self-hosted mp4 loops (`video0/1.mp4`, range-requested) plus ~16 webp textures per page; the
  showreel streams from Vimeo. Exact byte totals were not measurable from the page context (the
  CDN sends no `Timing-Allow-Origin`, so `transferSize` reads 0 cross-origin) and, per the brief,
  no assets were downloaded to weigh them; the *count* profile (few fonts, many tiny oggs, a
  handful of mp4 loops, webp textures, one JS bundle) is the reliable observation.
- **Reduced motion:** no `prefers-reduced-motion` rules exist in any stylesheet, and under
  emulated `reduce` the homepage loads the identical full-physics hero. There is no discoverable
  reduced-motion path — a genuine accessibility gap in an otherwise polished build.
- **Console:** clean. Zero errors, zero warnings across home, about, projects, and three project
  pages; the only output is a styled "Created by Lusion" signature log per navigation.

## Design lessons (principles to implement, not pixels to copy)

1. **Frame the spectacle in a calm mat.** Lusion's hero is a dark canvas *inside* a light page
   with a 20 px radius, not a full-bleed scene. Why it works: the frame gives the eye a resting
   ground, makes the 3D read as a crafted object, and lets DOM chrome stay legible without
   overlays. Desktop: stage card ~90 % width; mobile: same card recomposed portrait.
   Reduced-motion: the frame means a static poster fallback still composes. Cost: near zero — it
   is CSS; it actually *reduces* canvas area to render.

2. **One canvas, many scenes.** A single persistent WebGL2 context serves every route; scenes swap
   behind a cover transition. Why: no context churn or re-init jank on navigation, and route
   changes stay instant-feeling. Mobile: identical. Reduced-motion: scene swap can become a
   crossfade. Cost: engineering complexity in scene lifecycle management; memory of retained
   scenes must be managed.

3. **Escalate darkness through containers.** Dark card → darker card → full-bleed dark narrative →
   return to white footer. Why: the theme shift feels narratively earned instead of arbitrary, and
   the page still "ends" in daylight where the practical content (contact, footer) lives.
   Implication for us: sequence Aurora Obsidian's darkest moments mid-page and bracket them with
   lighter bezels. Cost: none — ordering decision.

4. **Spend the scroll budget on one story.** 80 % of the homepage's virtual height is a single
   pinned narrative with snap-stops at act boundaries; the informational sections are compact.
   Why: users remember one long coherent film better than six short gimmicks; snapping guarantees
   nobody parks between acts on a half-composed frame. Desktop: wheel-driven with momentum;
   mobile: same acts, portrait crops. Reduced-motion: snap points become static slides — design
   each act to hold as a still. Cost: the length must be authored; every act needs art.

5. **Whisper/shout typography.** Two sizes dominate: ~11 px uppercase mono meta and 90–200 px
   display grotesk, with body text used sparingly in between. Why: the contrast itself is the
   brand; hierarchy needs no weights or colors. Works at both viewports by letting display text
   wrap or even clip. Cost: free; requires discipline, not code.

6. **Meta lines as instrumentation.** Tiny mono labels, `+` registration marks, tick rulers,
   `[[ 001 ]]` counters, and scramble-in text give every screen a "calibrated instrument" texture
   around the emotional 3D. Why: it signals engineering credibility and gives idle areas quiet
   detail. Reduced-motion: render scramble text in its final state. Cost: trivial DOM; keep
   scramble timers off the main thread of attention (short, once).

7. **Per-case page tinting via tokens.** Project pages override a small set of CSS variables so
   the whole route (background, buttons, highlights, even the logo color) wears the project's
   palette. Why: each case feels bespoke while shipping one template; the portfolio reads as
   range. Implementation: our design tokens already centralize color — add a per-slug override
   layer. Cost: none at runtime.

8. **Rotate the case-study axis.** Detail pages scroll horizontally through rounded media panels
   ending in "NEXT PROJECT →". Why: the axis change signals "you are inside an artifact now," and
   filmstrip framing suits screen-shaped media. Mobile: fall back to vertical stacking (Lusion
   keeps pages short there). Reduced-motion/accessibility: must keep keyboard/scrollbar
   equivalents — Lusion's own version is wheel-only, which we should improve on. Cost: moderate
   JS; virtualize panels for memory.

9. **Chain everything.** Footer → "KEEP SCROLLING — ABOUT US — NEXT PAGE →"; case ends → "NEXT
   PROJECT →". Why: momentum is never dropped; the site becomes one continuous reel and session
   depth increases. Cost: small — an intersection trigger and a route push; must not hijack until
   the user actually keeps scrolling.

10. **Loading as typography.** A black screen, a thin progress bar, and a giant percentage
    numeral; route changes reuse the same language (pixel-block logo assembling on black). Why:
    honest about heavy payloads, on-brand, and cheap; the *transition is the brand moment*, no 3D
    required. Reduced-motion: it already barely moves. Cost: trivial.

11. **UI soundscape behind an explicit toggle.** Tiny ogg sprites for hover/click/focus/page
    events plus ambient loops, all gated by a visible header toggle. Why: sound makes physical
    interactions land, but only invited sound is tolerable. Implementation: 16 files totaling very
    little; preload after first interaction. Reduced-motion/a11y: default OFF (Lusion defaults on
    with visible mute — we should invert). Cost: negligible bytes; needs an audio manager.

12. **Three-color material discipline in hero 3D.** The jacks come in exactly cobalt / black /
    white — the brand palette as *materials*, not as UI chrome. Why: the 3D scene reads as branded
    even with zero logos in frame. Cost: none; an art-direction rule.

13. **Contrast of scale as a beat.** Act 3 shrinks the astronaut to a speck in a huge void right
    after a close-up. Why: alternating intimate and vast framings is what makes a scroll film feel
    cinematic rather than like a turntable demo. Cost: camera keyframes only.

14. **The same CTA in two costumes.** "Let's work together!" appears dark-theatrical (stickers,
    LED mascot) on the homepage and flat-graphic (confetti vectors on off-white) on the projects
    index. Why: repetition builds memory; re-staging keeps it fresh and lets the light version
    ship on pages without WebGL. Cost: one extra composition.

15. **Post-process for cohesion.** SMAA + LUT grading unify wildly different scenes (moonscape,
    glitch cubes, blue burst) into one photographic look. Why: grading is what makes multi-scene
    3D feel like one film. Cost: real GPU cost — budget it, and drop the pass first on weak
    devices.

## What NOT to copy (Lusion-specific identity)

1. **The astronaut protagonist and LED-faced mascot.** It is their recurring character across
   home, about, and CTA — a signature, not a pattern.
2. **The jack/cross hero objects and their physics pile.** Instantly recognizable as lusion.co's
   opening frame.
3. **Exact camera choreography of the goal film** (float-in → text → void ring → glitch-cube
   tunnel → blue burst → monitor payoff). The *structure* (acts, scale contrast, payoff-on-screen)
   is a lesson; the shot list is theirs.
4. **LusionMono and the Aeonik pairing.** Their licensed/custom faces; we have our own type law.
   Likewise the pixel-block "L" loader glyph built from their logo.
5. **The 90s sticker-confetti CTA texture** (lips, skeleton, 8-ball) — a personal, era-specific
   flourish that would read as direct imitation.
6. **The "Created by Lusion" console signature and labs.lusion.co tie-ins** — brand ephemera.
7. **The cyan squiggle menu ornament and cobalt menu ground** — their menu's visual signature; we
   should keep the card-stack *pattern* but draw our own ornament language.
8. **The moonscape/space art direction wholesale.** Space + astronaut = Lusion's world-building;
   our narrative needs its own world.

## Screenshot index

| File | Viewport | Shows |
|---|---|---|
| `lusion/home-desktop-00-loading.png` | 1440×900 | Loading state: black, progress bar, giant "092" counter |
| `lusion/home-desktop-01.png` | 1440×900 | Hero: light frame, dark stage card, cobalt/black/white jacks, nav pills |
| `lusion/home-desktop-02.png` | 1440×900 | Reel panel: violet collage of project screens, PLAY REEL |
| `lusion/home-desktop-03.png` | 1440×900 | Featured Work grid: video cards, mono meta, huge titles |
| `lusion/home-desktop-04.png` | 1440×900 | Goal act 1: astronaut close-up on black (scroll ~9.3k) |
| `lusion/home-desktop-05.png` | 1440×900 | Goal act 1b: astronaut full-body, arms spread (~11.3k) |
| `lusion/home-desktop-06.png` | 1440×900 | Goal act 2: "STEP INTO A NEW WORLD…" display text overlay (~12.8k) |
| `lusion/home-desktop-07.png` | 1440×900 | Goal act 3: tiny astronaut in void with iridescent ring (~18.2k) |
| `lusion/home-desktop-08.png` | 1440×900 | Goal act 4: glitch data-cube tunnel materializes (~20.4k) |
| `lusion/home-desktop-09.png` | 1440×900 | Goal act 4b: deeper glitch tunnel, motion blur (~23.6k) |
| `lusion/home-desktop-10.png` | 1440×900 | Goal act 5: green/teal cube world, multiple astronauts (~29k) |
| `lusion/home-desktop-11.png` | 1440×900 | Goal act 6: cobalt blue burst, motion-blur ribbons (~39.5k) |
| `lusion/home-desktop-12.png` | 1440×900 | Goal act 7: scene inside monitor, shattered glass (~44.9k) |
| `lusion/home-desktop-13.png` | 1440×900 | CTA: "Let's work together!", sticker confetti, LED mascot (~49.7k) |
| `lusion/home-desktop-14.png` | 1440×900 | Footer + "ABOUT US / NEXT PAGE" dark teaser band (bottom) |
| `lusion/menu-desktop.png` | 1440×900 | Desktop menu: dropdown card stack, cyan squiggle, LABS card |
| `lusion/transition-about-1.png` | 1440×900 | Route transition t≈0.25s: About item highlighted in menu |
| `lusion/transition-about-2.png` | 1440×900 | Route transition t≈0.75s: menu cards dissolving |
| `lusion/transition-about-3.png` | 1440×900 | Route transition t≈1.55s: black cover with pixel-block "L" |
| `lusion/about-desktop-01.png` | 1440×900 | About opening: particle astronaut + giant LUSION type |
| `lusion/about-desktop-02.png` | 1440×900 | About: moonscape, astronaut under light beam, WE ARE LUSION |
| `lusion/about-desktop-03.png` | 1440×900 | About: moonscape pulled back, italic display accents |
| `lusion/about-desktop-04.png` | 1440×900 | About: moonscape wide, beam narrows (deep scroll) |
| `lusion/about-desktop-05.png` | 1440×900 | About TEAM: particle portrait (Edan Kwan), HUD marks, blue arrow |
| `lusion/about-desktop-06.png` | 1440×900 | About services: cobalt ground, 4 white cards (Strategy/Creative/Tech/Production) |
| `lusion/projects-desktop-01.png` | 1440×900 | Projects index: giant PROJECTS + count 19, video grid start |
| `lusion/projects-desktop-02.png` | 1440×900 | Projects grid: Worldcoin Globe, Lusion Labs rows |
| `lusion/projects-desktop-03.png` | 1440×900 | Projects end CTA: light "Let's work together!" with confetti shapes |
| `lusion/proj-synthetic-human-01.png` | 1440×900 | Case opening: violet tint, left copy column, right media panel |
| `lusion/proj-synthetic-human-02.png` | 1440×900 | Case: laptop mockup panel in horizontal filmstrip |
| `lusion/proj-synthetic-human-03.png` | 1440×900 | Case: product-screen still panel mid-filmstrip |
| `lusion/proj-synthetic-human-04.png` | 1440×900 | Case end: tablet mockup + "NEXT PROJECT →" (DDD 2024) |
| `lusion/proj-porsche-01.png` | 1440×900 | Case opening: dusty-pink tint, WATCH VIDEO CTA |
| `lusion/proj-porsche-02.png` | 1440×900 | Case: particle-bloom render + installation photo panels |
| `lusion/proj-porsche-03.png` | 1440×900 | Case: full-bleed fiber-wave still between panels |
| `lusion/proj-porsche-04.png` | 1440×900 | Case: Porsche crest particle render panel |
| `lusion/proj-spatial-fusion-01.png` | 1440×900 | Case opening: lilac tint, Webby link, headset key art |
| `lusion/proj-spatial-fusion-02.png` | 1440×900 | Case: VR headset photo panel |
| `lusion/proj-spatial-fusion-03.png` | 1440×900 | Case: brand-board panel (logo, colours, typography) |
| `lusion/proj-spatial-fusion-04.png` | 1440×900 | Case: UI icons/buttons board + device photo |
| `lusion/reduced-motion-home.png` | 1440×900 | Hero under emulated prefers-reduced-motion (unchanged, full 3D) |
| `lusion/home-mobile-01.png` | 390×844 | Mobile hero: portrait stage card, headline under logo |
| `lusion/home-mobile-02.png` | 390×844 | Mobile reel band + PLAY REEL marquee, Featured Work, first card |
| `lusion/home-mobile-03.png` | 390×844 | Mobile featured list: Everswap, Porsche, Synthetic Human |
| `lusion/home-mobile-04.png` | 390×844 | Mobile: end of list, SEE ALL PROJECTS, "Where Creative Ideas…" |
| `lusion/home-mobile-05.png` | 390×844 | Mobile goal act: astronaut close-up + STEP INTO text |
| `lusion/home-mobile-06.png` | 390×844 | Mobile goal act: oversized text bleeding off viewport edges |
| `lusion/home-mobile-07.png` | 390×844 | Mobile glitch cube tunnel (portrait crop) |
| `lusion/home-mobile-08.png` | 390×844 | Mobile glitch world with multiple astronauts |
| `lusion/home-mobile-09.png` | 390×844 | Mobile CTA: Let's work together! + stickers |
| `lusion/home-mobile-10.png` | 390×844 | Mobile footer + ABOUT US next-page teaser |
| `lusion/menu-mobile.png` | 390×844 | Mobile menu: full-screen cobalt takeover, card stack |
