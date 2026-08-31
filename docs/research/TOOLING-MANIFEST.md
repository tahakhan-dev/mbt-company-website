# TOOLING MANIFEST — Live Claude capability inventory

Recorded: 2026-08-31, at the start of the V3 (Astro) build session. This manifest records what was
actually discoverable in the live session, per Section 3A.1 of the master build prompt. Names below
were enumerated from the live session's tool roster, not assumed from the prompt's advisory list.

## 1. Session facts

- Model: Claude (Fable 5), Claude Code CLI, macOS (darwin), repo `/Users/tahakhan/Downloads/mbt-company-website`, branch `claude/ai-agency-website-build-g0mqqh`.
- Repository hard rules confirmed and binding: **no `git push` to any remote; no Netlify deploy**. Firebase static preview refresh allowed on request only.
- Session style modifiers active: `caveman` (terse chat output; committed docs remain normal prose) and `ponytail` (minimal-solution discipline). Neither changes product scope; both recorded here because they shape session transcripts.

## 2. MCP servers — connected and verified

| Server | Status | Purpose in this build | Access level / side effects | Selected? |
| --- | --- | --- | --- | --- |
| `higgsfield` | Connected, authenticated. `balance` tool called: **10 credits, free plan** — matches owner report. | Primary generative-media service after Creative Gate A. | Paid generations consume credits; billing/upsell tools exist (`show_plans_and_credits`, `confirm_billing_purchase`, trial tools) and are **excluded from use** — no purchases, no trials, no auto-refill, ever. Also exposes unrelated surfaces (website builder, TikTok publishing, shorts studio) — out of scope, not selected. | Yes — generation tools only, post-Gate A, under 10-credit ceiling. |
| `playwright` | Connected. | Live Lusion research, later repeatable visual/route/admin QA. | Drives a real browser; screenshots saved locally. | Yes. |
| `context7` (direct + plugin) | Connected. | Current official docs for Astro, adapter, Three.js r158, Firebase, Cloudinary at implementation time. | Read-only external doc fetch. | Yes (Phase 2+). |
| `serena` (plugin) | Connected. | Semantic repo discovery and migration tracing during Phases 2–7. | Local code inspection/edit tooling. | Yes when useful; standard file tools cover most of this repo's size. |
| `superpowers-chrome` | Connected (`use_browser`). | Alternate eyes-on browser research. | Drives local Chrome. | Backup to Playwright; one browser tool at a time to avoid conflicts. |
| `github` | Connected. | Read-only research only (docs, source of public libraries). | Has WRITE tools (create PR/push files) — **prohibited** by repo rules; only read/search tools may be used. | Read-only, sparingly. |
| `mongodb` | Connected. | None. Firestore remains the application database. | Would be an unauthorized architecture change. | Not selected. |
| `redis` | Connected. | None. No approved dependency. | Unauthorized architecture change. | Not selected. |

## 3. MCP servers — configured but FAILED to connect this session

`brave-search`, `firebase`, `google-dev-knowledge`, `google-search`, `postgres`, `sqlite` — all
reported `CONNECTION_CLOSED`. Treated as connection failures, not missing capability.

Impact assessment: the **firebase MCP** failure does not block the build — all Firestore access in
this repo goes through the Admin SDK in server code and `scripts/*.mts`, which is also the pattern
the new build keeps. Search MCPs are replaced by built-in WebSearch/WebFetch. `postgres`/`sqlite`
are irrelevant to the locked architecture. Owner may retry these connections but nothing in the
plan depends on them.

## 4. Plugins and skills discoverable in session

Confirmed present (invocable via the Skill tool or agent types): `superpowers` (brainstorming,
writing-plans, TDD, systematic-debugging, verification-before-completion, code review workflows),
`superpowers-chrome:browsing`, `frontend-design`, `ui-ux-pro-max` (design/ui-styling/banner et al.),
`claude-skills-motion`, `claude-skills-senior-frontend`, `claude-skills-senior-fullstack`,
`claude-skills-aceternity-ui`, `claude-skills-landing-page-generator`,
`claude-skills-thesys-generative-ui`, `graphify`, `elements-of-style`, `code-review`,
`comprehensive-review:full-review`, `backend-development:*`, `api-scaffolding:*`,
`javascript-typescript:*`, `caveman:*`, `ponytail:*`, `runway-api:*`, plus Claude Code built-ins
(`artifact-design`, `dataviz`, `security-review`, etc.).

**Not discoverable this session:** `accesslint`, `impeccable`. Per the master prompt they were
marketplace references only; they will not be claimed or depended on. Accessibility review falls to
automated checks (Playwright + axe-style assertions) plus manual keyboard/contrast passes.

Marketplace origins listed in the prompt are provenance references only — no plugin installation or
upgrade will be performed without owner authorization.

## 5. Routing decisions (deviations from the prompt's advisory matrix)

- `runway-api`: present but **not selected**. The prompt allows it only as an owner-authorized
  fallback if Higgsfield cannot meet an approved shot. No such authorization exists.
- `landing-page-generator` / `aceternity-ui`: not used for public UI. Public components will be
  original. May inform admin-internal patterns at most.
- `private-journal-mcp`: not present in the session roster; not needed.
- `graphify`: reserved for documentation diagrams if a diagram genuinely clarifies (Scene lifecycle
  in SCENE-GUIDE.md is the likely candidate).
- Higgsfield `show_plans_and_credits`: deliberately **not called** — it is a sales/checkout widget.
  Balance was checked with the read-only `balance` tool instead. This is the correct
  least-side-effect choice and is recorded as a deviation from "inspect pricing via the MCP":
  per-generation cost will be confirmed via `models_explore` / generation-tool schemas (which state
  costs) immediately before the first post-Gate-A generation, still without purchasing anything.

## 6. Audit trail of material external calls (running log)

| Date | Tool | Purpose | Cost | Result |
| --- | --- | --- | --- | --- |
| 2026-08-31 | `higgsfield.balance` | Confirm credit ceiling before any plan | 0 | 10 credits, free plan — ceiling locked at 10 |
| 2026-08-31 | Playwright MCP (research agent) | Live Lusion study, screenshots | 0 | See docs/research/LUSION-LIVE-RND.md |
| 2026-08-31 | WebFetch (research agent) | Portfolio source verification | 0 | See docs/research/PORTFOLIO-SOURCE-LEDGER.md |

Further material calls (every Higgsfield generation, any GitHub read that informs a claim) get a row
here or in the GENERATIVE-ASSET-LEDGER.
