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
      // Count in the target's own precision (4.9 never flashes as 5), and
      // reset on scroll-up so the count replays with the story (V2
      // bidirectional motion contract).
      const decimals = Number.isInteger(value) ? 0 : 1;
      gsap.to(state, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "restart none none reset",
        },
        onStart: () => {
          el.textContent = `0${suffix}`;
        },
        onUpdate: () => {
          el.textContent = `${state.n.toFixed(decimals)}${suffix}`;
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
