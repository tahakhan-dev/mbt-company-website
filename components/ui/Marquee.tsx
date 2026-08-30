"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils/format";

/**
 * Seamless marquee: the track is duplicated (second copy aria-hidden) and
 * translated -50% on loop, so there is never a jump. Pauses on hover.
 * Reduced motion → a static, scrollable row.
 */
export function Marquee({
  children,
  className,
  duration = 42,
  fade = true,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  fade?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <div className="flex w-max items-center gap-14 px-6">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn("group/marquee relative overflow-hidden", className)}
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }
          : undefined
      }
    >
      <div
        className="flex w-max animate-marquee items-center group-hover/marquee:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center gap-14 pr-14">{children}</div>
        <div className="flex shrink-0 items-center gap-14 pr-14" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
