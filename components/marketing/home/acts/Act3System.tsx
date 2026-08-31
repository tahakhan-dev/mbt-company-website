"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion, useScrollTo } from "@/components/motion/MotionProvider";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn } from "@/lib/utils/format";

/** Lean act-3 payload assembled by the server page — never full docs. */
export type Act3Service = {
  slug: string;
  name: string;
  short: string;
  iconKey: string;
  metric: string;
  chips: string[];
};

/**
 * ACT 3 — THE SYSTEM (03/07): pinned stacked deck of the TEN services
 * (T22 grammar, T13 index-as-UI). Scroll scrubs the deck — the top card
 * exits up with a slight rotation, the next promotes; a 10-tick rail shows
 * and drives position (clickable through Lenis). Left column swaps the
 * active service's one-liner + before→after micro-metric.
 * Mobile & reduced motion: a static vertical list — same ten services.
 */
export function Act3System({ services }: { services: Act3Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const reduced = useReducedMotion();
  const scrollTo = useScrollTo();
  const count = services.length;

  useGSAP(
    () => {
      if (reduced || !sectionRef.current || !deckRef.current || count === 0) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-deck-card]", deckRef.current!);

        // Initial stack: active + two peeking behind.
        cards.forEach((card, i) => {
          gsap.set(card, {
            y: i === 0 ? 0 : i === 1 ? 18 : i === 2 ? 36 : 48,
            scale: i === 0 ? 1 : i === 1 ? 0.965 : i === 2 ? 0.93 : 0.9,
            autoAlpha: i === 0 ? 1 : i === 1 ? 0.85 : i === 2 ? 0.5 : 0,
            zIndex: count - i,
            transformOrigin: "50% 100%",
            pointerEvents: i === 0 ? "auto" : "none",
          });
        });

        // Scrub-driven UI updates go straight to the DOM — a React re-render
        // of the ten-card deck per index change caused 200ms+ style-recalc
        // storms at 4× CPU (Gate S bisect).
        const readout = readoutRef.current;
        const idxEl = readout?.querySelector<HTMLElement>("[data-readout-idx]");
        const shortEl = readout?.querySelector<HTMLElement>("[data-readout-short]");
        const metricEl = readout?.querySelector<HTMLElement>("[data-readout-metric]");
        const ticks = gsap.utils.toArray<HTMLElement>("[data-rail-tick]", sectionRef.current!);

        const applyActive = (idx: number) => {
          if (activeRef.current === idx) return;
          activeRef.current = idx;
          const s = services[idx]!;
          if (idxEl) idxEl.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
          if (shortEl) shortEl.textContent = s.short;
          if (metricEl) metricEl.textContent = s.metric;
          if (readout) {
            gsap.fromTo(readout, { autoAlpha: 0.4, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
          }
          cards.forEach((card, i) => {
            card.style.pointerEvents = i === idx ? "auto" : "none";
          });
          ticks.forEach((tick, i) => tick.classList.toggle("bg-aurora-teal", i <= idx));
        };

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 0.85 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.75,
            onUpdate: (self) => {
              applyActive(Math.min(count - 1, Math.round(self.progress * (count - 1))));
            },
          },
        });

        for (let s = 0; s < count - 1; s++) {
          tl.to(cards[s]!, { y: "-16%", rotation: -1.8, autoAlpha: 0 }, s);
          tl.to(cards[s + 1]!, { y: 0, scale: 1, autoAlpha: 1, rotation: 0 }, s);
          if (cards[s + 2]) tl.to(cards[s + 2]!, { y: 18, scale: 0.965, autoAlpha: 0.85 }, s);
          if (cards[s + 3]) tl.to(cards[s + 3]!, { y: 36, scale: 0.93, autoAlpha: 0.5 }, s);
        }
        if (fillRef.current) {
          gsap.set(fillRef.current, { scaleY: 1 / count, transformOrigin: "top" });
          tl.to(fillRef.current, { scaleY: 1, ease: "none", duration: count - 1 }, 0);
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduced, count] },
  );

  function jumpTo(i: number) {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const scrollable = el.offsetHeight - window.innerHeight;
    scrollTo(top + (i / Math.max(1, count - 1)) * scrollable + 2);
  }

  const first = services[0];

  return (
    <section
      ref={sectionRef}
      data-act="3"
      data-act-label="The system"
      aria-label="Services: ten ways we take work off your plate"
      className={cn("relative z-10", !reduced && "md:h-[560vh]")}
    >
      <div className={cn(!reduced && "md:sticky md:top-0 md:flex md:h-[100dvh] md:items-center")}>
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-24 md:grid-cols-[1fr_1.2fr] md:gap-10 md:px-10 md:py-0 lg:px-16">
          {/* Left: act header + live index (desktop) */}
          <div className="flex flex-col justify-center">
            <h2 className="max-w-[16ch] text-balance font-display text-display font-medium text-ink">
              Ten ways we take work off your plate.
            </h2>
            <p className="mt-5 max-w-md text-ink-muted">
              Every line below is a system we design, ship, and measure. Each one is chosen to
              return hours first and compound from there.
            </p>

            {/* Live readout — desktop deck only; content mutated via refs
                during the scrub (never a React re-render per frame) */}
            {!reduced && first && (
              <div ref={readoutRef} className="mt-10 hidden md:block">
                <p
                  data-readout-idx
                  className="font-mono text-sm tabular-nums tracking-[0.2em] text-ink-faint"
                >
                  01 / {String(count).padStart(2, "0")}
                </p>
                <p
                  data-readout-short
                  className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-ink-muted"
                >
                  {first.short}
                </p>
                <p
                  data-readout-metric
                  className="mt-3 font-mono text-[0.8125rem] uppercase tracking-[0.14em] text-aurora-teal"
                >
                  {first.metric}
                </p>
              </div>
            )}
          </div>

          {/* Right: the deck (desktop) / static list (mobile + reduced) */}
          <div className="relative">
            {/* Rail */}
            {!reduced && (
              <div className="absolute -left-8 top-1/2 hidden h-64 -translate-y-1/2 md:block" aria-hidden={false}>
                <div className="relative mx-auto h-full w-px bg-hairline-strong">
                  <div
                    ref={fillRef}
                    className="absolute inset-x-0 top-0 h-full origin-top bg-aurora-teal"
                    aria-hidden="true"
                  />
                </div>
                <div className="absolute inset-y-0 -left-2 flex flex-col justify-between">
                  {services.map((s, i) => (
                    <button
                      key={s.slug}
                      type="button"
                      data-rail-tick
                      onClick={() => jumpTo(i)}
                      aria-label={`Go to service ${i + 1}: ${s.name}`}
                      className={cn(
                        "size-[9px] rounded-full ring-1 ring-hairline-strong transition-colors duration-300 ease-swift hover:bg-bezel-hover",
                        i === 0 && "bg-aurora-teal",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            <div
              ref={deckRef}
              className={cn(
                "blueprint-grid rounded-[2.5rem] p-4 md:p-8",
                reduced ? "" : "md:relative md:h-[600px]",
              )}
            >
              {services.map((s, i) => (
                <article
                  key={s.slug}
                  data-deck-card
                  className={cn(
                    "bg-bezel p-1.5 ring-1 ring-hairline soft-shadow rounded-[2rem]",
                    "max-md:mb-4",
                    !reduced && "md:absolute md:inset-x-8 md:top-1/2 md:h-[490px] md:-translate-y-1/2 md:will-change-transform",
                  )}
                >
                  <div className="flex h-full flex-col justify-between rounded-[calc(2rem-0.375rem)] bg-surface inner-glow p-7 md:p-9">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <span className="grid size-12 place-items-center rounded-2xl bg-bezel ring-1 ring-hairline">
                          <ServiceIcon iconKey={s.iconKey} className="size-6" />
                        </span>
                        <span className="font-mono text-sm tabular-nums tracking-[0.18em] text-ink-faint">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mt-6 font-display text-title font-medium text-ink">{s.name}</h3>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted md:line-clamp-2">
                        {s.short}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {s.chips.map((chip) => (
                          <li
                            key={chip}
                            className="rounded-full bg-bezel px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted ring-1 ring-hairline"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-hairline pt-5">
                      <p className="font-mono text-[0.8125rem] tracking-[0.06em] text-aurora-teal">
                        {s.metric}
                      </p>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group inline-flex items-center gap-1.5 text-sm text-ink transition-colors duration-300 ease-swift hover:text-aurora-teal"
                      >
                        Explore
                        <ArrowUpRight
                          weight="bold"
                          className="size-3.5 transition-transform duration-300 ease-swift group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
