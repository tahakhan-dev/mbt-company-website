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

## Pricing + terms facts (verified 2026-09-01, post-Gate-A, before first spend)

- Costs preflighted with `get_cost:true` (no jobs submitted): **video is unaffordable** —
  seedance_2_5 6s/720p/21:9 = **39 credits** (~4× the entire ceiling). Image stills:
  nano_banana_pro 21:9 = **2 credits**; soul_2 16:9/2k = **0.12 credits**.
- **Plan adaptation (priority order preserved per §3A.2):** HF-01/HF-02 ship as high-res STILL
  plates, animated at runtime by the engine (slow shader pan/parallax/grain — cheaper at runtime
  than video anyway, and reduced-motion tier gets the static frame natively). Direction tests on
  soul_2 (0.12 cr each), finals on nano_banana_pro 21:9 (2 cr each). HF-03 transition video is
  dropped (unaffordable); the masked-wipe transition stays code-native GLSL.
- Commercial terms verified: Higgsfield's Terms of Use grant users ownership of outputs and
  unrestricted commercial use on all plans incl. free; no separate commercial license; rights
  survive account cancellation; outputs may be used to train their models (acceptable for
  abstract brand plates; never send client/private media). Sources:
  https://higgsfield.ai/terms-of-use-agreement ·
  https://higgsfield.ai/creator-hub/help-center/account/who-owns-my-generations-and-can-i-use-them-commercially

## Generation log

| # | Date | Shot | Model/settings | Expected cost | Pre-balance | Job ID | Actual cost | Post-balance | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-09-01 | HF-01-T1 direction test (comp A: three conflicting cold shafts) | soul_2, 16:9, 2k | 0.12 | 10.00 | adfc7530-91d4-4abc-8eda-5ceebbe5ad67 | 0.12 | 9.88 | Rejected for final (too bright/theatrical for a backdrop) — kept as evidence |
| 2 | 2026-09-01 | HF-01-T2 direction test (comp B: two opposing thin beams, off-center void) | soul_2, 16:9, 2k | 0.12 | 9.88 | 3f15df1a-f5e2-4ea6-a731-5f4f3d7cb7d5 | 0.12 | 9.76 | **Winning direction** — thin crossing signals = the Problem chapter motif |
| 3 | 2026-09-01 | HF-01 FINAL — problem-chamber plate (T2 direction refined) | nano_banana_pro, 21:9 | 2.00 | 9.76 | 63ea043f-4c3f-4c64-9ba6-387795ccca18 | 2.00 | 7.76 | **Approved.** Review: no artifacts/text/logos/people; dark enough for overlay text; center-weighted → 9:16 crop derivable locally (no HF-04 spend) |
| 4 | 2026-09-01 | HF-02 FINAL — warm resolution plate (amber raking brushed dark metal) | nano_banana_pro, 21:9 | 2.00 | 7.76 | 5d936102-0f67-4fe6-9e6f-1ffa2fea41f2 | 2.00 | 5.76 | **Approved.** Same review clean; machined-metal texture matches engine material language |

**Balance re-verified after session: 5.76 credits remaining** (spent 4.24 of 10; tests 0.24/2,
signature 4.00/5, supporting 0/2, reserve intact >1). HF-03 dropped (video 39 cr — over ceiling);
transition stays code-native GLSL. HF-04 unnecessary — mobile 9:16 crops derived locally with
sharp. Originals archived at docs/evidence/v3/higgsfield/ (t1, t2, finals); optimized web
derivatives in aigenvora/public/media/. Delivery via Cloudinary deferred to Phase 5 media pass
(assets are local-first for the prototype; no hotlinking of MCP URLs anywhere in the app).
