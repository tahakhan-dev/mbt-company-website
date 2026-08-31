# MASTER BUILD PROMPT V3 — AIGENVORA

## Cinematic AI Software Agency Website, CMS, Admin and Lead Platform

**Brand:** Aigenvora  
**Positioning:** Aigenvora — AI-Powered Software Development  
**Production domain:** https://aigenvora.com  
**Architecture:** Astro SSR, Three.js r158, WebGL2, GLSL, React islands, Firebase and Cloudinary  
**Creative benchmark:** https://lusion.co  
**Instruction type:** Complete research, design, migration, implementation, verification and production-readiness order

---

## 0. READ THIS BEFORE DOING ANYTHING

You are receiving this prompt because two earlier implementations were rejected.

They were technically busy but creatively weak. They produced a dark website with animations placed on top of sections instead of a coherent digital experience. The homepage behaved like an animation demonstration rather than a persuasive software-agency story. The inner pages were mostly static black layouts. The project pages did not feel like crafted case studies. The brand, media, lighting, camera direction and mobile behavior were not designed as one system.

Do not polish that result. Replace it.

This is a full rebuild using Astro. The existing Next.js site is not the target architecture. Preserve useful business logic, validated content, Firebase data, security rules and operational knowledge only after auditing them. Do not preserve a component merely because it already exists.

This prompt is not permission to clone Lusion. It is an order to reach a comparable level of art direction, spatial continuity, motion craft and editorial discipline with a completely original Aigenvora identity.

Before implementation:

1. Read this entire file.
2. Read all repository instructions, especially CLAUDE.md or AGENTS.md.
3. Inspect the current repository, current deployed preview and data model.
4. Visit Lusion live and complete the required research in Section 3.
5. Visit every portfolio source in Section 14 and complete the evidence ledger.
6. Produce the research, storyboard and asset-rights deliverables.
7. Stop at the creative approval gates explicitly marked in this prompt.
8. After the owner approves the creative prototype, execute the remaining plan without repeatedly asking questions that this specification already answers.

Repository-local prohibitions on pushing to GitHub or deploying to Netlify remain binding unless the owner explicitly changes them. Prepare everything for production, but do not bypass those rules.

Never place credentials, private keys, tokens, passwords or service-account JSON in source control, documentation, prompts, screenshots, terminal output, fixtures or client bundles. Earlier prompt text exposed live-looking credentials. Do not reuse them. Require rotated values through environment variables.

---

## 1. ROLE AND MISSION

Operate as one integrated senior product team:

- award-level digital art director;
- creative technologist specializing in WebGL, GLSL and scroll-driven 3D;
- motion director and interaction designer;
- principal Astro and full-stack engineer;
- Firebase security engineer;
- CMS and admin-product designer;
- conversion strategist for startup and B2B technology buyers;
- technical copywriter;
- accessibility and performance engineer;
- QA lead and release manager.

Your mission is to research, design, build, test and prepare for launch the complete Aigenvora website and admin platform.

The finished work must make a qualified founder, CTO or operations leader understand within one scroll:

- what Aigenvora builds;
- how Aigenvora uses AI to remove operational friction;
- that Aigenvora can take a startup from idea to an investable MVP;
- which services are available;
- what kinds of products the team has delivered;
- what evidence supports the work;
- who the people are;
- what the visitor should do next.

The website must feel authored, not assembled. Motion, lighting, copy, camera and layout must tell the same story.

---

## 2. DEFINITION OF SUCCESS

The build succeeds only when all of the following are true:

1. The website is unmistakably Aigenvora and cannot be confused with a generic AI template.
2. The homepage tells a complete story through scrolling without requiring clicks.
3. Services, Work, case studies, MVPs for Startups, About and Contact all have page-specific motion, lighting, camera direction and transitions.
4. The project is not a permanently black website. It uses art-directed transitions between editorial light scenes, deep cinematic scenes, saturated media and quiet neutral moments.
5. A persistent visual metaphor connects the pages instead of unrelated effects appearing in every section.
6. Real project media, original generated media or commercially licensed media carries the visual experience. Empty gradients are not accepted as portfolio art.
7. Every public content item and media asset can be managed from the admin.
8. Contact submissions and their attribution appear in an admin lead pipeline.
9. Text, portrait and video testimonials all render correctly through one conditional content model.
10. Desktop, tablet, mobile, reduced-motion, WebGL-disabled and low-power experiences are intentionally designed.
11. The first useful content renders without waiting for Three.js.
12. Performance, accessibility, security, SEO and browser-console gates pass.
13. Every public claim about a project, client or metric has evidence and publication permission.
14. No secrets are committed or exposed.
15. The work is documented and reproducible.

Passing tests while looking generic is failure.

---

## 3. MANDATORY LIVE R&D — NO COMPONENT CODE BEFORE THIS GATE

### 3.1 Study Lusion live

Visit https://lusion.co in a real browser at desktop and mobile sizes. Do not rely only on screenshots, memory, awards articles or the stack table in this prompt.

Inspect at minimum:

- homepage from loading state through footer;
- About;
- Projects;
- at least three project-detail pages;
- full-screen menu;
- page-to-page transitions;
- cursor and hover behavior;
- mobile navigation and scroll behavior;
- reduced-motion behavior if exposed;
- audio controls and audio behavior;
- loading and WebGL failure behavior;
- typography, whitespace, project-media framing and light/dark scene changes.

Record:

- a full homepage screen recording;
- a screenshot contact sheet at meaningful scroll beats;
- mobile screenshots at the same beats;
- a route-transition recording;
- DOM and canvas observations;
- network and asset observations;
- performance observations;
- implementable design lessons;
- lessons that should not be copied because they are specific to Lusion.

### 3.2 Confirmed starting observations

Live research on 2026-08-31 found the following. Re-verify them at implementation time:

- Lusion currently uses an Astro-generated shell.
- The main canvas exposes data-engine “three.js r158”.
- The experience contains multiple canvas surfaces including a transition overlay.
- The homepage opens as an editorial off-white composition with a framed 3D stage rather than an all-black hero.
- Large typography, extreme spacing and strong media do most of the design work.
- The About page opens as a cinematic dark 3D scene with oversized typography.
- The Projects page returns to an editorial off-white project index with large type and media.
- Inner pages are treated as experiences, not plain supporting pages.
- The type system uses Aeonik and mono utility faces.
- Observed root accents include electric blue, lime and violet.
- Three.js, WebGL2, GLSL shaders, custom animation logic, custom assets, postprocessing and deliberate audio controls are central to the experience.

These are research anchors, not copy instructions.

### 3.3 Required R&D deliverables

Create and commit:

- docs/research/LUSION-LIVE-RND.md
- docs/research/LUSION-SCREEN-CONTACT-SHEET.pdf or an equivalent image board
- docs/research/CURRENT-SITE-AUDIT.md
- docs/research/PORTFOLIO-SOURCE-LEDGER.md
- docs/research/ASSET-RIGHTS-LEDGER.md
- docs/design/AIGENVORA-STORYBOARD.md
- docs/design/MOTION-MATRIX.md
- docs/design/SCENE-ARCHITECTURE.md
- docs/design/COPY-DECK.md
- docs/migration/NEXT-TO-ASTRO-MIGRATION.md

For every reference technique, write:

- what the technique does;
- why it works;
- which Aigenvora route and scene will use the underlying principle;
- how Aigenvora’s execution will be original;
- desktop behavior;
- mobile behavior;
- reduced-motion behavior;
- performance cost and fallback.

“Nice animation,” “premium feel,” “use 3D” and similar generic notes fail this gate.

### 3.4 Creative Gate A — owner approval

Before building the complete website, present:

- the research summary;
- a visual moodboard;
- the homepage storyboard;
- representative frames for the Services, Work, case study, MVP and About pages;
- desktop and mobile views;
- the proposed Aigenvora Engine geometry, materials and lighting;
- an asset acquisition and generation plan.

Wait for owner approval at this gate.

---

## 4. ORIGINAL CREATIVE CONCEPT — THE AIGENVORA ENGINE

The site’s visual spine is an original object called **The Aigenvora Engine**.

