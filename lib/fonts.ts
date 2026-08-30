import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";

/**
 * Self-hosted brand typography (all OFL-licensed, latin subsets, variable).
 *
 * Swap path for Clash Display / Satoshi (Fontshare): drop the woff2 files into
 * app/fonts/ and point the `src` entries below at them — every style in the
 * app consumes only the CSS variables, so nothing else changes.
 */
export const displayFace = localFont({
  src: [{ path: "../app/fonts/SpaceGrotesk-Variable.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-display-face",
  display: "swap",
  preload: true,
});

export const sansFace = localFont({
  src: [{ path: "../app/fonts/InstrumentSans-Variable.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-sans-face",
  display: "swap",
  preload: true,
});

/** Italic never renders above the fold — loaded without a preload hint. */
export const sansItalicFace = localFont({
  src: [
    { path: "../app/fonts/InstrumentSans-Italic-Variable.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-sans-italic-face",
  display: "swap",
  preload: false,
});

/** Geist Mono ships its own variable (--font-geist-mono); we alias it below. */
export const monoFace = GeistMono;

export const fontClassNames = `${displayFace.variable} ${sansFace.variable} ${sansItalicFace.variable} ${monoFace.variable}`;
