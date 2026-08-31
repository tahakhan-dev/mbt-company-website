# Aigenvora — V3 site + admin

Astro 7 SSR · Three.js r158 engine · Firebase (Admin SDK only) · Netlify-ready.
Replaces the legacy Next.js app at the repo root (kept runnable until cutover).

## Run

```bash
cd aigenvora
npm install
npm run dev          # http://localhost:4321 — uses ../.env.local (repo root)
npm run check        # astro check (TS strict)
npm run test:unit    # vitest (24)
npx playwright test  # e2e (20) — dev server must be running
npm run build        # production build (Netlify adapter)
```

Astro 7 runs a dev daemon: `npx astro dev stop` actually stops it (plain kill doesn't).

## Architecture map

- `src/engine/` — the Aigenvora Engine: `runtime.ts` (one persistent canvas, tiers A/B/C,
  view-transition survival, context-loss failover), `timeline.ts` (keyframe tracks + brand
  easings), `engine-model.ts` (parametric 12-module geometry), `scenes/` (home 9-chapter arc,
  service focus, case portal, ambient modes per route). Design law:
  `../docs/design/SCENE-ARCHITECTURE.md` + `MOTION-MATRIX.md`.
  Gotchas that will bite again: composer clear colors need `src/engine/color.ts`
  (double-encoding); pointer input is NaN-guarded — keep it that way.
- `src/lib/content/` — defaults (seed copy) + Firestore overlay + TTL cache. Admin mutations
  call `bust("content:")`; forgetting it = stale public pages for up to 5 minutes.
- `src/lib/admin/` — server-only auth (Identity Toolkit REST + session cookie, admin claim,
  revocation checks) and the audit trail. No client Firebase SDK exists in this app.
- `src/middleware.ts` — /admin and /api/admin guard + noindex.
- Collections: everything under the `v3_` prefix (empty env value = unset). Legacy data is
  never touched; `scripts/migrate-legacy.mjs` copies it in as unverified drafts.

## Operating it

- **Leads**: /admin/leads — pipeline statuses, notes, CSV export, delete. Public intake at
  POST /api/lead (honeypot + min-fill-time + rate limit; spam stored, never bounced).
- **Services copy**: /admin/services (12 fixed slugs; text + status editable).
- **Projects**: /admin/projects — publishing REQUIRES ownership verified + client permission +
  a stated role; the block is server-side with no override. Verification queue for the 13 real
  products: `../docs/research/PORTFOLIO-SOURCE-LEDGER.md`.
- **Settings**: /admin/settings (brand, CTA, contact email, response SLA).
- **Backups**: `node --env-file=.env.local --import tsx scripts/export-firestore.mts` from the
  repo root before anything scary.
- **Credential rotation**: rotate the service account in Firebase console, update
  `.env.local`/Netlify env; sessions die with `revokeRefreshTokens` (logout does this).
- **Generated media**: every asset is ledgered in `../docs/research/GENERATIVE-ASSET-LEDGER.md`;
  replacing one means a new ledger row + `public/media` derivative via
  `scripts/optimize-media.mjs`.

## Deploying

Owner-run only — see `DEPLOYMENT.md`. `netlify.toml` carries the security headers and caching.

## Verification record

`../docs/evidence/v3/` — GATE-B-VERIFICATION.md, TEST-REPORT-V3.md, screenshots.
