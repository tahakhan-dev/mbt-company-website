import { Color } from "three";

/**
 * Clear-color compensation. The renderer's clear color skips the material
 * color pipeline, so the value that lands on screen depends on the path:
 * - through the EffectComposer (Tier A): the buffer is treated as linear and
 *   encoded to sRGB on output → pre-convert sRGB→linear (verified empirically:
 *   #030407 reads back exactly (3,4,7)).
 * - direct render (Tier B): the raw floats hit the sRGB canvas unencoded →
 *   recover the sRGB fractions from the linear-managed Color.
 */
export function clearColor(hex: string, composerActive: boolean): Color {
  const c = new Color(hex);
  return composerActive ? c.convertSRGBToLinear() : c.convertLinearToSRGB();
}
