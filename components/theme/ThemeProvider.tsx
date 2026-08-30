"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Class-strategy theme provider (DESIGN-SPEC-V2 §2). next-themes injects its
 * own pre-hydration inline script, so the resolved theme class is on <html>
 * before first paint — zero flash. Default follows the system preference.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
