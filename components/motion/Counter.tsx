"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";

/** Counts up once when scrolled into view. Server HTML shows the final value. */
export function Counter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;
      const state = { n: 0 };
      gsap.to(state, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onStart: () => {
          el.textContent = `0${suffix}`;
        },
        onUpdate: () => {
          el.textContent = `${Math.round(state.n)}${suffix}`;
        },
        onComplete: () => {
          el.textContent = `${value}${suffix}`;
        },
      });
    },
    { scope: ref, dependencies: [reduced, value, suffix] },
  );

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
