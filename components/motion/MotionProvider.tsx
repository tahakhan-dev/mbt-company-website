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

type MotionContextValue = {
  /** True when the user prefers reduced motion — every effect must honor it. */
  reduced: boolean;
  /** Pause/resume smooth scrolling (used by the overlay menu). */
  stopScroll: () => void;
  startScroll: () => void;
};

const MotionContext = createContext<MotionContextValue>({
  reduced: false,
  stopScroll: () => {},
  startScroll: () => {},
});

export function useReducedMotion(): boolean {
  return useContext(MotionContext).reduced;
}

export function useScrollLock(): Pick<MotionContextValue, "stopScroll" | "startScroll"> {
  const { stopScroll, startScroll } = useContext(MotionContext);
  return { stopScroll, startScroll };
}

/**
 * Global motion system for the marketing site:
 *  - Lenis smooth scroll driven by GSAP's ticker (the ONE scroll system)
 *  - ScrollTrigger kept in sync
 *  - route-change handling: instant scroll reset + a fast enter transition
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

  // Lenis ⟷ GSAP ticker sync.
  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Route transitions: reset scroll instantly, then a brief enter animation.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    if (!reduced && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: EASE_OUT,
          clearProps: "opacity,transform",
        },
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

  return (
    <MotionContext.Provider value={{ reduced, stopScroll, startScroll }}>
      <div ref={contentRef}>{children}</div>
    </MotionContext.Provider>
  );
}
