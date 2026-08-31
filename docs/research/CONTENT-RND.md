# Content R&D — how top agency sites structure their content

**Date:** 2026-09-01 · **Method:** WebFetch of live sites; Lusion findings reused from the
existing browser study (`LUSION-LIVE-RND.md`, 2026-08-31). Sites reviewed: lusion.co,
basement.studio, thoughtbot.com, evilmartians.com, netguru.com, wandr.studio.

## Patterns worth adopting

1. **Outcome-first proof headlines** (basement.studio, WANDR). Case studies lead with the
   business result as the headline — "sold out inventory in hours", "Cinepolis +25% ticket
   sales" — with the design work demoted to supporting evidence. *For us:* every Work card
   leads with the verified outcome line, never the tech stack. Where no verified number
   exists, the outcome stays capability-shaped ("bookings confirmed while the owner sleeps"),
   which our copy deck already mandates.

2. **Client + quantified result as a single unit** (Evil Martians, Netguru). Proof is never a
   bare logo wall: "bolt.new scaled to 3M+ MAU and grew ARR to $40M in 5 months." The pairing
   of a name with a sourced number is what converts. *For us:* the portfolio metrics
   (IH/product-site figures) should render as labeled, sourced chips next to each product —
   sourcing is the credibility, so show it, don't hide it.

3. **A named process with few phases** (thoughtbot "Shaping Sprints", WANDR's five-phase
   Discover→Measure). Naming the process turns methodology into a product people can ask for,
   and both keep it to 4–5 phases framed as flexible, not rigid. *For us:* our 4-step PROCESS
   (Map → Design → Build → Operate) deserves a name and its own anchor section on service pages.

4. **FAQ as positioning, not troubleshooting** (Evil Martians, WANDR). The best FAQs answer
   "who should hire us, what does it cost to run, what happens when it breaks" — extended
   positioning disguised as questions. WANDR's six collapsed questions cover pricing, legacy
   systems and AI UX. *For us:* our per-service FAQs already do this; extend the pattern to
   About and MVP pages (engagement model, ownership, post-launch).

5. **Engagement models listed as products** (thoughtbot: time-boxed sprint vs. embedded team
   augmentation; Netguru: dedicated teams / staff augmentation / delivery center; Evil
   Martians goes furthest with open pricing at $7,000/week per consultant). Making "how you
   can hire us" a first-class page removes the biggest unspoken question. *For us:* a short
   "Ways to work with us" block — project build / MVP sprint / managed cover — on About and
   Contact. Publish pricing only if the owner approves; the structure works without it.

6. **Embedding language beats partnership language** (Evil Martians: "Your repo, your Slack,
   your stand-ups"). Concrete collaboration mechanics out-persuade abstract partner talk.
   *For us:* Ch.8 People already leans this way ("one channel, short loops, working software
   every week") — push further with repo/infra ownership specifics.

7. **Whisper-or-shout typography as voice** (Lusion). Tiny uppercase mono meta labels against
   enormous display heads, no middle register; copy stays short enough to coexist with motion,
   and there is exactly one warm CTA per screen. Already our design law — the content
   implication is that every section needs a 3–8 word mono eyebrow and a head under ~12 words.

8. **Journey-stage service taxonomy** (Netguru). Services framed as lifecycle stages
   (ideation → design → build → support), each stage carrying its own case studies, so a buyer
   enters at their moment of need. *For us:* cross-link each of the 12 services to its
   portfolio products (the `serviceSlug` mapping) so every service page carries proof.

## Anti-patterns observed (avoid)

- **Unsourced stat strips** — round numbers with no attribution ("50% efficiency gains")
  read as decoration and invite fact-checking. Ours stay sourced or structural.
- **Category-generic tone** — "we create the extraordinary" (basement) works with their
  visuals but says nothing; our banned-word list already covers this failure mode.
- **Service sprawl** — Netguru's tech-specific sub-pages (React, AWS, Kubernetes…) are an SEO
  play requiring a content team; at our size, 12 deep pages beat 60 thin ones.
