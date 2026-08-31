"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";

/**
 * ACT 2 — WHY WE EXIST (02/07): type-only manifesto (T9). The panel enters
 * as an angular clip-path wipe over the pinned hero (T1 — zentry grammar),
 * then each line "illuminates" word by word as it crosses the read zone:
 * a per-line scrub raising word opacity 0.22 → 1 with an overlapping stagger.
 * Opacity floor 0.22 is decorative-scan-safe — illumination completes before
 * the line reaches reading position (DESIGN-SPEC-V2 Act 2).
 * Copy: COPY-V2 §3. Mobile/reduced: fully lit, no wipe — same words.
 */
const LINES: Array<Array<string | { gradient: string }>> = [
  ["Every", "business", "we", "meet", "is", "busier", "than", "it", "should", "be."],
  ["Not", "because", "the", "work", "is", "hard.", "Because", "the", "work", "is", "manual."],
  ["Software", "was", "supposed", "to", "fix", "this.", "Mostly,", "it", "added", "tabs."],
  ["So", "we", "build", "systems", "that", "do", "the", "work:", "answer,", "route,", "reconcile,", "report."],
  ["The", "hours", "come", "back.", { gradient: "The hours become growth." }],
];

export function Act2Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current || !panelRef.current) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // T1 — angular wipe over the hero's final pinned frame.
        gsap.fromTo(
          panelRef.current,
          { clipPath: "polygon(12% 0%, 76% 0%, 90% 92%, 0% 96%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 96%",
              end: "top 18%",
              scrub: 0.7,
            },
          },
        );
      });

      // Line illumination — all viewports except reduced motion. Two-layer
      // words: the always-visible base is ink-faint (AA on both themes), the
      // full-ink overlay's OPACITY scrubs 0→1. Every state a contrast auditor
      // can sample passes; the animated property stays opacity-only.
      // No-JS and reduced motion render the overlays at full opacity (lit).
      const lines = gsap.utils.toArray<HTMLElement>("[data-manifesto-line]", sectionRef.current);
      for (const line of lines) {
        const lit = line.querySelectorAll<HTMLElement>("[data-word-lit]");
        gsap.fromTo(
          lit,
          { opacity: 0 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: { trigger: line, start: "top 82%", end: "top 46%", scrub: 0.6 },
          },
        );
      }

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      data-act="2"
      data-act-label="Why we exist"
      aria-label="Why we exist"
      className="relative z-20 md:-mt-[100dvh]"
    >
      <div
        ref={panelRef}
        className="bg-void px-5 py-32 ring-1 ring-hairline md:rounded-t-[3rem] md:px-10 md:py-44 lg:px-16"
      >
        {/* Type-only chapter (T9): the manifesto needs no label — the act
            rail carries the wayfinding, the words carry the composition. */}
        <div className="mx-auto max-w-4xl border-l border-hairline-strong pl-8 md:pl-14">
          <div className="space-y-9">
            {LINES.map((line, i) => (
              <p
                key={i}
                data-manifesto-line
                className="max-w-[26ch] font-display text-manifesto font-medium text-ink"
              >
                {line.map((word, j) => {
                  const text = typeof word === "string" ? word : word.gradient;
                  const litClass =
                    typeof word === "string" ? "text-ink" : "text-gradient-aurora";
                  return (
                    <span key={j} className="inline">
                      <span className="relative inline-block">
                        <span className="text-ink-faint">{text}</span>
                        <span
                          data-word-lit
                          aria-hidden="true"
                          className={`absolute inset-0 ${litClass}`}
                        >
                          {text}
                        </span>
                      </span>{" "}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