It is a precision-built digital mechanism composed of twelve distinct modules. Each module represents one service line. The mechanism is neither a literal robot nor a stock neural network. It should feel like an engineered artifact from a near future: machined ceramic, dark titanium, translucent optical glass, flexible illuminated conduits and fine engraved markings.

### 4.1 Narrative states

1. **Unresolved:** modules drift in controlled disorder, signals are disconnected and the camera cannot see the complete object.
2. **Alignment:** scroll draws parts onto rails and aligns them around a shared core.
3. **System:** the twelve modules connect, light begins to travel between them and the engine becomes operational.
4. **Application:** the modules become windows into services, products and operational transformations.
5. **Proof:** the mechanism refracts or frames real project media rather than replacing it.
6. **Human control:** the machine recedes and people, process and judgment become visible.
7. **Resolution:** the engine becomes quiet, complete and warmly lit at the final contact scene.

### 4.2 Cross-page continuity

- Home assembles the engine.
- Services opens the engine and lets the camera inspect each module.
- Each service detail isolates one module with its own material accent and micro-behavior.
- Work converts modules into portals that reveal project media.
- Case studies use a project-specific scene, material and camera move.
- MVPs for Startups begins with an empty core and builds an operational product around it.
- About turns the system into a field of human decisions, sketches, prototypes and team portraits.
- Contact settles the object into its calmest state.
- Page transitions move through the engine or hand one module from the departing route to the arriving route.

Do not put an unrelated 3D object on each page.

### 4.3 Originality requirement

Create original:

- geometry;
- UVs and materials;
- shaders;
- camera paths;
- loading sequence;
- sound design;
- interaction logic;
- icons;
- image and video treatments.

Do not download, inspect, reconstruct or reuse Lusion’s private bundles, shader code, binary geometry, project media, type files, audio or branded interaction assets.

---

## 5. BRAND AND POSITIONING

### 5.1 Brand identity

**Company name:** Aigenvora  
**Full descriptor:** Aigenvora — AI-Powered Software Development  
**Domain:** aigenvora.com

The brand should communicate:

- intelligence without AI cliché;
- engineering depth without coldness;
- movement without chaos;
- confidence without inflated claims;
- technical ambition with commercial judgment;
- senior craftsmanship;
- global delivery;
- startup empathy.

### 5.2 Primary audiences

1. Startup founders who need an MVP, technical co-creation or product acceleration.
2. CTOs and product leaders who need AI-native product engineering.
3. Operations leaders who need automation and systems integration.
4. SMEs and mid-market businesses modernizing legacy software.
5. Teams that need reliable data, cloud, security and managed AI.

### 5.3 Core value proposition

Aigenvora designs, builds and operates AI-powered software that removes repetitive work, connects fragmented systems and turns product ideas into scalable businesses.

### 5.4 Startup MVP promise

The website must clearly state that Aigenvora helps founders:

- validate the problem and narrow scope;
- create product strategy and technical architecture;
- design the user experience;
- build an investor- and customer-ready MVP;
- add analytics, billing, auth, infrastructure and AI responsibly;
- launch, learn and iterate after release.

Use outcome-led language. Do not promise arbitrary launch times that cannot be supported. The CMS may show a typical range such as 6–12 weeks only when approved by the owner.

### 5.5 Copy voice

Copy is:

- direct;
- specific;
- calm;
- technically literate;
- warm;
- brief enough to coexist with motion;
- focused on the visitor’s operational or product outcome.

Avoid:

- “revolutionize”;
- “unlock the power”;
- “cutting-edge solutions”;
- “seamless innovation”;
- “digital transformation partner” without explanation;
- invented statistics;
- vague claims of global leadership;
- long paragraphs inside cinematic scenes.

### 5.6 Working homepage copy direction

Do not treat this as immutable, but use it as the standard:

**Eyebrow:** AI-powered software development  
**Hero:** We turn ambitious ideas and broken workflows into software that moves.  
**Support:** AI agents, products, data systems and custom platforms built by one senior team.  
**Primary CTA:** Build with Aigenvora  
**Secondary CTA:** Explore our work  
**Startup line:** From first sketch to a working MVP, we help founders build the product people can finally use.

All final copy lives in the CMS.

---

## 6. VISUAL DIRECTION

### 6.1 Overall art direction

The public experience combines:

- editorial off-white fields;
- controlled black cinematic chambers;
- large modern grotesk typography;
- precise mono annotations;
- project-specific saturated media;
- physically believable 3D materials;
- crisp, deliberate grid systems;
- extreme but balanced whitespace;
- soft ambient lighting;
- rare high-energy transitions;
- calm reading states after complex scenes.

The website must not be a uniform black canvas.

### 6.2 Color system

Build two complete scene-aware themes, not a simple inversion.

**Editorial Light**

- Paper: #F2F3F8
- Raised paper: #FFFFFF
- Ink: #090B10
- Secondary ink: #4E5360
- Hairline: rgba(9, 11, 16, 0.12)
- Electric blue: #1A39FF
- Signal lime: #C7FF3D
- Optical violet: #7957FF
- Warm action: #FFB84D

**Cinematic Dark**

- Void: #030407
- Carbon: #090B10
- Raised carbon: #11141C
- Primary light: #F2F3F8
- Secondary light: #9DA4B3
- Hairline: rgba(242, 243, 248, 0.12)
- Electric blue: #4A63FF
- Signal lime: #D2FF65
- Optical violet: #A18AFF
- Warm action: #FFC86A

Use the warm color only for the highest-priority action in a scene.

### 6.3 Typography

Preferred:

- Display and body: Aeonik, only if the owner supplies a valid commercial webfont license.
- Utility mono: IBM Plex Mono.
- Brand display mono: a newly licensed or commissioned Aigenvora Mono.

Do not use or imitate the proprietary Lusion Mono font.

If Aeonik is not licensed, use a commercially safe replacement selected during R&D. Record the license and files in the asset-rights ledger. The fallback must preserve a neutral, contemporary, large-display voice; do not silently fall back to Arial, Inter or a system font.

Desktop display type may reach 12–18vw when compositionally justified. Mobile sizes must be redrawn, not merely clamped.

### 6.4 Layout

- Use a disciplined 12-column desktop grid and 4-column mobile grid.
- Let typography and media break the grid intentionally.
- Prefer full-width stages, asymmetric editorial splits and media sequences.
- Avoid repeated card grids.
- Avoid three identical centered columns.
- Avoid pill overload.
- Avoid a rounded rectangle around every piece of content.
- Use borders only when they clarify a system or frame media.
- Section changes should be spatial or tonal, not a stack of boxes.

### 6.5 Media

Portfolio imagery must be:

- supplied by the owner with rights;
- downloaded from official client press/media kits with written permission;
- commercially licensed;
- or generated specifically for Aigenvora.

Never hotlink another company’s production assets. Never copy Lusion project media.

For each project, prepare:

- hero landscape;
- mobile portrait;
- interface close-up;
- product-in-context image;
- motion loop or short video when appropriate;
- poster;
- alt text;
- copyright owner;
- usage permission;
- Cloudinary public ID.

No project may ship with a meaningless gradient cover.

---

## 7. TECHNICAL STACK — LOCKED

### 7.1 Application

- Astro, current stable release verified from official documentation at implementation time.
- TypeScript strict mode.
- Astro SSR with the official Netlify adapter.
- React islands for the admin, advanced forms, project filters, video player and other truly stateful interfaces.
- Server-render public HTML first; hydration only where behavior requires it.
- CSS with custom properties, cascade layers, container queries and scoped component styles.
- No Tailwind requirement for the public site. If the existing admin uses utility styles, isolate them from public CSS.

### 7.2 3D and rendering

- Three.js r158, as explicitly requested.
- WebGL2 primary, WebGL1 or static fallback where necessary.
- Three.js WebGLRenderer.
- Custom GLSL vertex and fragment shaders.
- Custom requestAnimationFrame tween and timeline system.
- postprocessing package.
- SMAA.
- ACES filmic tone mapping or a researched equivalent.
- Physically correct lighting and color management.
- A custom SVG icon and annotation system drawn specifically for Aigenvora.
- KTX2/Basis textures where beneficial.
- Draco or Meshopt compressed GLB where appropriate.
- Custom binary geometry allowed for high-frequency scene data.
- No Spline embed.
- No copied Lusion engine code.

### 7.3 Motion

