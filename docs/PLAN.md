# Implementation Plan — MBT AI Software House website

Phased plan derived from the master spec + DESIGN-BRIEF.md. Every task carries its own
verification step; a phase is done only when its checks pass. Gates A–E defined in the spec
(§16); environment-blocked parts of Gate E are scripted for the owner in RUNBOOK.md.

## Phase 0 — Plan & scaffold ✅ criteria: `next build` green on hello-world, envs plumbed
1. Credential probes (Firestore/Auth/Mgmt API/rules API) — evidence in TEST-REPORT. ✔ done
2. Design brief + this plan committed.
3. Hand-rolled scaffold: package.json (pinned majors), tsconfig strict, next.config.ts
   (custom Cloudinary loader file, security headers), postcss + Tailwind v4, eslint flat
   config, app/layout + globals (tokens), vendored fonts, `geist` mono.
4. `.env.example` (complete, commented) + `.env.local` (real values; gitignored) +
   `secrets/` for the service-account JSON (gitignored).
5. `scripts/setup-firebase.mts`: enable Email/Password provider, deploy deny-all
   `firestore.rules` via Rules REST API, ensure web app exists → prints web config.
   Verify: live sign-in round-trip with a throwaway user; rules release updated.
6. netlify.toml (build, plugin, functions dir, schedule, headers, collect rewrite).

## Phase 1 — Foundation ✅ criteria: seed runs idempotently; vitest suite green
1. `lib/schemas/*` (zod v4) — TDD: parse/reject fixtures for every entity.
2. `lib/firebase/admin.ts` (singleton, preferRest), `lib/firebase/collections.ts` (`col()`
   prefix helper) — TDD prefix logic.
3. `lib/data/*` cached fetchers with tags (`unstable_cache`) + `lib/data/mutate.ts`
   (revalidateTag helpers). `lib/utils/slug.ts` (TDD), `lib/utils/format.ts`.
4. `lib/cloudinary/loader.ts` (TDD: URL building) + cover-art generator (deterministic SVG).
5. `scripts/seed.mts` — admin user + claims, settings, 6 services, 6 projects, 4 team,
   3 testimonials, 10 logos. Idempotent upserts; summary table printed.
6. Run seed against live Firestore; spot-read docs back.

## Phase 2 — Design system & motion kit ✅ criteria: /styleguide visually reviewed via
Playwright screenshots (desktop+mobile), zero console errors, reduced-motion mode correct
- tokens/fonts (done in P0) → primitives: `Bezel` (double-bezel card), `Eyebrow`, `Button`
  (magnetic pill, arrow-in-circle, press physics), `Reveal`/`SplitReveal` (GSAP+SplitText),
  `Counter`, `Marquee`, `Accordion`, `SectionHeading`.
- `MotionProvider`: Lenis ⟷ GSAP ticker sync, ScrollTrigger proxy, `prefers-reduced-motion`
  global switch, route-change scroll reset + page transition veil.
- `SiteNav` (island pill, morphing hamburger, full-screen glass menu with masked link
  reveals, keyboard + focus trap), `SiteFooter`, `NoiseOverlay`, `AuroraBackdrop`.
- Hidden `/styleguide` exercising all of it.

## Phase 3 — Home ✅ criteria: all 10 sections render from Firestore; hero 3D lazy +
poster fallback; pinned process scrubs; console-zero; screenshots reviewed at 390/768/1440
- `components/three/SignalField.tsx` (points+lines shaders, pointer inertia, scroll morph,
  visibility pause, capability gate) + `HeroPoster`.
- Sections per brief §5; all copy/data via data layer; metrics counters; FAQ accordion.

## Phase 4 — Inner pages ✅ criteria: every route 200s with real data; lead pipeline
verified end-to-end locally (doc created w/ attribution, spam traps block)
- Services index + detail template; Work index (tag filters) + case-study template
  (facts row, challenge/solution/results, metric cards, gallery, next-project); About;
  Contact (multi-step RHF+zod form → server action: zod, honeypot, time-trap, optional
  Turnstile, lead doc + attribution, revalidateTag('leads'), optional Resend);
  privacy/terms (accurate first-party-analytics language); custom 404; sticky mobile CTA;
  exit-intent (desktop, once/session, ≥20s).

## Phase 5 — Admin ✅ criteria: full CRUD round-trips live against Firestore; public page
reflects an edit without redeploy; deep-link guard redirects; logout revokes
- Auth: login page, `/api/admin/session` exchange, `requireAdmin()`, `proxy.ts`, logout.
- Shell: left nav, dark clean UI kit (in-repo shadcn-style primitives), toasts, skeletons,
  empty states.
- Modules: Dashboard (Phase 6 fills), Leads (pipeline, drawer, notes, journey), Projects,
  Services, Team, Testimonials, Logos, Settings (singleton), Media (env-gated Cloudinary).
- Every mutation: zod → admin SDK → revalidateTag. Slug uniqueness; delete confirms with
  name; dnd-kit reorder + keyboard fallback buttons.

## Phase 6 — Analytics ✅ criteria: scripted visit produces session+events+durations in
dashboard; budget math unit-tested; kill-switch unit-tested; journey renders on a lead
- `public/t.js` tracker (per brief §7/§10) + `<Analytics/>` mount.
- `lib/analytics/collect-core.ts` (validate, rate-limit, geo, ipHash, ip_cache, IPinfo,
  budget counter, kill-switch) + `/api/collect` route + `netlify/functions/collect.mts`.
- `netlify/functions/rollup-daily.mts` (+ shared core) — aggregates yesterday → daily_stats,
  purges >90d in ≤4k-delete chunks; manually invocable via `scripts/rollup.mts`.
- Dashboard: live-now, range picker, charts (Recharts), sources, countries, devices,
  companies (IPinfo attribution footer), funnels, journeys; lead drawer embeds journey.

## Phase 7 — SEO/perf/a11y ✅ criteria: metadata/sitemap/robots/OG verified; JSON-LD valid;
axe-clean pages; bundle report within budget
- Metadata API + canonicals; sitemap.ts/robots.ts; `next/og` OG images (brand template);
  JSON-LD Organization/Service/BreadcrumbList/FAQPage; focus-visible styles; skip link;
  contrast audit; bundle analysis (3D chunk lazy-verified); security headers final.

## Phase 8 — Gates & handover
- Gate A: `typecheck` + `lint` + `build` zero errors/warnings.
- Gate B: Playwright suite vs `next start` + `FIRESTORE_COLLECTION_PREFIX=e2e_` seeded data
  (routes/console-zero, nav+keyboard, form traps + valid submit + attribution, analytics
  pipeline, admin auth+CRUD+revalidation+reorder+draft-hiding+logout, 404/sitemap/robots/OG,
  390/768/1440 no h-scroll, reduced-motion).
- Gate C: full-page screenshots (+pinned-section frames) reviewed against §5/§6 law.
- Gate D: Lighthouse local (mobile+desktop) on `/`, one service, one case study, `/contact`;
  bundle-size evidence; 3D absent from initial JS.
- Gate E (env-blocked): owner runbook — `netlify init` → env import → deploy → live smoke
  script (`npm run smoke -- --url`) → seed → verify collect/rollup/schedule; test-lead
  cleanup script.
- Handover: README, RUNBOOK, TEST-REPORT; zip (code + gitignored secrets) sent in chat;
  branch pushed.
