/**
 * Seed content — real-feeling, outcome-led copy for every collection.
 * Clearly sample (fictional clients marked "Confidential …"), fully
 * replaceable from the admin. Rich-text fields use Tiptap doc JSON.
 */
import { richTextFromParagraphs } from "@/lib/schemas/common";
import type { Service } from "@/lib/schemas/service";
import type { Project } from "@/lib/schemas/project";
import type { TeamMember } from "@/lib/schemas/team";
import type { Testimonial } from "@/lib/schemas/testimonial";
import type { Logo } from "@/lib/schemas/logo";

const rt = richTextFromParagraphs;

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
type SeedService = Omit<Service, "createdAt" | "updatedAt">;

export const services: SeedService[] = [
  {
    name: "AI Chatbots & Customer Automation",
    slug: "ai-chatbots-customer-automation",
    iconKey: "chat",
    status: "published",
    order: 0,
    short:
      "Assistants that answer like your best rep — on your site, WhatsApp, and email — and hand the hard 20% to a human with full context.",
    problem:
      "Every unanswered message is a customer deciding you're slow. Inboxes open to forty threads, the same five questions eat the day, and after-hours leads buy from whoever replies first. We automate the conversations that don't need a human and speed up the ones that do.",
    long: rt([
      "We build customer-facing assistants grounded in your real knowledge — products, policies, availability — so they answer specifically, in your voice, with an audit trail. Not a widget with canned replies: a system wired into your calendar, order data, and CRM that can actually do things — book, reschedule, track, quote.",
      "Escalation is designed, not bolted on. The assistant knows what it doesn't know: below a confidence threshold it hands off to your team with the conversation summarized and the customer never re-typing a word. Every thread is logged and measured, so 'is it helping?' is a dashboard, not a debate.",
      "Deployment meets customers where they are: website, WhatsApp Business, Instagram DMs, email. One brain, every channel, consistent answers.",
    ]),
    offerings: [
      { title: "Website & in-app assistants", detail: "Grounded in your content and live data, with citations, typed actions (book, quote, track), and your tone of voice enforced in evals." },
      { title: "WhatsApp & social automation", detail: "WhatsApp Business API done properly: templates, session handling, opt-ins, and human takeover — where your customers actually message from." },
      { title: "Email triage & drafting", detail: "Inbound email classified, routed, and answered — auto-send for the routine, reviewed drafts for the rest." },
      { title: "Lead qualification & booking", detail: "Assistants that qualify, score, and book meetings straight into your calendar — with CRM records created and enriched automatically." },
      { title: "Human-handoff design", detail: "Confidence thresholds, full-context escalation, and takeover UX so customers never feel passed around." },
    ],
    process: [
      { title: "Conversation audit", detail: "1 week: we mine your real inbox/chat history for the automatable 80% and define escalation rules with your team." },
      { title: "Assistant build", detail: "2–4 weeks: grounded assistant on your channels, wired to booking/CRM/order systems, gated by an evaluation set built from real conversations." },
      { title: "Tune & expand", detail: "Weekly review of transcripts and scores; new intents and channels earn their way in with evidence." },
    ],
    stack: ["Claude", "OpenAI", "WhatsApp Business API", "Twilio", "pgvector", "Next.js", "n8n", "HubSpot"],
    faqs: [
      { question: "Will it sound like a robot?", answer: "It sounds like your best rep on a good day — because it's grounded in your actual answers and style guide, and evaluated against transcripts your team rates. Anything off-brand fails the eval before customers ever see it." },
      { question: "What happens when it can't answer?", answer: "It says so and hands off — to your inbox, phone, or live chat — with the conversation summarized and the customer's details attached. The worst case is a fast, well-briefed human reply, never a hallucinated one." },
      { question: "Which channels can it live on?", answer: "Web chat, WhatsApp Business, Instagram/Facebook Messenger, and email. One knowledge base and one set of rules drive all of them, so answers never drift between channels." },
    ],
    relatedProjectSlugs: ["whatsapp-concierge-clinics", "intake-automation-insurance", "support-copilot-fintech"],
    transformation: {
      before: [
        "Support inbox opens to 40 unanswered threads every morning",
        "The same five questions answered by hand, all day",
        "Leads that message after 6pm buy elsewhere by 9am",
      ],
      after: [
        "The assistant answers instantly on web, WhatsApp, and email — in your voice",
        "The hard 20% reaches a human with full context attached",
        "Every conversation logged, measured, and improving weekly",
      ],
      metric: "First reply: 6 hours → 8 seconds",
    },
  },
  {
    name: "Business Process Automation",
    slug: "business-process-automation",
    iconKey: "flow",
    status: "published",
    order: 1,
    short:
      "n8n, Zapier, and Make pipelines — plus custom glue where they end — that move data between your systems so people don't have to.",
    problem:
      "Somewhere in your company, a smart person is copy-pasting between a store, a spreadsheet, and an accounting tool — every day. That's not a job; that's a missing integration. We find those hours and give them back.",
    long: rt([
      "We map the manual loops in your operation — order handling, invoicing, onboarding, reporting, approvals — and rebuild them as monitored automations: n8n or Make where visual flows fit, Zapier where speed wins, custom code where the platforms run out of road.",
      "Everything we ship is engineered, not duct-taped: idempotent runs, retries with backoff, exception queues that route edge cases to a human, and logs that answer 'what happened to order #4712?' in one search. Automations you can trust are automations your team actually turns on.",
      "We start with the highest hour-count process, ship in days, and expand loop by loop — each one justified by the hours it returns.",
    ]),
    offerings: [
      { title: "Process mapping & ROI audit", detail: "A one-week teardown of where the hours actually go, ranked by automation payoff — you keep the map either way." },
      { title: "n8n / Zapier / Make pipelines", detail: "Visual, self-documenting flows your team can read — with version control, environments, and monitoring the platforms don't give you out of the box." },
      { title: "Custom integration glue", detail: "Typed connectors for the systems without official integrations: legacy ERPs, local banks, niche vertical SaaS." },
      { title: "Document & data workflows", detail: "Invoices parsed, POs matched, contracts extracted into fields — AI document processing with human review queues." },
      { title: "Exception & alerting design", detail: "When an automation can't decide, a human gets one clear task — not a silent failure at month-end." },
    ],
    process: [
      { title: "Process audit", detail: "1 week: shadow the workflows, measure the hours, rank the loops by payback." },
      { title: "Automate the top loop", detail: "1–3 weeks: the biggest time sink rebuilt as a monitored pipeline, run in parallel with the manual process until trusted." },
      { title: "Expand loop by loop", detail: "Each next automation ships with its own before/after hour count — the program funds itself." },
    ],
    stack: ["n8n", "Zapier", "Make", "TypeScript", "PostgreSQL", "Airtable", "QuickBooks", "Slack API"],
    faqs: [
      { question: "n8n, Zapier, or Make — which one?", answer: "Whichever fits the loop: Zapier for speed and breadth, Make for gnarly branching on a budget, n8n when you want self-hosting, versioning, and code steps. We're fluent in all three and hand over flows your team can maintain." },
      { question: "What if the automation breaks?", answer: "It tells you. Every pipeline ships with run logs, retries, and an exception queue — a failed step becomes a human task with context, never a silent gap you discover at month-end." },
      { question: "Is this safe for financial processes?", answer: "Yes, when engineered properly: idempotent runs (nothing double-invoices), approval checkpoints for money-moving steps, and full audit logs. We treat automations that touch money like the fintech systems we build." },
    ],
    relatedProjectSlugs: ["order-to-cash-automation", "intake-automation-insurance"],
    transformation: {
      before: [
        "Orders copy-pasted between store, spreadsheet, and accounting",
        "Invoices chased by hand — month-end eats two days",
        "One sick day and nobody knows what shipped",
      ],
      after: [
        "Order → invoice → fulfillment → ledger, untouched by hand",
        "Month-end runs itself; exceptions land in one review queue",
        "Every run logged, retried, and alerting when a human is needed",
      ],
      metric: "Invoice run: 2 days → 20 minutes",
    },
  },
  {
    name: "E-commerce Engineering",
    slug: "ecommerce-engineering",
    iconKey: "storefront",
    status: "published",
    order: 2,
    short:
      "Shopify, WooCommerce, and headless storefronts engineered for speed, conversion, and repeat purchase — not just launched.",
    problem:
      "Most stores don't have a traffic problem; they have a leak problem. Slow pages tax every ad dollar, clunky checkouts spill carts, and the merch team waits on developers for every change. We engineer the leaks shut.",
    long: rt([
      "We build and rebuild storefronts with an engineer's discipline: Core Web Vitals as a budget, checkout as a funnel to be instrumented and tested, and content modeling that lets your team ship campaigns without a developer in the loop.",
      "On Shopify we go deep — theme architecture, Functions, checkout extensibility, and app integrations that don't drag performance. Where the catalog, market, or brand demands it, we go headless (Next.js storefronts on Shopify or your own backend) without the headless tax of broken previews and stalled merch teams.",
      "Post-launch, the storefront becomes a growth machine: subscriptions, bundles, A/B-tested PDPs, and the analytics to know which change moved revenue.",
    ]),
    offerings: [
      { title: "Shopify engineering", detail: "Theme architecture, Shopify Functions, checkout UI extensions, and integration work that keeps Lighthouse green." },
      { title: "Headless storefronts", detail: "Next.js frontends over Shopify/Woo/custom backends — sub-second pages with previews and merch autonomy intact." },
      { title: "Checkout & CRO engineering", detail: "Instrumented funnels, one-page checkouts, wallet payments, and a monthly test cadence with revenue readouts." },
      { title: "Subscriptions & retention", detail: "Subscription flows, customer portals, and lifecycle automations that grow LTV instead of support tickets." },
      { title: "Performance rescue", detail: "App audit, script diet, image/CDN strategy — most stores we touch drop 2+ seconds of LCP in the first month." },
    ],
    process: [
      { title: "Store teardown", detail: "1 week: performance, funnel, and stack audit with a revenue-ranked fix list." },
      { title: "Build / rebuild", detail: "3–8 weeks: the storefront or fixes shipped behind preview themes, measured against the baseline." },
      { title: "Grow", detail: "Monthly CRO + performance cadence: test, measure, keep what pays." },
    ],
    stack: ["Shopify", "Hydrogen", "Next.js", "WooCommerce", "Klaviyo", "Stripe", "Sanity", "Vercel"],
    faqs: [
      { question: "Shopify theme or headless?", answer: "Theme until the numbers say otherwise. Headless pays when catalog complexity, internationalization, or brand experience outgrows Liquid — we'll show you the trade-offs with your own data before recommending the expensive path." },
      { question: "Can you fix our slow store without a rebuild?", answer: "Usually, yes. The first month of a performance rescue — app diet, script deferral, image pipeline, critical CSS — typically recovers the majority of lost speed without touching your theme's look." },
      { question: "Do you migrate stores?", answer: "Yes — Woo→Shopify, legacy→headless, platform consolidations — with SEO redirects mapped URL by URL, and revenue-critical flows (subscriptions, gift cards) tested before cutover." },
    ],
    relatedProjectSlugs: ["headless-shopify-fashion", "subscription-storefront-roaster"],
    transformation: {
      before: [
        "3-second pages quietly taxing every paid click",
        "Checkout leaks at every extra field and redirect",
        "Merch team waits on a developer for every banner",
      ],
      after: [
        "Sub-second storefront with Core Web Vitals in the green",
        "One-page checkout with wallets — tested monthly, not guessed",
        "Campaigns shipped by your team, no code, no waiting",
      ],
      metric: "Checkout conversion: 3.1% → 4.4%",
    },
  },
  {
    name: "WordPress & CMS Engineering",
    slug: "wordpress-cms-engineering",
    iconKey: "browser",
    status: "published",
    order: 3,
    short:
      "Editorial stacks your team can actually run — WordPress and modern headless CMS builds that are fast, secure, and unbreakable by design.",
    problem:
      "WordPress powers half the web and ruins half its Mondays: plugin roulette, mystery slowdowns, and layouts one update away from chaos. We engineer WordPress like software — locked dependencies, block systems editors can't break, and performance that holds.",
    long: rt([
      "For content-led organizations we build editorial platforms, not just websites: custom block libraries that make every page on-brand by construction, editorial workflows with roles and review states, and publishing that takes minutes instead of tickets.",
      "Engineering discipline is the difference: version-controlled themes and config, a curated and locked plugin set, staged updates with automated visual regression, daily backups with tested restores, and a hardened hosting setup. The result is a WordPress that behaves like a product, not a liability.",
      "Where headless fits better — multi-channel content, app + web, extreme performance — we pair WordPress or a modern CMS (Sanity, Payload) with a Next.js frontend, keeping editors happy and pages instant.",
    ]),
    offerings: [
      { title: "Custom themes & block libraries", detail: "Gutenberg block systems built to your design tokens — editors compose freely, the brand stays intact." },
      { title: "Headless WordPress / CMS builds", detail: "Next.js frontends over WordPress, Sanity, or Payload — sub-second pages with live preview editors trust." },
      { title: "Performance & Core Web Vitals", detail: "Caching architecture, image pipelines, and script diets that hold 90+ scores under real traffic." },
      { title: "Security & maintenance engineering", detail: "Locked dependencies, staged updates, automated backups with restore drills, uptime and integrity monitoring." },
      { title: "Migrations & rescues", detail: "Page-builder swamps, hacked sites, and decade-old installs rebuilt into maintainable platforms — content preserved, SEO intact." },
    ],
    process: [
      { title: "Platform audit", detail: "1 week: performance, security posture, plugin risk, and editorial pain — with a ranked plan." },
      { title: "Build / rebuild", detail: "3–6 weeks: theme/blocks/hosting shipped with redirects mapped and editors trained." },
      { title: "Steward", detail: "Monthly updates, monitoring, and small improvements — the site stays fast and boring." },
    ],
    stack: ["WordPress", "PHP", "Gutenberg", "Next.js", "Sanity", "Payload", "Cloudflare", "MySQL"],
    faqs: [
      { question: "Why is our WordPress site slow?", answer: "Almost always: too many plugins doing overlapping work, an unoptimized image pipeline, and no real caching strategy. Our audit names the culprits with numbers; the fix list usually recovers most of the speed without a redesign." },
      { question: "Should we leave WordPress?", answer: "Only if the requirements say so. WordPress engineered properly serves most content organizations brilliantly. We recommend headless when multi-channel content, app parity, or extreme scale genuinely demand it — not as a fashion statement." },
      { question: "Can you take over an existing site?", answer: "Yes. Takeovers start with a safety pass — backups, staging, dependency lock, monitoring — so we can work on a site that can't surprise us. Then improvements ship weekly." },
    ],
    relatedProjectSlugs: ["newsroom-cms-rebuild"],
    transformation: {
      before: [
        "Publishing a landing page takes three days and a developer",
        "Plugin roulette: every update risks the whole site",
        "Scores stuck in the 40s cap what SEO can do",
      ],
      after: [
        "Editors publish same-day with blocks that can't break the design",
        "Locked dependencies, staged updates, tested backups",
        "90+ Core Web Vitals with SEO structure baked in",
      ],
      metric: "Publish cycle: 3 days → same-day",
    },
  },
  {
    name: "AI & Generative AI Solutions",
    slug: "ai-generative-ai",
    iconKey: "sparkle",
    status: "published",
    order: 4,
    short:
      "LLM applications, AI agents, RAG systems, and copilots — evaluated, guarded, and shipped to production.",
    problem:
      "Most AI initiatives die between the demo and production: no evaluation harness, no cost control, no answer to \"is it actually right?\". We build the unglamorous machinery that makes AI dependable.",
    long: rt([
      "We design and ship AI systems that survive contact with real users: retrieval pipelines grounded in your data, agents with typed tools and hard guardrails, and copilots embedded where your team already works.",
      "Every engagement starts with the question executives actually care about — what decision or workflow does this accelerate, and how will we measure it? From there we build thin, production-grade slices: a working system in weeks, instrumented with evaluations from day one, hardened as usage grows.",
      "We are model-pragmatic. Frontier APIs where quality wins, open-weight models where cost, latency, or data residency wins — and an evaluation harness that tells you the difference with numbers instead of vibes.",
    ]),
    offerings: [
      { title: "LLM applications", detail: "Custom AI products on frontier and open-weight models, with structured outputs, streaming UX, and cost budgets enforced in code." },
      { title: "AI agents & automation", detail: "Multi-step agents with typed tool use, human-in-the-loop checkpoints, and audit trails — automation you can actually put in front of compliance." },
      { title: "RAG & knowledge systems", detail: "Retrieval pipelines over your documents and data: chunking strategy, hybrid search, re-ranking, and citations users can verify." },
      { title: "Chatbots & copilots", detail: "Support deflection, internal copilots, and onboarding assistants that resolve real tickets — measured by resolution rate, not message count." },
      { title: "Fine-tuning & evaluation", detail: "Task-specific tuning and rigorous evals: golden datasets, regression suites, and dashboards that catch quality drift before your users do." },
    ],
    process: [
      { title: "Feasibility sprint", detail: "1–2 weeks: we prototype against your real data and report what works, what doesn't, and what it will cost at scale." },
      { title: "Production slice", detail: "4–8 weeks: one high-value workflow shipped end to end — auth, observability, evals, and rollout plan included." },
      { title: "Evaluate & expand", detail: "Weekly iterations driven by eval scores and usage data; new capabilities earn their way in with evidence." },
    ],
    stack: ["Claude", "OpenAI", "LangGraph", "pgvector", "Pinecone", "Vercel AI SDK", "Python", "TypeScript"],
    faqs: [
      { question: "Which models do you work with?", answer: "Frontier APIs (Anthropic, OpenAI, Google) and open-weight models (Llama, Mistral, Qwen) — chosen per use case by quality, latency, cost, and data-residency requirements, and validated with your own evaluation set." },
      { question: "How do you keep our data safe?", answer: "Your data stays in your cloud and your vendor agreements. We design for zero-retention API tiers, redact PII before prompts where required, and never train shared models on your data." },
      { question: "What if the AI is wrong?", answer: "We treat wrongness as an engineering problem: grounded retrieval with citations, confidence thresholds, human-in-the-loop for consequential actions, and eval suites that quantify error rates per release." },
    ],
    relatedProjectSlugs: ["support-copilot-fintech", "rag-knowledge-platform"],
    transformation: {
      before: [
        "A demo that wowed the board and never reached users",
        "No way to answer 'is the AI actually right?'",
        "Costs unknown until the invoice arrives",
      ],
      after: [
        "A production copilot with citations users can verify",
        "An eval harness scoring every release before users see it",
        "Token budgets enforced in code, cost per feature on a dashboard",
      ],
      metric: "Tier-1 tickets auto-resolved: 0% → 54%",
    },
  },
  {
    name: "Data Engineering & Analytics",
    slug: "data-engineering",
    iconKey: "database",
    status: "published",
    order: 5,
    short:
      "Pipelines, warehouses, and dashboards that turn scattered operational data into decisions — and into AI-ready fuel.",
    problem:
      "Teams drown in exports and stale spreadsheets while the questions that matter go unanswered. Data work that never reaches a decision is a cost center; we build the path from raw events to answers people trust.",
    long: rt([
      "We build data platforms sized to your stage: not a big-data cathedral, but a reliable lakehouse or warehouse with tested pipelines, documented models, and dashboards leaders actually open on Monday morning.",
      "Everything is engineered like software — version-controlled transformations, data tests in CI, lineage you can trace, and alerting when freshness or quality slips. When you are ready for ML and LLM workloads, the same platform feeds them without a rebuild.",
    ]),
    offerings: [
      { title: "Pipelines & ELT", detail: "Ingestion from products, payments, CRMs, and third-party APIs — incremental, idempotent, and monitored." },
      { title: "Warehouses & lakehouses", detail: "BigQuery, Snowflake, ClickHouse, or Postgres — modeled with dbt, documented, and cost-controlled." },
      { title: "BI & dashboards", detail: "Metric layers and dashboards with owned definitions, so 'revenue' means one thing across the company." },
      { title: "ML-ready data platforms", detail: "Feature pipelines, embeddings stores, and clean training sets that make your AI roadmap a data query away." },
    ],
    process: [
      { title: "Data audit", detail: "1 week: sources, quality, and the top questions your team can't answer today." },
      { title: "Platform build", detail: "3–6 weeks: pipelines + warehouse + the first three dashboards in production." },
      { title: "Operate & extend", detail: "Quality SLAs, new sources, and self-serve enablement for your analysts." },
    ],
    stack: ["dbt", "BigQuery", "ClickHouse", "Airbyte", "Dagster", "Postgres", "Metabase", "Python"],
    faqs: [
      { question: "We're early stage — do we need this?", answer: "You need less of it than vendors say, sooner than you think. A one-week audit typically yields a minimal stack that answers 80% of questions for a few hundred dollars a month in infrastructure." },
      { question: "Can you work with our existing stack?", answer: "Yes — we extend before we replace. Most engagements start by making the current stack trustworthy (tests, lineage, alerts) and only migrate components with a measured payoff." },
    ],
    relatedProjectSlugs: ["ops-lakehouse-logistics", "rag-knowledge-platform"],
    transformation: {
      before: [
        "Every report starts with a CSV export and a prayer",
        "'Revenue' means three different numbers in three meetings",
        "Decisions made on last month's data",
      ],
      after: [
        "One governed warehouse; every metric has one owned definition",
        "Dashboards leadership actually opens on Monday morning",
        "Pipelines tested in CI and monitored for freshness",
      ],
      metric: "Reporting lag: 2 weeks → same-day",
    },
  },
  {
    name: "Fintech Engineering",
    slug: "fintech-engineering",
    iconKey: "bank",
    status: "published",
    order: 7,
    short:
      "Payments, wallets, and banking-grade apps — built with the controls, audit trails, and resilience regulators expect.",
    problem:
      "In fintech, a bug is not a ticket — it's money moving wrongly. Generic dev shops learn this on your users. We engineer for reconciliation, idempotency, and auditability from the first commit.",
    long: rt([
      "We build financial software the way it has to be built: double-entry ledgers as the source of truth, idempotent money movement, immutable audit logs, and reconciliation jobs that prove correctness every day.",
      "Our teams have shipped payment flows, wallets, and lending journeys across web and mobile — inside compliance-aware architectures (KYC/AML hooks, data residency, role-based controls) that make your auditors' lives boring, which is the goal.",
    ]),
    offerings: [
      { title: "Payments & wallets", detail: "Card, bank, and local-rails integrations with idempotent orchestration, retries, and full reconciliation." },
      { title: "Banking-grade apps", detail: "Mobile and web experiences with device binding, session security, and graceful degradation under load." },
      { title: "Ledgers & reconciliation", detail: "Double-entry ledger design, exception queues, and daily proof-of-books automation." },
      { title: "Compliance-aware architecture", detail: "KYC/AML integration points, audit trails, data retention, and least-privilege access baked into the design." },
    ],
    process: [
      { title: "Domain mapping", detail: "1–2 weeks: money flows, failure modes, and regulatory constraints mapped before code." },
      { title: "Core build", detail: "6–10 weeks: ledger, integrations, and the first user-facing release behind feature flags." },
      { title: "Hardening", detail: "Load, chaos, and reconciliation drills; observability and on-call runbooks handed over." },
    ],
    stack: ["TypeScript", "PostgreSQL", "Kafka", "Stripe", "Flutter", "Kotlin", "Terraform", "AWS"],
    faqs: [
      { question: "Are you PCI / SOC 2 compliant?", answer: "We architect so you rarely touch PCI scope directly (tokenization via certified providers) and build the controls SOC 2 auditors look for — access management, change control, audit logging — into the delivery itself." },
      { question: "Can you integrate local payment rails?", answer: "Yes. We've integrated card networks, bank transfers, and regional rails and wallets; the orchestration layer we build treats each as a pluggable, reconciled provider." },
    ],
    relatedProjectSlugs: ["digital-wallet-platform", "support-copilot-fintech"],
    transformation: {
      before: [
        "Reconciliation is a spreadsheet and a long Friday",
        "Every incident is an all-hands panic",
        "Auditors ask questions the system can't answer",
      ],
      after: [
        "A double-entry ledger proves the books every night",
        "Idempotent money movement with exception queues",
        "Immutable audit trails that make audits boring",
      ],
      metric: "Reconciliation exceptions: weekly fire → zero since launch",
    },
  },
  {
    name: "Product Engineering — Web & Mobile",
    slug: "product-engineering",
    iconKey: "devices",
    status: "published",
    order: 6,
    short:
      "Next.js/React and Flutter products, APIs, and SaaS platforms — from first commit to scale, by one senior team.",
    problem:
      "Feature factories ship code; products need judgment. We pair senior engineers with product thinking so every sprint moves a metric, not just a backlog.",
    long: rt([
      "We take products from idea to production and beyond: SaaS platforms, customer portals, mobile apps, and the APIs underneath them. TypeScript end to end, tested where it counts, instrumented so you can see what users actually do.",
      "You get a compact senior team — no juniors learning on your dime — working in your repos with weekly demos. When we hand over, your engineers inherit a codebase they'll thank us for.",
    ]),
    offerings: [
      { title: "SaaS platforms", detail: "Multi-tenant architecture, billing, roles, and admin tooling — the whole machine, not just the marketing site." },
      { title: "Web apps (Next.js/React)", detail: "Fast, accessible, SEO-sound applications with design systems that keep velocity high after launch." },
      { title: "Mobile apps (Flutter)", detail: "One codebase, native feel, store-ready pipelines for iOS and Android." },
      { title: "APIs & integrations", detail: "Typed, versioned, documented APIs; webhook systems; third-party integrations that don't rot." },
    ],
    process: [
      { title: "Product sprint", detail: "1 week: scope the thinnest lovable release with designs and a fixed quote." },
      { title: "Build & demo weekly", detail: "4–10 weeks: shippable increments every week, feature-flagged into production." },
      { title: "Scale & hand over", detail: "Performance, onboarding docs, and pairing sessions with your team." },
    ],
    stack: ["Next.js", "React", "Flutter", "Node.js", "PostgreSQL", "Prisma", "tRPC", "Tailwind"],
    faqs: [
      { question: "Do you work with in-house teams?", answer: "Constantly — as a feature team beside yours, or as leads who set architecture and mentor. We work in your repos, your CI, your standards, and we leave documentation, not dependency." },
      { question: "What does a typical first release cost?", answer: "Most first releases land between the mid-five and low-six figures depending on surface area. The product sprint gives you a fixed number before you commit to anything bigger." },
    ],
    relatedProjectSlugs: ["b2b-saas-procurement", "digital-wallet-platform"],
    transformation: {
      before: [
        "Nine months in and still nothing shippable",
        "Every new feature breaks two old ones",
        "Velocity dies when one engineer takes leave",
      ],
      after: [
        "A thin, production-grade release inside the first quarter",
        "Typed, tested code your next hire navigates on day one",
        "Weekly demos — progress you can see, not status you're told",
      ],
      metric: "Idea → production: 9 months → 8 weeks",
    },
  },
  {
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    iconKey: "cloud",
    status: "published",
    order: 8,
    short:
      "Architecture, CI/CD, observability, and cost control — infrastructure that lets a small team ship like a big one.",
    problem:
      "Slow deploys, mystery outages, and a cloud bill nobody can explain: infrastructure debt taxes every feature. We pay it down and automate it away.",
    long: rt([
      "We design and operate cloud platforms that are boring in the best way: infrastructure as code, deploys measured in minutes, dashboards that answer 'is it healthy?' at a glance, and bills that go down instead of up.",
      "Whether you're on AWS, GCP, or a mix, we right-size the architecture to your stage — no Kubernetes cargo-culting for a two-service product, no fragile snowflakes for one that's scaling.",
    ]),
    offerings: [
      { title: "Cloud architecture", detail: "Landing zones, networking, and service topology designed for your actual scale — with a written path to the next order of magnitude." },
      { title: "CI/CD", detail: "Pipelines with preview environments, automated tests, and one-click rollbacks; trunk-based flow your team can trust." },
      { title: "Observability", detail: "Tracing, metrics, logs, and alerting tuned to signal — plus SLOs that make reliability a number." },
      { title: "Cost optimization", detail: "Tagging, right-sizing, and architectural fixes; most engagements pay for themselves inside a quarter." },
    ],
    process: [
      { title: "Platform review", detail: "1 week: architecture, security posture, deploy pain, and spend — with a ranked fix list." },
      { title: "Implement", detail: "2–6 weeks: the fixes that matter, as code, with zero-downtime migrations." },
      { title: "Operate or hand over", detail: "Runbooks, on-call setup, and optional ongoing platform stewardship." },
    ],
    stack: ["AWS", "GCP", "Terraform", "Docker", "GitHub Actions", "Grafana", "OpenTelemetry", "Cloudflare"],
    faqs: [
      { question: "Can you cut our cloud bill?", answer: "Usually 25–50% on unoptimized accounts: right-sizing, storage-tiering, and killing zombie resources first, architectural changes second. We report savings against a baseline so the impact is undeniable." },
      { question: "Do we need Kubernetes?", answer: "Probably later than you think. We choose the simplest platform that meets your reliability and scale needs — and write down the triggers that would justify the next step up." },
    ],
    relatedProjectSlugs: ["ops-lakehouse-logistics", "b2b-saas-procurement"],
    transformation: {
      before: [
        "Deploys are a Friday-afternoon gamble",
        "The cloud bill grows faster than revenue",
        "One engineer holds the whole setup in their head",
      ],
      after: [
        "One-click deploys with previews and instant rollback",
        "Spend tagged, right-sized, reviewed — bills trend down",
        "Infrastructure as code any senior engineer can run",
      ],
      metric: "Cloud spend: −38% in one quarter",
    },
  },
  {
    name: "UI/UX & Product Design",
    slug: "ui-ux-design",
    iconKey: "pen-nib",
    status: "published",
    order: 9,
    short:
      "Research, design systems, and high-fidelity prototypes — design that ships, because it's built next to the engineers.",
    problem:
      "Beautiful mockups that die in handoff are the industry's quiet scandal. Our designers sit inside the build team, so what you approve is what ships.",
    long: rt([
      "We design products the way we engineer them: grounded in user evidence, systematized in tokens and components, and validated in working prototypes rather than static frames.",
      "For AI products especially, design is the moat — trust states, uncertainty, streaming feedback, and recovery from errors are design problems before they are engineering ones. We've shipped those patterns and bring the playbook.",
    ]),
    offerings: [
      { title: "Product & UX research", detail: "Interviews, journey mapping, and usability tests that de-risk the roadmap before code is written." },
      { title: "Design systems", detail: "Token-based systems in Figma and code that keep every screen consistent and every sprint fast." },
      { title: "High-fidelity prototypes", detail: "Clickable, testable prototypes — including AI interaction patterns like streaming and citations — before you commit budget." },
      { title: "Brand & marketing design", detail: "Sites and launch assets with the same craft as the product itself." },
    ],
    process: [
      { title: "Discover", detail: "1–2 weeks: users, jobs, and success metrics." },
      { title: "Design & test", detail: "2–4 weeks: flows, system, prototype, and at least one round of user validation." },
      { title: "Ship alongside", detail: "Design QA in every sprint until production matches the vision." },
    ],
    stack: ["Figma", "Storybook", "Tailwind", "Framer", "Maze", "Tokens Studio"],
    faqs: [
      { question: "Can you redesign without rebuilding?", answer: "Yes — we refactor UI in place behind a design-token layer, shipping improvements screen by screen without a risky big-bang rewrite." },
    ],
    relatedProjectSlugs: ["b2b-saas-procurement", "digital-wallet-platform"],
    transformation: {
      before: [
        "Beautiful mockups that die in developer handoff",
        "Users hesitate at every AI answer — no trust cues",
        "Every screen invents its own patterns",
      ],
      after: [
        "Tokens shared by Figma and code — what's approved is what ships",
        "Trust states, citations, and recovery designed into every AI surface",
        "A system that makes the tenth screen faster than the first",
      ],
      metric: "Trial → paid conversion: +31%",
    },
  },
];

