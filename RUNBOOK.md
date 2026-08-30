# RUNBOOK — operating the MBT website

Everything the owner does day-to-day, plus environment, quotas, and recovery.

## Daily use

### Add or edit a case study (project)
Admin → **Projects** → *New project* (or Edit). Fill Basics (slug auto-generates),
write Challenge/Solution/Results in the rich editors, add metrics (`-38%` / `ops
cost` pairs — the first metric becomes the headline stat on cards), pick service
tags, then **Save & publish**. The public site updates on the next request — no
deploys. *Draft* status hides it everywhere. Covers: “Generated aurora art” never
breaks; switch to “Uploaded image” and paste a Cloudinary URL when you have real
visuals (upload via Admin → Media, the URL is copied for you).

### Add a team member / testimonial / logo
Admin → the matching section → Add. Drag rows (or use the ↑↓ buttons) to reorder;
order is saved instantly. “Visible” unchecked hides an item without deleting it.

### Manage leads
Admin → **Leads**. New leads are bold with an amber dot. Click a row: full
message, **visitor journey** (pages, scrolls, clicks, timestamps — attached
automatically when the visitor allowed tracking), private notes, and the status
pipeline `new → contacted → qualified → won/lost` (select in the row updates
optimistically). Reply directly via the mailto link on the email address.

### Edit site copy, contact details, metrics, FAQs
Admin → **Site Settings**. Hero copy, tagline, contact email, WhatsApp number
(international digits → shows the WhatsApp buttons), Calendly URL (set → every
“Book a call” button goes straight to Calendly; empty → contact form), SEO
defaults, home metrics band, home FAQs, optional announcement pill. Save →
live immediately.

### Read the dashboard
Admin → **Dashboard**. “Live now” = sessions with a heartbeat in the last 3
minutes (auto-refreshes each minute). Range picker: Today / 7d / 30d / 90d —
past days come from nightly rollups, today is computed live. **Companies
visiting** lists business-network ASNs (warm-lead mining; “IP data by IPinfo”).
“Recent sessions” → View opens the full journey; sessions that converted carry a
`lead` badge linking to the lead. The write-budget badge shows today’s Firestore
write usage and the kill-switch state (normal / sampling / halted).

## Operations

### Rotate the admin password
Set a new `ADMIN_PASSWORD` in `.env.local` **and** Netlify env, run
`npm run seed` (locally it updates the Auth user + keeps content), then
`netlify deploy --build --prod` if you changed Netlify env. Old sessions die at
next verification (logout also revokes immediately).

### Environment variables

| Variable | Where used | Notes |
|---|---|---|
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | server | Service account (key keeps `\n` escapes, quoted) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` / `_AUTH_DOMAIN` / `_PROJECT_ID` / `_APP_ID` | client | Web config — used only for admin sign-in; safe to expose |
| `NEXT_PUBLIC_SITE_NAME` / `NEXT_PUBLIC_SITE_URL` | both | URL drives SEO canonicals + collector origin check — set to the real domain in prod |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | seed | The single admin login |
| `IP_HASH_SALT` | collector | Long random string; changing it resets visitor-IP hashing |
| `IPINFO_TOKEN` | collector | IPinfo Lite (free) — company/ASN enrichment |
| `CLOUDINARY_CLOUD_NAME` + `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | media | **Currently empty — uploads disabled until set** (dashboard shows setup steps) |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | media | Provided |
| `RESEND_API_KEY` / `LEAD_ALERT_EMAIL` | lead action | Optional email alert on new leads |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | lead form | Optional extra spam wall |
| `FIRESTORE_COLLECTION_PREFIX` | tests | Leave empty in production |

### Free-tier quotas and how this build stays inside them

| Service | Free limit | This build | Near the limit? |
|---|---|---|---|
| Firestore writes | 20k/day | ~10–17 writes per tracked visit (heartbeats batch into one session update, cadence decays 15→30→60s). ~1,000 visits/day ≈ 10–17k | Kill-switch: at 15k the collector drops event detail (sessions survive); at 19k it stops for the day. Dashboard badge shows state. |
| Firestore reads | 50k/day | Public pages are cached; dashboard reads rollups + today only | Rollups keep history reads ~1 doc/day |
| Firestore deletes | 20k/day | Nightly purge of >90-day raw data, capped at ~3.8k/run | Automatic |
| Firestore storage | 1 GiB | Raw analytics auto-purged at 90 days; content is KBs | Automatic |
| Firebase Auth | 50k MAU | 1 admin | — |
| Netlify bandwidth/builds | 100 GB / 300 min-mo | Static-heavy site, tiny functions | Check Netlify usage page monthly |
| Cloudinary | 25 credits/mo | Client-side downscale to ≤1920px WebP before upload; `f_auto,q_auto,w_` on delivery | Library view shows bytes per asset |
| IPinfo Lite | unlimited (attribution required) | One lookup per unique IP, cached forever in `ip_cache` | Attribution shown in admin |

### Backups / export
Firestore on Spark has no scheduled exports. Practical options: (1) content
lives in ~30 small docs — the seed file (`scripts/seed-content.ts`) doubles as a
re-creatable baseline; (2) for a point-in-time copy, a ~20-line script with
`adminDb()` can dump all collections to JSON (ask any engineer, or run
`npm run rollup` style scripts as a template); (3) upgrading to Blaze enables
`gcloud firestore export` without changing this app.

### Live verification (Gate E, after each deploy)
1. `/` renders with the 3D hero (desktop) and clean console.
2. Log in at `/admin` → Dashboard shows your own live session within ~30s.
3. Edit Settings → tagline → refresh `/` → change visible.
4. Submit a test lead via `/contact` (use a `+test` email) → appears in Leads
   with a journey → delete it from the lead drawer.
5. Netlify → Functions: `collect` invoked; `rollup-daily` scheduled 03:10 UTC.
6. `npm run smoke` equivalent: run `npx playwright test tests/e2e/01-public.spec.ts`
   with `PLAYWRIGHT_BASE_URL` pointed at production if you want the scripted pass.

### Troubleshooting
- **Admin login fails with correct password** — check the four
  `NEXT_PUBLIC_FIREBASE_*` values in Netlify env match `npm run setup:firebase`
  output; re-deploy after env changes.
- **Edits not appearing** — they appear on the *next request* (hard-refresh);
  if a CDN sits in front, purge it. All mutations call the layout-wide
  revalidation (see `lib/data/revalidate.ts`).
- **No analytics data** — the tracker skips itself for DNT/GPC browsers, on
  `/admin`, and when `localStorage.disable_tracking` is set (set that flag in
  YOUR browser so your own visits don’t count). Check Netlify function logs for
  `collect` errors; confirm the `/api/collect` rewrite in `netlify.toml`.
- **“Cloudinary not configured”** — set both cloud-name vars (dashboard card
  shows the exact steps), redeploy.
- **Write budget shows “sampling/halted”** — traffic spike or a beacon loop;
  raw events resume next UTC day automatically. Investigate top sessions in the
  dashboard.
