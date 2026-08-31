# DEPLOYMENT — owner-run (repo rules prohibit agent deploys)

The app is production-ready and verified locally; nothing here has been deployed by the agent.

## One-time Netlify setup

```bash
cd aigenvora
npm i -g netlify-cli
netlify login
netlify init                    # create/link a site; base directory: aigenvora
# Environment (values from the repo root .env.local — never commit them):
netlify env:set FIREBASE_PROJECT_ID   <value>
netlify env:set FIREBASE_CLIENT_EMAIL <value>
netlify env:set FIREBASE_PRIVATE_KEY  "<value with \n escapes>"
netlify env:set FIREBASE_API_KEY      <NEXT_PUBLIC_FIREBASE_API_KEY value>
netlify env:set PUBLIC_SITE_URL       https://aigenvora.com
# FIRESTORE_COLLECTION_PREFIX: leave unset — the app defaults to v3_
netlify deploy --build --prod
```

## aigenvora.com DNS

1. Netlify → Domain management → add `aigenvora.com` and `www.aigenvora.com`.
2. At the registrar: apex A/ALIAS per Netlify's instructions; `www` CNAME to the site.
3. Set the primary domain to the apex; Netlify then 301s `www` → apex and provisions HTTPS.

## Post-deploy smoke (Gate E)

- `/` renders with the engine after interaction; `/sitemap.xml` lists 19 routes; `/robots.txt` blocks /admin.
- `/admin` redirects to login; sign in with the admin user; leads/services/projects/settings load.
- Submit a test lead on `/contact`; it appears in /admin/leads; delete it.
- Response headers include the CSP and X-Frame-Options from netlify.toml.

## Rollback

Netlify → Deploys → previous deploy → "Publish deploy". Content rollback: Firestore data is
additive; the pre-migration backup lives at `secrets/backups/` (see scripts/export-firestore.mts
in the repo root for taking a fresh one first).

## Cutover from the legacy site

The legacy Next app still serves the old collections (no prefix). Nothing about this deploy
touches it. When you're ready to retire it, keep the branch in git history and remove its
Netlify site — no data migration is needed beyond what `scripts/migrate-legacy.mjs` already
copied into `v3_*`.