// ---------------------------------------------------------------------------
// Projects (sample case studies — fictional but realistic; marked confidential)
// ---------------------------------------------------------------------------
type SeedProject = Omit<Project, "createdAt" | "updatedAt">;

export const projects: SeedProject[] = [
  {
    title: "Support copilot for a payments platform",
    slug: "support-copilot-fintech",
    client: "Confidential — payments scale-up",
    industry: "Fintech",
    timeline: "8 weeks to production",
    serviceSlugs: ["ai-generative-ai", "fintech-engineering"],
    summary:
      "A RAG-grounded support copilot that resolves tier-1 tickets end to end and drafts responses for the rest — with every answer cited against policy documents.",
    challenge: rt([
      "A payments scale-up was adding support headcount linearly with transaction volume. Tier-1 tickets — chargeback status, KYC document issues, payout timing — consumed 60% of agent hours, and answers varied by agent because policy lived in a 400-page wiki.",
      "Previous chatbot attempts had failed for the reason they usually do: ungrounded answers in a domain where a wrong answer about money is worse than no answer.",
    ]),
    solution: rt([
      "We built a retrieval pipeline over policy docs, macros, and resolved tickets — hybrid search with re-ranking, chunked along the documents' own structure, refreshed nightly. The copilot answers only from retrieved context and shows its citations inline; below a confidence threshold it routes to a human with a pre-filled draft.",
      "Consequential actions (refunds, account changes) are typed tool calls behind human approval. An evaluation harness with 900 golden Q&A pairs gates every release; quality drift pages the team before customers notice.",
    ]),
    results: rt([
      "Six weeks after launch the copilot was resolving just over half of tier-1 tickets autonomously with a 96% citation-accuracy score on the eval set. Median first-response time dropped from 4 hours to 40 seconds, and the support team stopped hiring against volume — the same headcount now handles 2.3× the ticket load.",
    ]),
    metrics: [
      { label: "tier-1 tickets auto-resolved", value: "54%" },
      { label: "first-response time", value: "-98%" },
      { label: "ops cost per ticket", value: "-38%" },
    ],
    stack: ["Claude", "pgvector", "Next.js", "LangGraph", "PostgreSQL", "AWS"],
    cover: { kind: "generated", seed: "support-copilot-fintech", url: "", alt: "Support copilot case study" },
    gallery: [],
    featured: true,
    sample: true,
    status: "published",
    order: 0,
  },
  {
    title: "Digital wallet for a GCC neobank",
    slug: "digital-wallet-platform",
    client: "Confidential — GCC neobank",
    industry: "Fintech",
    timeline: "14 weeks to first release",
    serviceSlugs: ["fintech-engineering", "product-engineering", "ui-ux-design"],
    summary:
      "A banking-grade wallet — cards, P2P transfers, and bill payments — on a double-entry ledger that reconciles to the fils, shipped on iOS and Android from one Flutter codebase.",
    challenge: rt([
      "A licensed neobank needed to launch a consumer wallet in a market where trust is won or lost on day one: money movement had to be instant, correct, and auditable, and the regulator required complete transaction traceability before go-live.",
      "The founding team had banking experience but no engineering org — they needed a partner who could design the core, build the apps, and stand up the infrastructure simultaneously.",
    ]),
    solution: rt([
      "We built the platform around a double-entry ledger as the single source of truth, with idempotent orchestration over card and local-rails providers, exception queues for every failure mode, and a nightly reconciliation job that proves the books against provider statements.",
      "The Flutter app ships device binding, biometric sessions, and offline-tolerant flows; a back-office console gives compliance real-time visibility with role-based access and immutable audit logs. Infrastructure is Terraform end to end with one-command environment builds.",
    ]),
    results: rt([
      "The wallet passed the central-bank technical audit on the first submission and launched to a waitlist of 40,000 users. It now processes over 2 million transactions a month with zero unreconciled entries since launch and a 4.7-star store rating across both platforms.",
    ]),
    metrics: [
      { label: "transactions / month", value: "2M+" },
      { label: "unreconciled entries", value: "0" },
      { label: "regulator audit", value: "first-pass" },
    ],
    stack: ["Flutter", "Kotlin", "PostgreSQL", "Kafka", "Terraform", "AWS"],
    cover: { kind: "generated", seed: "digital-wallet-platform", url: "", alt: "Digital wallet case study" },
    gallery: [],
    featured: true,
    sample: true,
    status: "published",
    order: 1,
  },
  {
    title: "Operations lakehouse for a logistics group",
    slug: "ops-lakehouse-logistics",
    client: "Confidential — regional logistics group",
    industry: "Logistics",
    timeline: "6 weeks to first dashboards",
    serviceSlugs: ["data-engineering", "cloud-devops"],
    summary:
      "Twelve operational systems unified into one governed lakehouse — daily decisions moved from week-old spreadsheets to live, tested data.",
    challenge: rt([
      "A logistics group running 3PL warehouses and last-mile fleets had data in twelve systems — WMS, telematics, ERP, spreadsheets — and a reporting cycle measured in weeks. Fleet utilization decisions were made on month-old numbers; nobody trusted any two reports to agree.",
    ]),
    solution: rt([
      "We stood up an ELT platform landing every source into a lakehouse, modeled with dbt into documented, tested marts: shipments, fleet, warehouse labor, and cost-to-serve. Freshness and quality checks run in CI and page the data owner when a source drifts.",
      "Leadership got a daily operations dashboard with owned metric definitions; analysts got governed self-serve access; and the same models now feed an ETA-prediction service — the platform's first ML consumer, added without any rework.",
    ]),
    results: rt([
      "Reporting latency went from three weeks to same-day. Fleet utilization improved 11% in the first quarter simply from visibility, and finance retired 40 hours a month of manual spreadsheet assembly. The platform runs on a four-figure annual infrastructure budget.",
    ]),
    metrics: [
      { label: "reporting latency", value: "3wk → 1d" },
      { label: "fleet utilization", value: "+11%" },
      { label: "manual reporting", value: "-40h/mo" },
    ],
    stack: ["dbt", "BigQuery", "Airbyte", "Dagster", "Metabase", "GCP"],
    cover: { kind: "generated", seed: "ops-lakehouse-logistics", url: "", alt: "Logistics lakehouse case study" },
    gallery: [],
    featured: true,
    sample: true,
    status: "published",
    order: 2,
  },
  {
    title: "RAG knowledge platform for a law firm",
    slug: "rag-knowledge-platform",
    client: "Confidential — corporate law firm",
    industry: "Legal",
    timeline: "10 weeks to firm-wide rollout",
    serviceSlugs: ["ai-generative-ai", "data-engineering"],
    summary:
      "A private research assistant over 250k firm documents — precedents, memos, contracts — with paragraph-level citations and matter-based access control.",
    challenge: rt([
      "Associates spent hours re-researching questions the firm had answered before, because twenty years of work product was scattered across document management, email, and shared drives — and confidentiality walls made a naive search index a non-starter.",
    ]),
    solution: rt([
      "We built an ingestion pipeline that OCRs, de-duplicates, and classifies documents while preserving matter-level permissions, then a retrieval system that answers questions with paragraph-level citations into the source documents — inside the firm's cloud tenancy, with zero data leaving it.",
      "Access control is enforced at retrieval time per user, per matter. An evaluation set built with the knowledge-management team gates releases, and a feedback loop lets partners flag answers to improve chunking and ranking weekly.",
    ]),
    results: rt([
      "In the first quarter, 78% of the firm's lawyers became weekly active users. Internal sampling put research time on covered questions at roughly a third of baseline, and the partners' recurring worry — hallucinated authority — was addressed with a measured 98% citation-precision score on the eval set.",
    ]),
    metrics: [
      { label: "weekly active lawyers", value: "78%" },
      { label: "research time", value: "-65%" },
      { label: "citation precision", value: "98%" },
    ],
    stack: ["Claude", "Azure", "pgvector", "Python", "Next.js"],
    cover: { kind: "generated", seed: "rag-knowledge-platform", url: "", alt: "Legal RAG platform case study" },
    gallery: [],
    featured: false,
    sample: true,
    status: "published",
    order: 3,
  },
  {
    title: "Procurement SaaS from zero to first customers",
    slug: "b2b-saas-procurement",
    client: "Confidential — B2B SaaS founder",
    industry: "SaaS",
    timeline: "9 weeks to paying customers",
    serviceSlugs: ["product-engineering", "ui-ux-design", "cloud-devops"],
    summary:
      "A multi-tenant procurement platform — requests, approvals, budgets, and vendor management — taken from a founder's deck to its first paying customers in nine weeks.",
    challenge: rt([
      "A solo founder with deep procurement expertise and signed LOIs needed a product before the LOIs expired. The spec was a 30-page document; the budget demanded a first release in one quarter, production-grade — the LOI customers were mid-market companies who would not tolerate a toy.",
    ]),
    solution: rt([
      "We ran a one-week product sprint to cut the spec to a thin lovable release: request → approval chain → PO issuance → budget tracking. Then a nine-week build: multi-tenant Next.js app with row-level security, an approval engine modeled as a state machine, SSO, and an audit trail — behind feature flags from the first week.",
      "Design worked inside the build team on a token-based system, so the product the LOI customers saw in week 3 demos was the real product, improving weekly.",
    ]),
    results: rt([
      "Two of three LOI customers converted to paid annual contracts at launch; the third followed after SSO shipped in week 11. The founder raised a pre-seed round two months later, with the platform — and its live usage metrics — as the centerpiece of the raise.",
    ]),
    metrics: [
      { label: "idea → paying customers", value: "9 wks" },
      { label: "LOI conversion", value: "3 / 3" },
      { label: "uptime since launch", value: "99.98%" },
    ],
    stack: ["Next.js", "PostgreSQL", "Prisma", "tRPC", "Tailwind", "AWS"],
    cover: { kind: "generated", seed: "b2b-saas-procurement", url: "", alt: "Procurement SaaS case study" },
    gallery: [],
    featured: false,
    sample: true,
    status: "published",
    order: 4,
  },
  {
    title: "Demand forecasting for a retail chain",
    slug: "demand-forecasting-retail",
    client: "Confidential — grocery retail chain",
    industry: "Retail",
    timeline: "12 weeks to chain-wide rollout",
    serviceSlugs: ["data-engineering", "ai-generative-ai"],
    summary:
      "Store-level demand forecasting and replenishment recommendations for 140 stores — waste down, availability up, adopted because buyers can see why each number is what it is.",
    challenge: rt([
      "A 140-store grocery chain was ordering on gut feel and last year's numbers: 4% of fresh goods expired on shelves while bestsellers stocked out weekly. A previous vendor's black-box forecast had been quietly abandoned because buyers didn't trust numbers they couldn't interrogate.",
    ]),
    solution: rt([
      "On a clean feature store (sales, weather, promotions, local events) we built gradient-boosted per-store/per-SKU forecasts with explicit uncertainty bands — and, critically, an explanation view: every recommendation decomposes into the drivers behind it, in buyer language.",
      "Recommendations flow into the buyers' existing ordering screen with one-tap accept/override; overrides feed back as training signal. We shipped to five pilot stores in week 6 and let the pilot's measured results sell the rollout internally.",
    ]),
    results: rt([
      "Chain-wide after one season: fresh-goods waste down 23%, on-shelf availability up 3.4 points, and forecast acceptance at 81% — the number that actually matters, because a forecast nobody follows is decoration.",
    ]),
    metrics: [
      { label: "fresh waste", value: "-23%" },
      { label: "availability", value: "+3.4pts" },
      { label: "buyer acceptance", value: "81%" },
    ],
    stack: ["Python", "ClickHouse", "dbt", "XGBoost", "React", "GCP"],
    cover: { kind: "generated", seed: "demand-forecasting-retail", url: "", alt: "Retail forecasting case study" },
    gallery: [],
    featured: false,
    sample: true,
    status: "published",
    order: 5,
  },
  {
    title: "WhatsApp concierge for a dental clinic group",
    slug: "whatsapp-concierge-clinics",
    client: "Confidential — dental clinic group",
    industry: "Healthcare",
    timeline: "4 weeks to first clinic, 7 to all nine",
    serviceSlugs: ["ai-chatbots-customer-automation", "business-process-automation"],
    summary:
      "A WhatsApp assistant that books, reschedules, and answers treatment questions for nine clinics — after-hours patients stopped going to voicemail and started going into the calendar.",
    challenge: rt([
      "A nine-clinic dental group was losing patients at the front desk: phones rang out during treatments, WhatsApp messages sat unread overnight, and two full-time staff spent their days on reschedules and 'do you do X?' questions. Mystery-shopper tests showed a third of new-patient enquiries never got a reply at all.",
    ]),
    solution: rt([
      "We built a WhatsApp Business assistant grounded in the group's treatments, prices, insurers, and each clinic's live calendar. It books and reschedules directly, answers coverage questions with citations into the policy sheet, and triages emergencies to the on-call line immediately.",
      "Anything below the confidence threshold — or any upset patient — hands off to staff with the thread summarized. An n8n layer syncs conversations into the practice-management system, so the front desk sees one timeline per patient, not two inboxes.",
    ]),
    results: rt([
      "After-hours enquiries went from voicemail to a 38% booked-appointment rate. Front-desk call volume dropped by more than half, no-shows fell 41% on the back of automated confirmations and easy rescheduling, and the two coordinators moved from message triage to treatment-plan follow-ups — revenue work.",
    ]),
    metrics: [
      { label: "after-hours enquiries booked", value: "38%" },
      { label: "no-shows", value: "-41%" },
      { label: "front-desk calls", value: "-55%" },
    ],
    stack: ["Claude", "WhatsApp Business API", "n8n", "PostgreSQL", "Next.js"],
    cover: { kind: "generated", seed: "whatsapp-concierge-clinics", url: "", alt: "Clinic WhatsApp assistant case study" },
    gallery: [],
    featured: false,
    sample: true,
    status: "published",
    order: 6,
  },
  {
    title: "Order-to-cash automation for a distributor",
    slug: "order-to-cash-automation",
    client: "Confidential — building-materials distributor",
    industry: "Wholesale & Distribution",
    timeline: "5 weeks, loop by loop",
    serviceSlugs: ["business-process-automation", "data-engineering"],
    summary:
      "The order-to-cash cycle of a 60-person distributor — orders, fulfillment docs, invoicing, payment chasing — rebuilt as monitored n8n pipelines. Ninety hours of admin a month, returned.",
    challenge: rt([
      "Orders arrived by email, phone, and a web form; staff re-keyed them into the ERP, generated delivery notes by hand, invoiced at month-end in a two-day marathon, and chased payments from a spreadsheet. Error rate was human: wrong SKUs shipped weekly, and one missed invoice was found four months late.",
    ]),
    solution: rt([
      "We rebuilt the cycle as five n8n pipelines with a shared order model: intake (email/form parsing with AI extraction and a human review queue for low-confidence fields), ERP entry, fulfillment docs, same-day invoicing on delivery confirmation, and a dunning ladder that escalates politely from reminder to statement to a human call task.",
      "Every run is idempotent and logged; exceptions become one review queue with context. The manual process ran in parallel for two weeks until the numbers matched to the cent — then the team switched and didn't look back.",
    ]),
    results: rt([
      "Month-end invoicing went from two days to twenty minutes of review. Mis-shipments from re-keying dropped to near zero, day-sales-outstanding improved by nine days thanks to same-day invoices and automatic follow-ups, and the operations lead reclaimed roughly ninety hours a month across the team — without replacing the ERP.",
    ]),
    metrics: [
      { label: "admin hours returned", value: "90h/mo" },
      { label: "invoice run", value: "2d → 20min" },
      { label: "DSO", value: "-9 days" },
    ],
    stack: ["n8n", "TypeScript", "PostgreSQL", "QuickBooks", "Slack API"],
    cover: { kind: "generated", seed: "order-to-cash-automation", url: "", alt: "Order-to-cash automation case study" },
    gallery: [],
    featured: false,
    sample: true,
    status: "published",
    order: 7,
  },
  {
    title: "Headless Shopify relaunch for a fashion brand",
    slug: "headless-shopify-fashion",
    client: "Confidential — DTC fashion brand",
    industry: "E-commerce",
    timeline: "8 weeks to relaunch",
    serviceSlugs: ["ecommerce-engineering", "ui-ux-design"],
    summary:
      "A 4-second theme swamp rebuilt as a sub-second Next.js storefront on Shopify — checkout conversion up 42%, and the merch team shipping campaigns without tickets.",
    challenge: rt([
      "Years of app installs and theme patches had left a DTC fashion brand with 4.1-second pages, a checkout funnel leaking at every step, and a merchandising team that needed a developer for every homepage change. Paid acquisition was profitable on paper and marginal in practice — the site was taxing every click.",
    ]),
    solution: rt([
      "We rebuilt the storefront headless: a Next.js frontend over Shopify with static product pages revalidated on catalog change, an image pipeline sized to the layout, and a 14-app diet down to four that earned their keep. Checkout moved to Shopify's extensible checkout with wallets first.",
      "Merchandising got a visual page builder over structured content — campaign pages compose from designed sections with live preview, no code. SEO migration mapped every URL; rankings held through cutover.",
    ]),
    results: rt([
      "LCP went from 4.1s to 0.9s on mobile. Checkout conversion rose 42% and returning-customer purchase rate 18% over the following quarter; the paid team re-opened two channels that had been unprofitable purely on landing speed. Campaign pages now ship the day they're designed.",
    ]),
    metrics: [
      { label: "mobile LCP", value: "4.1s → 0.9s" },
      { label: "checkout conversion", value: "+42%" },
      { label: "campaign lead time", value: "1wk → 1d" },
    ],
    stack: ["Next.js", "Shopify", "Hydrogen", "Sanity", "Klaviyo", "Vercel"],
    cover: { kind: "generated", seed: "headless-shopify-fashion", url: "", alt: "Headless Shopify case study" },
    gallery: [],
    featured: false,
    sample: true,
    status: "published",
    order: 8,
  },
  {
    title: "Editorial platform rebuild for a news publisher",
    slug: "newsroom-cms-rebuild",
    client: "Confidential — regional news publisher",
    industry: "Media & Publishing",
    timeline: "6 weeks to cutover",
    serviceSlugs: ["wordpress-cms-engineering", "cloud-devops"],
    summary:
      "A decade-old WordPress install — 30 plugins, nightly outages, scores in the 40s — rebuilt into a locked, block-based editorial platform holding 90+ Core Web Vitals under real traffic.",
    challenge: rt([
      "A regional publisher's WordPress had grown for ten years: thirty active plugins with overlapping jobs, a page builder three majors behind, ad scripts fighting analytics scripts, and traffic spikes that took the site down on the stories that mattered most. Editors drafted in fear of breaking layout; Core Web Vitals capped their search visibility.",
    ]),
    solution: rt([
      "We rebuilt the theme as a Gutenberg block library on design tokens — article, liveblog, gallery, and briefing formats editors compose freely without touching layout. The plugin set went from thirty to nine, locked and staged; caching moved to a proper edge architecture with stale-while-revalidate for spikes.",
      "Updates now run through a staging pipeline with automated visual regression on the top templates; backups restore-drill monthly. The newsroom got publishing checklists in the editor itself — SEO fields, image crops, and fact-box prompts where the work happens.",
    ]),
    results: rt([
      "Core Web Vitals went from the low 40s to 90+ on article pages and held through two election-night traffic spikes. Organic sessions grew 64% over two quarters as rankings recovered, publish cycles for special formats went from days to same-day, and the site's last unplanned outage was the week before cutover.",
    ]),
    metrics: [
      { label: "Core Web Vitals", value: "40s → 90+" },
      { label: "organic sessions", value: "+64%" },
      { label: "unplanned outages", value: "0 since launch" },
    ],
    stack: ["WordPress", "Gutenberg", "PHP", "Cloudflare", "MySQL", "GitHub Actions"],
    cover: { kind: "generated", seed: "newsroom-cms-rebuild", url: "", alt: "News publisher CMS case study" },
    gallery: [],
    featured: false,
    sample: true,
    status: "published",
    order: 9,
  },
  {
    title: "Intake-to-quote automation for an insurance broker",
    slug: "intake-automation-insurance",
    client: "Confidential — commercial insurance broker",
    industry: "Insurance",
    timeline: "6 weeks to full intake coverage",
    serviceSlugs: ["business-process-automation", "ai-chatbots-customer-automation"],
    summary:
      "Submission intake for a commercial broker — emails, PDFs, broker portals — parsed, structured, and quoted in hours instead of days, with an assistant that chases missing documents itself.",
    challenge: rt([
      "A commercial broker's growth was capped by intake: every submission arrived as an email thread with PDFs, took 45 minutes of re-keying into the management system, and waited days while staff chased missing documents. Producers spent selling hours on data entry; quote turnaround averaged three days and lost deals to faster brokers.",
    ]),
    solution: rt([
      "We built an intake pipeline that parses submissions on arrival — AI extraction of insured details, schedules, and loss runs into typed fields, with a review queue showing confidence per field rather than making staff re-read whole PDFs. Complete submissions flow straight into rating; incomplete ones trigger an assistant that emails the producer or insured for exactly the missing items and files the replies.",
      "Every submission gets a live status page, so 'where's my quote?' became a link instead of a phone call. The management system stayed; we automated around it.",
    ]),
    results: rt([
      "Quote turnaround dropped from three days to four hours median. Intake capacity grew 2.1× with the same staff, document chase-ups run themselves with a full audit trail, and producers report their first week ever with zero re-keying. The broker now advertises same-day quotes — as a feature.",
    ]),
    metrics: [
      { label: "quote turnaround", value: "3d → 4h" },
      { label: "intake capacity", value: "2.1×" },
      { label: "re-keying time", value: "0 min" },
    ],
    stack: ["Claude", "n8n", "TypeScript", "PostgreSQL", "SendGrid"],
    cover: { kind: "generated", seed: "intake-automation-insurance", url: "", alt: "Insurance intake automation case study" },
    gallery: [],
    featured: false,
    sample: true,
    status: "published",
    order: 10,
  },
  {
    title: "Subscription storefront for a coffee roaster",
    slug: "subscription-storefront-roaster",
    client: "Confidential — specialty coffee roaster",
    industry: "Food & Beverage",
    timeline: "7 weeks to relaunch",
    serviceSlugs: ["ecommerce-engineering", "product-engineering"],
    summary:
      "A subscription-first storefront and customer portal for a specialty roaster — pause, swap, and gift flows that cut churn 22% and pushed subscriptions to nearly half of revenue.",
    challenge: rt([
      "A roaster with a loyal customer base ran subscriptions through a plugin that fought their theme: customers couldn't pause or swap without emailing support, failed payments quietly cancelled plans, and the subscription P&L was invisible. Churn was blamed on the coffee; it was the software.",
    ]),
    solution: rt([
      "We rebuilt the storefront subscription-first on Shopify with a custom customer portal: pause, skip, swap roast, change cadence, and gift — all self-serve, all one tap from the account page. Failed payments enter a designed dunning flow with retries and empathetic emails rather than silent cancellation.",
      "A lightweight subscription dashboard gives the founders cohort retention, pause-vs-cancel rates, and revenue by roast — the numbers that were invisible before. Post-purchase, an onboarding series times brewing tips to the first delivery.",
    ]),
    results: rt([
      "Subscriber churn fell 22% in the first quarter — pauses now absorb most would-be cancellations. Failed-payment recovery went from 12% to 58%, average subscriber lifetime value rose 31%, and subscriptions reached 47% of total revenue, giving the roastery predictable production for the first time.",
    ]),
    metrics: [
      { label: "subscriber churn", value: "-22%" },
      { label: "payment recovery", value: "12% → 58%" },
      { label: "revenue on subscription", value: "47%" },
    ],
    stack: ["Shopify", "Next.js", "TypeScript", "Stripe", "Klaviyo", "Vercel"],
    cover: { kind: "generated", seed: "subscription-storefront-roaster", url: "", alt: "Coffee subscription storefront case study" },
    gallery: [],
    featured: false,
    sample: true,
    status: "published",
    order: 11,
  },
];

