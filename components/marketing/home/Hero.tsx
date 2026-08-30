"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";
import { fieldState } from "@/lib/three/field-state";
import { HeroVisual } from "@/components/three/HeroVisual";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

type HeroProps = {
  eyebrow: string;
  headline: string;
  subline: string;
  trustLine: string;
  ctaHref: string;
};

/**
 * Hero: split editorial layout over the Signal Field. The section is 170vh
 * with a sticky viewport — scrolling morphs the field (chaos → lattice)
 * while the copy parallax-exits. Reduced motion: plain 100dvh hero.
 */
export function Hero({ eyebrow, headline, subline, trustLine, ctaHref }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) {
        fieldState.progress = 0;
        return;
      }
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          fieldState.progress = self.progress;
        },
      });
      const exit = gsap.to(copyRef.current, {
        yPercent: -18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "28% top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      return () => {
        st.kill();
        exit.scrollTrigger?.kill();
        exit.kill();
      };
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className={reduced ? "relative" : "relative h-[170vh]"}
      aria-label="Intro"
    >
      <div
        className={
          reduced
            ? "relative flex min-h-[100dvh] items-center overflow-hidden"
            : "sticky top-0 flex h-[100dvh] items-center overflow-hidden"
        }
      >
        <HeroVisual />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8">
          <div ref={copyRef} className="max-w-4xl pt-20 md:pt-10">
            <Reveal y={20}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <SplitReveal
              as="h1"
              mode="load"
              delay={0.15}
              disableBelow={768}
              className="mt-6 max-w-3xl font-display text-hero font-medium text-balance"
            >
              {headline}
            </SplitReveal>
            <Reveal y={36} delay={0.55}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
                {subline}
              </p>
            </Reveal>
            <Reveal y={36} delay={0.7}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href={ctaHref} size="lg" cta="hero-primary">
                  Book a free AI strategy call
                </Button>
                <Button href="/work" variant="ghost" size="lg" cta="hero-secondary">
                  See our work
                </Button>
              </div>
            </Reveal>
            <Reveal y={24} delay={0.85}>
              <p className="mt-10 font-mono text-xs uppercase tracking-[0.22em] text-ink-faint">
                {trustLine}
              </p>
            </Reveal>
          </div>
        </div>

        {!reduced && (
          <div
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ink-faint"
            aria-hidden="true"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
              <span className="block h-8 w-px bg-gradient-to-b from-ink-faint to-transparent" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
