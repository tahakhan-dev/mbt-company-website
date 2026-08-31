import type { Service } from "~/lib/schemas/content";

/**
 * Seeded defaults — the single source for public content until the admin
 * (Phase 6) writes Firestore. The content getters overlay Firestore records
 * on top of these; the seed script (Phase 7) writes exactly this data. All
 * copy follows docs/design/COPY-DECK.md voice rules.
 */

export interface ServiceDetail extends Service {
  intro: string;
  useCases: { head: string; body: string }[];
  deliverables: string[];
  faq: { q: string; a: string }[];
}

export const SITE = {
  name: "Aigenvora",
  descriptor: "AI-powered software development",
  domain: "https://aigenvora.com",
  contactEmail: "hello@aigenvora.com",
  responseExpectation: "We reply within two working days.",
  cta: "Build with Aigenvora",
  // Owner supplies real values (or edits in /admin/settings); empty = hidden.
  phone: "",
  whatsapp: "",
  address: "",
  linkedin: "",
  twitter: "",
  github: "",
};

export type SiteSettings = typeof SITE;

const service = (
  order: number,
  slug: string,
  name: string,
  outcome: string,
  accent: Service["accent"],
  intro: string,
  useCases: { head: string; body: string }[],
  deliverables: string[],
  faq: { q: string; a: string }[],
): ServiceDetail => ({
  order,
  slug,
  name,
  outcome,
  accent,
  description: intro,
  status: "published",
  intro,
  useCases,
  deliverables,
  faq,
});

