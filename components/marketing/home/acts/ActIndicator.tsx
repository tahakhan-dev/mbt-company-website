"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion, useScrollTo } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils/format";

type ActInfo = { index: number; label: string; el: HTMLElement };

/**
 * The narrative position indicator (DESIGN-SPEC-V2 §5, T12/T13): a thin
 * left rail on desktop — 7 ticks, the current act numeral and label — and a
 * 2px top progress bar on mobile. Progress animates via transform only.
 * Decorative (aria-hidden rail) with an SR-only live region announcing act
 * changes; hidden entirely under reduced motion.
 */
export function ActIndicator() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [acts, setActs] = useState<ActInfo[]>([]);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      if (reduced) return;
      // Direct document query: this useGSAP context is scoped to rootRef (the
      // rail itself), and scoped selector resolution can never see the act
      // sections outside it — gsap.utils.toArray("[data-act]") returns [].
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-act]"));
      if (sections.length === 0) return;
      setActs(
        sections.map((el, i) => ({
          index: i,
          label: el.dataset.actLabel ?? `Act ${i + 1}`,
          el,
        })),
      );

      const triggers = sections.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        }),
      );

      // Page progress (scaleY on desktop rail, scaleX on the mobile bar).
      const tweens: gsap.core.Tween[] = [];
      for (const [el, prop] of [
        [fillRef.current, "scaleY"],
        [barRef.current, "scaleX"],
      ] as const) {
        if (!el) continue;
        gsap.set(el, { [prop]: 0 });
        tweens.push(
          gsap.to(el, {
            [prop]: 1,
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "max",
              scrub: 0.4,
            },
          }),
        );
      }

      return () => {
        triggers.forEach((t) => t.kill());
        tweens.forEach((t) => t.scrollTrigger?.kill());
      };
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  if (reduced) return null;
  const current = acts[active];

  return (
    <div ref={rootRef}>
      {/* Mobile: hairline progress bar */}
      <div
        className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent md:hidden"
        aria-hidden="true"
      >
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-gradient-to-r from-aurora-cyan via-aurora-teal to-aurora-violet"
        />
      </div>

      {/* Desktop: act rail */}
      <div
        className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
        aria-hidden="true"
      >
        <span className="font-mono text-[0.625rem] tabular-nums tracking-[0.2em] text-ink-faint">
          {String(active + 1).padStart(2, "0")}
        </span>
        <div className="relative h-44 w-px bg-hairline-strong">
          <div
            ref={fillRef}
            className="absolute inset-x-0 top-0 h-full origin-top bg-aurora-teal"
          />
          <div className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 flex-col justify-between py-0.5">
            {acts.map((act) => (
              <button
                key={act.index}
                type="button"
                tabIndex={-1}
                onClick={() => scrollTo(act.el, act.index === 0 ? 0 : -1)}
                title={act.label}
                className={cn(
                  "size-[7px] rounded-full ring-1 ring-hairline-strong transition-colors duration-300 ease-swift",
                  act.index <= active ? "bg-aurora-teal" : "bg-void hover:bg-bezel-hover",
                )}
              />
            ))}
          </div>
        </div>
        <span
          className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-ink-faint"
          style={{ writingMode: "vertical-rl" }}
        >
          {current?.label ?? ""}
        </span>
      </div>

      {/* SR announcement of narrative position */}
      <p className="sr-only" aria-live="polite">
        {current ? `Act ${active + 1} of ${acts.length}: ${current.label}` : ""}
      </p>
    </div>
  );
}
