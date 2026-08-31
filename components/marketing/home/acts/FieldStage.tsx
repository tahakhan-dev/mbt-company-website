"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";
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
  // The field only RENDERS while it is narratively alive (Act 1's morph and
  // Act 7's wake-up). Dimmed behind Acts 2–6 it pauses and its last frame
  // stays as the static backdrop — indistinguishable at 0.12 opacity, and it
  // keeps the whole scroll inside the frame budget on weak GPUs (Gate S).
  const [fieldLive, setFieldLive] = useState(true);
  const liveActs = useRef({ act1: true, act7: false });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (window.innerWidth < 768) return;
    if ((navigator.hardwareConcurrency ?? 8) < 4) return;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      if (!gl) return;
      // Software rasterizers (SwiftShader/llvmpipe) burn CPU the page needs
      // for scroll — those visitors get the designed poster instead. The
      // localStorage override exists for screenshot/QA harnesses only.
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
      let forceGl = false;
      try {
        forceGl = localStorage.getItem("mbt_force_gl") === "1";
      } catch {}
      if (!forceGl && /swiftshader|llvmpipe|software|basic render/i.test(renderer)) return;
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

  // Act-keyed intensity: the field owns Acts 1 and 7 and fully EXITS the
  // compositor between them (autoAlpha → visibility:hidden at 0). A fixed
  // full-viewport layer costs ~12ms/frame in software raster even when
  // dimmed to a whisper (Gate S bisect); mid-acts, depth belongs to the
  // surfaces (act-2 panel, blueprint grids, seams) instead.
  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;
      const stage = rootRef.current;
      const act1 = document.querySelector("[data-act='1']");
      const act2 = document.querySelector("[data-act='2']");
      const act7 = document.querySelector("[data-act='7']");

      const syncLive = () => setFieldLive(liveActs.current.act1 || liveActs.current.act7);
      const liveTriggers = [
        act1 &&
          ScrollTrigger.create({
            trigger: act1,
            start: "top bottom",
            end: "bottom 40%",
            onToggle: (self) => {
              liveActs.current.act1 = self.isActive;
              syncLive();
            },
          }),
        act7 &&
          ScrollTrigger.create({
            trigger: act7,
            start: "top 90%",
            end: "max",
            onToggle: (self) => {
              liveActs.current.act7 = self.isActive;
              syncLive();
            },
          }),
      ].filter(Boolean) as ScrollTrigger[];
      if (act2) {
        gsap.fromTo(
          stage,
          { autoAlpha: 1 },
          {
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: { trigger: act2, start: "top 90%", end: "top 30%", scrub: 0.6 },
          },
        );
      }
      if (act7) {
        gsap.fromTo(
          stage,
          { autoAlpha: 0 },
          {
            autoAlpha: 0.5,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: act7, start: "top 70%", end: "top 15%", scrub: 0.6 },
          },
        );
      }
      return () => {
        liveTriggers.forEach((st) => st.kill());
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === act2 || st.trigger === act7) st.kill();
        });
      };
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    // Canvas-only carrier: the static posters live INSIDE acts 1 and 7 so
    // they scroll/pin with their act instead of blending as a fixed layer
    // under the whole page every frame (Gate S: ~4% of dropped frames).
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-field-stage
    >
      {enabled && (
        <div
          className={cn(
            // visibility rides the opacity transition so the GL layer leaves
            // the compositor entirely mid-acts (the acts' posters carry the
            // backdrop); it fades back in for Act 7's wake-up.
            "absolute inset-0 transition-[opacity,visibility] duration-1000 ease-swift",
            canvasReady && fieldLive ? "visible opacity-100" : "invisible opacity-0",
          )}
        >
          <SignalField
            active={pageVisible && fieldLive}
            trackDocument
            onReady={() => setCanvasReady(true)}
          />
        </div>
      )}
    </div>
  );
}