export const SERVICES: ServiceDetail[] = [
  service(
    1,
    "ai-agents-automation",
    "AI Agents & Business Automation",
    "Hand your repetitive workflows to agents that actually finish them.",
    "electric",
    "Not chat widgets. Working software that reads, decides, acts and reports — inside the tools your company already runs, with people in control of the risky parts.",
    [
      { head: "Inbox that answers itself", body: "Customer and supplier messages triaged, drafted and — where you allow it — sent, with your tone and your rules." },
      { head: "Documents that file themselves", body: "Invoices, contracts and forms read, validated and pushed into the systems that need them, with a human review lane." },
      { head: "Operations that run the routine", body: "Bookings confirmed, records reconciled, reports assembled overnight — agents that finish tasks, not demos that start them." },
    ],
    ["Workflow map of where hours actually go", "Agent design with explicit rules and human checkpoints", "Shadow-mode rehearsal against real cases", "Monitoring, escalation paths and monthly reviews"],
    [
      { q: "What stops an agent from doing something stupid?", a: "Scope. Each agent gets a narrow job, explicit rules, and human approval wherever risk lives. It rehearses in shadow mode against real cases before it touches anything." },
      { q: "Which tools can it work inside?", a: "Anything with an API or an inbox — email, CRMs, accounting, booking systems, spreadsheets. Integration is part of the build, not an extra." },
      { q: "What does it cost to run?", a: "Model usage is metered and capped per workflow. You see the per-task cost before go-live and a monthly usage report after." },
    ],
  ),
  service(
    2,
    "ai-integration",
    "AI Integration",
    "Put working AI inside the software your company already runs.",
    "violet",
    "Your systems already hold the data. We add the intelligence — retrieval, classification, drafting, decision support — where your team already works, without a rip-and-replace.",
    [
      { head: "Answers from your own knowledge", body: "Search and chat grounded in your documents, tickets and wikis — with sources cited, not hallucinated." },
      { head: "Classification at intake", body: "Leads, tickets, claims and orders sorted and routed the moment they arrive." },
      { head: "Drafting where typing happens", body: "Replies, summaries and reports proposed inside the tool your team already has open." },
    ],
    ["Integration audit of current systems and data quality", "Model and vendor selection with cost projection", "Production integration with fallbacks and monitoring", "Evaluation harness so quality is measured, not vibed"],
    [
      { q: "Do we have to move our data?", a: "No. We connect to where it lives, index what's needed, and respect existing permissions." },
      { q: "Which models do you use?", a: "The one that wins on your evaluation set at the best cost — we're vendor-neutral and swap providers behind one interface." },
      { q: "What about our data and the model provider?", a: "Contracts and configuration matter more than logos: no-training flags, retention windows and region pinning are set explicitly and documented." },
    ],
  ),
  service(
    3,
    "ai-saas-product-development",
    "AI SaaS / AI Product Development",
    "Ship an AI-native product, not a wrapper around a prompt.",
    "electric",
    "From idea to a product with real users: architecture, UX, evaluation, billing and the AI core designed together — so the product survives its first thousand users and its first model swap.",
    [
      { head: "AI products with a moat", body: "Workflow depth, proprietary data loops and evaluation discipline — the parts a weekend wrapper can't copy." },
      { head: "Usage-based billing done right", body: "Metering, caps and margins designed with the unit economics of inference in mind." },
      { head: "Quality you can measure", body: "Evaluation sets and regression gates so a model update never silently breaks your product." },
    ],
    ["Product strategy and technical architecture", "UX for probabilistic features (drafts, confidence, review lanes)", "Production AI pipeline with evaluation and cost control", "Auth, billing, analytics and admin from day one"],
    [
      { q: "How is this different from your MVP offer?", a: "Same discipline, deeper AI core. AI-native products need evaluation infrastructure and cost modeling from day one; we build both." },
      { q: "Can you take over an existing AI prototype?", a: "Yes — a prototype audit tells you what survives, what gets rebuilt, and what it costs to run at scale." },
      { q: "Who owns the models and data?", a: "You. Prompts, fine-tunes, evaluation sets and data pipelines are deliverables in your repo, not our lock-in." },
    ],
  ),
  service(
    4,
    "data-ai-infrastructure",
    "Data & AI Infrastructure",
    "Make your data reliable enough for machines to act on.",
    "lime",
    "AI is only as good as the data underneath it. We build the pipelines, warehouses and retrieval layers that turn scattered records into something models — and people — can trust.",
    [
      { head: "One source of truth", body: "Pipelines that pull your scattered systems into a clean, versioned warehouse with tested transformations." },
      { head: "Retrieval that finds the right thing", body: "Embedding and search infrastructure tuned on your actual queries, not defaults." },
      { head: "Data quality you can see", body: "Freshness, completeness and drift monitored — bad data pages someone before it reaches a model." },
    ],
    ["Data audit and lineage map", "Pipeline and warehouse build with tests", "Retrieval/embedding layer with relevance evaluation", "Monitoring, alerts and documented runbooks"],
    [
      { q: "Cloud or on-prem?", a: "Either. We work in your cloud account with your compliance constraints; nothing routes through ours." },
      { q: "How do you keep costs sane?", a: "Storage tiering, incremental processing and query budgets designed in — with a monthly cost report so nothing creeps." },
      { q: "Do we need 'big data' scale for this to be worth it?", a: "No. Most companies need trustworthy data, not big data. The value is reliability, not volume." },
    ],
  ),
  service(
    5,
    "legacy-modernization",
    "Legacy Software + AI Modernization",
    "Upgrade the system everyone fears touching — without stopping the business.",
    "violet",
    "The system works, mostly, and everyone is afraid of it. We modernize incrementally — strangler patterns, test harnesses, staged cutovers — and add AI only where it earns its place.",
    [
      { head: "Modernize without a freeze", body: "New capabilities grow alongside the old system; traffic moves over gradually with rollback at every stage." },
      { head: "Tests before touches", body: "Characterization tests pin down what the legacy system actually does before anything changes." },
      { head: "AI on old rails", body: "Document processing, search and drafting layered onto systems that predate the cloud." },
    ],
    ["Risk-ranked modernization roadmap", "Test harness around current behavior", "Staged migration with rollback plans", "Documentation the next team can actually use"],
    [
      { q: "Rewrite or refactor?", a: "Usually neither, at first. We stabilize, test, then replace the riskiest seams incrementally. Full rewrites are a last resort with a business case." },
      { q: "Our last modernization attempt failed. Why would this work?", a: "Most fail by moving everything at once. Staged cutovers with rollback mean no single step can sink the project." },
      { q: "Can you work with our existing team?", a: "Preferred. They hold the institutional knowledge; we bring the migration discipline." },
    ],
  ),
  service(
    6,
    "custom-saas-development",
    "Custom SaaS Development",
    "A complete platform, from schema to billing, built to be operated.",
    "electric",
    "Multi-tenant platforms with the unglamorous parts done properly: permissions, billing, audit trails, admin tooling and the operational visibility you need after launch.",
    [
      { head: "Multi-tenant from the schema up", body: "Tenant isolation, roles and permissions designed before the first feature, not patched after." },
      { head: "Billing that matches your model", body: "Seats, usage, tiers, trials — wired to payments with dunning and invoices handled." },
      { head: "An admin your team can run", body: "Support tooling, feature flags and audit trails so operating the platform doesn't require a developer." },
    ],
    ["Architecture and data model", "Complete platform build with tests", "Payments, subscriptions and invoicing", "Observability, backups and an operations runbook"],
    [
      { q: "Which stack?", a: "Boring, proven, and staffable — chosen for your team's ability to own it, documented in an architecture decision record." },
      { q: "How long until v1?", a: "Depends on scope; the plan gives you a range you can hold us to after the first two weeks of discovery." },
      { q: "What happens after launch?", a: "Your choice: full handover with documentation, or we operate it under the Maintenance & Managed AI service." },
    ],
  ),
  service(
    7,
    "web-application-development",
    "Web Application Development",
    "Portals, marketplaces and dashboards your team runs the company on.",
    "lime",
    "Internal tools and customer-facing apps with real engineering: fast, accessible, tested, and honest about states like loading, empty and error — because operations software lives in those states.",
    [
      { head: "Customer portals", body: "Self-service account, orders, documents and support — cutting the emails that ask where things are." },
      { head: "Marketplaces and booking", body: "Two-sided flows with availability, payments and payouts handled correctly." },
      { head: "Operational dashboards", body: "The company's real numbers, live, with drill-down — replacing the Friday spreadsheet ritual." },
    ],
    ["UX flows for the messy real cases", "Responsive, accessible frontend build", "API and data layer with tests", "Deployment, monitoring and handover"],
    [
      { q: "Can you integrate with our existing backend?", a: "Yes — most web apps we build sit on existing systems through a clean API layer we add." },
      { q: "Mobile too?", a: "Web apps are responsive by default; when a real native app is warranted, that's service 08." },
      { q: "Accessibility?", a: "WCAG-conscious by default: keyboard, contrast, screen-reader landmarks. It's part of done, not an add-on." },
    ],
  ),
  service(
    8,
    "mobile-app-development",
    "Mobile App Development",
    "iOS and Android apps with a backend that can carry them.",
    "violet",
    "Native-quality apps — cross-platform where it's smart, fully native where it matters — plus the API, push, offline and release engineering that decide whether an app survives contact with users.",
    [
      { head: "Consumer apps", body: "Onboarding, subscriptions and notifications tuned for retention, not just installs." },
      { head: "Field and operations apps", body: "Offline-first data capture for teams that work where connectivity doesn't." },
      { head: "Companion apps", body: "A focused mobile surface for your existing platform — the 20% of features used 80% of the time." },
    ],
    ["Platform strategy (native vs cross-platform, decided with evidence)", "App build with offline and push done right", "Backend/API work to support mobile patterns", "Store submission, release pipeline and crash monitoring"],
    [
      { q: "Flutter, React Native or native?", a: "Decided by your app's needs — camera/AR/background demands push native; most business apps ship faster cross-platform. You get the reasoning in writing." },
      { q: "Do you handle App Store review?", a: "Yes, including the metadata, privacy declarations and the resubmission dance." },
      { q: "What about updates after launch?", a: "Release pipeline is part of the build; ongoing releases fall under Maintenance & Managed AI if you want them handled." },
    ],
  ),
  service(
    9,
    "api-system-integration",
    "API & System Integration",
    "Your CRM, ERP and payments, finally on speaking terms.",
    "lime",
    "The unglamorous work that removes the most friction: reliable synchronization between the systems your business already paid for — with retries, idempotency and monitoring, not weekend scripts.",
    [
      { head: "CRM ↔ everything", body: "Customers, deals and invoices consistent across sales, accounting and support — no more triple entry." },
      { head: "Webhooks that don't drop", body: "Event delivery with retries, dead-letter queues and replay — because 'it usually works' isn't integration." },
      { head: "Partner APIs", body: "A clean, documented API for your partners, with keys, quotas and versioning handled." },
    ],
    ["Integration map of systems and data flows", "Connectors with retries, idempotency and rate-limit handling", "Monitoring with per-flow alerting", "Documentation and credential rotation runbook"],
    [
      { q: "Zapier already does this, no?", a: "Until volume, error handling or compliance says otherwise. We build where no-code breaks — and happily leave no-code where it's genuinely enough." },
      { q: "What happens when a third-party API changes?", a: "Versioned connectors, contract tests and monitoring catch it; maintenance cover fixes it before your team notices." },
      { q: "Can you untangle an existing integration mess?", a: "Yes — the integration map usually pays for itself by showing which three of your eleven syncs actually matter." },
    ],
  ),
  service(
    10,
    "cloud-devops",
    "Cloud / DevOps",
    "Infrastructure that scales on purpose, with CI/CD and observability built in.",
    "electric",
    "AWS, Azure or GCP architecture that fits your load and your budget — infrastructure as code, pipelines that ship safely, and dashboards that tell you the truth at 3am.",
    [
      { head: "From clicks to code", body: "Hand-built cloud consoles turned into reviewed, reproducible infrastructure as code." },
      { head: "Ship without ceremony", body: "CI/CD with tests, preview environments and one-command rollback — deploys become boring." },
      { head: "Bills that make sense", body: "Right-sizing, budgets and alerts; most audits find 30% of spend doing nothing." },
    ],
    ["Architecture review and target design", "Infrastructure as code with environments", "CI/CD pipelines with quality gates", "Observability stack and incident runbooks"],
    [
      { q: "Which cloud?", a: "The one you're already deepest in, usually. Migration for its own sake is rarely the answer; we'll say so." },
      { q: "Kubernetes?", a: "Only when your scale and team can feed it. Plenty of successful platforms run simpler — we match the machinery to the org." },
      { q: "Can you fix our deploy anxiety?", a: "That's the job: small reversible releases, tested pipelines, and rollback that's one command, rehearsed." },
    ],
  ),
  service(
    11,
    "cybersecurity-ai-security",
    "Cybersecurity & AI Security",
    "Ship fast without leaving doors open — app, cloud, data and agents.",
    "violet",
    "Security that fits how modern products are actually built — including the new attack surface AI brings: prompt injection, data leakage through model context, and agents with too much permission.",
    [
      { head: "Pre-launch security review", body: "Auth, secrets, headers, dependencies and cloud config checked before users arrive — with fixes, not just findings." },
      { head: "AI-specific hardening", body: "Prompt-injection defenses, output validation, permissioned tools and audit trails for agent actions." },
      { head: "Compliance groundwork", body: "The access controls, logging and policies that make SOC 2 or ISO a project, not a panic." },
    ],
    ["Threat model for your actual product", "Security review with ranked, fixable findings", "Hardening implementation, not just a PDF", "Monitoring, alerting and an incident response plan"],
    [
      { q: "Is this a pentest?", a: "Broader: review plus remediation. Where a formal third-party pentest is required, we prepare you for it and triage its findings." },
      { q: "What's different about securing AI features?", a: "The model is a confused deputy: anything it can read can leak, anything it can call can be abused. We scope both aggressively." },
      { q: "We were built fast by a small team. How bad is it?", a: "Usually fixable in weeks. Fast-built products share the same ten issues; the review finds which ones you have." },
    ],
  ),
  service(
    12,
    "maintenance-managed-ai",
    "Maintenance & Managed AI",
    "We keep it running, watched and improving after launch.",
    "lime",
    "Software degrades without attention: dependencies rot, models drift, costs creep. Managed cover keeps your product healthy — monitoring, incident response, updates and monthly AI-quality reviews.",
    [
      { head: "Someone is watching", body: "Uptime, errors and cost monitored with a human escalation path — you hear about incidents from us, not customers." },
      { head: "Updates without drama", body: "Dependencies, models and infrastructure kept current on a schedule, with tests deciding what ships." },
      { head: "AI that keeps earning its place", body: "Monthly review of agent quality, cost per task and drift — with tuning, not tickets." },
    ],
    ["SLA-backed monitoring and incident response", "Scheduled dependency and model updates", "Monthly quality and cost reports", "A prioritized backlog you control"],
    [
      { q: "Do you maintain software you didn't build?", a: "Yes, after an onboarding audit that maps the system and its risks. Most of our managed estate arrived that way." },
      { q: "What does the SLA cover?", a: "Response times by severity, defined escalation, and monthly reporting. The document is short enough to actually read." },
      { q: "Can we cancel?", a: "Monthly terms with a proper handover. Managed cover should be earned, not locked in." },
    ],
  ),
];

