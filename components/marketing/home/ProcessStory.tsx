"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Bezel } from "@/components/ui/Bezel";
import { cn } from "@/lib/utils/format";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    time: "week 1–2",
    detail:
      "A strategy call, then a short discovery sprint against your real data and constraints.",
    deliverables: ["Scoped roadmap", "Architecture proposal", "Fixed quote for v1"],
  },
  {
    n: "02",
    title: "Design",
    time: "week 2–4",
    detail:
      "Flows, design system, and a clickable prototype — validated with users before we commit budget.",
    deliverables: ["UX flows & prototype", "Design system tokens", "Eval criteria for AI features"],
  },
  {
    n: "03",
    title: "Build",
    time: "week 3–8",
    detail:
      "Senior engineers ship production-grade increments weekly, feature-flagged into a live environment.",
    deliverables: ["Weekly shippable demos", "Tests + CI/CD", "Observability from day one"],
  },
  {
    n: "04",
    title: "Ship",
    time: "week 8–10",
    detail:
      "Launch with rollout plans, load checks, and analytics wired to the metric the release exists to move.",
    deliverables: ["Production launch", "Runbooks & docs", "Team handover session"],
  },
  {
    n: "05",
    title: "Scale",
    time: "ongoing",
    detail:
      "Iterate from evidence: eval scores, usage data, and cost curves decide what earns its way in next.",
    deliverables: ["Monthly product team", "Quality & cost dashboards", "Roadmap reviews"],
  },
] as const;

/**
 * The Apple-storytelling beat: on desktop the left rail (headline + progress
 * line + step index) pins while steps scrub past on the right. Collapses to
 * a plain stacked list on mobile / reduced motion (same DOM).
 */
export function ProcessStory() {
  const rootRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]");

        gsap.to(lineRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 20%",
            end: "bottom 80%",
            scrub: true,
          },
        });

        for (const step of steps) {
          gsap.fromTo(
            step,
            { opacity: 0.18, y: 44, filter: "blur(3px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "none",
              scrollTrigger: {
                trigger: step,
                start: "top 78%",
                end: "top 45%",
                scrub: true,
              },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section ref={rootRef} className="relative py-28 md:py-40" aria-label="How we work">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <div ref={railRef} className="lg:sticky lg:top-28">
            <Eyebrow>Signature process</Eyebrow>
            <SplitReveal
              as="h2"
              className="mt-5 max-w-md font-display text-display font-medium text-balance"
            >
              A system that turns ideas into shipped product.
            </SplitReveal>
            <p className="mt-6 max-w-sm leading-relaxed text-ink-muted">
              Five beats, each with named deliverables and timeframes. You always know what
              exists, what is next, and what it costs.
            </p>
            <div className="mt-10 hidden gap-4 lg:flex" aria-hidden="true">
              <div className="relative h-40 w-px overflow-hidden bg-white/10">
                <div
                  ref={lineRef}
                  className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-aurora-cyan to-aurora-violet"
                />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint [writing-mode:vertical-rl]">
                Discover → Scale
              </p>
            </div>
          </div>
        </div>

        <ol className="flex flex-col gap-10 lg:gap-24">
          {STEPS.map((step) => (
            <li key={step.n} data-process-step className="lg:min-h-[30vh]">
              <Bezel glow innerClassName="p-7 md:p-9">
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    className="font-mono text-sm text-transparent"
                    style={{
                      WebkitTextStroke: "1px rgba(94,234,212,0.55)",
                      fontSize: "2.4rem",
                    }}
                    aria-hidden="true"
                  >
                    {step.n}
                  </span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink-faint">
                    {step.time}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-medium md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-lg leading-relaxed text-ink-muted">{step.detail}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {step.deliverables.map((d) => (
                    <li
                      key={d}
                      className={cn(
                        "rounded-full bg-white/[0.04] px-3 py-1.5 font-mono text-[0.68rem]",
                        "uppercase tracking-[0.14em] text-ink-muted ring-1 ring-white/10",
                      )}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </Bezel>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
