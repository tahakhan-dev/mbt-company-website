"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/components/motion/MotionProvider";

/**
 * Pointer tilt (T3, restrained): rotates a card toward the pointer within
 * ±maxDeg, rAF-driven transforms only — no setState per move, springs back
 * on leave. Decorative: disabled under reduced motion and on touch.
 */
export function TiltCard({
  children,
  className,
  maxDeg = 3,
}: {
  children: ReactNode;
  className?: string;
  maxDeg?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let running = false;

    const tick = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      el.style.transform = `perspective(900px) rotateX(${curY.toFixed(3)}deg) rotateY(${curX.toFixed(3)}deg)`;
      if (Math.abs(curX - targetX) > 0.01 || Math.abs(curY - targetY) > 0.01) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        if (targetX === 0 && targetY === 0) el.style.transform = "";
      }
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2 * maxDeg;
      targetY = -((e.clientY - r.top) / r.height - 0.5) * 2 * maxDeg;
      start();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [reduced, maxDeg]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