// ---------------------------------------------------------------------------
// Team (sample — replace with real people in the admin)
// ---------------------------------------------------------------------------
type SeedTeamMember = Omit<TeamMember, "createdAt" | "updatedAt">;

export const team: SeedTeamMember[] = [
  {
    name: "Taha Khan",
    role: "Founder & Principal Engineer",
    bio: "Architect behind our fintech and AI platforms. Previously led engineering on payment systems processing millions of transactions a month.",
    photoUrl: "",
    socials: { linkedin: "", github: "", x: "" },
    visible: true,
    order: 0,
  },
  {
    name: "Sara Mansoor",
    role: "Head of AI Engineering",
    bio: "Builds the retrieval systems and evaluation harnesses behind our AI work. Obsessed with the question 'how do we know it's right?'.",
    photoUrl: "",
    socials: { linkedin: "", github: "", x: "" },
    visible: true,
    order: 1,
  },
  {
    name: "Daniyal Ahmed",
    role: "Head of Product Engineering",
    bio: "Full-stack lead who has shipped four SaaS platforms from zero to revenue. Writes TypeScript like it's poetry and tests like it's law.",
    photoUrl: "",
    socials: { linkedin: "", github: "", x: "" },
    visible: true,
    order: 2,
  },
  {
    name: "Emaan Qureshi",
    role: "Design Lead",
    bio: "Product designer embedded in every build. Turns research into design systems and AI ambiguity into interfaces people trust.",
    photoUrl: "",
    socials: { linkedin: "", github: "", x: "" },
    visible: true,
    order: 3,
  },
];

