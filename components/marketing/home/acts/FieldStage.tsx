"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";
import { HeroPoster } from "@/components/three/HeroVisual";
import { cn } from "@/lib/utils/format";

const SignalField = dynamic(() => import("@/components/three/SignalField"), {
  ssr: false,
});

/**
 * The narrative spine (DESIGN-SPEC-V2 §0, T4/T18): ONE fixed Signal Field
 * behind the whole home page whose intensity is keyed to the acts —
 * full presence in Act 1, a dimmed supporting glow through Acts 2–6, and a
 * serene re-brightened grid in Act 7. Only the wrapper's opacity is scroll-
 * animated (composited); the chaos→lattice morph itself is driven by Act 1
 * through fieldState.progress.
 *
 * Capability-gated exactly like V1's hero: WebGL on capable desktops after
 * first paint; the aurora poster on mobile/reduced-motion/no-GL. Rendering
 * pauses when the tab is hidden.
 */
export function FieldStage() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
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
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Act-keyed intensity: 1 → 0.16 across Act 2's entry; 0.16 → 0.55 into Act 7.
  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;
      const stage = rootRef.current;
      const act2 = document.querySelector("[data-act='2']");
      const act7 = document.querySelector("[data-act='7']");
      if (act2) {
        gsap.fromTo(
          stage,
          { opacity: 1 },
          {
            opacity: 0.12,
            ease: "none",
            scrollTrigger: { trigger: act2, start: "top 90%", end: "top 30%", scrub: 0.6 },
          },
        );
      }
      if (act7) {
        gsap.fromTo(
          stage,
          { opacity: 0.12 },
          {
            opacity: 0.5,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: act7, start: "top 70%", end: "top 15%", scrub: 0.6 },
          },
        );
      }
      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === act2 || st.trigger === act7) st.kill();
        });
      };
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-field-stage
    >
      <HeroPoster
        className={cn(
          "transition-opacity duration-1000 ease-swift",
          canvasReady ? "opacity-35" : "opacity-100",
        )}
      />
      {enabled && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-swift",
            canvasReady ? "opacity-100" : "opacity-0",
          )}
        >
          <SignalField
            active={pageVisible}
            trackDocument
            onReady={() => setCanvasReady(true)}
          />
        </div>
      )}
      {/* Soft floor so the field never hard-clips against the fold. */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-void/70" />
    </div>
  );
}
