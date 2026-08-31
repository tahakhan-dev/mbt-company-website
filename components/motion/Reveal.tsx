"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE_OUT } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";

type Variant = "rise" | "mask" | "scale";

/**
 * Scroll-entrance for content blocks. V2 motion law: transform / opacity /
 * clip-path only — the V1 blur-filter entrance is gone (AUDIT-V1 §1).
 * Server HTML stays visible (no-JS and reduced-motion safe); GSAP takes over
 * only just before animating.
 */
const FROM: Record<Variant, gsap.TweenVars> = {
  rise: { y: 44, opacity: 0 },
  mask: { clipPath: "inset(0 0 96% 0)", y: 22 },
  scale: { scale: 0.96, opacity: 0, transformOrigin: "50% 62%" },
};
const TO: Record<Variant, gsap.TweenVars> = {
  rise: { y: 0, opacity: 1, duration: 0.85 },
  mask: { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.95 },
  scale: { scale: 1, opacity: 1, duration: 0.7 },
};

export function Reveal({
  children,
  className,
  variant = "rise",
  stagger = 0,
  delay = 0,
  y,
  once = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** Stagger direct children instead of animating the wrapper as one. */
  stagger?: number;
  delay?: number;
  /** Override the rise distance (rise/mask variants). */
  y?: number;
  /**
   * Default false: the entrance REVERSES when the user scrolls back above
   * the trigger, so the whole story plays backward on scroll-up (V2 motion
   * contract). Pass true only for one-shot cases (e.g. LCP-critical hero).
   */
  once?: boolean;
  as?: "div" | "section" | "ul" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const targets = stagger > 0 ? Array.from(ref.current.children) : [ref.current];
      if (targets.length === 0) return;
      const from = { ...FROM[variant], ...(y !== undefined ? { y } : null) };
      const to = TO[variant];
      gsap.fromTo(targets, from, {
        ...to,
        delay,
        ease: EASE_OUT,
        stagger,
        // No clearProps: the tween must stay alive so scrolling back up can
        // reverse it; reversible reveals keep their transforms.
        ...(once ? { clearProps: "transform,opacity,clipPath" } : null),
        scrollTrigger: {
          trigger: ref.current,
          start: "top 86%",
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      });
    },
    { scope: ref, dependencies: [reduced, variant, once] },
  );

  const TagName = Tag as "div";
  return (
    <TagName ref={ref} className={className}>
      {children}
    </TagName>
  );
}

/**
 * Batched entrance for grids/lists (V2 §7): ONE ScrollTrigger.batch over all
 * `[data-reveal-item]` descendants instead of a trigger per card.
 */
export function RevealGroup({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const items = ref.current.querySelectorAll<HTMLElement>("[data-reveal-item]");
      if (items.length === 0) return;
      gsap.set(items, { y: 40, opacity: 0 });
      ScrollTrigger.batch(Array.from(items), {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, ease: EASE_OUT, stagger: 0.08 }),
        // Scroll-up reverses the entrance (V2 bidirectional motion contract).
        onLeaveBack: (batch) =>
          gsap.to(batch, { y: 40, opacity: 0, duration: 0.5, ease: EASE_OUT, stagger: 0.05 }),
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  const TagName = Tag as "div";
  return (
    <TagName ref={ref} className={className}>
      {children}
    </TagName>
  );
}
