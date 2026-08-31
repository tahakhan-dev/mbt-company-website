# Gate N — fresh-context narrative read (V2 home)

Method: 15 viewport screenshots of one continuous wheel-driven scroll through
`/` (desktop 1440×900, dark), captured after the act-indicator fix. A
fresh-context subagent saw ONLY the screenshots (no code, no docs, no brief)
and had to answer the six visitor questions. Frames: scratch capture set
regenerated per run; the answer key is DESIGN-SPEC-V2 §0's reading spine.

## Verdict: **NARRATIVE: PASS** (all six answered correctly)

1. **What do they do?** "An AI Systems Studio — designs, ships, and measures
   AI and automation systems"; named the deck's services (chatbots, BPA,
   e-commerce, data, fintech, cloud, design).
2. **Why do they exist?** Quoted the manifesto: "busier than it should be…
   Not because the work is hard. Because the work is manual." → hours → growth.
3. **How does it grow my business?** Read Act 4 exactly as designed: "my week
   changing from ticket queues… to all systems running", cited "40+ hours
   back", 24/7 orders, one screen, and per-service metric shifts.
4. **What proof?** The three case rows with their metrics + the counters
   (systems shipped, industries, partner score). Flagged that cases are
   anonymized/confidential — accepted trade-off of the sample-content
   mandate (real logos/names are the owner's to add via the admin).
5. **Who are they?** "Small team. Senior hands. No handoffs." + named the
   founder and AI lead from the team tiles.
6. **Next step?** "Book a 5-minute growth call… bring your worst bottleneck…
   before the call ends you'll know which system, what it costs, what it
   returns", including the FAQ's four-to-five-figure anchor and 4–8 week
   timeline.

## Polish flags raised by the judge (dispositions)

- **`hello@example.com` footer email** — seeded sample setting (RFC-reserved
  domain, deliberately safe). Owner must set the real address in
  Admin → Settings before launch; called out in the handover notes.
- **"4.0/5 partner score"** — screenshot froze the counter mid-count; the
  served value is 4.9 (verified in the HTML payload). No change.
- **Anonymized proof** — inherent to `sample: true` fictional content; the
  admin CMS exists precisely so the owner replaces these with real cases.

## Bug found by this gate (fixed before the judged run)

The sitewide act indicator was dead on every interactive load: it resolved
`[data-act]` through its scoped GSAP context (which can never see the act
sections outside its own subtree), so it early-returned — numeral stuck at
`01`, no dots, no labels, no `aria-live` announcements, and the progress
fill was an unstyled full-height bar. Fixed with a direct `document` query;
probe verified 01→03→04→06 with correct labels and SR announcements at
0/30/55/85% scroll depths.
