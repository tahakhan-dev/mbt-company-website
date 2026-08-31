# Current-Site Audit — pre-Astro-rebuild survey

Audited 2026-08-31 on branch `claude/ai-agency-website-build-g0mqqh`. Read-only analysis of the
Next.js 16 codebase at the repo root, recorded before the rebuild to Astro SSR described in
`AIGENVORA-ASTRO-MASTER-BUILD-PROMPT.md`. Secrets were not opened; `.env.local` and `secrets/` are
confirmed gitignored.

---

## 1. Route map

### Marketing (`app/(marketing)/`, shared shell in `layout.tsx`)

| Route | Purpose |
|---|---|
| `/` | Seven-act GSAP narrative home over a persistent R3F "Signal Field" canvas; pulls settings, services, featured projects, team, testimonials, logos from Firestore. |
| `/about` | Studio story, metrics, team grid (CMS team + settings metrics). |
| `/contact` | Multi-step lead form (`LeadForm`) plus contact details from settings. |
| `/services` | Index of published services. |
| `/services/[slug]` | Service detail: problem, offerings, process, stack, before→after transformation, FAQs, related projects. Has its own `opengraph-image.tsx`. |
| `/work` | Case-study grid (`WorkGrid`) of published projects. |
| `/work/[slug]` | Case study: challenge/solution/results rich text, metrics, gallery, adjacent-project nav. Has its own `opengraph-image.tsx`. |
| `/privacy`, `/terms` | Static legal pages (privacy page documents the analytics posture). |
| `/styleguide` | Internal design-token/component reference page. |
| `/[...missing]` + `not-found.tsx` | Catch-all routing every unknown public path into the designed 404 inside the marketing shell. |
| `opengraph-image.tsx` (root) | Default OG card rendered with `next/og` + bundled Space Grotesk fonts (`lib/og/template.tsx`). |
| `app/robots.ts`, `app/sitemap.ts` | Generated robots.txt and sitemap from published content. |

### Admin (`app/admin/`)

| Route | Purpose |
|---|---|
| `/admin/login` | Firebase client-SDK sign-in; exchanges a fresh ID token for a session cookie. |
| `/admin` | Dashboard: content counts, recent leads, full analytics dashboard (today live + rolled-up ranges). |
| `/admin/settings` | Singleton site-settings form. |
| `/admin/services`, `/admin/services/[id]` | Service list + full edit form. |
| `/admin/projects`, `/admin/projects/[id]` | Project list + full edit form (cover, gallery, rich text). |
| `/admin/team`, `/admin/testimonials`, `/admin/logos` | `SimpleCrud`-based list/edit/reorder modules. |
| `/admin/leads` | Lead inbox: status pipeline, notes, delete. |
| `/admin/media` | Cloudinary media manager (upload/list), shows setup instructions when unconfigured. |
| `/admin/visitors/[sessionId]` | Single-session visitor journey (event timeline). |

### API + server actions

| Route | Purpose |
|---|---|
| `POST /api/collect` | Analytics collector, Next flavor — used in dev and by Playwright; in production `netlify.toml` force-rewrites this path to the native function. |
| `POST/DELETE /api/admin/session` | ID-token → session-cookie exchange (with a 400 ms constant-friction delay); logout revokes refresh tokens and clears the cookie. |
| `POST/GET /api/admin/media` | Server-signed Cloudinary upload bridge + recent-uploads listing; 501 when Cloudinary env is absent. |
| `app/actions/lead.ts` (`submitLead`) | Server action receiving the contact form. |
| `lib/admin/actions.ts` | Server actions: generic content CRUD, reorder, settings update, lead status/notes/delete. |

`proxy.ts` (Next middleware) redirects cookie-less `/admin/*` traffic to the login page —
explicitly documented as UX, not security.

## 2. Data model

Collection names are frozen in `lib/firebase/collections.ts` as the `COLLECTIONS` const and every
access goes through `col(name)`, which prepends `FIRESTORE_COLLECTION_PREFIX` (test isolation).
Twelve collections:

