# AIGENVORA STORYBOARD — Homepage and route narrative

Status: DRAFT for Creative Gate A. 2026-08-31.
Companion docs: MOTION-MATRIX.md (per-route grammar), SCENE-ARCHITECTURE.md (runtime),
COPY-DECK.md (working copy), GENERATIVE-ASSET-LEDGER.md (shot budget).

## 1. The spine — Aigenvora Engine, restated operationally

One original object carries the whole site: a precision digital mechanism of **twelve modules**
around a core — machined ceramic (matte, slightly warm white), dark titanium, translucent optical
glass, illuminated flexible conduits, fine engraved markings. Twelve modules = twelve service
lines, same order as the services taxonomy, each with an assigned accent bias and a micro-behavior
(e.g. the Automation module has a reciprocating armature; the Data module has laminar internal
flow; the Security module has an iris shutter).

Seven narrative states (Unresolved → Alignment → System → Application → Proof → Human control →
Resolution) map onto homepage chapters and recur, re-entered from different angles, on inner
routes. The engine is never "an animation on top of a section" — the page IS the camera's path
through the object's life.

### Design keys (what makes it ours, not Lusion's)

- **Editorial-first**: pages open on paper (#F2F3F8), not void. Darkness is entered deliberately,
  as a chamber, and exited. Target ratio on the homepage: ~55% light field / 35% dark chamber /
  10% saturated project media.
- **The frame device**: the engine lives inside a hairline-ruled "stage" — a drafting-table frame
  with mono annotations (module indices, state read-outs like `STATE: UNRESOLVED`,
  `MODULES 00/12`). The frame is HTML/SVG, not canvas, so it survives every tier. As chapters
  progress the frame expands, breaks, and re-forms — that's our transition signature.
- **Light writes the story**: cool split light = disorder; white studio light = explanation;
  per-module emission = activation; project-colored reflections = proof; warm key = people; warm
  low light = resolution.
- **Type is structural**: display grotesk at 12–18vw participates in scenes (passes behind/through
  the engine with depth-tested masking) but every word also exists as real DOM text.

## 2. Chapter storyboard — homepage (9 chapters, one scroll)

Format per chapter: PURPOSE / STAGE / CAMERA / LIGHT / MOTION / COPY (see COPY-DECK) / MOBILE /
REDUCED-MOTION (Tier C).

### Ch.1 — Arrival (state: Unresolved)
- PURPOSE: name, promise, authority in <3s.
- STAGE: paper field. Left 7 columns: eyebrow, hero statement, two CTAs (one warm). Right 5
  columns: the framed stage, deep — twelve modules drifting in controlled disorder, conduits dark,
  annotations flickering low readouts. HTML hero paints first; canvas fades in beneath it.
- CAMERA: static three-quarter establishing view; ≤1.5° inertial pointer parallax.
- LIGHT: cold directional key from off-frame right, soft white fill; modules read as silhouettes
  with glinting edges.
- MOTION: modules drift on slow noise curves; occasional conduit spark that fails to connect —
  the "almost working" tension. Scroll begins pulling modules toward rails.
- MOBILE: stage moves above copy at ~55vh, portrait-recomposed (modules cluster vertically);
  CTAs thumb-reachable.
- REDUCED-MOTION: authored still of the unresolved state (pre-rendered poster from our own scene),
  full copy, no scrub.

### Ch.2 — The problem (state: Unresolved, examined)
- PURPOSE: why Aigenvora exists.
- STAGE: the frame expands past the viewport edges — paper slides away, we are inside the dark
  chamber (#030407→#090B10 gradient). Abstract operational evidence: signal lines that terminate
  nowhere, duplicated pulse trains, module pairs misaligned by a few degrees. NOT floating
  dashboard cards. Optional HF-01 volumetric plate sits behind the live geometry.
- CAMERA: slow dolly along the gap between two module groups — the camera literally travels
  through the disconnection.
- LIGHT: fragmented cold pools; each group lit separately, nothing shares a key light.
- MOTION: manifesto lines (3, masked line reveals) arrive at fixed scroll marks; each line's
  arrival snaps one signal to a dead end — text and scene state the same fact.
- MOBILE: same chamber, single module group, 2 manifesto lines, shorter travel.
- REDUCED-MOTION: one still of the misaligned pair + all three lines as static text.

### Ch.3 — The system (state: Alignment → System) — the service atlas
- PURPOSE: all twelve services, memorably.
- STAGE: chamber resolves to studio white. Modules slide onto rails and align around the core.
  Desktop: pinned inspection — scroll steps 01/12→12/12; active module docks, ignites its conduit,
  and the adjacent column shows service name + one outcome line + link. Progress readout
  `MODULES 07/12` in the frame.
- CAMERA: locked orbit radius, stepping 30° per service, with a micro dolly-in on each dock.
- LIGHT: white studio key; the active module gains its accent emission (blue/lime/violet bias per
  service family).
- MOTION: docking is mechanical and satisfying — rail glide, seat, quarter-turn lock, ignite.
  Each has ~600ms of authored ease (no springs).
- MOBILE: NO pin. Vertical editorial index (numbered 01–12, big type) with a single simplified
  module viewer at top that swaps state as the list scrolls (IntersectionObserver, not scrub).
- REDUCED-MOTION: static aligned-engine still + the plain 12-row index. Identical links.

### Ch.4 — For founders (state: Application, subtractive)
- PURPOSE: MVP offer unmissable.
- STAGE: the engine core empties — modules retract to the frame edges leaving a void with a single
  small seed object (a founder's idea: a glass tetrahedron). Scroll assembles seven thin layers
  around it: strategy, UX, application, data, AI, infrastructure, launch — each a labeled ring.
- CAMERA: slow push-in from wide to medium on the growing product.
- LIGHT: transitions from studio white toward a first hint of warmth as layers complete.
- MOTION: each layer arrives as a machined part, not a particle bloom. Copy states the phase.
- CTA: "Plan your MVP" (warm — this chapter's single warm action).
- MOBILE: rings become a vertical stack build; same 7 beats, tighter camera.
- REDUCED-MOTION: exploded-diagram still with the seven labeled layers.

### Ch.5 — Transformation (state: Application, comparative)
- PURPOSE: business value, before/after.
- STAGE: split spatial scene. Left: cold fragmented pools — manual work as separate stuttering
  signal clusters (messages, documents, bookings, payments, CRM, reporting — abstract glyphs
  engraved on small plates, not fake UI). Right: the same plates connected through one conduit
  spine, pulses flowing in rhythm. Scroll drags the divide left until connection wins the frame.
- CAMERA: lateral truck following the divide.
- LIGHT: the story IS the lighting — six cold pools merge into one continuous source.
- COPY: capability statements only, owner-approved; no invented client results.
- MOBILE: vertical before→after (top/bottom), divide dragged by scroll.
- REDUCED-MOTION: single still with divide at 50% + copy.

### Ch.6 — Work (state: Proof)
- PURPOSE: evidence.
- STAGE: 4–6 verified projects. Modules become **portals**: the camera approaches a module's glass
  face and project media (real screens/video, rights-cleared) is visible THROUGH it, refracted at
  the edges; passing fully through lands in a full-bleed editorial media block (HTML) with project
  color, name, role, outcome, link. Then the next portal.
- CAMERA: approach → pass-through → editorial rest → pull-back → next. The rest states are real
  scroll sections, not canvas — media stays crisp and selectable.
- LIGHT: each project's palette reflects onto the engine while its portal is active.
- MOBILE: portals become full-width media cards with the refraction treatment as a static edge
  effect; swipe/scroll rhythm.
- REDUCED-MOTION: standard editorial project list with hero images — still art-directed.
- HARD RULE: no gradient covers; nothing publishes unverified (see PORTFOLIO-SOURCE-LEDGER).

### Ch.7 — Client voices (state: Proof, human)
- PURPOSE: human proof.
- STAGE: quiet paper interlude. One testimonial at a time. Video testimonial: large cinematic
  stage with poster + duration + play (scene rendering pauses during playback). Text-only:
  editorial quote composition (portrait, quote at display size, company, project link) — no empty
  video chrome. Audio-only: restrained waveform + transcript.
- MOTION: minimal — masked quote reveal, slow portrait parallax.
- MOBILE/REDUCED-MOTION: near-identical; this section barely moves by design.

### Ch.8 — People and method (state: Human control)
- PURPOSE: who does the work.
- STAGE: the engine recedes to a small quiet presence upper-frame. Paper field fills with human
  material: photography, sketches, prototype fragments, a 5-step delivery method as an annotated
  strip. Senior involvement / communication / ownership stated plainly.
- LIGHT: warm key enters for the first time at full strength.
- MOTION: tactile — things settle like prints on a table, slight paper drag on scroll.
- MOBILE: sequential; portraits at human reading pace.
- REDUCED-MOTION: fully static, loses almost nothing.

### Ch.9 — Resolution (state: Resolution)
- PURPOSE: convert.
- STAGE: the complete engine, at rest, warm low light (HF-02 plate optional behind). Final promise
  (one sentence), warm CTA "Build with Aigenvora", secondary contact line, risk-reversal microcopy.
  The footer scene grows out of the same stage — the frame's hairlines extend into the footer grid.
- CAMERA: settles to the calmest frame on the site and stops.
- MOBILE/REDUCED-MOTION: warm still + identical conversion block.

## 3. Route continuity map

| Route | Opens on | Engine role | Signature move |
| --- | --- | --- | --- |
| Home | Paper | Full 7-state arc | Frame expands/breaks/reforms |
| Services index | Paper | Engine opened flat — exploded atlas, camera inspects | Numbered atlas 01–12 with module activation |
| Service detail ×12 | Paper → module chamber | ONE module isolated, opened, its micro-behavior explains the service | Module handed off from index via transition |
| Work index | Paper, giant WORK type | Modules as dormant portals in margins | Media planes with refraction edges |
| Case study | Project-colored cinematic open | Engine yields — project media and palette lead; one module cameo as the "systems" chapter divider | Media-through-glass motif |
| MVPs for Startups | Paper | Empty core → product build (Ch.4 expanded to full page) | Layer-by-layer assembly |
| About | Dark cinematic open (the one route that opens dark) | Engine decomposes into decisions/sketches/tests/people | Decomposition to human field |
| Contact | Paper, warmest | Resolved engine, minimal motion | Stillness |
| 404 | Paper | One lost module drifting + link home | Single wink of motion |

Transitions: departing route hands a real element (a module, the frame, a media plane) to the
arriving route; ≤700ms; quiet opacity handoff under reduced motion or low tier. Navigation never
blocked.

## 4. Mobile choreography principles

Recomposed, not scaled: portrait module clusters, no pins, IntersectionObserver state-swaps
instead of scrub where fidelity would suffer, DPR ≤1.5, simplified geometry set (module count in
frame ≤4 at once), posters for Tier C. CTA and nav one-handed. No horizontal overflow anywhere.

## 5. Capability tiers (contract with SCENE-ARCHITECTURE.md)

- Tier A (WebGL2, capable, motion allowed): everything above.
- Tier B: same narrative, conservative DPR, no postprocessing beyond SMAA, volumetric plates
  replaced by static gradients, portal refraction simplified to planar distortion.
- Tier C (no WebGL / reduced motion / low power): authored still per chapter from OUR scene
  (rendered at build time), full copy and links, CSS-only reveals. Same content, same order, same
  conversion paths. Designed, not degraded.

## 6. What Gate A approves

1. This chapter arc and the route continuity map.
2. The engine's material language (ceramic/titanium/glass/conduits/engravings) and the frame
   device as the brand signature.
3. The light-ratio commitment (site is NOT uniformly black; About is the only dark-opening route).
4. Type direction pending Aeonik license decision (see ASSET-RIGHTS-LEDGER open decisions).
5. The Higgsfield shot plan below (no spend until this document is approved).

## 7. Higgsfield shot briefs (full versions of GENERATIVE-ASSET-LEDGER rows; NO spend yet)

- **HF-01 — Problem chamber plate.** 21:9, 6–8s seamless loop, near-black blue-grey volumetric
  haze, three cold light shafts entering at conflicting angles, extremely slow drift, no objects,
  no text, no lens flares. Sits at 20–30% opacity behind live geometry. Negative: logos, text,
  people, recognizable machinery, bloom kitsch. Fallback if unavailable: layered gradient +
  animated grain in GLSL (already planned as Tier B behavior).
- **HF-02 — Resolution plate.** 21:9 loop, warm amber key light raking across dark machined-metal
  surfaces, near-still, breathing not moving. Same negatives. Fallback: static authored gradient +
  scene lighting only.
- **HF-03 — Transition plate.** 1–2s, abstract ceramic surface fracturing into light conduits,
  used as a masked wipe texture. Lowest priority.
- **HF-04 — Mobile portrait derivative** of whichever plate ships, only if the desktop crop fails
  at 390px.

Direction tests (≤2 credits) will test HF-01 composition variants only — not "random styles".
