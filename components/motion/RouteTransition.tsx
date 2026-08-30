"use client";

import * as React from "react";
import type { ComponentType, ReactNode } from "react";

type VTProps = { children: ReactNode; default?: string };

/**
 * Route-level View Transitions (DESIGN-SPEC-V2 §4). Next 16 App Router ships
 * React canary, whose <ViewTransition> integrates the native View Transitions
 * API (verified against next/dist/docs/01-app/02-guides/view-transitions.md).
 * The export is resolved defensively at runtime: if this build/browser lacks
 * it, children render untouched and MotionProvider's ≤400ms GSAP enter rise
 * is the fallback (it self-gates on `document.startViewTransition`).
 * Animations live in globals.css under `::view-transition-*(.vt-page)` —
 * transform/opacity only, ≤400ms.
 */
const ReactViewTransition =
  ((React as unknown as Record<string, unknown>).ViewTransition as
    | ComponentType<VTProps>
    | undefined) ??
  ((React as unknown as Record<string, unknown>).unstable_ViewTransition as
    | ComponentType<VTProps>
    | undefined);

export function RouteTransition({ children }: { children: ReactNode }) {
  if (!ReactViewTransition) return <>{children}</>;
  return <ReactViewTransition default="vt-page">{children}</ReactViewTransition>;
}
