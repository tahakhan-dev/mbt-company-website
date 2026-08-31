"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, EASE_OUT } from "@/lib/gsap";
import { fieldState } from "@/lib/three/field-state";

type ScrollTarget = number | HTMLElement | string;

type MotionContextValue = {
  /** True when the user prefers reduced motion — every effect must honor it. */
  reduced: boolean;
  /** Pause/resume smooth scrolling (used by the overlay menu). */
  stopScroll: () => void;
  startScroll: () => void;
  /** Smooth-scroll to a position/element through Lenis (act rail, anchors). */
  scrollTo: (target: ScrollTarget, offset?: number) => void;
};

const MotionContext = createContext<MotionContextValue>({
  reduced: false,
  stopScroll: () => {},
  startScroll: () => {},
  scrollTo: () => {},
});

export function useReducedMotion(): boolean {
  return useContext(MotionContext).reduced;
}

export function useScrollLock(): Pick<MotionContextValue, "stopScroll" | "startScroll"> {
  const { stopScroll, startScroll } = useContext(MotionContext);
  return { stopScroll, startScroll };
}

export function useScrollTo(): MotionContextValue["scrollTo"] {
  return useContext(MotionContext).scrollTo;
}

/**
 * Global motion system for the marketing site (V2 core):
 *  - ONE Lenis instance driven by GSAP's ticker; ScrollTrigger kept in sync
 *  - scroll velocity bridged into fieldState (T8 velocity-reactive field)
 *  - anchor links routed through Lenis; overlays pause it
 *  - ScrollTrigger re-measures after web fonts resolve (V2 §7)
 *  - route changes: instant scroll reset; a ≤400ms GSAP enter rise runs ONLY
 *    where the browser lacks the View Transitions API (see RouteTransition)
 *  - prefers-reduced-motion: no Lenis, no transitions, instant states
 */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void): () => void {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
  const pathname = usePathname();
  const firstRender = useRef(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis ⟷ GSAP ticker sync + velocity bridge + anchor handling.
  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      anchors: false,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", (e: { velocity: number }) => {
      ScrollTrigger.update();
      // Normalized scroll energy for the Signal Field (decays in-scene).
      fieldState.velocity = Math.min(1, Math.abs(e.velocity) / 55);
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // In-page anchors travel through Lenis so smoothing stays consistent.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = decodeURIComponent(anchor.getAttribute("href")!.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -96, duration: 1.05 });
    };
    document.addEventListener("click", onClick);

    // Film-grain pause: .noise-overlay is a fixed full-viewport translucent
    // layer, and compositing it over moving content costs a whole-viewport
    // blend per scrolled frame on software rasterizers (~6% of the Gate S
    // frame budget). Grain reads as noise while things move anyway, so it
    // fades out on scrollStart and returns once the scroll settles.
    const root = document.documentElement;
    const onScrollStart = () => root.classList.add("is-scrolling");
    const onScrollEnd = () => root.classList.remove("is-scrolling");
    ScrollTrigger.addEventListener("scrollStart", onScrollStart);
    ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

    // Fluid type + font swaps change layout — re-measure every trigger once
    // the real faces are in (V2 §7 refresh-after-fonts).
    let fontsCancelled = false;
    document.fonts?.ready.then(() => {
      if (!fontsCancelled) ScrollTrigger.refresh();
    });

    return () => {
      fontsCancelled = true;
      document.removeEventListener("click", onClick);
      ScrollTrigger.removeEventListener("scrollStart", onScrollStart);
      ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
      root.classList.remove("is-scrolling");
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      fieldState.velocity = 0;
    };
  }, [reduced]);

  // Route transitions: reset scroll instantly; animate entry only where the
  // native View Transitions API (used by RouteTransition) is unavailable.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    const hasNativeVT = typeof document !== "undefined" && "startViewTransition" in document;
    if (!reduced && !hasNativeVT && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.4, ease: EASE_OUT, clearProps: "opacity,transform" },
      );
    }
    // New page height ⇒ recalc every trigger.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, reduced]);

  const stopScroll = () => {
    lenisRef.current?.stop();
    document.documentElement.style.overflow = "hidden";
  };
  const startScroll = () => {
    document.documentElement.style.overflow = "";
    lenisRef.current?.start();
  };
  const scrollTo = (target: ScrollTarget, offset = 0) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.05 });
      return;
    }
    // Reduced motion / no Lenis: jump instantly to the same destination.
    if (typeof target === "number") {
      window.scrollTo(0, target + offset);
      return;
    }
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (el) window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + offset);
  };

  return (
    <MotionContext.Provider value={{ reduced, stopScroll, startScroll, scrollTo }}>
      <div ref={contentRef}>{children}</div>
    </MotionContext.Provider>
  );
}