- Custom scene timeline owns camera, light, material and shader animation.
- Native scroll progress feeds one normalized master state.
- Motion/Framer Motion is allowed only for small React-island UI transitions.
- CSS and the Web Animations API handle simple Astro-native UI behavior.
- Do not run GSAP and the custom tween system against the same properties.
- No React state update on every scroll or pointer frame.
- Animate transform, opacity and shader uniforms. Avoid scroll-animating blur, box-shadow, large filters or layout properties.

### 7.4 Audio

- Web Audio API-style audio controller.
- Audio is off by default until the user chooses to enable it.
- One persistent mute/unmute control with a visible label.
- Never autoplay audible media.
- Use subtle original sound design only when it adds spatial feedback.
- All essential information remains available without audio.

### 7.5 Backend and content

- Firebase Authentication for admin sign-in.
- Cloud Firestore for structured content and leads.
- Firebase Admin SDK on the server only for Firestore access.
- Client Firebase SDK limited to authentication when necessary.
- Deny client Firestore access through security rules.
- Cloudinary for images, videos, posters and generated media.
- Zod schemas shared between forms, server endpoints, admin and seed/import scripts.
- Server-side validation on every mutation.

### 7.6 Testing and tooling

- Vitest for logic.
- Playwright for browser behavior, responsive states and admin flows.
- Visual-regression snapshots for approved keyframes.
- Lighthouse or equivalent audited in production mode.
- Automated accessibility checks plus keyboard and screen-reader-oriented manual checks.
- Bundle and scene-performance reports.

### 7.7 Version discipline

Before installing any dependency:

1. Read the current official documentation.
2. Confirm Astro and adapter compatibility.
3. Confirm Node and Netlify runtime compatibility.
4. Record exact versions and why they were chosen.
5. Commit the lockfile.

Do not claim a package or platform behavior from memory.

---

## 8. APPLICATION ARCHITECTURE

### 8.1 One Astro application

Use one Astro project with:

- public marketing routes;
- protected admin routes;
- server endpoints;
- Firebase integration;
- shared schemas;
- shared CMS queries;
- shared SEO helpers;
- shared media helpers;
- shared 3D scene runtime.

Do not preserve a hidden Next.js application inside the finished build.

### 8.2 Suggested source boundaries

- src/pages — Astro routes and endpoints
- src/layouts — public, legal and admin layouts
- src/components/public — public Astro components
- src/components/admin — React admin islands
- src/components/forms — forms and validation UI
- src/components/media — responsive image and video primitives
- src/scenes — page scene definitions
- src/engine — renderer, camera, timeline, asset loader, capability detection and lifecycle
- src/shaders — original GLSL
- src/styles — tokens, typography, grids, utilities, motion fallbacks
- src/lib/firebase — server and auth clients
- src/lib/content — queries, cache and transformations
- src/lib/schemas — Zod schemas
- src/lib/leads — validation, spam protection, notifications and attribution
- src/lib/seo — metadata, JSON-LD and social images
- scripts — migration, seed, export, verification and media processing
- tests — unit, integration, e2e and visual
- docs — research, design, migration, runbook and verification

### 8.3 Persistent scene runtime

Create one fixed canvas owned by the top-level public layout.

The scene runtime must:

- survive internal route transitions when supported;
- expose route, section progress, pointer, viewport, theme and capability state;
- load route scenes incrementally;
- dispose unused geometries, textures, framebuffers and listeners;
- pause when the document is hidden;
- pause or reduce work when the canvas is off-screen or idle;
- clamp device pixel ratio by measured capability;
- expose a deterministic static poster mode;
- recover from context loss;
- log no production warnings;
- never block the first contentful render.

### 8.4 Page transitions

Transitions are route-aware and under 700ms for normal navigation.

Use:

- shared-object handoff;
- camera travel through a module;
- masked media reveal;
- typographic wipe;
- or a quiet opacity handoff when performance or reduced motion requires it.

Navigation must remain responsive. Never hold the route hostage while a long animation finishes.

---

## 9. MOTION, CAMERA AND LIGHTING GRAMMAR

### 9.1 Motion has a job

Every animation must do at least one of these:

- explain a system;
- reveal hierarchy;
- connect two ideas;
- establish spatial continuity;
- show before and after;
- reward a deliberate interaction;
- guide the next action.

If an animation does none of these, remove it.

### 9.2 Master scroll model

- Native document scrolling remains accessible.
- Convert scroll to normalized route and scene progress.
- Smooth only the visual interpolation, not browser input.
- Use damped interpolation with measured response.
- Camera, object and typography progress are authored on named timelines.
- Refresh measurements after fonts and critical media load.
- Avoid nested scroll traps.
- Avoid long desktop pins on mobile.

### 9.3 Camera

The camera is a narrator:

- wide establishing view;
- controlled dolly toward a service module;
- orbit only when it reveals structure;
- macro pass for material detail;
- travel through a portal into project media;
- human-height calm frame for team and contact.

Do not make the camera wobble continuously. Pointer response is subtle and inertial.

### 9.4 Lighting

Lighting changes mark meaning:

- cool directional separation for unresolved systems;
- white studio light for explanation;
- colored internal emission for active modules;
- project-specific reflected color for work;
- warmer key light when people and partnership enter;
- soft warm resolution at contact.

Use real light direction, shadows, environment maps and exposure changes carefully. Bloom is subtle and never substitutes for composition.

### 9.5 Typography motion

- Masked line reveals.
- Character or word motion only at major narrative moments.
- Kinetic type responds to scroll velocity sparingly.
- Type may pass behind or in front of 3D when contrast remains readable.
- Do not duplicate invisible and visible text in a way that creates ghosting.
- All text is present and readable in reduced-motion mode.

### 9.6 Micro-interactions

- magnetic response under 8px;
- tactile press state;
- project-media hover reveals;
- navigation labels with precise masked transitions;
- cursor state changes only when useful;
- keyboard focus receives an equivalent visual response.

### 9.7 Reduced motion

When prefers-reduced-motion is active:

- disable scroll scrubbing;
- disable inertia;
- render static scene keyframes or posters;
- preserve every content section in the same order;
- keep route transitions near-instant;
- keep video paused unless requested;
- maintain a complete, premium composition.

Reduced motion is not an unstyled fallback.

---

## 10. RESPONSIVE AND CAPABILITY STRATEGY

Design three choreographies:

1. Desktop: full camera and scroll narrative.
2. Tablet: shortened paths, fewer simultaneous layers and touch-first interactions.
3. Mobile: recomposed scenes, reduced geometry, shallower depth and content-led transitions.

Mobile is not desktop scaled down.

### 10.1 Mobile rules

- No horizontal page overflow.
- No essential hover-only interaction.
- No multi-screen pin that prevents normal reading.
- Use 100dvh carefully with browser chrome.
- Keep CTA and navigation reachable with one hand.
- Cap texture sizes and DPR.
- Replace expensive postprocessing.
- Use posters for low-memory or low-power devices.
- Test actual touch scrolling and orientation changes.

### 10.2 Capability tiers

**Tier A:** WebGL2, sufficient memory and no reduced motion. Full scene.  
**Tier B:** WebGL with conservative DPR and effects. Simplified scene.  
**Tier C:** no WebGL, reduced motion or low-power preference. Designed static posters and CSS transitions.

Content and conversion behavior must be identical across tiers.

---

## 11. GLOBAL NAVIGATION AND SHELL

The shell must feel like part of the scene.

### 11.1 Navigation

- Aigenvora wordmark.
- Home, Services, Work, MVPs for Startups, About and Contact.
- Primary CTA: Build with Aigenvora.
- Compact desktop navigation that adapts its contrast to the current scene.
- Mobile menu is a complete visual scene with masked typography and a lightweight 3D or generated-media accent.
- Current route and keyboard focus are clear.
- Menu opening pauses background interaction.

### 11.2 Progress and wayfinding

- A subtle route progress rail or chapter index.
- Chapter names, not meaningless dots.
- Hide or simplify it on small screens.
- Update aria-live text without announcing every animation frame.

### 11.3 Theme behavior

The site is scene-directed rather than offering a global novelty toggle by default. Pages may move from light to dark as part of the narrative. If a manual theme preference is retained, it must select a complete art-directed variant and never break project media or scene lighting.

