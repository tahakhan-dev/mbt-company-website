"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/components/motion/MotionProvider";
import { hashSeed } from "@/lib/covers/palette";
import { cn } from "@/lib/utils/format";

const SignalField = dynamic(() => import("@/components/three/SignalField"), {
  ssr: false,
});

/** Static constellation poster — always rendered under (or instead of) WebGL. */
export function HeroPoster({ className }: { className?: string }) {
  const dots = Array.from({ length: 46 }, (_, i) => {
    const n = hashSeed(`poster:${i}`);
    return {
      x: 4 + (n % 92),
      y: 6 + ((n >>> 6) % 88),
      r: 0.9 + ((n >>> 12) % 16) / 10,
      o: 0.25 + ((n >>> 16) % 50) / 100,
    };
  });
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div
        className="aurora-orb animate-aurora left-[30%] top-[8%] h-[46rem] w-[46rem]"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.13), transparent 65%)" }}
      />
      <div
        className="aurora-orb animate-orb right-[-6%] top-[30%] h-[38rem] w-[38rem]"
        style={{ background: "radial-gradient(circle, rgba(129,140,248,0.14), transparent 65%)" }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true">
        {dots.slice(0, 20).map((d, i) => {
          const m = dots[(i + 7) % dots.length]!;
          return (
            <line
              key={`l${i}`}
              x1={`${d.x}%`}
              y1={`${d.y}%`}
              x2={`${m.x}%`}
              y2={`${m.y}%`}
              stroke="#22d3ee"
              strokeOpacity="0.08"
            />
          );
        })}
        {dots.map((d, i) => (
          <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fill="#5eead4" fillOpacity={d.o * 0.5} />
        ))}
      </svg>
    </div>
  );
}

/**
 * Capability-gated hero scene: WebGL constellation on capable desktops,
 * the aurora poster everywhere else (reduced motion, mobile, no WebGL,
 * low-core devices). The canvas lazy-loads after first paint and pauses
 * whenever the hero leaves the viewport.
 */
export function HeroVisual() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (window.innerWidth < 768) return;
    if ((navigator.hardwareConcurrency ?? 8) < 4) return;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      if (!gl) return;
    } catch {
      return;
    }
    // Defer past first paint so the marketing bundle stays lean and LCP clean.
    const id = window.setTimeout(() => setEnabled(true), 450);
    return () => window.clearTimeout(id);
  }, [reduced]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([e]) => setInView(e!.isIntersecting), {
      rootMargin: "80px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return (
    <div ref={rootRef} className="absolute inset-0" aria-hidden="true">
      <HeroPoster
        className={cn(
          "transition-opacity duration-1000 ease-swift",
          canvasReady ? "opacity-40" : "opacity-100",
        )}
      />
      {enabled && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-swift",
            canvasReady ? "opacity-100" : "opacity-0",
          )}
        >
          <SignalField active={inView} onReady={() => setCanvasReady(true)} />
        </div>
      )}
      {/* Bottom fade into the page so the field never hard-clips. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />
    </div>
  );
}
