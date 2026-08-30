"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const noopSubscribe = () => () => {};

const THEME_COLORS = { dark: "#05070c", light: "#f7f7f4" } as const;

/**
 * Sun/moon toggle for the island nav (DESIGN-SPEC-V2 §2, T14). Shows the
 * theme you'd switch TO. The icon morph is transform/opacity per path; the
 * page-wide ~250ms token crossfade comes from a transient `theme-fade` class
 * on <html> (see globals.css).
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // Hydration gate without setState-in-effect (server snapshot = false).
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const next = resolvedTheme === "dark" ? "light" : "dark";

  function toggle() {
    const root = document.documentElement;
    root.classList.add("theme-fade");
    setTheme(next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[next as keyof typeof THEME_COLORS]);
    window.setTimeout(() => root.classList.remove("theme-fade"), 320);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${next} theme` : "Switch theme"}
      className={`group relative grid size-9 place-items-center rounded-full text-ink-muted transition-colors duration-300 ease-[var(--ease-swift)] hover:bg-bezel hover:text-ink ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
        {/* Sun — visible in dark theme (click → light) */}
        <g
          className="origin-center transition-[transform,opacity] duration-300 ease-[var(--ease-swift)] scale-50 opacity-0 -rotate-90 dark:scale-100 dark:opacity-100 dark:rotate-0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4.1" />
          <g className="origin-center transition-transform delay-75 duration-300 ease-[var(--ease-spring)] scale-0 dark:scale-100">
            <line x1="12" y1="1.8" x2="12" y2="3.9" />
            <line x1="12" y1="20.1" x2="12" y2="22.2" />
            <line x1="1.8" y1="12" x2="3.9" y2="12" />
            <line x1="20.1" y1="12" x2="22.2" y2="12" />
            <line x1="4.8" y1="4.8" x2="6.3" y2="6.3" />
            <line x1="17.7" y1="17.7" x2="19.2" y2="19.2" />
            <line x1="4.8" y1="19.2" x2="6.3" y2="17.7" />
            <line x1="17.7" y1="6.3" x2="19.2" y2="4.8" />
          </g>
        </g>
        {/* Moon — visible in light theme (click → dark) */}
        <path
          d="M20.6 13.4A8.4 8.4 0 1 1 10.6 3.4a6.6 6.6 0 0 0 10 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="origin-center transition-[transform,opacity] duration-300 ease-[var(--ease-swift)] scale-100 opacity-100 rotate-0 dark:scale-50 dark:opacity-0 dark:rotate-90"
        />
      </svg>
    </button>
  );
}
