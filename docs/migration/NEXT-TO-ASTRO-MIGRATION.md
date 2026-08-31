# NEXT → ASTRO MIGRATION DESIGN

Status: DRAFT v2 (2026-09-01), reconciled with docs/research/CURRENT-SITE-AUDIT.md.
Rule zero: the old Next.js 16 app is the reference implementation, not the target. Nothing is
preserved because it exists; everything is audited in, as logic, or discarded.

## 1. Strategy

Build the Astro app as a fresh application in this repository (new `src/` tree per master prompt
§8.2), with the Next app left intact and runnable until Phase 7 reconciliation completes. No
big-bang rewrite of data: Firestore is shared state, so the migration is mostly **schema mapping +
new read/write layer**, not a data move. Old data is never auto-deleted.

## 2. Carries over as LOGIC (rewritten into Astro-shaped modules, semantics preserved)

- **Firestore access pattern**: Admin-SDK-only, deny-all client rules (`firestore.rules` keeps
  working verbatim), collection-name indirection (`col()` honoring
  `FIRESTORE_COLLECTION_PREFIX`) → `src/lib/firebase/`.
- **Admin auth model**: single admin user, `{ admin: true }` custom claim, session cookie
  re-verified on every mutation → Astro middleware + endpoint guards. Add session rotation on
  login + CSRF per new spec.
- **Zod validation approach** (v4 already in use) → `src/lib/schemas/`, extended with the new
  content model (verification fields, testimonial video model, homepage chapters, redirects,
  FAQs, mediaAssets, adminAudit, lead pipeline stages).
- **Lead + spam logic**: honeypot/min-fill-time/server validation patterns.
- **Analytics pipeline**: audit confirms `lib/analytics/collect-core.ts` + rollup-core + write-
  budget kill-switch are already framework-neutral and shared with the Netlify functions — these
  port nearly verbatim, along with `public/t.js`. Lawfulness posture is good (no raw IP stored;
  salted+truncated hash; DNT/GPC honored; 90-day purge). Fix during port: rotate/derive the static
  salt, add TTL to `ip_cache`, keep the legitimate-interest posture documented in the privacy page.
- **Seed/setup scripts**: `setup-firebase.mts`, seed idempotency, e2e collection isolation and
  cleanup pattern.
- **Cloudinary integration** as a plain helper (loses the `next/image` loader shape) — signing
  and URL helpers carry over.
- **Seed copy**: 1,028 lines of finished content in `scripts/seed-content.ts` — reusable as raw
  material, but re-voiced per COPY-DECK and re-seeded to the 12-service taxonomy (only 10 seeded
  today).
- **Operational knowledge**: RUNBOOK env table, quota notes, the "tag revalidation alone doesn't
  expire unstable_cache" scar (moot in Astro, recorded so nobody reintroduces the pattern).

## 3. Dies with the framework (rebuilt, not ported)

- All App Router routes/layouts/server actions; `unstable_cache`/`bustTag` (Astro SSR + explicit
  cache layer of our own instead).
- `next/image` + custom loader → Astro `<Image>`/custom media primitives with Cloudinary URLs.
- GSAP + Lenis + R3F "Signal Field" scene → new engine per SCENE-ARCHITECTURE.md (Three.js r158,
  custom timeline, no GSAP; native scroll, no Lenis).
- `next-themes` → scene-directed theming (no global novelty toggle).
- Tailwind on public pages → token/cascade-layer CSS. Admin islands may keep utility styling but
  isolated from public CSS.
- Geist font → new licensed type per ASSET-RIGHTS-LEDGER decision.
- Aurora Obsidian design law (V2 brand) → superseded by Aigenvora direction. `render-covers.mts`
  aurora gradients explicitly violate the new no-gradient-covers rule → discarded.

## 4. Data model mapping (old → new)

| Old collection | Disposition |
| --- | --- |
| settings | Extend (brand, CTAs, booking URL, markets, maintenance mode, analytics flags) |
| services | Re-seed to the locked 12-service taxonomy; keep doc shape ideas |
| projects | Extend heavily: engagementModel, ownershipVerified, clientPermission, mediaRights, metrics with sourceUrl/verifiedAt, scene preset. **All existing projects re-enter as draft, ownershipVerified:false** per PORTFOLIO-SOURCE-LEDGER |
| team, testimonials | Extend (testimonial video/captions/transcript/permissions model) |
| logos | Fold into mediaAssets or keep; audit decides |
| leads | Preserve history verbatim; add pipeline fields (status, owner, notes, history) via additive migration |
| visitors/sessions/events/ip_cache/daily_stats | Preserve; collector rewritten against same shapes if lawfulness audit passes |
| (new) homepageChapters, pages, navigation, faqs, mediaAssets, redirects, leadActivity, adminAudit | Created fresh |

Migration scripts: `scripts/migrate/` with dry-run flag, per-collection mapping, backup-first
(export to `secrets/backups/<date>/` — gitignored), idempotent upserts keyed by stable IDs,
reconciliation report to `docs/migration/MIGRATION-REPORT.md`. Old collections untouched; new
prefix or additive fields only.

## 5. Cutover sequence

1. Phase 2: Astro skeleton boots alongside Next (different dev port); shared `.env.local`.
2. Phases 3–6: build against prefixed dev collections (`v3_` via `FIRESTORE_COLLECTION_PREFIX`)
   so the live preview's data is never touched.
3. Phase 7: backup → dry-run import → owner verification pass (projects) → real import →
   reconciliation report.
4. Next app archived in git history at cutover (branch retained, not deleted); Netlify config
   switched to the Astro build — **prepared only; owner runs the deploy** per repo hard rules.

## 6. Risks (v2 — reconciled with audit)

1. **No Firestore export/backup script exists.** Leads and analytics are real, unrecoverable
   data. A backup/export script is the FIRST artifact of Phase 7 (and runs before any write).
   Until then, migration writes are prohibited.
2. **Read quota**: Astro SSR with no cache layer would read ~6 collections per page render and
   can blow the Spark free tier. The new content layer needs an in-process TTL cache +
   explicit bust on admin mutation (replacing `unstable_cache`/`bustTag`) designed in from
   Phase 2, not bolted on.
3. **Admin-auth port fidelity**: the current model does revocation checks, `admin` claim, and
   fresh-auth requirements — easy to silently drop details in a port. Port `lib/admin/auth.ts`
   semantics test-first.
4. Analytics wire-contract continuity (`t.js` payload shape ↔ collector) — keep the shared core
   as the single source of truth.
5. The 9-chapter motion rebuild is the largest effort and regression surface — hence Gates B and
   the per-route verification cadence in Phase 5.
6. Netlify adapter/runtime versions vs Astro current stable — verify from official docs before
   install (Phase 2, context7).
7. e2e isolation pattern must be rebuilt early (prefix + isolated collections) or Phases 5–8
   lose their safety net.
8. Secrets handling during dual-app phase — one `.env.local`, two consumers; validate at startup
   in both.
9. Preview mirror (`deploy-preview.mts` → Firebase Hosting) mirrors public pages of the OLD
   site; refresh only on owner request; never admin/server/secrets.
10. Repo hygiene: modified `package-lock.json`, untracked `.mcp.json`, `.playwright-mcp/`, stray
    root screenshots — resolve deliberately at first V3 commit (lockfile diff reviewed, `.mcp.json`
    gitignored or committed by owner decision).
