# ASSET RIGHTS LEDGER

Opened 2026-08-31. Every asset that ships on the public site gets a row before it ships. No row, no
publish. Columns per Section 26.2 of the master prompt.

## Rules in force

- Allowed sources: owner-supplied with rights; licensed commercial stock; custom photography;
  original 3D/shader output; AI-generated media with commercially usable terms (see
  GENERATIVE-ASSET-LEDGER.md); official client media with explicit written permission.
- Never: hotlinked third-party production assets, Lusion assets of any kind, fonts copied from any
  website, client media without recorded permission.
- Project imagery additionally requires `ownershipVerified` and `clientPermission` true on the
  project record before public use.

## Open decisions

| Item | Status | Action needed |
| --- | --- | --- |
| Display/body face — Aeonik | **Unlicensed as of today.** Owner has not supplied a commercial webfont license. | Owner: buy Aeonik license OR approve fallback below. Blocking for Phase 3 typography lock. |
| Fallback display/body candidates | Proposed for Gate A: **General Sans** or **Switzer** (Indian Type Foundry, free ITF license, self-hostable) — both neutral contemporary grotesks that hold at 12–18vw. Second tier: Space Grotesk (OFL) if a more technical voice is wanted. | Owner picks at Gate A. License file will be committed to `docs/` upon adoption. Explicitly NOT falling back to Arial/Inter/system. |
| Utility mono — IBM Plex Mono | OFL, safe. | Adopt; record version on install. |
| "Aigenvora Mono" brand display mono | Deferred — commissioning a face is out of budget/scope for V3 launch. IBM Plex Mono covers utility; display mono duties fall to the grotesk. | Owner may commission later; recorded as a known limitation. |
| Team portraits | None on hand. | Owner supplies real portraits (preferred) or approves rights-cleared editorial alternatives. Generic initials/avatar grids prohibited. |
| Project media (per product) | Blocked on PORTFOLIO-SOURCE-LEDGER owner verification queue. | Owner supplies originals or written client permission per product. |

## Asset rows

| ID | Asset | Source | Creator/tool | Prompt (if generated) | License | Owner | Client permission | Usage scope | Acquired | Cloudinary ID | Alt text | Linked records |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A-001 | General Sans variable webfonts (upright+italic) | Fontshare direct download | Indian Type Foundry | — | ITF FFL v2.0 (docs/licenses/GeneralSans-FFL.txt) — self-hosting permitted | ITF (licensed to us) | n/a | Site-wide display/body type | 2026-09-01 | — (self-hosted /fonts) | — | tokens.css |
| A-002 | IBM Plex Mono 400/500 latin woff2 | @fontsource/ibm-plex-mono 5.3.0 | IBM | — | OFL 1.1 | IBM (OFL) | n/a | Mono annotations/labels | 2026-09-01 | — (self-hosted /fonts) | — | tokens.css |
| A-003 | HF-01 problem-chamber plate (21:9 still) | Generated, Higgsfield MCP | nano_banana_pro (job 63ea043f…) | See GENERATIVE-ASSET-LEDGER row 3 | Higgsfield ToU: user owns output, commercial use all plans | Aigenvora | n/a | Home Ch.2 backdrop (engine-animated), Tier C background | 2026-09-01 | Phase 5 | Two cold light beams crossing in darkness | arrival scene, index.astro |
| A-004 | HF-02 resolution plate (21:9 still) | Generated, Higgsfield MCP | nano_banana_pro (job 5d936102…) | See GENERATIVE-ASSET-LEDGER row 4 | Same as A-003 | Aigenvora | n/a | Home Ch.9 / Contact backdrop (Phase 5) | 2026-09-01 | Phase 5 | Warm amber light raking dark brushed metal | contact scene (planned) |
| A-005 | Direction tests T1/T2 (evidence only, not shipped) | Generated, Higgsfield MCP | soul_2 | See ledger rows 1–2 | Same as A-003 | Aigenvora | n/a | docs/evidence only | 2026-09-01 | — | — | GENERATIVE-ASSET-LEDGER |