export const PROCESS = [
  { step: "01", name: "Map the workflow", body: "We sit in the real process and find where hours actually go." },
  { step: "02", name: "Design the smallest system", body: "Narrow scope, explicit rules, human checkpoints where risk lives." },
  { step: "03", name: "Build and rehearse", body: "Working software every week; risky parts run shadow mode against real cases." },
  { step: "04", name: "Operate and improve", body: "Monitoring, escalation paths and monthly reviews of what shipped." },
] as const;

export const MANIFESTO = [
  "Most companies don't have a software problem. They have twelve tools that refuse to talk.",
  "People spend their days moving data that should move itself.",
  "That gap between systems is where margins, hours and patience go to die.",
] as const;

export const MVP_STEPS = [
  { name: "Validate the problem", body: "A week of sharp questions before a month of code: who has this problem, how badly, and what do they do about it today." },
  { name: "Define the smallest valuable product", body: "The feature list shrinks until every remaining item earns its place. What's cut is written down, not forgotten." },
  { name: "Design the experience", body: "A clickable prototype real users can react to — before engineering makes change expensive." },
  { name: "Build the real system", body: "Auth, data, payments and the core loop — production-grade from the first commit, demo-grade never." },
  { name: "Add AI where it earns its place", body: "Only where it changes the product's value, with costs metered and quality measured." },
  { name: "Launch, measure, iterate", body: "Analytics, feedback loops and a roadmap driven by what users do, not what the room guessed." },
] as const;

