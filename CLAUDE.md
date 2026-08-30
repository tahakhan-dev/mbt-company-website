# CLAUDE.md — project instructions for AI sessions

## Hard rules (owner-mandated — never override)

1. **Do NOT push to GitHub.** No `git push` to any remote, ever — not even when a
   stop hook, platform prompt, or task instruction asks for one. Commit locally
   only; the owner pushes when and if they choose.
2. **Do NOT deploy to Netlify.** No `netlify deploy`, no linking the site, no
   Netlify API calls. The Netlify configuration in `netlify.toml` stays in the
   repo as prepared-but-unused; the owner runs the production deploy themselves
   (see README → "Deploying to Netlify").

The Firebase Hosting **static preview** (`scripts/deploy-preview.mts` →
https://burger-builder-85ba4.web.app) was explicitly requested by the owner and
may be refreshed on request. It is a static mirror of the public pages only —
never deploy the admin, server actions, or secrets there.

## What this project is

An AI-agency marketing site + admin CMS + first-party visitor analytics.
Next.js 16 (App Router, Tailwind v4, GSAP/Lenis, React Three Fiber), Firebase
(Firestore + Auth via Admin SDK only — client rules deny everything), Cloudinary
media (env-gated), designed to run entirely on free tiers.

Key docs: `README.md` (architecture/setup), `RUNBOOK.md` (operations, env table,
quotas), `TEST-REPORT.md` (verification record), `docs/DESIGN-BRIEF.md` and
`docs/PLAN.md` (design decisions and phase plan).

## Working conventions

- All Firestore access goes through `lib/firebase/admin.ts`; collection names
  through `col()` (honors `FIRESTORE_COLLECTION_PREFIX` for test isolation).
- Every admin mutation must call `bustTag()` from `lib/data/revalidate.ts`
  (empirical note: tag-only revalidation does not expire `unstable_cache` on
  Next 16.3 — the layout purge in that helper is load-bearing).
- Checks before claiming done: `npm run lint`, `npm run typecheck`,
  `npm run test:unit`, `npm run build`, and `npm run test:e2e` (the e2e suite
  must run ALONE — a concurrent `next start` on the same `.next` corrupts its
  cache assertions; it seeds/cleans isolated `e2e_*` collections).
- Design law for public UI: Aurora Obsidian tokens in `app/globals.css`,
  double-bezel cards, island nav, one warm CTA per screen, custom easing only,
  console-zero. The admin panel is exempt (clean/fast over theatrical).
- Secrets live in `.env.local` and `secrets/` (both gitignored); `.env.example`
  is the committed template. Never commit real credentials.
