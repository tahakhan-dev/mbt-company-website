import localFont from "next/font/local";

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

/**
 * Mono styles eyebrows/meta/numerals only — never the LCP headline — so it
 * loads without a preload hint (the 70KB preload was the largest item on the
 * throttled-mobile critical path; Gate D trace). Vendored from the geist
 * package into app/fonts; keeps the same --font-geist-mono variable.
 */
export const monoFace = localFont({
  src: [{ path: "../app/fonts/GeistMono-Variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const fontClassNames = `${displayFace.variable} ${sansFace.variable} ${sansItalicFace.variable} ${monoFace.variable}`;