### 11.4 Footer

The footer is a final designed scene:

- contact path;
- primary navigation;
- services;
- social links;
- legal;
- location/markets;
- copyright;
- media and IP attribution where required;
- no giant list that feels detached from the finale.

---

## 12. HOMEPAGE — NINE CONNECTED CHAPTERS

The homepage is one continuous pitch. A visitor who only scrolls must understand the company.

### Chapter 1 — Arrival: Ambition in motion

**Purpose:** establish Aigenvora and visual authority.

- Editorial light opening.
- Large Aigenvora wordmark and outcome-led hero copy.
- The unresolved Aigenvora Engine occupies a framed but spatially deep stage.
- Pointer response is subtle.
- Scroll starts the assembly.
- One primary CTA and one work link.
- First content renders as HTML before Three.js.

### Chapter 2 — The problem: businesses trapped between tools

**Purpose:** show why the company exists.

- The frame expands.
- The background moves into a darker chamber.
- Disconnected signals, duplicated tasks and fragmented interfaces appear as abstract operational evidence, not literal floating dashboard cards.
- Short manifesto lines arrive in sequence.
- Camera shows gaps between engine modules.

### Chapter 3 — The system: twelve ways to make software move

**Purpose:** communicate all services.

- The twelve modules align around the core.
- Each service activates one module, light path and concise outcome.
- Desktop uses a controlled pinned inspection sequence.
- Mobile uses a vertical editorial index with a simplified 3D module at the top.
- Progress shows 01/12 through 12/12.
- Each service links to its detail route.

### Chapter 4 — For founders: from idea to MVP

**Purpose:** make startup work impossible to miss.

- Engine core empties.
- Strategy, UX, application, data, AI, infrastructure and launch layers assemble around a founder’s initial idea.
- Copy explains discovery, prototype, MVP, launch and iteration.
- Show tangible MVP outputs rather than inspirational startup language.
- CTA: Plan your MVP.

### Chapter 5 — Transformation: before and after

**Purpose:** demonstrate business value.

- A split spatial scene shows disconnected manual work becoming an automated operating system.
- Examples: customer messages, document processing, booking, payment, CRM and reporting.
- Claims use only owner-approved capability figures.
- No fake client result is presented as fact.
- Lighting moves from cold fragmented pools to one connected source.

### Chapter 6 — Work: systems in the world

**Purpose:** provide proof.

- The engine modules become portals.
- Real project media passes through the scene.
- Feature 4–6 owner-approved projects.
- Each project has distinct color, typography and motion.
- Outcome and role are visible before the detail link.
- Do not show volatile MRR as the primary success metric.

### Chapter 7 — Client voices

**Purpose:** add human proof.

- A quieter editorial scene.
- One featured testimonial at a time.
- Video, when available, becomes a large cinematic media stage.
- Text-only testimonials use portrait, quote and project context without leaving an empty video frame.
- Captions and transcript are required for video.

### Chapter 8 — People and method

**Purpose:** show who will do the work.

- The engine recedes.
- Team photography, sketches, prototypes and a concise delivery method enter.
- Motion becomes tactile and human.
- Avoid a generic headshot-card grid.
- State senior involvement, communication model and ownership clearly.

### Chapter 9 — Resolution: build what moves next

**Purpose:** convert.

- The complete engine rests in warm light.
- The most concise final promise.
- Build with Aigenvora CTA.
- Secondary contact path.
- Risk-reversal microcopy.
- Footer emerges from the same scene.

### Homepage failure conditions

- chapters feel like independent sections;
- the engine disappears for most of the page;
- three or more consecutive sections share the same layout;
- project media is replaced by gradients;
- copy is too dense to coexist with the scene;
- mobile becomes a long static black page;
- scrolling produces duplicated text or lagging ghost states;
- the user cannot explain the MVP offer after scrolling.

---

## 13. SERVICES

### 13.1 Service taxonomy

Create these twelve services in this order:

1. **AI Agents & Business Automation** — automate real business workflows.
2. **AI Integration** — add AI to existing software and business systems.
3. **AI SaaS / AI Product Development** — build AI-native products for startups and businesses.
4. **Data & AI Infrastructure** — make company data reliable and usable by AI.
5. **Legacy Software + AI Modernization** — upgrade existing applications and add AI responsibly.
6. **Custom SaaS Development** — build complete web platforms and business systems.
7. **Web Application Development** — portals, marketplaces, dashboards and ERP/CRM systems.
8. **Mobile App Development** — iOS, Android and cross-platform applications.
9. **API & System Integration** — connect CRMs, ERPs, payments and third-party platforms.
10. **Cloud / DevOps** — AWS, Azure and GCP architecture, CI/CD, observability and scaling.
11. **Cybersecurity & AI Security** — application, cloud, data and AI-agent security.
12. **Maintenance & Managed AI** — ongoing support, monitoring, incident response and AI optimization.

Do not display emoji or star ratings from the owner’s planning table in the public interface. Use them only as internal prioritization if desired.

### 13.2 Services index

- Opens in an editorial light field.
- A giant numbered service atlas creates the page structure.
- The Aigenvora Engine is open and inspectable.
- Scrolling activates each module and updates the adjacent outcome statement.
- Filters may group AI, Product, Infrastructure and Operations without hiding services.
- Related case studies appear as media, not small cards.
- End with the MVP path and contact path.

### 13.3 Individual service pages

Every service route must have:

- its own scene preset;
- module geometry/material state;
- camera path;
- lighting accent;
- outcome-led H1;
- problem-to-outcome opening;
- use cases;
- capabilities;
- engagement deliverables;
- process;
- integrations or stack where meaningful;
- security and risk notes;
- related work;
- testimonial;
- FAQ;
- CTA.

The page may use a shared content schema and scene runtime, but the result must not look like the same template with a different title.

### 13.4 Service-page motion

- Camera locks onto the relevant module.
- Module opens or transforms to explain the service.
- Key concepts appear through physical or typographic transitions.
- Related project media inherits the service accent.
- Next service transition hands off a real piece of the module.
- Mobile uses a single high-quality scene and content-led reveals.

---

## 14. PORTFOLIO R&D AND CASE-STUDY CANDIDATES

### 14.1 Integrity rule

The owner has stated that the team delivered the products below. Public sources also name independent founders or operating companies for several products. Do not infer Aigenvora’s role from the public website.

Before publishing any “we built,” “our team delivered,” client logo or attributed metric:

1. Obtain owner confirmation of the engagement.
2. Record the exact engagement model: full build, subcontract, staff augmentation, redesign, feature work, maintenance or another truthful role.
3. Obtain client publication permission.
4. Confirm the media rights.
5. Confirm which metrics may be used.
6. Store the evidence and approval reference privately in the admin.

Until then, seed the record as draft with ownershipVerified false and clientPermission false. Never work around this requirement by hiding the claim in metadata.

### 14.2 Research ledger

Revisit every source immediately before writing the final content. Values below are research anchors from 2026-08-31 and may change.

#### 1. Zugrow

- Category: AI Agents & Automation.
- Official: https://zugrow.com/about
- External proof: https://www.indiehackers.com/product/zugrow
- Verified public description: autonomous short-term rental platform with property management, channel management and AI agents for hosts and small property managers.
- Public product capabilities include calendar/channel sync, guest communication, direct booking tools, guidebooks and agent-assisted operation.
- Research-time external metric: Indie Hackers showed approximately $240/month.
- Research-time pricing: from £16.60 per property/month on annual billing.
- Case-study angle after ownership verification: AI agents and operational software for vacation-rental hosts.

#### 2. Userdesk

- Category: AI Customer Support.
- Official: https://userdesk.io
- External proof: https://www.indiehackers.com/product/userdesk/revenue
- Verified public description: no-code AI assistants trained on websites, Notion, PDFs and other sources for lead collection and customer support.
- Public capabilities include instant answers, customer insight, multilingual support, web widgets, Slack and API use.
- Research-time external metric: Indie Hackers showed approximately $700/month. A founder post states that the product was sold in 2024, so re-verify ownership and current context.
- Case-study angle after ownership verification: retrieval-based customer support and lead automation.

#### 3. PDFData

