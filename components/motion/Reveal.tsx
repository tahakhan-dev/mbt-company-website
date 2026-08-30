"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, EASE_OUT } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";

/**
 * Scroll-entrance for content blocks: rise + de-blur + fade, staggered over
 * direct children when `stagger` is set. Server HTML stays visible (no-JS
 * and reduced-motion safe); GSAP hides elements only just before animating.
 */
export function Reveal({
  children,
  className,
  stagger = 0,
  delay = 0,
  y = 56,
  once = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Stagger direct children instead of animating the wrapper as one. */
  stagger?: number;
  delay?: number;
  y?: number;
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
      gsap.fromTo(
        targets,
        { y, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          delay,
          ease: EASE_OUT,
          stagger,
          clearProps: "filter,transform,opacity",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 86%",
            once,
          },
        },
      );
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
