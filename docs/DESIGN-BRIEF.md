# Design Brief — MBT · AI Software House

**Date:** 2026-08-30 · **Author:** build agent (Phase 0 brainstorm output)
**Read:** Awwwards-tier landing experience for an AI software agency selling to founders/CTOs — cinematic dark-futuristic, calm and expensive, engineered to convert. Dials: `DESIGN_VARIANCE 9 · MOTION_INTENSITY 8 · VISUAL_DENSITY 3`.

This brief resolves every open decision in the master spec so implementation never stalls. Decisions marked ⚠ are environment-forced deviations, each with its rationale and a swap path.

---

## 1. Brand defaults (owner did not fill placeholders)

| Key | Value used | Where it lives |
|---|---|---|
| `[AGENCY_NAME]` | **MBT** (from repo `mbt-company-website`) | `settings/site.name`, env `NEXT_PUBLIC_SITE_NAME` |
| `[TAGLINE]` | "We build AI products that ship." | `settings/site.tagline` |
| `[CONTACT_EMAIL]` | `hello@example.com` — **flagged in handover** | `settings/site.contactEmail` |
| `[WHATSAPP_NUMBER]` | empty → WhatsApp button hidden | `settings/site.whatsapp` |
| `[CALENDLY_URL]` | empty → CTA falls back to `/contact` form | `settings/site.calendlyUrl` |
| Socials | empty → hidden | `settings/site.socials` |
| `[PRIMARY_MARKETS]` | "Global" | `settings/site.markets` |
| Admin | `ADMIN_EMAIL` / `ADMIN_PASSWORD` env only | `.env.local` (gitignored) |

Everything above is editable in **Admin → Site Settings** with zero redeploys.

## 2. Typography ⚠

Fontshare's CDN is unreachable from this build sandbox (egress policy), and `next/font/local`
needs vendored files. Vendoring random third-party mirrors of Clash Display/Satoshi is a
licensing-provenance risk. Decision:

- **Display:** Space Grotesk (variable 300–700, OFL, vendored woff2) — tight-tracked, geometric-grotesk; the closest license-clean cousin of Clash Display.
- **Body/UI:** Instrument Sans (variable, OFL, vendored) — General Sans-adjacent neutral humanist.
- **Mono:** Geist Mono via the official `geist` npm package.
- Banned faces (Inter/Roboto/Arial/Open Sans/Helvetica) are not used anywhere.

**Swap path:** drop `ClashDisplay-*.woff2` / `Satoshi-*.woff2` into `app/fonts/` and edit the
two `localFont` blocks in `lib/fonts.ts` (documented in RUNBOOK). All type styles reference
`--font-display` / `--font-sans` / `--font-mono` variables only.

## 3. Aurora Obsidian tokens (final values)

Defined once in `app/globals.css` `@theme`:

- Void `#05070C` · Surface `#0B0E16` · Raised `#111624` · hairlines `white/8–12`
- Text: `#EEF2F8` / `#9AA6B8` / `#5C6778` (contrast-checked: secondary on Void = 7.4:1, faint used ≥ 18px or decorative only)
- Aurora: cyan `#22D3EE` → teal `#5EEAD4` → violet `#818CF8` — glows, orbs, gradient text strokes only
- CTA amber `#F5B14C` — the single warm element per screen (primary button + live-dot accents)
- Noise: fixed full-page SVG-noise overlay at 3% opacity, `pointer-events-none`
- Easing tokens: `--ease-out-expo: cubic-bezier(0.16,1,0.3,1)`, `--ease-swift: cubic-bezier(0.32,0.72,0,1)`; `linear`/`ease-in-out` never used for motion.

## 4. The 3D hero — "Signal Field" (chosen concept)

A living neural constellation: ~1,400 GPU points + ~1,100 precomputed nearest-neighbor line
segments in one R3F scene. Behavior:

1. **Breathing:** simplex-noise displacement in the vertex shader (shared by points + lines so they stay attached), slow phase drift.
2. **Pointer gravity:** `uPointer` uniform lerped on CPU each frame (inertia), points swell/brighten within a falloff radius.
3. **Scroll morph:** `uProgress` (piped from a ScrollTrigger on the hero pin) lerps every point between two position targets — organic cloud → ordered lattice ("chaos → shipped system", the brand story told mechanically).
4. Depth-graded aurora colors (cyan near → violet far), additive blending, subtle size attenuation. No postprocessing pass — bloom is faked via soft sprite falloff (cheaper).

Constraints honored: `dpr` clamped [1, 1.75]; `Canvas` lazy-imported after first paint and
excluded from the marketing JS budget; render loop pauses when the hero leaves the viewport;
static **aurora poster** (pure CSS gradients + noise + SVG constellation) always renders
underneath — WebGL-unsupported, reduced-motion, low-power and low-core devices simply keep
the poster. The page must feel finished if the canvas never mounts.

Secondary depth accents: pointer-tilt on case-study covers (Motion springs), breathing orb in
the final CTA band (pure CSS). No other 3D.

## 5. Layout archetypes (per Home section)

1. **Hero** — split editorial: copy column left (eyebrow → 2-line display headline with masked SplitText reveal → subhead → CTA pair → mono trust row), Signal Field bleeding right/behind; scroll pins ~120vh while the field morphs and the headline parallax-exits.
2. **Trust bar** — full-bleed seamless marquee of logo wordmarks, hairline-framed, pause on hover.
3. **Services bento** — 12-col asymmetric: AI & GenAI hero cell (2×2) + five satellite cells; double-bezel cards, icon micro-motion, inner-glow hover.
4. **Process** — pinned vertical scrub: left rail = step index 01–05 (mono) with progress line; right = step card stack, each scrubbed in/out; each step lists deliverables + timeframe.
5. **Featured work** — alternating editorial rows (media 7 cols / text 5 cols), parallax covers, "View case ↗" pill slides in on hover.
6. **Metrics band** — 4 counters, mono, count-up once.
7. **Testimonials** — asymmetric 2-up + 1 wide quote, no carousel.
8. **Team preview** — 4 portrait cards → About.
9. **FAQ strip** — elegant accordion, 4 objection-killers.
10. **Final CTA** — centered giant display headline over a breathing orb, amber primary button, proof line beneath.

Mobile (<768px): all of the above collapse to single-column `w-full px-4`, pinned scenes
degrade to plain stacked reveals, sticky bottom CTA appears after hero and hides at footer.

## 6. Cover art system ⚠ (Cloudinary cloud name not provided)

Only `API_KEY`/`API_SECRET` were supplied — Cloudinary is unusable without the **cloud name**,
and its API is also egress-blocked in this sandbox. Decision: a **generative cover system** —
deterministic aurora-field SVG/CSS art per project/service (seeded hue rotation, grain,
concentric geometry) that fits the art direction better than stock photos and can never 404.
Every image component accepts a Cloudinary URL the moment one exists: the custom `next/image`
loader injects `f_auto,q_auto,w_{size}` for `res.cloudinary.com` sources and passes other
sources through. Admin → Media is fully built and env-gated: set
`CLOUDINARY_CLOUD_NAME` (+ optional unsigned preset) and uploads work with zero code changes.

## 7. Data shapes (Firestore, admin-SDK only)

- `settings/site` — singleton, full brand/SEO/metrics/announcement fields.
- `services/{id}` — name, slug, iconKey, short, long (Tiptap JSON), offerings[], faqs[], relatedProjectIds[], order, status, timestamps.
- `projects/{id}` — title, slug, client, industry, serviceSlugs[], summary, challenge/solution/results (Tiptap JSON), metrics[{label,value}], stack[], cover{kind:'generated'|'cloudinary', seed|publicId,…}, gallery[], featured, order, status, timestamps.
- `team/{id}`, `testimonials/{id}`, `logos/{id}` — per spec, with order/visible.
- `leads/{id}` — name, email, services[], budget, message, status pipeline, notes[], attribution {visitorId, sessionId, referrer, utm, country, city, path}, timestamps.
- `visitors/{visitorId}` — firstSeenAt, lastSeenAt, sessionCount, country.
- `sessions/{sessionId}` — visitorId, startedAt, lastSeenAt, durationSec, pageCount, maxScroll, entry/exit paths, referrer, utm, device, language, country/city/region, ipHash, asnOrg, asnType, isLead, leadId.
- `sessions/{id}/events/{autoId}` — {t, ts, path, meta} for page_view / scroll_depth / cta_click / form_start / form_submit / outbound_click. **Heartbeats never create docs** — they only bump session fields at flush.
- `ip_cache/{ipHash}` — country, city, region, asn, asnOrg, asnType, cachedAt (forever).
- `daily_stats/{YYYY-MM-DD}` — rollup document the dashboard reads for ranges.
- `counters/writes-{YYYYMMDD}` — amortized write counter powering the kill-switch.

