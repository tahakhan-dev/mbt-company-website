# Aigenvora Astro Master Prompt — Design Record

**Date:** 2026-08-31  
**Status:** Approved by the owner  
**Deliverable:** `AIGENVORA-ASTRO-MASTER-BUILD-PROMPT.md`

## Objective

Produce a production-grade build prompt for replacing the existing Next.js website with a complete Astro implementation for **Aigenvora — AI-Powered Software Development** at `aigenvora.com`.

The prompt must prevent a repeat of the two rejected builds: a generic dark agency template with isolated animation effects, weak visual storytelling, static inner pages, and an under-art-directed portfolio. It must make visual research, original media production, page-specific choreography, CMS control, and evidence-based visual review mandatory before the implementation can be called complete.

## Approved Architecture

The owner selected a full Astro rebuild rather than preserving the current Next.js application.

- One Astro SSR application deployed through the Netlify adapter.
- React islands only for stateful surfaces such as the admin application, complex forms, filters, and video controls.
- Firebase Authentication and Cloud Firestore accessed through server-only endpoints and actions.
- Cloudinary for images, posters, videos, and generated media.
- A persistent Three.js r158/WebGL2 scene layer with custom GLSL shaders, camera direction, postprocessing, SMAA, and a purpose-built requestAnimationFrame tween system.
- CSS and custom properties for the public design system; Motion/Framer Motion only for small React-island interactions.
- A fast, conventional admin interface at `/admin`; public theatrical effects do not enter the admin.

## Approved Creative Direction

The signature visual system is **The Aigenvora Engine**: an original illuminated mechanism built from twelve modules. It begins fragmented, assembles as the visitor scrolls, exposes its internal systems when services are discussed, becomes a set of portals when work is shown, and resolves into a calm, complete object at the final call to action.

The concept provides one visual spine across the entire site without using the dated particle-network cliché. Every public page receives its own camera path, material state, lighting cue, transition logic, and mobile fallback.

Lusion is a quality and interaction benchmark, not a source to clone. Research confirmed that the current Lusion experience combines an Astro shell with a persistent Three.js r158 canvas, WebGL/GLSL scenes, custom animation systems, large Aeonik typography, editorial off-white surfaces, cinematic black scenes, media-led projects, and animated inner pages. Aigenvora must borrow the principles of continuity, restraint, camera direction, typography, and scene-to-scene storytelling while using original assets, copy, geometry, shaders, and brand behavior.

## Information Architecture

The public website comprises:

1. Home: a continuous scroll pitch with nine connected chapters.
2. Services: an animated service atlas and twelve individual outcome-led service pages.
3. Work: an interactive project index and thirteen researched case-study candidates.
4. MVPs for Startups: a dedicated founder conversion journey.
5. About: philosophy, people, capabilities, and delivery principles.
6. Contact: qualification form, booking options, and lead capture.
7. Privacy, terms, sitemap, robots, and designed 404.
8. Admin: content, media, services, projects, testimonials, team, navigation, SEO, leads, and safe visual configuration.

## Content and Portfolio Integrity

The owner supplied thirteen products as work delivered by the team. Public sources identify independent founders or operating companies for several products, and one supplied mobile-app URL is currently unavailable. Therefore the prompt treats all thirteen as **case-study candidates**.

Each candidate requires owner-side engagement verification and client publication permission before an authorship claim can go live. The CMS includes `ownershipVerified`, `clientPermission`, `engagementModel`, `proofSourceUrl`, `proofVerifiedAt`, and publication status fields. Unverified records remain drafts. This protects Aigenvora from publishing an unsupported “we built this” claim while retaining all supplied research and content.

External revenue, customer, pricing, and usage numbers are time-sensitive. They must be source-linked, date-stamped, admin-editable, and hidden automatically when stale or contradicted. Project narratives may describe only facts visible in official sources or supplied by the owner; implementation details, stacks, roles, challenges, and outcomes must not be invented.

## Quality Strategy

The prompt uses creative gates because code-level acceptance lists did not prevent the earlier visual failures:

- Research gate: live Lusion study, current-build audit, portfolio source ledger, and asset-rights ledger.
- Art-direction gate: desktop and mobile storyboards plus representative light/dark frames before component work.
- Prototype gate: the homepage arrival, one transition, one service page, and one case-study page must prove the visual system.
- Page-completion gate: every public route receives a screenshot sequence and short interaction recording.
- Production gate: performance, accessibility, fallback, CMS, lead, security, and responsive tests.
- Fresh-eyes gate: an independent reviewer must understand Aigenvora’s offer, startup MVP service, proof, people, and next action from the scroll sequence alone.

## Safety and Rights

- Never include credentials in prompts, source control, screenshots, logs, or fixtures.
- Never download or reuse Lusion’s geometry, shaders, source code, fonts, project media, or audio.
- Generated and licensed assets require a provenance record and commercial-use rights.
- Aeonik and other commercial fonts may be used only when the owner supplies a valid license; otherwise use the specified licensed fallback.
- Existing credentials exposed in earlier prompt text must be rotated outside this deliverable.
- Repository-local instructions prohibiting GitHub pushes and Netlify deployment remain controlling unless the owner explicitly changes them.

## Deliverable Structure

The master prompt will contain:

- mission and operating contract;
- failure diagnosis and anti-template rules;
- mandatory live R&D outputs;
- brand, audience, positioning, and copy direction;
- exact technical architecture and migration boundaries;
- visual system, motion grammar, lighting, audio, and responsive behavior;
- route-by-route storyboards;
- the complete service taxonomy;
- portfolio candidate source ledger and case-study schema;
- testimonials and optional-video conditional behavior;
- CMS, media, leads, auth, security, analytics, and SEO requirements;
- implementation phases and creative checkpoints;
- testing, performance budgets, acceptance gates, handover, and final response contract.

## Self-Review

- No architecture ambiguity remains: this is a full Astro rebuild.
- The design is inspired by Lusion’s principles without requesting a clone.
- All twelve requested services and thirteen supplied project candidates are in scope.
- Every requested content surface is CMS-managed.
- Inner pages, mobile behavior, lighting, camera, motion, and 3D are explicit requirements.
- Ownership and time-sensitive proof are handled without fabricating claims.
- Secrets are explicitly excluded.
- The prompt requires visual evidence and owner approval before full implementation.