- Category: AI Document Processing.
- Official: https://pdfdata.co
- External proof: https://www.indiehackers.com/product/pdfdata/revenue
- Verified public description: invoice and receipt extraction for bookkeepers, accountants and finance teams, with validation, duplicate detection and Excel/CSV export.
- Research-time external metric: Indie Hackers showed approximately $5.3K/month.
- Case-study angle after ownership verification: document ingestion, OCR/AI extraction, review workflows and structured finance data.

#### 4. HelpKit

- Category: AI Knowledge Base / RAG.
- Official: https://www.helpkit.so
- Product support: https://support.helpkit.so
- External proof: https://www.indiehackers.com/product/helpkit/revenue
- Verified public description: turns Notion content into a hosted help center or documentation site with search, widgets and an optional AI chatbot.
- Research-time external metric: Indie Hackers showed approximately $4.3K/month. Older founder reports mention more than 130 customers at $3K MRR.
- Case-study angle after ownership verification: Notion publishing, search, help-center UX and knowledge-grounded AI.

#### 5. PhotoInvoice

- Category: Niche SaaS Development.
- Official: https://www.photoinvoice.com
- External proof: https://www.indiehackers.com/product/photo-invoice/revenue
- Verified public description: pay-to-download invoicing and media delivery for real-estate photographers.
- Official public metrics: more than 70K invoices sent and more than $14M collected at research time.
- Research-time external metric: Indie Hackers showed approximately $510/month.
- Research-time pricing: plans from $24/month or per-invoice options.
- Case-study angle after ownership verification: vertical SaaS, invoicing, payments, watermarking and gated digital delivery.

#### 6. ¡HolaOlas!

- Category: Booking Software.
- Official: https://holaolas.app
- Feature reference: https://holaolas.app/en/resources/booking-link
- External proof: https://www.indiehackers.com/product/holaolas/revenue
- Verified public description: commission-free direct booking and payment software for tourism and experience businesses.
- Research-time external metric: Indie Hackers showed approximately $3.1K/month.
- Case-study angle after ownership verification: real-time availability, direct bookings, payments and tourism operations.

#### 7. Nat.app

- Category: CRM Development.
- Official: https://www.nat.app
- External proof: https://www.indiehackers.com/product/nat-bot/revenue
- Verified public description: relationship-focused personal CRM that uses Gmail, Google Calendar, contact and business data to surface follow-ups and relationship health.
- Research-time external metric: Indie Hackers showed approximately $12K/month.
- Case-study angle after ownership verification: communication sync, relationship intelligence, CRM workflows and Gmail integration.

#### 8. Bizzey

- Category: Business Management Web App.
- Official: https://www.bizzey.com/en
- External proof: https://www.indiehackers.com/product/bizzey/revenue
- Verified public description: all-in-one administration for freelancers and SMEs covering invoices, quotes, customers, projects, time, payments and expenses.
- Research-time external metric: Indie Hackers showed approximately $1.2K/month.
- Case-study angle after ownership verification: multi-module SaaS, CRM, billing, projects, expense and integration workflows.

#### 9. Webhook Relay

- Category: API / Integration Software.
- Official: https://webhookrelay.com
- Pricing: https://webhookrelay.com/pricing
- External proof: https://www.indiehackers.com/product/webhook-relay/revenue
- Verified public description: webhook gateway for receiving, transforming and delivering webhooks to public services, private networks and localhost, with durable retries and tunneling.
- Research-time external metric: Indie Hackers showed approximately $3.8K/month.
- Research-time pricing: Basic plan from $8.99/month.
- Case-study angle after ownership verification: event delivery, secure tunneling, retries, routing and infrastructure reliability.

#### 10. Phare

- Category: Monitoring / Maintenance.
- Official: https://phare.io
- Documentation: https://docs.phare.io/uptime/overview
- External proof: https://www.indiehackers.com/product/minkit/revenue
- Verified public description: European uptime monitoring, alerting, incident management and status-page platform.
- Official site claimed 900+ startups, agencies and SMBs at research time.
- Volatile metric conflict: the owner supplied 66 paying Scale customers and about €346 monthly revenue; Indie Hackers showed approximately $330/month. Reconcile against a current authoritative source before publication.
- Case-study angle after ownership verification: global monitoring, incidents, alert rules, status communication and managed reliability.

#### 11. AI ChatBuddy

- Category: Mobile App Development.
- External proof: https://www.indiehackers.com/product/ai-chatbuddy/revenue
- Historical store URL: https://play.google.com/store/apps/details?id=com.teknikforce.aitalk
- Verified public description from Indie Hackers: mobile app for chatting with AI and generating images.
- Research-time external metric: Indie Hackers showed approximately $45/month.
- Important status: the linked Google Play listing returned unavailable/404 during research. Do not publish a live-store claim without an owner-supplied active listing or archived evidence.
- Case-study angle after ownership verification: paid consumer AI mobile experience, subscriptions and image generation.

#### 12. SecureVibing

- Category: Cybersecurity.
- Official: https://securevibing.com
- Audit service: https://audit.bllekholl.com
- Verified public description: security scanner and monitoring tools for AI-assisted or rapidly built websites, including checks for exposed keys, missing headers, public databases and Supabase configuration issues.
- Research-time audit offer: $499 and a claim of helping 20+ indie hackers on the audit page.
- Do not invent MRR.
- Case-study angle after ownership verification: automated security scanning, findings, monitoring and founder-friendly remediation.

#### 13. RotateProduct

- Category: AI SaaS Product.
- Official: https://rotateproduct.com
- Pricing: https://rotateproduct.com/pricing
- Shopify listing: https://apps.shopify.com/rotateproduct
- Verified public description: generates rotating product videos from static product images, including a Shopify integration.
- Research-time direct plans: $19, $39 and $99/month.
- Research-time Shopify pricing: $3 per successfully generated video.
- Do not invent MRR.
- Case-study angle after ownership verification: image-to-video generation, credit billing, API and e-commerce integration.

### 14.3 Metric presentation rules

- A product’s current MRR is not automatically an outcome caused by Aigenvora.
- Do not use it as “revenue generated by us” unless attribution is contractually and factually supported.
- Prefer product scale, workflow outcome, technical challenge, adoption or operational value.
- Every volatile metric requires sourceUrl, sourceLabel and verifiedAt.
- Flag metrics stale after 90 days.
- The admin can hide a metric without deleting it.
- If two sources conflict, hide the metric and show the conflict privately in admin.

### 14.4 Project-detail content model

Every project record supports:

- name;
- slug;
- one-line outcome;
- category;
- industry;
- year;
- client name;
- client visibility;
- engagement model;
- Aigenvora’s verified role;
- ownershipVerified;
- clientPermission;
- publication status;
- problem;
- constraints;
- approach;
- solution;
- features;
- technical architecture, only if verified;
- service links;
- result metrics;
- proof sources;
- quote/testimonial;
- official product link;
- hero media;
- gallery;
- video;
- video poster;
- captions/transcript;
- color/material scene preset;
- SEO title and description;
- social image;
- related projects;
- next project;
- updatedAt and verifiedAt.

Do not fabricate stacks, team size, timelines, client quotes, challenges or results.

---

## 15. WORK INDEX AND CASE-STUDY EXPERIENCES

### 15.1 Work index

- Editorial light opening with giant WORK typography.
- Project count and truthful filtering.
- Project media enters through WebGL texture planes or equivalent original treatments.
- Hover/touch reveals role, outcome and service.
- Filtering transitions are spatially coherent and keyboard accessible.
- Each project owns a color and motion identity.
- The grid may vary in scale and rhythm; avoid identical cards.
- Draft or unverified projects never appear publicly.

### 15.2 Case-study page

Every project page is a scroll story:

1. Project-specific cinematic opening.
2. Concise public description and verified Aigenvora role.
3. Challenge.
4. System/solution.
5. Product behavior demonstrated through media.
6. Architecture or technical depth when verified.
7. Outcomes with linked evidence.
8. Testimonial when approved.
9. Related services.
10. Next-project transition.

The scene uses project media and materials. Do not force the generic engine to dominate the client’s identity.

### 15.3 Video and interactive media

- Lazy load.
- Provide poster, controls, captions and transcript.
- Never autoplay audible content.
- Pause off-screen.
- Offer image fallback.
- Optimize through Cloudinary.
- Respect reduced data where detectable.

