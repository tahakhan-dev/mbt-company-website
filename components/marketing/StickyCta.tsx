"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/format";

/**
 * Mobile-only sticky bottom CTA: appears after the hero scrolls out,
 * hides again when the footer is in view (never covers footer content).
 */
export function StickyCta({ ctaHref }: { ctaHref: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const heroIo = new IntersectionObserver(([e]) => setPastHero(!e!.isIntersecting));
    heroIo.observe(sentinel);

    const footer = document.querySelector("footer");
    let footerIo: IntersectionObserver | undefined;
    if (footer) {
      footerIo = new IntersectionObserver(([e]) => setNearFooter(e!.isIntersecting));
      footerIo.observe(footer);
    }
    return () => {
      heroIo.disconnect();
      footerIo?.disconnect();
    };
  }, []);

  const show = pastHero && !nearFooter;

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute left-0 top-[92vh] h-px w-px" />
      <div
        inert={!show || undefined}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-8 md:hidden",
          "bg-gradient-to-t from-void via-void/85 to-transparent",
          "transition-[transform,opacity] duration-500 ease-swift",
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <Button
          href={ctaHref}
          size="lg"
          magnetic={false}
          className="w-full justify-between"
          cta="sticky-mobile"
        >
          Book a free AI strategy call
        </Button>
      </div>
    </>
  );
}
