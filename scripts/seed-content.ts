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
    name: "AI & Generative AI Solutions",
    slug: "ai-generative-ai",
    iconKey: "sparkle",
    status: "published",
    order: 0,
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
  },
  {
    name: "Data Engineering & Analytics",
    slug: "data-engineering",
    iconKey: "database",
    status: "published",
    order: 1,
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
  },
  {
    name: "Fintech Engineering",
    slug: "fintech-engineering",
    iconKey: "bank",
    status: "published",
    order: 2,
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
  },
  {
    name: "Product Engineering — Web & Mobile",
    slug: "product-engineering",
    iconKey: "devices",
    status: "published",
    order: 3,
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
  },
  {
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    iconKey: "cloud",
    status: "published",
    order: 4,
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
  },
  {
    name: "UI/UX & Product Design",
    slug: "ui-ux-design",
    iconKey: "pen-nib",
    status: "published",
    order: 5,
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
    status: "published",
    order: 5,
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
  tagline: "We build AI products that ship.",
  heroEyebrow: "AI software house",
  heroHeadline: "Ship AI products your users actually use.",
  heroSubline:
    "Strategy, design, and engineering for LLM apps, data platforms, and fintech-grade software — delivered by one senior team.",
  trustLine: "12+ products shipped · fintech-grade security · Global reach",
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
    { label: "Products shipped", value: "12", suffix: "+" },
    { label: "Years building", value: "6", suffix: "" },
    { label: "Industries served", value: "9", suffix: "" },
    { label: "Avg. weeks to v1", value: "8", suffix: "" },
  ],
  announcement: { enabled: false, text: "", href: "" },
};