---

## 16. MVPs FOR STARTUPS PAGE

This is a first-class route, not one paragraph on Services.

### Story

1. Founder begins with a sharp problem and an incomplete shape.
2. Discovery removes uncertainty.
3. Product definition sets the smallest valuable scope.
4. UX prototype makes the idea testable.
5. Engineering creates a real system.
6. AI is added only where it improves the product.
7. Launch infrastructure makes the MVP observable and secure.
8. Iteration turns usage into the next roadmap.

### Required content

- who the offer is for;
- what an MVP is and is not;
- typical deliverables;
- discovery and validation;
- UX and prototype;
- architecture;
- web/mobile/AI implementation;
- auth, billing, analytics and admin;
- deployment;
- handover and iteration;
- engagement models;
- typical timeline range only when approved;
- founder FAQ;
- related startup projects;
- CTA: Plan your MVP.

### Scene

The empty engine core receives product layers as the page progresses. At the end it becomes a functioning small system, not an overbuilt machine.

---

## 17. ABOUT PAGE

The About page must have as much authorship as the homepage.

### Opening

- Cinematic dark scene.
- The Aigenvora Engine decomposes into decisions, prototypes, code, tests and human inputs.
- Large statement typography.
- One clear description of who the company is.

### Required chapters

- why Aigenvora exists;
- the belief that AI should improve real workflows, not decorate products;
- senior-team delivery model;
- disciplines and capabilities;
- how product, design, AI, data, cloud and security work together;
- team;
- principles;
- delivery process;
- markets and collaboration model;
- selected proof;
- contact CTA.

### Team presentation

- Real portraits or rights-cleared generated editorial portraits approved by the owner.
- Role, short bio, expertise and social link.
- Avoid generic initials.
- Avoid a static four-card grid as the primary presentation.
- Show people at a human reading pace with subtle motion.

---

## 18. TESTIMONIALS AND OPTIONAL VIDEO

### 18.1 Content model

Each testimonial supports:

- quote;
- client name;
- title;
- company;
- portrait;
- company logo;
- linked project;
- featured status;
- text permission;
- video URL;
- video poster;
- video duration;
- captions;
- transcript;
- video permission;
- publication status;
- display order.

### 18.2 Conditional rendering

If an approved video exists:

- use a large media-led composition;
- show poster, duration and clear play control;
- open inline or in an accessible modal;
- include captions and transcript;
- pause the 3D scene or reduce rendering while the video plays;
- return focus correctly when closed.

If no video exists:

- use an editorial quote composition with portrait, company and project context;
- do not leave a blank media region;
- do not show disabled play controls;
- do not change the testimonial’s importance merely because it has no video.

If only audio exists:

- provide waveform or restrained audio UI;
- provide transcript;
- never autoplay.

The admin preview must show all three layouts.

---

## 19. CONTACT AND LEAD PIPELINE

### 19.1 Contact experience

- Calmest route in the site.
- Warm light and minimal camera motion.
- Clear qualification form.
- Booking link when configured.
- Direct email when configured.
- Optional WhatsApp when configured.
- Explicit response expectation.
- Success state remains inside the designed scene.

### 19.2 Form fields

- name;
- work email;
- company;
- role;
- project type;
- selected services;
- startup/MVP status;
- budget range;
- desired start;
- message;
- optional product or brief URL;
- consent acknowledgement where required.

Do not require every field. Keep the first interaction humane.

### 19.3 Lead record

Store:

- all submitted fields;
- status;
- owner;
- priority;
- tags;
- internal notes;
- createdAt and updatedAt;
- first and last page;
- referrer;
- UTM values;
- session ID;
- pages viewed;
- selected CTA;
- spam score;
- notification status;
- consent state;
- deletion/export metadata.

### 19.4 Pipeline

Admin stages:

- New;
- Qualified;
- Discovery booked;
- Proposal;
- Won;
- Lost;
- Spam.

Support:

- filtering;
- search;
- notes;
- status history;
- assignment;
- CSV export;
- retention/deletion;
- optional email notification;
- optional webhook.

### 19.5 Spam and security

- honeypot;
- minimum-fill-time trap;
- origin validation;
- server-side Zod validation;
- rate limiting;
- generic public errors;
- safe logging;
- optional Turnstile only when configured;
- no sensitive lead data in analytics events.

---

## 20. ADMIN CMS — EVERYTHING MANAGEABLE

### 20.1 Admin principles

The admin is fast, clear and conventional. Do not apply the cinematic public UI to business operations.

- Protected server-side.
- Dark neutral interface by default.
- Responsive enough for tablet and emergency mobile use.
- Clear empty states.
- Autosave only when safe.
- Explicit publish controls.
- Preview links.
- Audit trail for material content changes.
- Accessible forms and tables.

### 20.2 Managed modules

1. Site settings.
2. Navigation and footer.
3. Homepage chapters.
4. Static pages.
5. Services.
6. Projects/case studies.
7. Testimonials.
8. Team.
9. FAQs.
10. Media library.
11. SEO and social images.
12. Redirects.
13. Leads.
14. Safe scene configuration.
15. Users and roles if more than one admin is later enabled.

### 20.3 Site settings

- brand name and descriptor;
- domain;
- default SEO;
- contact email;
- phone/WhatsApp;
- booking URL;
- social links;
- markets;
- office/location;
- CTA labels;
- response time;
- legal business name;
- analytics/privacy flags;
- theme and scene defaults;
- maintenance mode.

### 20.4 Content control

Every public content record supports:

- draft/published/archived;
- order;
- title;
- copy;
- media;
- links;
- theme/scene preset;
- SEO;
- createdAt;
- updatedAt;
- scheduled publication if implemented;
- preview.

“Everything manageable” does not mean letting an admin paste shader code. Expose safe fields such as:

- scene preset;
- object variant;
- accent colors within allowed contrast;
- media IDs;
- section enabled;
- section order within safe constraints;
- motion intensity preset;
- poster;
- desktop/mobile focal point.

Validate all values and keep code-owned accessibility and performance limits.

### 20.5 Media manager

- Cloudinary upload.
- image/video type validation.
- alt text.
- poster generation.
- focal point.
- crop presets.
- responsive preview.
- attribution and rights.
- linked-content usage list.
- prevent deletion while in use or provide a safe replacement workflow.

### 20.6 Project verification fields

Private admin fields:

- ownershipVerified;
- verifiedBy;
- verificationDate;
- engagementModel;
- clientPermission;
- permissionReference;
- mediaRights;
- proof conflicts;
- metric source and verification date.

Public publishing is blocked unless required verification fields pass.

---

## 21. FIRESTORE DATA MODEL

Use a documented schema with shared Zod types.

Suggested collections:

- settings
- navigation
- pages
- homepageChapters
- services
- projects
- testimonials
- team
- faqs
- mediaAssets
- redirects
- leads
- leadActivity
- adminAudit
- analyticsSessions
- analyticsEvents
- dailyStats

Every content record includes status, order, createdAt and updatedAt.

### Security posture

- All Firestore content and lead access flows through server code.
- Client rules deny document reads and writes.
- Admin session and authorization are checked on every privileged endpoint.
- Never rely on hiding the admin route.
- Rotate sessions on login.
- Revoke on logout.
- Use secure, httpOnly, sameSite cookies.
- Apply CSRF protection appropriate to Astro’s server model.
- Sanitize any rich text before rendering.
- Do not expose service-account fields to the browser.

### Migration

The Next-to-Astro migration must:

- export current content safely;
- map old schemas to new schemas;
- preserve stable IDs/slugs when useful;
- preserve lead history;
- preserve publication state;
- preserve admin users;
- preserve security rules;
- back up before writing;
- support dry-run;
- be idempotent;
- produce a reconciliation report;
- never delete old data automatically.

---

## 22. ANALYTICS AND PRIVACY

Preserve useful first-party analytics only if the current implementation is lawful, secure and quota-safe after audit.

At minimum track:

- page view;
- route;
- referrer;
- UTM;
- CTA clicks;
- case-study views;
- form start;
- form completion;
- session duration through coarse heartbeat;
- maximum scroll depth.

Do not:

- store raw IP indefinitely;
- fingerprint;
- capture form values as analytics;
- claim cookie-free if cookies or local storage identifiers are used without explaining them;
- create a consent banner that lies about actual behavior.

