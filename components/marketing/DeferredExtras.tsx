"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ExitIntent = dynamic(
  () => import("@/components/marketing/ExitIntent").then((m) => m.ExitIntent),
  { ssr: false },
);

/**
 * Loads non-critical interaction chunks (exit-intent + its motion/react
 * dependency) after the page has been idle — they can never affect LCP/INP,
 * and the exit prompt is only allowed after 20s anyway.
 */
export function DeferredExtras({ ctaHref }: { ctaHref: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 12_000);
    return () => window.clearTimeout(id);
  }, []);
  return ready ? <ExitIntent ctaHref={ctaHref} /> : null;
}
