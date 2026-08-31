# MOTION MATRIX — per-route grammar

Status: DRAFT for Creative Gate A. Every animated thing on the site must trace to a row here and a
job from the master prompt's Section 9.1 list (explain / reveal hierarchy / connect / spatial
continuity / before-after / reward interaction / guide action). Anything that can't name its job
gets deleted.

## Global rules

- One owner per animated property: the custom scene timeline owns camera/light/material/uniforms;
  CSS/WAAPI owns simple DOM reveals; Motion (Framer) is allowed only inside React admin islands.
  GSAP is NOT in the new stack (it dies with the Next build).
- Native scroll always; visual interpolation damped (response ~0.12–0.18 crit-damped), input never
  hijacked. No nested scroll traps. Pins: desktop only, one per page max (Home Ch.3), ≤4 viewport
  heights, with reduced-motion and mobile bypass.
- Animate: transform, opacity, shader uniforms. Never scroll-animate: blur, box-shadow, layout,
  large filters.
- Easing family (brand): `ease-mech` cubic-bezier(0.72, 0, 0.14, 1) for mechanical docking;
  `ease-drift` cubic-bezier(0.22, 0.08, 0.14, 1) for camera/ambient; `ease-out-fast`
  cubic-bezier(0.16, 1, 0.3, 1) for UI micro. No default easings, no springs on the public site.
- Durations: micro 120–200ms; UI reveal 350–500ms; mechanical beat ~600ms; route transition
  ≤700ms; camera phrases 1–2.5s of scroll distance.
- Reduced motion: scrub off, inertia off, authored stills, near-instant transitions, video paused.
  Content identical.

## Route × motion table

| Route | Scroll model | Camera grammar | Light arc | Type motion | Signature micro | Transition out |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 9-chapter master timeline; one desktop pin (Ch.3) | Establish → gap-dolly → orbit-step → push-in → truck → portal-pass → recede → settle | Cold split → studio → accents → project reflections → warm | Masked lines; hero words assemble once on load only | Conduit spark on CTA hover | Frame expands into next route |
| Services index | Free scroll, step-activation | Inspection orbit, 30° steps | Studio white + per-module accent | Numbered atlas counts up | Module dock "seat + quarter-turn" | Active module handed to detail route |
| Service detail | Free scroll | Lock-on → open module → macro pass | Module accent dominant | H1 masked once; body static | Module micro-behavior loops at ~0.2 intensity | Next-service handoff carries a part |
| Work index | Free scroll | Dormant portals in margins; media planes lead | Neutral paper; media provides color | Giant WORK settles 1 time | Hover: refraction edge + role/outcome reveal | Portal-pass into case study |
| Case study | Free scroll | Project scene, one cameo divider | Project palette | Chapter numerals tick | Media-through-glass hover | Next-project pull |
| MVPs | Free scroll | Continuous push-in across page | Studio → warming | Phase labels dock like parts | Layer-seat clunk (visual only) | Standard |
| About | Free scroll | Dark open, decomposition, human-height finish | Dark → warm human key | Statement type at 14vw, masked | Sketches settle with paper drag | Standard |
| Contact | Minimal | One settle move on load, then still | Warmest, static | None beyond reveals | Form focus glow (accessible) | Quiet opacity |
| Admin | None of the above | n/a | n/a | n/a | 150ms fades only | Instant |

## Interaction micro-set (public)

- Magnetic CTAs: ≤8px translation, ease-out-fast, keyboard focus gets equivalent ring + same label
  transition.
- Press state: 0.97 scale, 120ms.
- Nav labels: masked slide, 200ms.
- Cursor: default everywhere except portal media (subtle "view" affordance); never hide cursor.
- Focus-visible: 2px accent ring, offset 3px, on every interactive element, all scene states,
  contrast-checked per theme.

## Performance guardrails per row

Every scene keyframe added to the visual-regression set. Budgets (SCENE-ARCHITECTURE.md): no
long-task cluster >100ms during 10s steady scroll at 4× throttle; 60fps desktop / 30–60fps mobile;
zero per-frame allocation in hot paths; DPR cap 1.5 with dynamic downshift.