Provide:

- truthful privacy policy;
- do-not-track handling if supported;
- retention controls;
- analytics kill switch;
- deletion path;
- quota budget.

---

## 23. SEO AND DISCOVERABILITY

- Server-render meaningful HTML on every route.
- Unique title and meta description.
- Canonical URLs using aigenvora.com.
- Sitemap and robots.
- Organization JSON-LD.
- Service JSON-LD.
- Breadcrumb JSON-LD.
- FAQ JSON-LD only when the FAQ is visible.
- VideoObject JSON-LD for approved video testimonials/case media where appropriate.
- Dynamic social images.
- Correct 404 status.
- Redirect management.
- No index for admin, preview and draft routes.
- Descriptive alt text.
- Clean project and service slugs.
- Link service and work content semantically.

Do not let canvas hide the page’s meaning from crawlers.

---

## 24. PERFORMANCE BUDGETS

Measure in a production build on representative devices.

### Public web budgets

- LCP at or below 2.5s on throttled mobile for public routes.
- CLS below 0.05.
- INP below 200ms.
- First HTML content visible without Three.js.
- Initial route JavaScript target below 170KB gzip excluding the deferred 3D engine and admin.
- 3D route code lazy and separately cached.
- No main-thread long-task clusters above 100ms during a 10-second steady scroll at 4× CPU throttle.
- Desktop target 60fps; mobile target stable 30–60fps by capability tier.
- DPR normally capped at 1.5 and lowered dynamically when needed.
- No per-frame allocation in hot render paths.
- No unbounded texture or media memory.

### Scene budgets

Define and record per scene:

- triangle count;
- draw calls;
- shader count;
- texture memory;
- render-target memory;
- postprocessing passes;
- frame time;
- asset transfer.

### Loading

- Critical font and hero HTML prioritized.
- Scene loads after useful content.
- Route scenes prefetch only when reasonable.
- Use compressed geometry and textures.
- Videos stream and use posters.
- Pause rendering when hidden.
- Dispose everything on route exit.
- Handle WebGL context loss.

---

## 25. ACCESSIBILITY

- One H1 per page.
- Semantic landmarks.
- Skip link.
- Fully keyboard-operable navigation, filters, media and admin.
- Visible focus.
- Contrast compliant in every scene state.
- Canvas is decorative unless a true accessible equivalent exists.
- Canvas never contains the only copy or control.
- Reduced motion is complete.
- Captions and transcripts for testimonial and project video.
- Form labels and associated errors.
- Status messages announced correctly.
- Modal focus trap and return.
- Touch targets at least 44px where possible.
- No autoplay audio.
- No flashing.
- Content remains readable at 200% zoom.

Test light, dark, project-colored and transitional frames for contrast.

---

## 26. ASSET PRODUCTION AND RIGHTS

### 26.1 Allowed sources

- owner-supplied assets with rights;
- licensed commercial stock;
- custom photography;
- original 3D models;
- original shader output;
- AI-generated media with commercially usable terms;
- official client media with explicit permission.

### 26.2 Required asset metadata

- source;
- creator/tool;
- generation prompt when applicable;
- license;
- owner;
- client permission;
- usage scope;
- created/downloaded date;
- Cloudinary ID;
- alt text;
- linked records.

### 26.3 Generated media

Use image or video generation when it materially improves the experience. Generate original Aigenvora scenes, product abstractions, texture plates and transitions. Do not prompt a generator to reproduce Lusion’s branded scene or a client’s copyrighted interface.

Review every generated asset for:

- artifacts;
- fake text;
- accidental logos;
- inconsistent lighting;
- licensing;
- cultural or demographic bias;
- mobile crop.

### 26.4 Fonts

Record licenses. Never ship a font copied from another website.

---

## 27. IMPLEMENTATION PHASES AND GATES

### Phase 0 — Audit and protect

- Read repository rules.
- Capture status and existing changes.
- Back up data.
- Audit Next application, admin, Firebase, analytics and deployment.
- Identify reusable logic without preserving the framework.
- Verify secrets are ignored.

**Gate:** CURRENT-SITE-AUDIT and migration map complete.

### Phase 1 — Live research

- Complete Lusion study.
- Complete portfolio source study.
- Complete rights ledger.
- Complete visual benchmark matrix.

**Creative Gate A:** owner approves research and storyboards.

### Phase 2 — Architecture and foundation

- Initialize Astro SSR.
- Configure TypeScript, Netlify adapter, Firebase server, environment validation and CSS tokens.
- Implement schemas.
- Implement content query layer.
- Implement base layouts and accessibility shell.
- Prove a hello-world production build.

**Gate:** static checks, server smoke and no leaked client secrets.

### Phase 3 — Engine prototype

- Renderer lifecycle.
- capability tiers.
- asset loader.
- custom timeline.
- engine geometry.
- materials and lighting.
- homepage arrival.
- one route transition.
- reduced-motion poster.

### Phase 4 — Representative inner-page prototypes

- one service page;
- one case-study page;
- mobile variants;
- project media treatment;
- scene performance trace.

**Creative Gate B:** show recordings and screenshots. Owner approves the actual working visual system before full page production.

### Phase 5 — Complete public pages

- Home chapters.
- Services index.
- twelve service pages.
- Work index.
- verified case-study pages.
- MVPs for Startups.
- About.
- Contact.
- legal and 404.
- navigation and footer.

Verify each route before starting the next route family.

### Phase 6 — Admin and CMS

- auth;
- content CRUD;
- project verification gates;
- media;
- testimonials/video;
- settings;
- leads;
- preview;
- audit trail.

### Phase 7 — Migration and content

- dry-run import;
- owner-reviewed project verification;
- media processing;
- copy finalization;
- reconciliation;
- rollback notes.

### Phase 8 — Hardening

- performance;
- responsive;
- reduced motion;
- a11y;
- SEO;
- security;
- quota;
- error handling;
- cross-browser.

### Phase 9 — Production readiness

- full test suite;
- screenshot and video evidence;
- owner-run deployment instructions if deployment remains prohibited;
- aigenvora.com DNS and environment checklist;
- rollback;
- handover.

---

## 28. TESTING REQUIREMENTS

### 28.1 Static

- typecheck;
- lint;
- production build;
- dependency audit;
- secret scan;
- no warnings treated as harmless without investigation.

### 28.2 Public routes

- every route returns the intended status;
- metadata correct;
- no console errors;
- no broken links;
- no missing images;
- no horizontal overflow at 360, 390, 768, 1024, 1440 and 1920 widths;
- navigation works by keyboard and touch;
- internal route transition never blocks navigation;
- browser back/forward works;
- deep links work.

### 28.3 Scene behavior

- WebGL2 full tier;
- conservative tier;
- no-WebGL fallback;
- context loss and restore;
- reduced motion;
- background tab pause;
- orientation change;
- resize;
- scene disposal;
- media playback pause interaction;
- no duplicate canvas;
- no duplicate timeline listeners;
- no ghost text.

### 28.4 Admin

- unauthorized routes redirect;
- wrong login rejected generically;
- login/logout;
- service CRUD;
- project CRUD;
- verification prevents unsafe publication;
- testimonial text layout;
- testimonial video layout;
- team CRUD;
- page/chapter edit;
- navigation edit;
- media upload and in-use protection;
- SEO edit;
- preview;
- reorder;
- publish/unpublish;
- public revalidation or cache refresh;
- audit entry.

### 28.5 Leads

- client and server validation;
- bot traps;
- rate limit;
- valid submit;
- attribution;
- pipeline display;
- status and notes;
- export;
- deletion;
- optional notification failure does not lose the lead.

### 28.6 Portfolio proof

For every published project:

- ownershipVerified true;
- clientPermission true;
- role populated;
- media rights populated;
- every metric has source and date;
- no contradiction unresolved;
- official link reachable or clearly marked historical;
- Aigenvora’s role is not overstated.

### 28.7 Visual evidence

Capture every public route:

- desktop opening;
- desktop key scroll beats;
- mobile opening;
- mobile key scroll beats;
- reduced motion;
- WebGL fallback.

Create short recordings for:

- homepage full scroll;
- services;
- work filtering;
- one case study;
- MVP page;
- About;
- menu and transitions;
- video testimonial;
- contact success.

---

## 29. VISUAL QUALITY GATES

### Gate V1 — Narrative

Give a fresh reviewer only the homepage scroll recording. They must correctly answer:

- What does Aigenvora do?
- Who is it for?
- How does it help a startup build an MVP?
- Which services are offered?
- What proof is shown?
- Who does the work?
- What is the next step?

Any missing answer requires a narrative revision.

### Gate V2 — Inner pages

Show Services, one service page, Work, one case study, MVPs, About and Contact without route labels. A reviewer must see distinct page intentions within one coherent brand.

If they look like the same black template, fail the gate.

### Gate V3 — Reference quality

Compare with Lusion on:

- continuity;
- typography;
- whitespace;
- media quality;
- camera purpose;
- light/dark scene direction;
- transition quality;
- inner-page authorship;
- mobile adaptation.

Do not compare by copying exact components. Compare craft and intentionality.

### Gate V4 — Originality

- no Lusion asset;
- no copied shader;
- no copied geometry;
- no copied copy;
- no unlicensed font;
- no suspiciously identical scene;
- rights ledger complete.

### Gate V5 — Anti-template

Fail if:

- stock particle network is the hero;
- every section is a rounded card;
- background remains one near-black color;
- “premium” depends on glow and blur;
- service pages differ only by text;
- project covers are gradients;
- motion is mostly fade-up;
- giant words exist without composition;
- 3D loops without narrative response;
- the admin controls content that the public page still hardcodes elsewhere.

---

## 30. ERROR HANDLING AND FALLBACKS

- Missing CMS content uses a safe unpublished state, not lorem ipsum.
- Missing media uses a designed brand poster and admin warning.
- Broken project source disables the external link and raises an admin warning.
- Cloudinary failure preserves text and a local poster.
- Firebase read failure returns cached/public-safe content or a designed service state.
- Lead notification failure still stores the lead.
- WebGL failure switches once to fallback without repeated reload.
- Video failure shows poster, quote and transcript.
- Admin actions return specific private errors and safe public errors.
- Production logging excludes secrets and sensitive lead content.

---

## 31. SECURITY

- Validate environment variables at startup.
- Server-only Firebase Admin import boundaries.
- Deny Firestore client access.
- Admin custom claim or documented role system.
- Verify authorization on every privileged endpoint.
- Secure cookies.
- CSRF protection.
- Origin checks.
- Rate limits.
- Zod validation.
- rich-text sanitization.
- safe URL validation.
- file type and size checks.
- Cloudinary signed operations for privileged uploads.
- Content Security Policy compatible with required assets.
- frame protection.
- strict referrer policy.
- permissions policy.
- no source maps containing secrets.
- no sensitive browser logs.
- dependency review.
- documented secret rotation.

Never commit a real .env file or service-account file.

---

## 32. DEPLOYMENT AND DOMAIN READINESS

Prepare:

- Netlify configuration for Astro SSR;
- functions/runtime settings;
- environment-variable matrix;
- Firebase production project configuration;
- Cloudinary configuration;
- aigenvora.com DNS checklist;
- apex and www canonical redirect;
- HTTPS;
- preview versus production settings;
- noindex previews;
- cache rules;
- security headers;
- rollback;
- health check;
- smoke test.

If repository instructions prohibit Netlify deployment, stop before the external deployment action and provide exact owner-run steps. Do not weaken the production verification checklist; label it pending owner-run deployment and provide the script.

---

## 33. DOCUMENTATION AND HANDOVER

Deliver:

- README.md;
- ARCHITECTURE.md;
- RUNBOOK.md;
- CONTENT-MODEL.md;
- SCENE-GUIDE.md;
- MEDIA-RIGHTS.md;
- PORTFOLIO-SOURCE-LEDGER.md;
- MIGRATION-REPORT.md;
- TEST-REPORT.md;
- PERFORMANCE-REPORT.md;
- ACCESSIBILITY-REPORT.md;
- DEPLOYMENT.md;
- CHANGELOG-ASTRO.md.

Runbook must explain:

- editing every content type;
- adding a service;
- adding and verifying a project;
- attaching proof sources;
- adding a text testimonial;
- adding a video testimonial with captions;
- replacing media;
- managing leads;
- rotating credentials;
- disabling analytics;
- changing a scene preset safely;
- rebuilding and deploying;
- rollback.

---

## 34. FINAL ACCEPTANCE CHECKLIST

### Brand and story

- [ ] Aigenvora naming and aigenvora.com are used consistently.
- [ ] The homepage communicates the complete business story by scroll.
- [ ] Startup MVP work is a first-class offer.
- [ ] The Aigenvora Engine provides a consistent original visual spine.
- [ ] The site is not uniformly black.
- [ ] Copy is specific and outcome-led.

### Pages

- [ ] Home complete.
- [ ] Services index complete.
- [ ] Twelve service pages complete.
- [ ] Work index complete.
- [ ] Only verified case studies published.
- [ ] MVPs for Startups complete.
- [ ] About complete.
- [ ] Contact complete.
- [ ] Legal, sitemap, robots and 404 complete.
- [ ] Every public page has its own intentional motion and scene direction.

### Visual and motion

- [ ] Original geometry, shaders, media treatment and sound.
- [ ] Camera and lighting changes have narrative purpose.
- [ ] Project media is high quality and rights-cleared.
- [ ] Page transitions are fast and coherent.
- [ ] Mobile choreography is designed.
- [ ] Reduced motion is premium.
- [ ] WebGL fallback is premium.
- [ ] No ghosted or duplicate animated text.

### CMS and leads

- [ ] All public copy and media is admin-managed.
- [ ] Safe scene presets are admin-managed.
- [ ] Services, projects, testimonials and team CRUD work.
- [ ] Video testimonial conditional behavior works.
- [ ] Leads arrive with attribution.
- [ ] Pipeline, notes, status, export and deletion work.
- [ ] Project verification blocks unsupported claims.

### Technical

- [ ] Full Astro architecture; no hidden Next runtime.
- [ ] Three.js r158/WebGL2 engine is deferred.
- [ ] Static, unit, e2e and visual suites pass.
- [ ] Performance budgets pass or every exception is explicitly approved.
- [ ] Accessibility passes.
- [ ] SEO passes.
- [ ] Security posture passes.
- [ ] No secrets committed.
- [ ] No console errors or hydration warnings.
- [ ] Scene resources dispose correctly.

### Research and rights

- [ ] Live Lusion R&D complete.
- [ ] Portfolio sources re-verified.
- [ ] Rights ledger complete.
- [ ] No Lusion assets copied.
- [ ] No unlicensed font.
- [ ] No invented project role, stack, metric or testimonial.

### Handover

- [ ] Migration report reconciles data.
- [ ] Runbook complete.
- [ ] Owner-run deployment steps complete where required.
- [ ] aigenvora.com configuration documented.
- [ ] Final screenshot and recording evidence delivered.

---

## 35. FINAL RESPONSE CONTRACT

Do not finish with “the code is ready.”

The final response must provide:

1. concise outcome summary;
2. local project path;
3. preview or production URL when actually available;
4. admin URL;
5. exact verification commands and results;
6. performance results;
7. accessibility results;
8. screenshot and recording locations;
9. migration summary;
10. published versus draft portfolio list;
11. unresolved owner verification or media-rights items;
12. deployment status;
13. credential setup location without exposing values;
14. known limitations;
15. next owner action, if any.

Never claim deployed, verified, licensed, client-approved or complete without evidence.

---

## 36. START NOW

Begin with:

1. repository and instruction audit;
2. current-site visual audit;
3. live Lusion research;
4. portfolio source and ownership ledger;
5. Aigenvora Engine storyboard;
6. Next-to-Astro migration design;
7. desktop/mobile/reduced-motion visual frames;
8. Creative Gate A presentation.

Do not write the production component system before Creative Gate A is approved. After Gate A, build the engine and representative inner-page prototypes. Do not mass-produce the remaining pages before Creative Gate B proves the visual system in working code.

The standard is not “contains animation.”

The standard is: every page feels directed, every transition advances the story, every project is presented truthfully, every frame belongs to Aigenvora, and the complete system is fast enough to deserve its craft.
