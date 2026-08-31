# Aigenvora — AI-Powered Software Development

Marketing site + admin CMS + lead pipeline. Astro 7 SSR, an original Three.js r158
scroll-driven 3D engine, Firebase (Admin SDK only — client rules deny everything),
prepared for Netlify.

**The application lives in [`aigenvora/`](aigenvora/)** — setup, scripts and the
operations runbook are in [`aigenvora/README.md`](aigenvora/README.md); owner-run
deploy steps in [`aigenvora/DEPLOYMENT.md`](aigenvora/DEPLOYMENT.md).

```bash
cd aigenvora
npm install
cp .env.example .env.local     # fill in real values (never commit them)
npm run dev                    # http://localhost:4321 · admin at /admin
```

## Repo layout

| Path | What |
| --- | --- |
| `aigenvora/` | The site + admin + engine + tests (unit 24, e2e 20) |
| `docs/research/` | Live R&D, tooling manifest, generated-media + rights ledgers, portfolio verification queue |
| `docs/design/` | Storyboard, motion matrix, scene architecture, copy deck |
| `docs/migration/` | Legacy→v3 migration design + executed report |
| `docs/evidence/v3/` | Verification records (TEST-REPORT-V3, Gate B) + screenshots |
| `AIGENVORA-ASTRO-MASTER-BUILD-PROMPT.md` | The V3 build specification |

## Integrity rule (load-bearing)

Case studies publish only through the admin's server-side verification gate:
ownership verified + client permission + a truthfully stated role. There is no
override. The per-product verification queue with sourced facts lives in
`docs/research/PORTFOLIO-SOURCE-LEDGER.md`.

The legacy Next.js implementation was removed in the V3 cutover; it remains in git
history before this commit if ever needed.
