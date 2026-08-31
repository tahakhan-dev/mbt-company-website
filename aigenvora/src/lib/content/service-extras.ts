/** Depth content per service (benefits + typical stack), from the content
 *  R&D pass (docs/research/copy-upgrades.md). Keyed by service slug. */

export interface ServiceExtras {
  benefits: string;
  stack: string[];
}

export const SERVICE_EXTRAS: Record<string, ServiceExtras> = {
  "ai-agents-automation": {
    benefits:
      "The hours come back first: the routine work that filled a role gets done by software, and the person who did it moves to the judgment calls. Errors drop because agents never skip a step in a checklist, and every action is logged, so you can finally see how the work actually flows. Costs are metered per task, so the economics are visible before you commit. And because humans hold the approval points, you get automation without handing over the keys.",
    stack: [
      "Claude/GPT-class models behind one swappable interface",
      "Queue-backed orchestration (Temporal or BullMQ)",
      "Postgres for state and audit trails",
      "Evaluation harness run on real cases",
      "OpenTelemetry tracing on every agent action",
    ],
  },
  "ai-integration": {
    benefits:
      "Your team keeps its tools and gains a layer that reads, sorts and drafts inside them — adoption is high because nothing about the workday has to change. Answers come grounded in your own documents with sources cited, so trust builds instead of eroding. Quality is measured on an evaluation set, not vibes, which means a model swap is a Tuesday, not a crisis.",
    stack: [
      "Retrieval over pgvector or a managed vector store",
      "Embedding pipelines with permission-aware indexing",
      "A model router with fallbacks",
      "Evaluation sets in CI",
      "No-training and retention flags set explicitly per provider",
    ],
  },
  "ai-saas-product-development": {
    benefits:
      "You ship a product whose AI core is defensible — workflow depth, data loops and evaluation discipline that a weekend wrapper can't copy. Unit economics are designed in: metering, caps and margins modeled against real inference costs before launch, not discovered after. And because evaluation gates every release, a model update never silently degrades what your users pay for.",
    stack: [
      "Next.js + TypeScript",
      "Postgres",
      "Stripe metered billing",
      "A model gateway with per-tenant cost tracking",
      "Evaluation and regression gates in CI",
      "Feature flags for staged AI rollouts",
    ],
  },
  "data-ai-infrastructure": {
    benefits:
      "Decisions stop being arguments about whose spreadsheet is right — there is one tested source of truth and everyone queries it. Models and agents get data fresh and validated enough to act on, which is the difference between AI that works and AI that demos. When data goes bad, monitoring pages a person before the bad number reaches a dashboard or a model.",
    stack: [
      "dbt for tested transformations",
      "Dagster or Airflow orchestration",
      "A warehouse sized to the problem (Postgres before Snowflake, honestly)",
      "pgvector for retrieval",
      "Freshness and drift checks with alerting",
    ],
  },
  "legacy-modernization": {
    benefits:
      "The business keeps running the whole time — no freeze, no big-bang cutover, no weekend that decides everything. Risk shrinks step by step because every stage ships behind a rollback, and characterization tests pin down what the old system really does before anything changes it. Your team ends up with a system they understand, documented, instead of a new mystery replacing the old one.",
    stack: [
      "Characterization test harnesses",
      "Strangler-fig routing at an API façade",
      "Contract tests on every seam",
      "Feature flags for staged cutover",
      "Documentation written as the migration happens, not after",
    ],
  },
  "custom-saas-development": {
    benefits:
      "You get a platform, not a pile of features: tenancy, permissions, billing and audit trails designed before the first screen, because retrofitting any of them is where SaaS projects go to die. Your ops team can run it without a developer on call — admin tooling and support views are part of the build. And it's operable from day one: observability, backups and a runbook, because launch is the start of the product, not the end of the project.",
    stack: [
      "Next.js or a comparable proven framework",
      "Postgres with row-level tenancy",
      "Stripe for subscriptions and dunning",
      "Audit logging",
      "An admin panel your support team actually uses",
      "Infrastructure as code from the first deploy",
    ],
  },
  "web-application-development": {
    benefits:
      "The app holds up in the states real operations live in — loading, empty, error, offline — so your team trusts it with the company's actual work. It's fast and accessible by default, which shows up as fewer support tickets and no retrofit later. Because it ships with tests and monitoring, changing it stays cheap after launch, which is when most web apps quietly become unchangeable.",
    stack: [
      "React/Next.js + TypeScript",
      "Postgres behind a typed API layer",
      "Playwright end-to-end tests",
      "WCAG-conscious component library",
      "Error tracking and performance monitoring wired before go-live",
    ],
  },
  "mobile-app-development": {
    benefits:
      "The platform decision — native or cross-platform — is made on your app's actual demands and given to you in writing, so you're never rebuilding in year two because of a guess. Offline and push are engineered, not bolted on, which is what separates apps that get used in the field from apps that get uninstalled. Store submission, release pipeline and crash monitoring come with the build, so shipping version 1.1 is routine, not a project.",
    stack: [
      "Flutter or React Native where it's smart, Swift/Kotlin where it matters",
      "Offline-first local store with sync",
      "Push via APNs/FCM",
      "Fastlane release automation",
      "Crash and performance monitoring (Sentry-class)",
    ],
  },
  "api-system-integration": {
    benefits:
      "Data entered once exists everywhere it should, and the triple-entry quietly eating your team's week stops. Syncs survive the real world — outages, rate limits, duplicate deliveries — because retries, idempotency and dead-letter queues are built in, not hoped for. When a third-party API changes, monitoring and contract tests catch it before your team notices, instead of three weeks after the data went stale.",
    stack: [
      "Queue-backed connectors with idempotency keys",
      "Retries with dead-letter queues and replay",
      "Contract tests against third-party APIs",
      "Per-flow monitoring and alerting",
      "OpenAPI-documented endpoints for anything we expose",
    ],
  },
  "cloud-devops": {
    benefits:
      "Deploys stop being events: small, reversible releases with a rehearsed one-command rollback turn shipping into routine. Your infrastructure is reviewable code, so environments stop drifting and the next engineer can read how production actually works. And the bill makes sense — right-sizing, budgets and alerts mean you pay for load, not for forgotten experiments.",
    stack: [
      "Terraform/OpenTofu",
      "GitHub Actions pipelines with quality gates",
      "Docker",
      "AWS, GCP or Azure — whichever you're already deepest in",
      "Grafana/Prometheus-class observability",
      "Preview environments per pull request",
    ],
  },
  "cybersecurity-ai-security": {
    benefits:
      "You ship at startup speed without carrying startup-sized holes: the ten issues fast-built products share get found and fixed before users arrive. The AI surface is covered specifically — prompt injection, data leakage through model context, over-permissioned agents — which generic security reviews don't yet look for. And the groundwork for SOC 2 or ISO gets laid as engineering, so compliance later is a project, not a panic.",
    stack: [
      "Threat modeling per product",
      "Dependency and secret scanning in CI",
      "Cloud posture review",
      "Prompt-injection test suites for AI features",
      "Permissioned tool scopes and audit trails for agents",
      "An incident response plan short enough to follow at 3am",
    ],
  },
  "maintenance-managed-ai": {
    benefits:
      "Someone is watching, so you hear about incidents from us — with a fix underway — not from a customer. The slow rot that kills software is handled on a schedule: dependencies, models and infrastructure kept current, with tests deciding what ships. And the AI keeps earning its place, because cost per task, quality and drift get reviewed monthly with tuning attached, not tickets.",
    stack: [
      "Uptime and error monitoring with human escalation",
      "Sentry-class error tracking",
      "Automated dependency updates gated by tests",
      "Monthly AI evaluation runs",
      "Cost dashboards per workflow",
      "An SLA short enough to actually read",
    ],
  },
};
