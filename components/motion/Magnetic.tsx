"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/components/motion/MotionProvider";

/**
 * Magnetic hover: children drift toward the pointer with critically-damped
 * spring physics. Runs on a rAF loop with direct transforms — zero React
 * state, zero library weight in the critical path.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let raf = 0;
    let running = false;
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    function tick() {
      // Spring toward target (stiffness/damping tuned to feel like a light magnet).
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      el!.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0)`;
      if (Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.1 || target.x !== 0 || target.y !== 0) {
        raf = requestAnimationFrame(tick);
      } else {
        el!.style.transform = "";
        running = false;
      }
    }
    function ensureLoop() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    }
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = el!.getBoundingClientRect();
      target.x = (e.clientX - rect.left - rect.width / 2) * strength;
      target.y = (e.clientY - rect.top - rect.height / 2) * strength;
      ensureLoop();
    }
    function onLeave() {
      target.x = 0;
      target.y = 0;
      ensureLoop();
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [reduced, strength]);

  return (
    <div ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
