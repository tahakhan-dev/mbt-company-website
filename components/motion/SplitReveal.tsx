"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, EASE_OUT } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";

/**
 * Masked line reveal for headlines (SplitText). Lines rise out of an
 * overflow mask with stagger — the signature reveal grammar of the site.
 * `mode="load"` plays immediately (hero); default plays on scroll into view.
 */
export function SplitReveal({
  children,
  className,
  as = "h2",
  mode = "scroll",
  delay = 0,
  disableBelow = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  mode?: "scroll" | "load";
  delay?: number;
  /** Skip splitting under this viewport width (mobile LCP protection). */
  disableBelow?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;
      if (disableBelow > 0 && window.innerWidth < disableBelow) return;

      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        aria: "auto",
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.05,
            ease: EASE_OUT,
            stagger: 0.09,
            delay,
            ...(mode === "scroll"
              ? {
                  // Reverses on scroll-up: the story plays backward too
                  // (V2 bidirectional motion contract).
                  scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none reverse",
                  },
                }
              : {}),
          }),
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [reduced, mode, disableBelow] },
  );

  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}
