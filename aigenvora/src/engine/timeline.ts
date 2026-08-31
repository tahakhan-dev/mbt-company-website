/**
 * Keyframe timeline — pure functions of progress, so scrubbing is free and
 * Tier C posters are sampled keyframes. Owns every camera/light/material/
 * uniform animation (MOTION-MATRIX rule: one owner per animated property).
 */

export type EaseFn = (t: number) => number;

/** Cubic-bezier easing (CSS semantics, x = time, y = value). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): EaseFn {
  // Newton–Raphson on the x polynomial; 6 iterations is plenty at animation precision.
  const ax = 3 * x1 - 3 * x2 + 1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 3 * y1 - 3 * y2 + 1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const dx = sampleDX(t);
      if (dx === 0) break;
      t -= (sampleX(t) - x) / dx;
    }
    return sampleY(Math.min(1, Math.max(0, t)));
  };
}

/** Brand easings — mirror the CSS custom properties in tokens.css. */
export const easeMech = cubicBezier(0.72, 0, 0.14, 1);
export const easeDrift = cubicBezier(0.22, 0.08, 0.14, 1);
export const easeOutFast = cubicBezier(0.16, 1, 0.3, 1);
export const linear: EaseFn = (t) => t;

export interface Key {
  /** Position on the track, 0..1. Keys must be sorted ascending. */
  t: number;
  v: number;
  /** Easing INTO the next key (ignored on the last key). */
  ease?: EaseFn;
}

export type Track = (progress: number) => number;

/** Build a scalar track from sorted keyframes. Clamps outside the range. */
export function track(keys: readonly Key[]): Track {
  if (keys.length === 0) throw new Error("track needs at least one key");
  return (progress: number): number => {
    const first = keys[0]!;
    const last = keys[keys.length - 1]!;
    if (progress <= first.t) return first.v;
    if (progress >= last.t) return last.v;
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i]!;
      const b = keys[i + 1]!;
      if (progress >= a.t && progress <= b.t) {
        const span = b.t - a.t;
        const local = span === 0 ? 1 : (progress - a.t) / span;
        const eased = (a.ease ?? easeDrift)(local);
        return a.v + (b.v - a.v) * eased;
      }
    }
    return last.v;
  };
}

/** Vector-of-tracks helper for positions/colors. */
export function track3(
  keys: readonly { t: number; v: readonly [number, number, number]; ease?: EaseFn }[],
): (progress: number, out: [number, number, number]) => [number, number, number] {
  const tx = track(keys.map((k) => ({ t: k.t, v: k.v[0], ease: k.ease })));
  const ty = track(keys.map((k) => ({ t: k.t, v: k.v[1], ease: k.ease })));
  const tz = track(keys.map((k) => ({ t: k.t, v: k.v[2], ease: k.ease })));
  return (progress, out) => {
    out[0] = tx(progress);
    out[1] = ty(progress);
    out[2] = tz(progress);
    return out;
  };
}

/** Critically-damped style approach used for pointer/scroll smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