- **`settings`** — singleton doc `settings/site` (`siteSettingsSchema`): name, tagline, hero copy, trust line, contact email/WhatsApp/Calendly, markets, response promise, socials, SEO block, metrics array, `homeFaqs` array, announcement banner.
- **`services`** (`serviceSchema`): name, slug, iconKey (10-key enum), short, problem, `long` rich text, offerings, process steps, stack, faqs, relatedProjectSlugs, transformation (before[]/after[]/metric), plus base `order`/`status(draft|published)`/timestamps.
- **`projects`** (`projectSchema`): title, slug, client, industry, timeline, serviceSlugs, summary, challenge/solution/results rich text, metrics, stack, `cover` (kind generated|cloudinary + seed/url/alt), gallery, `featured`, `sample` (seeded-demo flag surfaced only in admin), base fields.
- **`team`** (`teamMemberSchema`): name, role, bio, photoUrl (empty → generated monogram), socials, `visible`, order.
- **`testimonials`** (`testimonialSchema`): quote, author, role, company, avatarUrl, `visible`, order. **Text only — no video model.**
- **`logos`** (`logoSchema`): name, kind client|tech, optional imageUrl (default = styled wordmark), `visible`, order.
- **`leads`** (`leadSchema`): name, email, services[], budget enum, message, `status` (new|contacted|qualified|won|lost), `notes[]` ({text, at}), attribution (visitorId, sessionId, path, referrer, utm, country, city), timestamps.
- **`visitors`** — analytics: firstSeenAt/lastSeenAt/sessionCount/country per visitor UUID.
- **`sessions`** (`sessionDocSchema`) — analytics session doc with an `events` subcollection; fields include entry/exit paths, referrer, utm, device, viewport, language, geo (country/city/region), `ipHash`, ASN (asn/asnOrg/asnType), per-path view counters (`paths` map), cta/form counters, `isLead`/`leadId`, `dayKey`.
- **`ip_cache`** — enrichment cache keyed by hashed IP (country/city/region/ASN, `cachedAt`); cached forever by design.
- **`daily_stats`** — one doc per UTC day (`DailyStats` type): visitors/sessions/pageviews/avgDuration/leads, top pages/referrers/utm/countries/companies, devices, cta/form counters, scroll-depth buckets.
- **`counters`** — daily write-budget counters (`writes-YYYYMMDD`) driving the analytics kill-switch.

All schemas are Zod v4 and live in `lib/schemas/` (`common`, `settings`, `service`, `project`,
`team`, `testimonial`, `logo`, `lead`, `analytics`, re-exported via `index.ts`). Timestamps are
epoch milliseconds throughout. Rich text is Tiptap doc JSON, validated loosely
(`richTextSchema`) and sanitized at render time (`lib/richtext.ts`, sanitize-html).

## 3. Server boundaries