// ---------------------------------------------------------------------------
// Testimonials (sample)
// ---------------------------------------------------------------------------
type SeedTestimonial = Omit<Testimonial, "createdAt" | "updatedAt">;

export const testimonials: SeedTestimonial[] = [
  {
    quote:
      "They shipped in eight weeks what our previous vendor couldn't in eight months — and the eval dashboard means I can tell my board exactly how well the AI performs, with numbers.",
    author: "COO",
    role: "Chief Operating Officer",
    company: "Payments scale-up (confidential)",
    avatarUrl: "",
    visible: true,
    order: 0,
  },
  {
    quote:
      "The first agency I've worked with that treats reconciliation as sacred. We passed the central-bank audit on the first submission because of how they built the ledger.",
    author: "Founder & CEO",
    role: "Founder",
    company: "GCC neobank (confidential)",
    avatarUrl: "",
    visible: true,
    order: 1,
  },
  {
    quote:
      "Weekly demos, honest trade-off memos, zero drama. My LOI customers watched the product get better every Friday — two signed before we even launched.",
    author: "Founder",
    role: "Founder",
    company: "Procurement SaaS (confidential)",
    avatarUrl: "",
    visible: true,
    order: 2,
  },
];

// ---------------------------------------------------------------------------
// Logos — tech marquee + trust bar
// ---------------------------------------------------------------------------
type SeedLogo = Omit<Logo, "createdAt" | "updatedAt">;

