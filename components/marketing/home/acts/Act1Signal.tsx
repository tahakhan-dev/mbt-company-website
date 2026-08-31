"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, EASE_OUT } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";
import { fieldState } from "@/lib/three/field-state";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroPoster } from "@/components/three/HeroVisual";
import { cn } from "@/lib/utils/format";

/**
 * ACT 1 — SIGNAL (01/07): pinned hero. The scroll scrubs the field's
 * chaos→lattice morph while the headline hands off to the lock-in claim
 * "Noise in. Growth out." (COPY-V2 §1). The warm CTA anchors bottom-left
 * for the whole act. Sticky positioning does the pinning (no pin-spacer);
 * every scrubbed property is transform/opacity (V2 motion law).
 * Mobile/reduced-motion: static hero, claim in normal flow — same narrative.
 */
export function Act1Signal({
  eyebrow,
  headline,
  subline,
  ctaHref,
}: {
  eyebrow: string;
  headline: string;
  subline: string;
  ctaHref: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const claimRef = useRef<HTMLDivElement>(null);
  const claimLineRef = useRef<HTMLSpanElement>(null);
  const claimCaptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current || !headlineRef.current) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const split = SplitText.create(headlineRef.current!, {
          type: "lines",
          mask: "lines",
          linesClass: "act1-line",
          autoSplit: true,
          aria: "auto",
        });
        gsap.from(split.lines, {
          yPercent: 112,
          duration: 1.05,
          ease: EASE_OUT,
          stagger: 0.09,
          delay: 0.1,
        });

        // Claim starts hidden only once JS owns the choreography (no-JS and
        // reduced-motion render it statically visible further down the act).
        gsap.set(claimRef.current, { autoAlpha: 1 });
        gsap.set(claimLineRef.current, { yPercent: 115 });
        gsap.set(claimCaptionRef.current, { autoAlpha: 0, y: 14 });

        const proxy = { p: 0 };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
          },
        });
        tl.to(
          proxy,
          {
            p: 1,
            duration: 0.55,
            onUpdate: () => {
              fieldState.progress = proxy.p;
            },
          },
          0,
        )
          .to(split.lines, { yPercent: -115, stagger: 0.035, duration: 0.15 }, 0.28)
          .to(introRef.current, { autoAlpha: 0, y: -26, duration: 0.1 }, 0.29)
          .to(claimLineRef.current, { yPercent: 0, duration: 0.16, ease: "power2.out" }, 0.42)
          .to(claimCaptionRef.current, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.52)
          // Hand the stage to Act 2's wipe with nothing left beneath it.
          .to(ctaRowRef.current, { autoAlpha: 0, y: 18, duration: 0.08 }, 0.88);

        return () => {
          split.revert();
          fieldState.progress = 0;
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      data-act="1"
      data-act-label="Signal"
      aria-label="Intro: what we do"
      className={cn("relative z-10", !reduced && "md:h-[280vh]")}
    >
      <div
        className={cn(
          "relative isolate flex min-h-[100dvh] flex-col justify-between px-5 pb-8 pt-32 md:px-10 md:pt-36 lg:px-16",
          !reduced && "md:sticky md:top-0 md:h-[100dvh]",
        )}
      >
        {/* Constellation backdrop pins WITH the act (the live canvas, where
            the GPU is real, draws over it from the fixed FieldStage). */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <HeroPoster />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-void/70" />
        </div>

        {/* Intro block */}
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1
            ref={headlineRef}
            className="mt-6 max-w-[14ch] text-balance font-display text-hero font-medium text-ink"
          >
            {headline}
          </h1>
          <div ref={introRef}>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ink-muted">{subline}</p>
          </div>
        </div>

        {/* Lock-in claim — overlays the stage on desktop, flows after on mobile */}
        <div
          ref={claimRef}
          className="pointer-events-none max-md:mt-20 md:absolute md:inset-0 md:grid md:place-items-center"
        >
          <div className="text-left md:text-center">
            <span className="block overflow-hidden">
              <span
                ref={claimLineRef}
                className="block font-display text-display font-medium text-ink"
              >
                Noise in. <span className="text-gradient-aurora">Growth out.</span>
              </span>
            </span>
            <p
              ref={claimCaptionRef}
              className="mt-5 font-mono text-[0.8125rem] uppercase tracking-[0.18em] text-ink-faint"
            >
              This is what we do with operational chaos
            </p>
          </div>
        </div>

        {/* Persistent anchor row: the ONE warm CTA + its ghost pair, nothing
            else (hero stack discipline: eyebrow, headline, subtext, CTAs) */}
        <div
          ref={ctaRowRef}
          className="relative z-10 mt-14 flex flex-wrap items-center gap-4 md:mt-0"
        >
          <Button href={ctaHref} size="lg" cta="hero">
            Book a 5-minute growth call
          </Button>
          <Button href="/work" variant="ghost" size="lg" cta="hero-secondary">
            See the work
          </Button>
        </div>
      </div>
    </section>
  );
}
