# Copy upgrades — homepage, About, services

**Date:** 2026-09-01. Suggestions only — nothing here ships without owner approval. Voice per
COPY-DECK: direct, specific, calm, technically literate, warm, outcome-led. No banned words,
no invented numbers. Patterns applied come from `CONTENT-RND.md`.

## Homepage, per chapter

**Ch.1 Arrival.** Current hero holds. Two additions: a mono eyebrow variant for A/B
consideration — `SOFTWARE THAT FINISHES THE JOB` — and a one-line sub-support under the CTA
row: *"Thirteen products in production. Twelve ways to build yours."* (Structural, verifiable
from the portfolio itself.)

**Ch.2 Problem.** The three manifesto lines are strong; keep. Optional fourth beat as the
turn into Ch.3: *"We build the software that closes the gap."* — one line, lands the pivot
from problem to system.

**Ch.3 System.** Keep the intro. Give each service card a mono eyebrow of its number
(`01`–`12`) — the numbering is already locked and reads as a system, which is the chapter's
argument. Per-card copy stays the outcome line only; depth lives on the service page.

**Ch.4 Founders.** Name the process (R&D pattern 3). Suggested name: **the Build Loop** —
"Map → Design → Build → Operate" already reads as a loop, and Operate feeding back into Map is
the honest claim. Suggested line under the steps: *"The loop doesn't end at launch. That's
the point."*

**Ch.5 Transformation.** Keep capability-shaped claims. Sharpen the before/after with one
concrete pair per line: *"Before: the booking sits in an inbox until Monday. After: confirmed
in ninety seconds, and the calendar already knows."* (Illustrative scenario, not a client
claim — label stays generic.)

**Ch.6 Work.** Apply outcome-first headlines (R&D pattern 1): each card leads with what the
product does in the world, then the sourced metric chip (label · value · source), then our
role. Metric chips must always show their source — the sourcing *is* the credibility.

**Ch.7 Voices.** Curation guidance for the CMS: prefer quotes with a specific noun in them
(a feature, a number the client owns, a day of the week) over general praise. One line of
context per voice: who they are and what we built.

**Ch.8 People.** Add the embedding specifics (R&D pattern 6): *"Your repo, your cloud, your
name on everything. We work in your channels, not around them."* Sits well as a fourth line
after the existing three.

**Ch.9 Resolution.** Holds as written. One optional micro-addition under the risk-reversal:
*"Worst case, you leave with a sharper plan and we part friends."*

## About

**Mission (opening statement options — pick one, keep the rest for CMS rotation):**
1. Current: *"Software should remove work. We started Aigenvora because too much of it adds
   work instead."* (Keep as default — it's the best of the three.)
2. *"Every business runs on software. Most of it runs on patience. We build the kind that
   gives the patience back."*
3. *"We build systems that finish the job — agents, products and platforms that do the work
   instead of describing it."*

**Values.** The five PRINCIPLES hold. One candidate addition, drawn from how the portfolio
actually operates: **"Operate what you build"** — *"We run products in production, so we
design like the 3am page is coming to us. Because sometimes it is."*

**Stats strip (structural only — no invented numbers, every item verifiable from the site
itself):**
- `12 service lines · 13 products in production · 1 senior team`
- `Senior-only · No hand-offs · No account managers`
- `Your repo · Your cloud · Your code, from the first commit`
- `Replies within two working days · One channel per client · Working software every week`

Pick one strip of three to four items; rotate the rest into section headers. If the owner
later approves sourced portfolio metrics for About, they join as labeled chips, never as bare
round numbers.

**Ways to work with us** (new About/Contact block, R&D pattern 5): three engagement shapes —
**Project build** (scoped, milestone-billed), **MVP sprint** (time-boxed, per the MVP page),
**Managed cover** (monthly, cancellable, per service 12). Three sentences each, no pricing
until the owner approves any.

## Services — benefits + typical stack additions

Format for `defaults.ts`: add `benefits: string` (one paragraph) and `stack: string[]` per
service. Stacks describe what we typically reach for — each service page should note stacks
are chosen per project and documented in an architecture decision record.

### 01 AI Agents & Business Automation
**Benefits.** The hours come back first: the routine work that filled a role gets done by
software, and the person who did it moves to the judgment calls. Errors drop because agents
never skip a step in a checklist, and every action is logged, so you can finally see how the
work actually flows. Costs are metered per task, so the economics are visible before you
commit. And because humans hold the approval points, you get automation without handing over
the keys.
**Typical stack.** Claude/GPT-class models behind one swappable interface · queue-backed
orchestration (Temporal or BullMQ) · Postgres for state and audit trails · evaluation harness
run on real cases · OpenTelemetry tracing on every agent action.

### 02 AI Integration
**Benefits.** Your team keeps its tools and gains a layer that reads, sorts and drafts inside
them — adoption is high because nothing about the workday has to change. Answers come grounded
in your own documents with sources cited, so trust builds instead of eroding. Quality is
measured on an evaluation set, not vibes, which means a model swap is a Tuesday, not a crisis.
**Typical stack.** Retrieval over pgvector or a managed vector store · embedding pipelines
with permission-aware indexing · a model router with fallbacks · evaluation sets in CI ·
no-training and retention flags set explicitly per provider.

