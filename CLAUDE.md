# CLAUDE.md — project instructions for AI sessions

## Rules (owner-mandated)

1. **Deploys are owner-run.** No `netlify deploy`, no linking sites, no production
   pushes to hosting. `aigenvora/netlify.toml` + `aigenvora/DEPLOYMENT.md` stay
   prepared-but-unused; the owner deploys.
2. **Git pushes only on the owner's explicit request in-session** (the owner
   lifted the former blanket no-push rule on 2026-09-01). Never push secrets;
   `.env*` and `secrets/` are gitignored and must stay that way. The repo is
   PUBLIC — scan before any push.
3. **Portfolio integrity:** projects publish only through the admin verification
   gate (ownershipVerified + clientPermission + stated role, enforced server-side
   in `aigenvora/src/pages/api/admin/projects.ts`). Never weaken or bypass it.
4. **Higgsfield:** every generation is ledgered in
   `docs/research/GENERATIVE-ASSET-LEDGER.md` before and after the call. No
   purchases, trials, or other billable generators.

## What this project is

Aigenvora (aigenvora.com): AI-agency marketing site + admin CMS + lead pipeline.
Astro 7 SSR + Netlify adapter, Three.js r158 engine (`aigenvora/src/engine/`),
Firebase via Admin SDK only (deny-all client rules in `aigenvora/firestore.rules`),
collections under the `v3_` prefix. Built to the spec in
`AIGENVORA-ASTRO-MASTER-BUILD-PROMPT.md`.

## Working conventions

- All Firestore access via `aigenvora/src/lib/firebase/server.ts` (`col()` honors
  `FIRESTORE_COLLECTION_PREFIX`; empty means `v3_`).
- Admin mutations must `bust("content:")` from `src/lib/content/cache.ts` and
  append to the audit trail (`src/lib/admin/audit.ts`).
- Checks before claiming done (from `aigenvora/`): `npm run check`,
  `npm run test:unit`, `npm run build`, `npx playwright test` (dev server up).
- Engine gotchas: composer clear colors go through `src/engine/color.ts`;
  pointer input stays NaN-guarded; `src/env.d.ts` would be shadowed by
  `src/env.ts` — global types live in `src/app.d.ts`.
- Astro dev is a daemon: stop with `npx astro dev stop`, not pkill.
- Design law: `docs/design/` (storyboard, motion matrix, scene architecture).
  Admin UI is exempt (clean/fast over theatrical).