**Write budget:** typical visit = 1 visitor upsert + 1 session create + ~4–8 session flush
updates (heartbeat decay: 15s → 30s → 60s cap) + ~4–7 event docs + amortized ~0.5 counter
writes ≈ **10–17 writes**. At 1,000 visits/day ≈ 10–17k of the 20k/day Spark quota → kill-switch
trips at 15k (`counters` doc): collector drops event docs + slows session updates but keeps
sessions alive (sampling mode). Reads: dashboard = rollups + today only.

**Test isolation:** every collection name flows through `col()` which applies
`FIRESTORE_COLLECTION_PREFIX` (e.g. `e2e_`) so Playwright runs never touch real content.

## 8. Auth & session flow (admin)

Client (login page only) `signInWithEmailAndPassword` → ID token → POST `/api/admin/session`
→ server verifies token + `admin` claim → `createSessionCookie` (14d) → httpOnly secure
`__session` cookie. `proxy.ts` does a cheap cookie-presence redirect for `/admin/*`;
**every** admin server action/page calls `requireAdmin()` (full `verifySessionCookie(…, true)`
+ claim check). Logout revokes refresh tokens and clears the cookie. Failed logins: +600ms
delay, generic error. No signup path exists. Email/Password provider is enabled
programmatically by `scripts/setup-firebase.mts` (verified by a live sign-in round-trip).

## 9. Caching & revalidation

Data layer wraps all public reads in `unstable_cache(..., { tags: [collection] })`;
every admin mutation calls `revalidateTag(tag)`. Chosen over `"use cache"`/Cache Components
because tagged `unstable_cache` is the stable, Netlify-adapter-proven path on 16.3 while
`cacheComponents` still changes page-level dynamics globally. Public pages stay
`force-dynamic`-free; content changes appear on next request after save (verified in Gate B).

## 10. Collector topology

Tracker always posts to `/api/collect`. In production `netlify.toml` force-rewrites that path
to the native function `netlify/functions/collect.mts` (which gets `context.geo` for free);
locally and in Playwright the Next route handler serves it. Both are 20-line shells over one
shared core (`lib/analytics/collect-core.ts`) so tests exercise the real logic. Geo source
order: Netlify `context.geo` → `x-nf-geo` header → IPinfo Lite (also the ASN/company source)
→ unknown. Raw IPs are never stored — `sha256(ip + IP_HASH_SALT)` only.

## 11. Environment-forced deviations (full list)

| Blocked in sandbox | Mitigation shipped |
|---|---|
| Netlify API/CLI egress | Complete `netlify.toml` + OpenNext plugin config + one-command deploy runbook; Gate E steps scripted for the owner (or a future session with Netlify egress). |
| Cloudinary API + missing cloud name | Generative cover system; env-gated Media module; loader ready. |
| IPinfo egress | Enrichment module unit-tested against recorded fixture shapes; graceful-degrade path (unknown org) live-tested; real calls verified post-deploy. |
| Fontshare CDN | §2 font substitution with drop-in swap path. |
| Superpowers/taste plugins & MCPs absent | Same discipline natively: this brief (brainstorm), PLAN.md (writing-plans), vitest TDD for logic, Playwright + real-Chromium screenshots for gates, phase-end self-review. |
