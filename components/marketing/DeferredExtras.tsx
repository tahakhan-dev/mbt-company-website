"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ExitIntent = dynamic(
  () => import("@/components/marketing/ExitIntent").then((m) => m.ExitIntent),
  { ssr: false },
);

/**
 * Loads non-critical interaction chunks (exit-intent + its motion/react
 * dependency) after the page has been open a while AND the user has stopped
 * scrolling — evaluating the chunk mid-scroll cost a >300ms main-thread
 * storm at 4× CPU (Gate S trace). The exit prompt is only allowed after 20s
 * anyway, so waiting for a quiet moment loses nothing.
 */
export function DeferredExtras({ ctaHref }: { ctaHref: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let armed = false;
    let quietTimer = 0;
    const scheduleQuiet = () => {
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(() => setReady(true), 1_600);
    };
    const minDelay = window.setTimeout(() => {
      armed = true;
      scheduleQuiet();
    }, 12_000);
    const onScroll = () => {
      if (armed) scheduleQuiet();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(minDelay);
      window.clearTimeout(quietTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return ready ? <ExitIntent ctaHref={ctaHref} /> : null;
}