export const MVP_FAQ = [
  { q: "What do I get at the end?", a: "A deployed product with real users able to sign up and pay, the codebase and infrastructure in your accounts, and a documented roadmap. Not a prototype — the first honest version of your business." },
  { q: "Who owns the code?", a: "You do, from the first commit. Repos, cloud accounts and credentials live under your organization." },
  { q: "What happens after launch?", a: "Your call: handover to your team, ongoing iteration with us, or managed cover. The MVP is built so any of the three works." },
  { q: "How much of it will be AI?", a: "As much as earns its place, no more. Investors and users reward working products, not model demos." },
  { q: "What do you need from me weekly?", a: "One or two hours: a working session and fast decisions. Founders who stay close ship better products." },
] as const;

export const PRINCIPLES = [
  { name: "Software should remove work", body: "If a feature adds process instead of deleting it, it doesn't ship." },
  { name: "AI belongs inside workflows", body: "Not on top of products as decoration — inside the loop where it moves real work." },
  { name: "Senior people, start to ship", body: "The people who scope your product are the people who build it." },
  { name: "Evidence over confidence", body: "Claims get measured — in tests, in evaluation sets, in analytics. Including ours." },
  { name: "Boring where it counts", body: "Proven stacks, reversible deploys, documented decisions. Excitement belongs in the product, not the infrastructure." },
] as const;
