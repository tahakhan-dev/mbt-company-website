# MIGRATION REPORT — legacy → v3

Executed 2026-09-01 via `aigenvora/scripts/migrate-legacy.mjs` (dry-run first, then live).

## Preconditions

- Full Firestore backup taken before any v3 write: `secrets/backups/2026-08-31T19-05-37-361Z/`
  (9 collections, 622 documents, gitignored). Script: `scripts/export-firestore.mts`.
- v3 app reads/writes only `v3_*` collections (`FIRESTORE_COLLECTION_PREFIX` defaults to `v3_`;
  an empty value in the shared .env.local is treated as unset). Legacy collections untouched.

## Reconciliation

| Source (legacy) | Count | Target | Result |
| --- | ---: | --- | --- |
| projects | 12 | v3_projects | 12 migrated — ALL as `draft`, `ownershipVerified:false`, `clientPermission:false`, role empty. These are the V2 sample records; none can publish until the owner clears them through the admin verification gate. |
| team | 4 | v3_team | 4 migrated as draft (rendering awaits owner-approved portraits per rights ledger) |
| testimonials | 3 | v3_testimonials | 3 migrated as draft with text/video permission false |
| leads | 0 | v3_leads | Legacy site had no leads collection; nothing to move |
| settings/services/logos/analytics | — | — | Not migrated: v3 seeds its own 12-service taxonomy and settings; analytics collector is not yet ported (see limitations) |

Idempotent: documents keyed by stable slug/id with merge writes — re-running is safe.
Rollback: v3_* collections can be deleted wholesale without touching legacy data; the backup
covers everything prior.

## The 13 real portfolio candidates

Deliberately NOT migrated as content: they enter via the admin only after per-product owner
verification (engagement model, client permission, allowed metrics). The queue with today's
verified facts and conflicts: `docs/research/PORTFOLIO-SOURCE-LEDGER.md`.