### 03 AI SaaS / AI Product Development
**Benefits.** You ship a product whose AI core is defensible — workflow depth, data loops and
evaluation discipline that a weekend wrapper can't copy. Unit economics are designed in:
metering, caps and margins modeled against real inference costs before launch, not discovered
after. And because evaluation gates every release, a model update never silently degrades what
your users pay for.
**Typical stack.** Next.js + TypeScript · Postgres · Stripe metered billing · a model gateway
with per-tenant cost tracking · evaluation and regression gates in CI · feature flags for
staged AI rollouts.

### 04 Data & AI Infrastructure
**Benefits.** Decisions stop being arguments about whose spreadsheet is right — there is one
tested source of truth and everyone queries it. Models and agents get data fresh and validated
enough to act on, which is the difference between AI that works and AI that demos. When data
goes bad, monitoring pages a person before the bad number reaches a dashboard or a model.
**Typical stack.** dbt for tested transformations · Dagster or Airflow orchestration · a
warehouse sized to the problem (Postgres before Snowflake, honestly) · pgvector for retrieval ·
freshness and drift checks with alerting.

### 05 Legacy Software + AI Modernization
**Benefits.** The business keeps running the whole time — no freeze, no big-bang cutover, no
weekend that decides everything. Risk shrinks step by step because every stage ships behind a
rollback, and characterization tests pin down what the old system really does before anything
changes it. Your team ends up with a system they understand, documented, instead of a new
mystery replacing the old one.
**Typical stack.** Characterization test harnesses · strangler-fig routing at an API façade ·
contract tests on every seam · feature flags for staged cutover · documentation written as the
migration happens, not after.

### 06 Custom SaaS Development
**Benefits.** You get a platform, not a pile of features: tenancy, permissions, billing and
audit trails designed before the first screen, because retrofitting any of them is where SaaS
projects go to die. Your ops team can run it without a developer on call — admin tooling and
support views are part of the build. And it's operable from day one: observability, backups
and a runbook, because launch is the start of the product, not the end of the project.
**Typical stack.** Next.js or a comparable proven framework · Postgres with row-level tenancy ·
Stripe for subscriptions and dunning · audit logging · an admin panel your support team
actually uses · infrastructure as code from the first deploy.

### 07 Web Application Development
**Benefits.** The app holds up in the states real operations live in — loading, empty, error,
offline — so your team trusts it with the company's actual work. It's fast and accessible by
default, which shows up as fewer support tickets and no retrofit later. Because it ships with
tests and monitoring, changing it stays cheap after launch, which is when most web apps
quietly become unchangeable.
**Typical stack.** React/Next.js + TypeScript · Postgres behind a typed API layer · Playwright
end-to-end tests · WCAG-conscious component library · error tracking and performance
monitoring wired before go-live.

### 08 Mobile App Development
**Benefits.** The platform decision — native or cross-platform — is made on your app's actual
demands and given to you in writing, so you're never rebuilding in year two because of a
guess. Offline and push are engineered, not bolted on, which is what separates apps that get
used in the field from apps that get uninstalled. Store submission, release pipeline and crash
monitoring come with the build, so shipping version 1.1 is routine, not a project.
**Typical stack.** Flutter or React Native where it's smart, Swift/Kotlin where it matters ·
offline-first local store with sync · push via APNs/FCM · Fastlane release automation · crash
and performance monitoring (Sentry-class).

### 09 API & System Integration
**Benefits.** Data entered once exists everywhere it should, and the triple-entry quietly
eating your team's week stops. Syncs survive the real world — outages, rate limits, duplicate
deliveries — because retries, idempotency and dead-letter queues are built in, not hoped for.
When a third-party API changes, monitoring and contract tests catch it before your team
notices, instead of three weeks after the data went stale.
**Typical stack.** Queue-backed connectors with idempotency keys · retries with dead-letter
queues and replay · contract tests against third-party APIs · per-flow monitoring and
alerting · OpenAPI-documented endpoints for anything we expose.

### 10 Cloud / DevOps
**Benefits.** Deploys stop being events: small, reversible releases with a rehearsed one-command
rollback turn shipping into routine. Your infrastructure is reviewable code, so environments
stop drifting and the next engineer can read how production actually works. And the bill makes
sense — right-sizing, budgets and alerts mean you pay for load, not for forgotten experiments.
**Typical stack.** Terraform/OpenTofu · GitHub Actions pipelines with quality gates · Docker ·
AWS, GCP or Azure — whichever you're already deepest in · Grafana/Prometheus-class
observability · preview environments per pull request.

### 11 Cybersecurity & AI Security
**Benefits.** You ship at startup speed without carrying startup-sized holes: the ten issues
fast-built products share get found and fixed before users arrive. The AI surface is covered
specifically — prompt injection, data leakage through model context, over-permissioned agents —
which generic security reviews don't yet look for. And the groundwork for SOC 2 or ISO gets
laid as engineering, so compliance later is a project, not a panic.
**Typical stack.** Threat modeling per product · dependency and secret scanning in CI · cloud
posture review · prompt-injection test suites for AI features · permissioned tool scopes and
audit trails for agents · an incident response plan short enough to follow at 3am.

### 12 Maintenance & Managed AI
**Benefits.** Someone is watching, so you hear about incidents from us — with a fix underway —
not from a customer. The slow rot that kills software is handled on a schedule: dependencies,
models and infrastructure kept current, with tests deciding what ships. And the AI keeps
earning its place, because cost per task, quality and drift get reviewed monthly with tuning
attached, not tickets.
**Typical stack.** Uptime and error monitoring with human escalation · Sentry-class error
tracking · automated dependency updates gated by tests · monthly AI evaluation runs · cost
dashboards per workflow · an SLA short enough to actually read.
