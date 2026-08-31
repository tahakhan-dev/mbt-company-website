# TEST REPORT — V3 (Phases 5–8), 2026-09-01

Continues docs/evidence/v3/GATE-B-VERIFICATION.md (Phases 2–4). All commands run from
`aigenvora/` against commit `2040c64`+.

## Static

| Check | Result |
| --- | --- |
| `astro check` (TS strict, 56 files) | 0 errors / 0 warnings / 0 hints |
| `vitest run` | 24/24 (timeline, tiers, cache, publication gate, lead spam heuristics via schema tests, scroll math) |
| `astro build` (production, Netlify adapter) | green |
| Client bundle secret scan | clean |

## E2E (`npx playwright test`) — 20/20

- Every public route (9): status 200, correct title, exactly one h1, **zero console errors**.
- Unknown route → 404. No horizontal overflow at 390px.
- Engine canvas persists across a view transition (single canvas, marker survives).
- Reduced-motion context → Tier C: engine never downloads, posters visible, content intact.
- Lead endpoint: valid → 200/ok; instant-submit bot → 200 (stored as spam, no oracle);
  garbage → generic 400 with no schema internals leaked.
- Admin: all admin pages redirect to login without a session; admin API rejects (401/403);
  responses carry `X-Robots-Tag: noindex`; wrong login rejected generically.

## Admin functional E2E (session-cookie flow, executed live)

login 303 → /admin · authed pages 200 · lead status/note update persisted · service copy edit
**visible on the public route** (cache bust proven) then reverted · unverified project publish
blocked with `error=verification` (server-side gate) · draft save allowed · logout revokes the
session (subsequent /admin → 302). Audit trail rows written for every mutation.

## Data operations

- Backup: 9 collections / 622 docs prior to any write.
- Migration: 12 projects + 4 team + 3 testimonials → v3_* as unverified drafts
  (docs/migration/MIGRATION-REPORT.md). Legacy collections untouched.
- QA artifacts removed post-suite (`scripts/cleanup-qa.mjs`).

## Known limitations (open, tracked)

1. First-party analytics collector not yet ported from the legacy app — the privacy page
   truthfully reflects that. Port plan: reuse `lib/analytics/collect-core.ts` (framework-neutral)
   behind a Netlify function, with salt rotation and ip_cache TTL fixes.
2. Draw-call merge pass pending (102 measured vs ≤40 target; 60fps regardless).
3. Testimonial video model + media library UI are schema-ready but have no admin UI yet
   (no verified testimonials exist to render).
4. Nav contrast over dark scenes; full-screen mobile menu scene; chapter progress rail.
5. Lighthouse run pending a deployed environment (adapter has no local prod server).
6. `npm audit`: 16 advisories (6 moderate, 10 high), all transitive and none in client-shipped
   code: extract-zip / image-size / sharp 0.34 sit under @netlify/vite-plugin's LOCAL DEV
   tooling (never deployed, never in the bundle); uuid <11.1.1 sits under
   firebase-admin → @google-cloud/storage (server-side; the advisory concerns v3/v5/v6
   generation with a caller-provided buffer, a path this app never invokes). `npm audit fix`
   applied where non-breaking; the rest require upstream releases — re-check at each
   dependency update in the maintenance cycle.
