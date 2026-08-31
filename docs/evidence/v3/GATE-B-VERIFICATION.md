# GATE B VERIFICATION — engine + representative prototypes

Date: 2026-09-01. Scope: Phases 2–4 of the V3 master prompt (Astro foundation, engine prototype,
representative inner pages). Full page production (Phase 5) is intentionally NOT started — it
awaits Creative Gate B approval, per the master prompt.

## Commands run and results

| Check | Result |
| --- | --- |
| `astro check` (TS strict) | 0 errors, 0 warnings, 0 hints |
| `vitest run` | 24/24 pass (timeline, bezier, damp, tier classifier, TTL cache, publication gate, scroll math) |
| `astro build` (production, Netlify adapter) | green |
| Secret scan of client bundle | no FIREBASE_*/private-key material in `dist/_astro` |
| Route smoke (dev server) | `/` 200 · service 200 · case 200 · unknown 404 |
| Console | zero errors on all routes (one informational Astro reduced-motion notice under emulated reduce, dev-only) |

## Measured budgets (dev machine, headless Chromium)

| Budget | Target | Measured |
| --- | --- | --- |
| Initial route JS (excl. engine) | <170KB gz | **~7.2KB gz** (ClientRouter 5.6 + boot 1.6) |
| Engine chunk (three r158 + postprocessing + runtime) | lazy, separate | **185.8KB gz** (+ runtime 5.6KB), loads after load/idle/first-intent |
| Steady 10s scroll @4× CPU throttle | no long-task cluster >100ms; 60fps desktop | **60fps, zero long tasks ≥100ms** |
| Draw calls / triangles (home, full engine) | ≤40 target (SCENE-ARCHITECTURE) | **102 calls / 18,480 tris** — over call target, still 60fps; instancing/merge pass scheduled for Phase 5 hardening |
| Horizontal overflow at 390px | none | none (fixed nav overflow found and repaired during QA) |
| Route transition | ≤700ms, canvas persists | **140ms nav; single canvas persisted; scene swapped; no duplicates** |
| Fonts | small, self-hosted | 4 woff2, ~108KB total |
| Media plates | optimized | HF-01/02 webp 17–60KB each, mobile crops derived locally |

## Behavior verified

- Tier A: full engine, SMAA composer, HalfFloat linear pipeline (clear-color double-encode bug
  found empirically and fixed with a path-aware helper, `src/engine/color.ts`).
- Tier C (reduced-motion emulation): engine never downloads; designed SVG posters render; all
  copy, links and CTAs present; HF-01 plate serves as CSS background with mobile crop.
- Chamber and case-study "darkness" is rendered by the scene (clear-color alpha), with solid CSS
  fallbacks for no-JS/Tier C/failed-engine states.
- NaN guard on pointer input (malformed events can no longer blank the camera).
- Dispose path exercised on every route swap; context-loss handler restores once then fails over
  to posters permanently.

## Evidence

`docs/evidence/v3/screens/` — 15 captures: home desktop beats 01–06 (arrival, frame-expand,
chamber, manifesto, assembly/ignition, endcap), service hero + use-cases, case portal + story,
mobile home ×2, mobile service, reduced-motion ×2. Higgsfield originals + tests in
`docs/evidence/v3/higgsfield/` (ledger: docs/research/GENERATIVE-ASSET-LEDGER.md — 4.24/10 credits
spent, 5.76 verified remaining).

## Known open items (deliberate, post-Gate-B)

1. Draw-call merge/instancing pass (102 → target ≤40).
2. Nav contrast adaptation over dark scenes (translucent paper bar currently sits light on dark).
3. Conduit "failed spark" micro-moment in Ch.1; engraved-marking texture pass.
4. Full-screen mobile menu scene; chapter progress rail.
5. Case-study media-through-glass refraction treatment (portal is in; refraction shader next).
6. HF-02 plate not yet wired (Contact/Ch.9 arrives with Phase 5).
7. E2E suite (Playwright specs) formalized from the manual QA scripts used here.
