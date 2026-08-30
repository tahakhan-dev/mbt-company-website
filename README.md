# MBT — AI Software House · Website + Admin + Visitor Intelligence

A production-grade agency site: cinematic marketing pages (Next.js 16 App Router,
GSAP scroll storytelling, R3F WebGL hero), a full admin CMS, and a private
first-party analytics platform — all running at **$0/month** on free tiers.

## Architecture

```
┌──────────────────────────── Netlify (free tier) ─────────────────────────────┐
│                                                                              │
│  Next.js 16 (@netlify/plugin-nextjs)          Native functions               │
│  ┌──────────────────────────────────┐         ┌──────────────────────────┐   │
│  │ (marketing)/  public site        │         │ collect.mts  ← /api/collect  │
│  │   cached data layer (tags)       │         │  (context.geo + IPinfo)  │   │
│  │ admin/        CMS + dashboard    │         │ rollup-daily.mts (03:10) │   │
│  │ api/          session, media,    │         └────────────┬─────────────┘   │
│  │               collect (dev path) │                      │                 │
│  └───────────────┬──────────────────┘                      │                 │
│                  │  firebase-admin (service account)       │                 │
└──────────────────┼─────────────────────────────────────────┼─────────────────┘
                   ▼                                         ▼
        ┌─────────────────────────── Firebase (Spark, free) ─────────────┐
        │ Firestore: settings services projects team testimonials logos  │
        │            leads visitors sessions(+events) ip_cache           │
        │            daily_stats counters        · rules: deny ALL client│
        │ Auth: single admin user with { admin: true } custom claim      │
        └─────────────────────────────────────────────────────────────────┘

Media: Cloudinary (free) via custom next/image loader — generated aurora
cover art is the zero-dependency default. Fonts self-hosted. No third-party
analytics, no cookies.
```

**Security model in one line:** Firestore rules deny everything; every read/write
goes through server code holding the service account, and every admin mutation
re-verifies the session cookie + `admin` claim (`lib/admin/auth.ts`).

## Local setup

```bash
npm install
cp .env.example .env.local        # fill in values (see the table in RUNBOOK.md)
npm run setup:firebase            # one-time: enables email sign-in, deploys rules
npm run seed                      # idempotent: admin user + full sample content
npm run dev                       # http://localhost:3000  (admin: /admin)
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Standard Next.js lifecycle |
| `npm run lint` / `typecheck` / `test:unit` | Gate A checks (ESLint, tsc, vitest) |
| `npm run test:e2e` | Gate B Playwright suite — seeds isolated `e2e_*` collections, runs 26 tests against a prod build, cleans up |
| `npm run seed` | Idempotent admin + content seed (honors `FIRESTORE_COLLECTION_PREFIX`) |
| `npm run setup:firebase` | Enables Email/Password sign-in, registers the web app, deploys deny-all Firestore rules, verifies a sign-in round trip |
| `npm run rollup [YYYY-MM-DD]` | Manually run the nightly aggregation + retention purge |
| `npm run cleanup:e2e` | Delete all `e2e_*` test collections |

## Deploying to Netlify (one time)

```bash
npm i -g netlify-cli
netlify login
netlify init                      # create/link the site (build cmd + plugin come from netlify.toml)
# Import every variable from .env.local, then set the production URL:
netlify env:import .env.local
netlify env:set NEXT_PUBLIC_SITE_URL https://<your-site>.netlify.app
netlify deploy --build --prod
```

After the first deploy: verify `/`, `/admin` (login), submit a test lead, and check
Site configuration → Functions shows `collect` and the scheduled `rollup-daily`.
Full checklist: RUNBOOK.md → “Live verification (Gate E)”.

## Repo tour

- `app/(marketing)/` public routes · `app/admin/` CMS · `app/api/` route handlers
- `components/marketing|admin|motion|three|ui/` — public sections, admin modules, GSAP/Lenis primitives, the Signal Field WebGL scene, shared UI
- `lib/schemas/` zod models shared everywhere · `lib/data/` cached public reads + revalidation · `lib/admin/` auth + validated server actions · `lib/analytics/` collector core, budget math, rollups, dashboard queries · `lib/covers/` generative cover art
- `netlify/functions/` native collector + nightly rollup · `public/t.js` the 2.7KB tracker
- `scripts/` seed, setup, rollup, cleanup · `tests/` vitest unit + Playwright e2e
- `docs/` design brief, implementation plan · `firestore.rules` · `netlify.toml`

See **RUNBOOK.md** for day-to-day operations and **TEST-REPORT.md** for the full
verification record.
