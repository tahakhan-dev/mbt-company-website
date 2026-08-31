"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils/format";

/**
 * Media parallax: the inner layer is oversized and drifts vertically as the
 * container crosses the viewport (transform-only, scrubbed). Pairs with a
 * subtle scale-in from 1.06 → 1.
 */
export function ParallaxMedia({
  children,
  className,
  amount = 10,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !outerRef.current || !innerRef.current) return;
      // Translate-only drift: a continuous scale scrub forces the compositor
      // to re-rasterize the (large, SVG-heavy) layer every frame for
      // crispness — measured as the act-5 frame tax in Gate S. yPercent
      // alone moves the cached raster for free.
      gsap.fromTo(
        innerRef.current,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: {
            trigger: outerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: outerRef, dependencies: [reduced, amount] },
  );

  return (
    <div ref={outerRef} className={cn("relative overflow-hidden", className)}>
      <div ref={innerRef} className="absolute -inset-y-[6%] inset-x-0">
        {children}
      </div>
    </div>
  );
}