export const logos: SeedLogo[] = [
  { name: "Anthropic Claude", kind: "tech", imageUrl: "", visible: true, order: 0 },
  { name: "OpenAI", kind: "tech", imageUrl: "", visible: true, order: 1 },
  { name: "Next.js", kind: "tech", imageUrl: "", visible: true, order: 2 },
  { name: "React", kind: "tech", imageUrl: "", visible: true, order: 3 },
  { name: "Flutter", kind: "tech", imageUrl: "", visible: true, order: 4 },
  { name: "PostgreSQL", kind: "tech", imageUrl: "", visible: true, order: 5 },
  { name: "BigQuery", kind: "tech", imageUrl: "", visible: true, order: 6 },
  { name: "Terraform", kind: "tech", imageUrl: "", visible: true, order: 7 },
  { name: "AWS", kind: "tech", imageUrl: "", visible: true, order: 8 },
  { name: "Stripe", kind: "tech", imageUrl: "", visible: true, order: 9 },
];

// ---------------------------------------------------------------------------
// Site settings seed
// ---------------------------------------------------------------------------
export const settingsSeed = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "MBT",
  tagline: "Operational noise → growth.",
  heroEyebrow: "AI systems studio",
  heroHeadline: "Five minutes to a faster business.",
  heroSubline:
    "Bring your bottleneck. Leave with a plan: which AI systems pay off first, what they cost, what they return.",
  trustLine: "12+ systems shipped · 9 industries · fintech-grade security",
  contactEmail: "hello@example.com",
  whatsapp: "",
  calendlyUrl: "",
  markets: "Global",
  responsePromise: "We reply within one business day.",
  socials: { linkedin: "", github: "", x: "" },
  seo: {
    titleTemplate: "%s — MBT",
    description:
      "MBT is an AI-driven software house: LLM applications, data platforms, fintech engineering, and product design — shipped end to end by one senior team.",
    ogImage: "",
  },
  metrics: [
    { label: "Systems shipped", value: "12", suffix: "+" },
    { label: "Industries served", value: "9", suffix: "" },
    { label: "Partner score", value: "4.9", suffix: "/5" },
    { label: "Avg. weeks to v1", value: "8", suffix: "" },
  ],
  homeFaqs: [
    {
      question: "What actually happens on the 5-minute call?",
      answer:
        "You describe your worst bottleneck; we tell you which system removes it, roughly what it costs, and what it should return. You leave with a plan either way — no pitch, no deck.",
    },
    {
      question: "What does an engagement cost?",
      answer:
        "Automation and assistant builds typically start in the four-to-five-figure range; product and platform builds are scoped in fixed releases. Every quote names deliverables, timeline, and what happens if scope changes.",
    },
    {
      question: "How fast do we see results?",
      answer:
        "First automations ship in days; first production releases in 4–8 weeks. Everything we build is measured, so 'is it working?' is a number you can check, not a feeling.",
    },
  ],
  announcement: { enabled: false, text: "", href: "" },
};