- **`lib/firebase/admin.ts`** — Admin SDK singleton built from three env vars
  (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` with `\n` unescaping).
  Uses `initializeFirestore(app, { preferRest: true })` for serverless cold-start speed and
  `ignoreUndefinedProperties: true` so optional fields are omitted rather than throwing. Exposes
  `adminDb()` / `adminAuth()`. The client SDK (`lib/firebase/client.ts`) exists solely for
  `/admin/login` to obtain an ID token; Firestore rules deny all client access.
- **`lib/admin/auth.ts`** — session cookie named `__session`, 14-day lifetime, httpOnly,
  `sameSite: lax`, secure in production. `verifyAdmin()` does the full check on every call:
  `verifySessionCookie(cookie, true)` (signature **and** revocation) plus the `admin: true`
  custom claim. Two guards: `requireAdminPage()` redirects to login; `requireAdmin()` throws
  `UNAUTHORIZED` so server actions fail closed. `createSessionCookieFromIdToken()` re-verifies the
  ID token, requires the admin claim, and rejects tokens whose `auth_time` is older than 5 minutes
  (anti-replay). Logout revokes refresh tokens.
- **`proxy.ts`** — cookie-presence redirect for `/admin/*` only; the code comments state the
  redirect layer is assumed bypassable and real enforcement lives in `verifyAdmin()`.
- **`lib/data/revalidate.ts` — `bustTag()`** — the load-bearing cache helper. Empirical note
  (Gate B): on Next 16.3 neither `updateTag()` nor `revalidateTag(tag, {expire: 0})` actually
  expires `unstable_cache` entries; `revalidatePath("/", "layout")` does. So the helper fires all
  three (tag calls first, for the day tagged expiry works; the layout purge as the guarantee).
  Every admin mutation calls it. This entire mechanism is Next-specific and dies in Astro.
- **`lib/data/content.ts`** — public read layer: each collection read wrapped in
  `unstable_cache` with a per-collection (prefix-aware) tag and a 1-hour revalidate safety net;
  published/visible filtering and order sorting happen after the cached full-collection read.
  Admin reads (`lib/admin/queries.ts`) bypass the cache entirely.

## 4. Analytics pipeline

**Client**: `public/t.js` (~2 KB, framework-free IIFE). Cookie-less: random visitor UUID in
localStorage (13-month cap), session UUID in sessionStorage (30-minute idle rotation), first-touch
referrer/UTM captured per session. Honors DNT, Global Privacy Control, a `disable_tracking`
localStorage key, and never runs under `/admin`. Batches events (page_view, heartbeat,
scroll_depth, cta_click, form_start, form_submit, outbound_click) and posts to `/api/collect`
with an adaptive flush cadence (15s → 30s → 60s, `heartbeatFlushDelay`).

**Server**: `lib/analytics/collect-core.ts` — one shared handler used by both the Next route
(dev/tests, geo via `x-nf-geo` header if present) and `netlify/functions/collect.mts`
(production, geo via `context.geo`; `netlify.toml` force-rewrites `/api/collect` there). The
handler: same-origin check (localhost and `*.netlify.app` allowed), per-instance token-bucket
rate limit (60/min/IP), Zod payload validation, then a budget check.

**Budget kill-switch** (`lib/analytics/budget.ts`): an amortized daily write counter in
`counters/writes-YYYYMMDD` (flushed every ~8 writes) drives three modes against the Spark
20k-writes/day quota — normal, **sampling** at 15k (event docs dropped, sessions still updated),
**halted** at 19k (collector no-ops).

**Storage**: session doc upsert (merge) with per-path view counters kept as a map on the session
doc so rollup never reads event subcollections; up to 30 non-heartbeat event docs per batch in
`sessions/{id}/events`; visitor upsert on new sessions.

**IP handling / lawfulness posture** — the strongest part of the codebase:

- **Raw IP is never stored.** It is used transiently for rate limiting and the enrichment lookup,
  then discarded. What is stored is `sha256(ip + IP_HASH_SALT)` truncated to 32 hex chars.
- Enrichment (Netlify geo + IPinfo Lite for country/ASN/org/type) is cached in `ip_cache` keyed
  by the hash, "forever" by design. ASN heuristics classify isp/hosting/business (warm-lead hint).
- Tracker respects DNT/GPC (verified by an e2e test), no cookies, no fingerprinting, no PII.
- Retention: raw sessions + event subcollections older than **90 days** are purged nightly
  (`purgeOldSessions`, delete budget 3,800/run, chunked — a free-tier substitute for Firestore TTL).
- Residual caveats for the rebuild: a salted hash of an IP is still pseudonymous personal data
  under GDPR (the salt is static, not rotated), and `ip_cache` has no retention cap. City-level
  geo and ASN org are stored per session. There is no consent banner — the posture is
  legitimate-interest first-party analytics, documented on `/privacy`. Defensible, but the new
  build should keep the purge, consider a rotating salt or dropping the hash, and cap `ip_cache`.

**Rollup**: `lib/analytics/rollup-core.ts` — pure `aggregateSessions()` (shared with the live
"today" view in `lib/analytics/dashboard.ts`) plus `rollupDay()` writing `daily_stats/{date}`,
scheduled at 03:10 UTC via `netlify/functions/rollup-daily.mts` and runnable manually via
`scripts/rollup.mts`. The admin dashboard reads rolled-up days plus a live today aggregate and a
"on the site right now" query (heartbeat within 3 minutes).

**Lead link**: a converted session gets `isLead: true, leadId` so journeys and leads cross-reference.

## 5. Lead pipeline

- **Form**: `components/marketing/contact/LeadForm.tsx` — multi-step client form
  (react-hook-form + zod resolver) sharing `leadInputSchema` with the server.
- **Validation + spam traps** in `app/actions/lead.ts` (`submitLead` server action):
  1. Zod parse (also enforces the honeypot: `website` must be the empty string literal).
  2. Per-instance in-memory rate limit: 5 submissions / 10 min / IP.
  3. Time trap: `startedAt` must be 2 s–24 h in the past.
  4. Cloudflare Turnstile verification — env-gated; when `TURNSTILE_SECRET_KEY` is unset the
     check passes (trap-based protection only).
- **Attribution**: visitor/session IDs, path, referrer, UTM come from the client
  (`lib/analytics/client-ids.ts` `readAttribution()`); country/city are copied server-side from
  the visitor's analytics session; the session is flagged as converted.
- **Storage**: `leads` collection with `status: "new"` and empty notes.
- **Alerting**: Resend email (env-gated, `LEAD_ALERT_EMAIL` or settings contact email) —
  best-effort, failure logged not surfaced.
- **Admin UI**: `LeadsClient` — status transitions across new/contacted/qualified/won/lost,
  transactional note append, delete. No pipeline stages beyond the status enum, no assignment,
  no reply-from-admin.

## 6. Media

- **Cloudinary** is fully env-gated: without `CLOUDINARY_CLOUD_NAME` the media API returns 501
  and the admin UI shows setup instructions. Uploads go through the server-signed bridge
  (`/api/admin/media`): SHA-1 signature computed server-side, 10 MB cap, `mbt-site` folder;
  listing pulls the 60 most recent via the Admin REST API with Basic auth. The API secret never
  reaches the client.
- **Custom `next/image` loader** (`lib/cloudinary/image-loader.ts`, wired in `next.config.ts`):
  Cloudinary upload URLs get `f_auto,q_{q},w_{width},c_limit` injected (stripping any existing
  transform so the loader's wins); all other sources pass through untouched, so the site works
  with no media host configured.
- **Generated aurora covers**: `lib/covers/cover-svg.ts` + `palette.ts` produce a deterministic
  SVG from a seed string; `scripts/render-covers.mts` pre-rasterizes seeded-project covers to
  `public/covers/{seed}.jpg` (1200×800 JPEG q80, via Playwright Chromium — dev-time only, JPEGs
  are committed) with `lib/covers/prerendered.json` as the manifest; `GeneratedCover.tsx` falls
  back to a live data-URI SVG for covers added later through the admin.

## 7. Admin CMS

Modules present: **dashboard** (counts, recent leads, analytics with range switch and
auto-refresh), **settings**, **services**, **projects**, **team**, **testimonials**, **logos**,
**leads**, **media**, **visitors** (session journey detail). CRUD completeness:

- Generic server actions (`createContent`/`updateContent`/`deleteContent`/`reorderContent`)
  operate only on a hard whitelist of five content collections; every mutation re-validates with
  the collection's Zod schema, guards with `requireAdmin()`, and calls `bustTag()`.
- Slugged collections (services, projects) get automatic slug uniquing (`ensureSlug` +
  `uniqueSlug`). Drag reorder persists `order = index * 10` in a batch.
- **Publish/draft**: services and projects carry `status: draft|published` via `baseDocSchema`;
  the public data layer filters to published. Team, testimonials, and logos use a simpler
  `visible` boolean. Settings is a merge-false singleton write.
- Rich text is edited with Tiptap (`RichTextEditor`) and stored as doc JSON.
- Admin reads are always uncached so the panel reflects writes instantly.
- The admin panel is deliberately exempt from the public design system (clean/fast).

## 8. Public site

Sections/pages as in §1. **CMS-driven**: hero eyebrow/headline/subline, services deck (act 3),
featured projects + testimonials + logos (act 5), team (act 6), finale contact strip, FAQs
(settings.homeFaqs → accordion + FAQ JSON-LD), metrics counters, announcement banner, footer,
nav CTA target (Calendly URL or /contact), all service and project detail content.
**Hardcoded in components**: Act 2 manifesto lines, Act 4 transformation claims and the
before/after panel compositions, styleguide, privacy/terms copy, misc microcopy.

**Motion system**: `lib/gsap.ts` registers GSAP + ScrollTrigger + `useGSAP`;
`MotionProvider` runs Lenis smooth scrolling and a reduced-motion context; primitives in
`components/motion/` (Reveal, SplitReveal, Magnetic, TiltCard, ParallaxMedia, Counter,
RouteTransition). **Three.js**: `components/three/SignalField.tsx` + `HeroVisual.tsx` (R3F)
render the persistent particle field behind the home acts, driven by `lib/three/field-state.ts`
scroll state and `field-palette.ts`. Theme via `next-themes`
(`ThemeProvider`/`ThemeToggle`), design tokens in `app/globals.css` (Aurora Obsidian), Tailwind v4
utilities throughout the public pages. SEO: per-page metadata, canonical alternates, JSON-LD
(Organization + FAQ), generated OG images, sitemap, robots.

## 9. Tests

- **Unit (Vitest, 5 files in `tests/unit/`)**: budget-mode thresholds, `col()`/prefix behavior,
  Cloudinary loader URL rewriting, schema validation, slug utils. Pure-logic, no Firebase.
- **E2E (Playwright, `tests/e2e/`, 4 specs)**:
  - `01-public` — every public route renders console-clean; designed 404; no horizontal scroll
    across viewports + sticky CTA; overlay menu with mouse and keyboard; reduced-motion
    behavior; sitemap/robots/OG endpoints.
  - `02-lead` — inline validation, honeypot rejection, time-trap rejection, valid submit stores
    an attributed lead.
  - `03-analytics` — scripted visit produces session + events + dashboard numbers; DNT respected.
  - `04-admin` — auth (deep-link guard, wrong password, login/logout), testimonial CRUD
    round-trip to the public site, drafts hidden publicly, reorder persistence, settings
    edit-and-revert propagation, lead status + notes.
- **Isolation mechanism**: the suite runs against a local production build (`next start` on port
  3111) wired to the **real** Firebase project with `FIRESTORE_COLLECTION_PREFIX=e2e_`; global
  setup seeds `e2e_*` collections, teardown (plus `scripts/cleanup-e2e.mts`, hardcoded to the
  `e2e_` prefix) deletes them. `workers: 1` because Firestore state is shared. The suite must run
  **alone**: a concurrent `next start` on the same `.next` shares the incremental cache and
  repopulates entries the suite just revalidated (observed settings-propagation flake).

## 10. Config

- **`netlify.toml`** — official Next.js runtime plugin; native functions in `netlify/functions`
  (esbuild); `rollup-daily` scheduled `10 3 * * *`; force-rewrite of `/api/collect` to the native
  collector; security headers globally and admin-hardening headers (frame-deny, noindex) on
  `/admin/*`. Prepared-but-unused per owner mandate (no deploys from AI sessions).
- **`next.config.ts`** — custom image loader wiring; the same two header groups as Netlify (so
  behavior matches under plain `next start`).
- **`firestore.rules`** — confirmed deny-all: a single `match /{document=**} { allow read,
  write: if false; }`. All authority lives server-side behind the Admin SDK.
- **`proxy.ts`** — `/admin/:path*` matcher, cookie-presence redirects only (see §3).
- **`tsconfig.json`** — strict, ES2022, `moduleResolution: bundler`, `@/*` path alias.
- **`.env.example`** variable names (values not audited): FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_SITE_NAME, NEXT_PUBLIC_SITE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, IP_HASH_SALT,
  IPINFO_TOKEN, NEXT_PUBLIC_COLLECT_ENDPOINT, CLOUDINARY_CLOUD_NAME,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, RESEND_API_KEY,
  LEAD_ALERT_EMAIL, NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY,
  FIRESTORE_COLLECTION_PREFIX.
- `.gitignore` covers `.env*` (except `.env.example`) and `/secrets/` — verified.

## 11. Reusable-for-Astro inventory

**Carries over as LOGIC (framework-free or trivially portable):**

- All Zod schemas (`lib/schemas/*`) — the single most valuable asset; they define the data model,
  the lead contract, and the analytics wire format.
- `lib/firebase/admin.ts` (singleton, preferRest, ignoreUndefinedProperties) and
  `lib/firebase/collections.ts` (`col()` prefix pattern) — only the error-message wording is
  Next-flavored.
- `lib/analytics/collect-core.ts`, `rollup-core.ts`, `budget.ts`, `client-ids.ts` — already
  written framework-neutral precisely so the Netlify functions could share them.
- `netlify/functions/collect.mts` and `rollup-daily.mts` — usable as-is alongside Astro on
  Netlify (only the `@/` import aliases → relative paths need checking).
- `public/t.js` tracker — zero framework coupling.
- Lead validation + spam-trap logic in `app/actions/lead.ts` — the body ports to an Astro
  action/endpoint nearly verbatim; only `headers()`/server-action plumbing changes.
- Admin auth approach (`lib/admin/auth.ts`) — session-cookie + custom-claim + revocation +
  fresh-auth-window logic ports; swap `next/headers` cookies for Astro's cookie API.
- Cloudinary signing/upload/listing logic in `app/api/admin/media/route.ts` and the URL-transform
  logic inside the image loader (as a plain `cloudinaryUrl(src, width)` helper).
- Cover generation (`lib/covers/cover-svg.ts`, `palette.ts`, prerendered JPEGs in
  `public/covers/`, `scripts/render-covers.mts`).
- Scripts: `seed.mts`, `seed-content.ts` (1,028 lines of finished copy for 10 services,
  12 projects, team, testimonials, logos, settings), `setup-firebase.mts`, `cleanup-e2e.mts`,
  `rollup.mts`, `deploy-preview.mts`.
- `firestore.rules` deny-all, `slug.ts`, `format.ts`, `richtext.ts` sanitization,
  `logo-glyphs.ts`, OG template + fonts (portable to raw satori).
- Test logic: all five unit suites nearly unchanged; e2e scenarios and the `e2e_` prefix
  isolation mechanism as a pattern (specs need new selectors/URLs).

**Dies with the framework:**

- Every `app/` page, layout, route handler, and `"use server"` action as files (their bodies are
  the logic listed above; the wrappers are Next).
- `unstable_cache` / `bustTag()` / `revalidatePath` machinery and the whole Gate-B workaround —
  Astro SSR has no data cache to bust; this problem disappears (and a new one appears, see risks).
- `next/image` + custom-loader wiring, `next/og` opengraph-image routes, `next/font` usage in
  `lib/fonts.ts`, `proxy.ts` middleware, `next-themes`.
- GSAP/Lenis/R3F **components** (`components/motion/*`, `components/three/*`, home acts) — the
  choreography knowledge and `lib/three/field-*` state modules inform the rebuild, but the React
  component code is rewritten (the new spec mandates a different 9-chapter structure anyway).
- Admin React components could technically survive as React islands in Astro (Tiptap editor,
  dnd-kit sortables, recharts dashboards), but they are wired to server actions, so their data
  layer is rewritten regardless.
- Tailwind v4 usage is portable in principle (Astro supports Tailwind), and the Aurora Obsidian
  tokens in `app/globals.css` carry over as CSS — but the new design spec supersedes them.

## 12. Gaps vs the new spec

Things the Astro build needs that do not exist here at all (verified by grep — none of these
identifiers appear anywhere in `lib/` or `scripts/`):

1. **Homepage chapter CMS** — the current home is seven acts with structure and two acts' copy
   hardcoded in components; the spec's nine connected chapters with CMS-managed content have no
   collection or schema.
2. **Project verification fields** — no `ownershipVerified` / `clientPermission` on projects;
   the only related concept is the `sample` flag.
3. **Testimonial video model** — testimonials are text-only (quote/author/avatar); no
   type/video/poster fields, no conditional content model.
4. **Redirects** — no redirects collection or config beyond the single Netlify collect rewrite.
5. **Standalone FAQs collection** — FAQs exist only embedded (settings.homeFaqs,
   service.faqs); no global FAQ entity.
6. **`mediaAssets` collection / asset-rights ledger** — media exists only as live Cloudinary
   API listings; nothing is recorded in Firestore, no rights/provenance tracking.
7. **`adminAudit`** — no audit log of admin mutations whatsoever.
8. **Lead pipeline stages** — only the flat five-value status enum; no stage timestamps,
   assignment, or pipeline analytics.
9. **MVPs-for-Startups page** — no route, content type, or copy.
10. **Twelve-services taxonomy** — seed contains ten services; the spec's twelve-service
    taxonomy requires two new services and a re-mapping of slugs/related projects.
11. **Video anywhere** — no video player component, no video fields in any schema, no
    poster/mobile-crop handling.

## 13. Git state

- Current branch: `claude/ai-agency-website-build-g0mqqh` (main branch: `main`).
- Modified: `package-lock.json` (56 deletions — dependency pruning, no package.json change).
- Untracked: `.mcp.json` (Higgsfield MCP server config — tooling, not app code),
  `.playwright-mcp/`, `docs/research/` (this report's directory), and two stray screenshots at
  the repo root (`home-desktop-00-loading.png`, `home-desktop-01-hero.png`).
- Recent history is documentation + V2 verification commits; working tree is otherwise clean.

## 14. Data backup readiness

**No Firestore export script exists.** The scripts directory covers setup, seed, rollup, e2e
cleanup, cover rendering, and preview deploys — nothing exports. Content collections are
recoverable from `scripts/seed-content.ts`, but **leads, visitors, sessions (+ event
subcollections), ip_cache, daily_stats, and counters are real, unreproducible data**, and any
owner edits made through the admin since seeding exist only in Firestore.
**A Firestore export script (all twelve collections, including the `sessions/{id}/events`
subcollection, to timestamped JSON) must be written and run before any migration work touches
the database.** Not written now, per audit scope.

---

## Migration verdict

**Keep as logic (port, don't rewrite):** Zod schemas; `admin.ts` + `col()`;
collect-core/rollup-core/budget/client-ids; `t.js`; both Netlify functions; lead
validation/spam-trap body; admin session-cookie auth logic; Cloudinary signing + URL-transform
helpers; cover generator + prerendered covers; seed/seed-content/setup-firebase/cleanup-e2e/
rollup/deploy-preview scripts; deny-all rules; slug/format/richtext utils; OG template + fonts;
unit-test suites; the `e2e_` prefix isolation pattern; `.env.example` contract.

**Rewrite (concept survives, code doesn't):** all pages/layouts as Astro routes; server actions
as Astro actions/endpoints; middleware guard; caching strategy (replace `unstable_cache` with an
explicit per-request or in-memory layer); image pipeline (loader → explicit Cloudinary helper /
Astro assets); admin UI (optionally reusing Tiptap/dnd-kit/recharts as React islands); theme
toggle; home narrative per the new nine-chapter spec; e2e specs against the new DOM.

**Discard:** `bustTag()` and the Gate-B revalidation workaround; `next/og` route wrappers;
`next-themes`; `next/font` wiring; `proxy.ts`; the seven-act GSAP/R3F component code; RouteTransition;
`prerendered.json` plumbing if the new media pipeline supersedes generated covers; V1/V2 design
docs as anything but reference.

**Ten biggest migration risks, ranked:**

1. **No data backup.** Live leads and analytics history have no export path; a migration mistake
   is unrecoverable. Blocker — write and run the export script first (§14).
2. **Read-quota regression.** Today every public request is absorbed by `unstable_cache`; a naive
   Astro SSR port reads ~6 collections per page view and can burn the Spark 50k-reads/day free
   tier under modest traffic. The rebuild needs an explicit caching layer designed up front.
3. **Admin auth port fidelity.** The current flow closes real holes (revocation check, admin
   claim, 5-minute fresh-auth window, fail-closed action guard). Any drift while translating to
   Astro cookies/endpoints silently reopens them.
4. **Analytics continuity.** The `t.js` ↔ `/api/collect` wire contract, the Netlify rewrite, the
   budget counter, and visitor IDs in users' browsers must all survive the swap or history
   bifurcates mid-migration.
5. **Schema migration on live data.** New fields (verification flags, video testimonials,
   chapters, mediaAssets, audit) must be added while the old site still serves the same
   collections; needs additive-only changes plus defaults, or a prefix-separated cutover.
6. **Homepage motion rebuild scope.** The seven-act GSAP/Lenis/R3F choreography is the bulk of
   the project's polish and its hardest-won performance evidence (`docs/evidence/`); the
   nine-chapter rewrite is the largest single effort and regression surface.
7. **In-memory rate limiting assumptions.** Both the collector's token bucket and the lead
   limiter live in per-instance Maps; on scale-to-zero or multi-instance serverless they weaken
   to near-zero. Acceptable today, but the rebuild should not assume they protect anything.
8. **Image optimization call sites.** The custom loader is applied automatically by
   `next/image`; in Astro every image call site must opt in to the Cloudinary helper — missed
   spots serve full-size originals and drain the Cloudinary/bandwidth free tier.
9. **Test-isolation discipline.** Isolation works only because literally every access goes
   through `col()`. One hardcoded collection name in new Astro code lets e2e runs corrupt live
   data against the real project.
10. **Free-tier tuning is encoded in constants.** Write limits, delete budgets, flush cadences,
    REST-transport cold-start choices were tuned for Netlify + Spark; changing the adapter or
    hosting profile invalidates them and needs re-measurement, not blind copying.
