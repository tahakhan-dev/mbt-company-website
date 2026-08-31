# GENERATIVE ASSET LEDGER — Higgsfield

Opened: 2026-08-31. Governs every paid generation for the Aigenvora build.

## Ceiling and ground rules

- Confirmed balance at ledger opening: **10 credits** (read via `higgsfield.balance`, free plan).
  This is a **hard total ceiling**, not a target. No purchases, no trials, no auto-refill, no
  retry loops, no other billable generator (Runway present in session but unauthorized).
- **Zero generations before Creative Gate A approval.** The shot plan below is unpriced planning
  work only.
- Before the first paid call: confirm actual per-request credit cost from the live generation-tool
  schema / `models_explore` (never assume 1 request = 1 credit), confirm commercial-use terms and
  retention behavior, and record both here.
- Every request gets a pre-entry (shot ID, route/scene, why code-native Three.js is insufficient,
  exact prompt + negatives, model/settings/seed/AR/duration, expected cost, pre-call balance) and a
  post-entry (job ID, actual cost, remaining balance, output destination, review decision, artifact/
  fake-text/logo/lighting/crop/rights review, allowed routes and breakpoints).
- Every approved output: downloaded, optimized, given a poster and mobile crop where relevant,
  uploaded via the approved Cloudinary workflow, entered in ASSET-RIGHTS-LEDGER.md. No hotlinking
  temporary MCP URLs. Experience must stay coherent with the media blocked or absent.

## Allocation (provisional, priority-ordered; adapt to real pricing without exceeding 10)

| Purpose | Max | Notes |
| --- | ---: | --- |
| Direction tests | 2 | Two tightly scoped composition/motion tests after storyboard approval. |
| Final signature media | 5 | Hero atmosphere plate and/or Engine-reveal / route-transition plates. |
| Supporting route/mobile media | 2 | At most one secondary asset where the approved storyboard proves need. |
| Correction reserve | 1 | Held until final visual QA. Prefer leaving it unspent. |

If real pricing breaks this table, preserve priority: signature media → one supporting asset →
correction reserve.

## Shot plan (DRAFT — priced at 0 until Gate A; see AIGENVORA-STORYBOARD.md §11 for full briefs)

| Shot ID | Route / scene | Intent | Why not code-native | Status |
| --- | --- | --- | --- | --- |
| HF-01 | Home Ch.2 "Problem" backdrop | Slow abstract volumetric plate: cold fractured light shafts in haze, near-black blue-grey, loopable 6–8s, 21:9 | Volumetric fog + light-shaft quality at this fidelity is costly in real-time WebGL on mobile tiers; a compressed video plate behind the live engine is cheaper at runtime | Planned |
| HF-02 | Home Ch.9 / Contact "Resolution" | Warm quiet plate: soft amber light settling across dark machined surfaces, barely moving, loopable | Same volumetric/GI rationale; sets the warm finale without extra lights in scene budget | Planned |
| HF-03 | Route-transition wipe plate | 1–2s abstract material transformation (ceramic → light conduits), used as masked transition texture | One-shot high-detail simulation, not worth a real-time particle system | Planned (only if credits remain after HF-01/02) |
| HF-04 | Mobile hero derivative | Portrait recrop/regen of the chosen signature plate if desktop crop fails on 390px | Aspect-specific composition | Contingent |

Explicitly out of scope for generation: logo, UI, readable product screenshots, case-study evidence,
fake clients/people/metrics/testimonials, Lusion replicas, derivatives of client assets, any
essential content that disappears when video is unavailable.

## Generation log

| # | Date | Shot | Model/settings | Expected cost | Pre-balance | Job ID | Actual cost | Post-balance | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | none yet — blocked until Creative Gate A approval | | | 10 | | | 10 | |
