/**
 * Per-theme Signal Field palettes (DESIGN-SPEC-V2 §2). Dark renders additive
 * (glows on obsidian); light renders normal-blended with deepened inks —
 * additive blending is invisible over porcelain.
 */
export type FieldPalette = {
  /** primary / secondary / glow colors as linear-ish RGB triples */
  a: [number, number, number];
  b: [number, number, number];
  c: [number, number, number];
  lineAlpha: number;
  pointAlpha: number;
  additive: boolean;
};

export const FIELD_PALETTES: Record<"dark" | "light", FieldPalette> = {
  dark: {
    a: [0.133, 0.827, 0.933], // aurora cyan #22d3ee
    b: [0.506, 0.549, 0.973], // aurora violet #818cf8
    c: [0.369, 0.918, 0.831], // aurora teal #5eead4
    lineAlpha: 0.1,
    pointAlpha: 1.0,
    additive: true,
  },
  light: {
    a: [0.055, 0.455, 0.565], // cyan-700 #0e7490
    b: [0.31, 0.275, 0.898], // violet #4f46e5
    c: [0.059, 0.463, 0.431], // teal-700 #0f766e
    lineAlpha: 0.2,
    pointAlpha: 0.88,
    additive: false,
  },
};
