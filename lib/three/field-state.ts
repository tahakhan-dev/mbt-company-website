/**
 * Tiny cross-component channel: scroll choreography writes here; the WebGL
 * scene reads it every frame. No React re-renders, no per-frame allocations.
 */
export const fieldState = {
  /** 0 = organic chaos cloud, 1 = ordered lattice ("we ship systems"). */
  progress: 0,
  /**
   * Normalized scroll energy 0..1 (T8 — velocity-reactive turbulence).
   * Written by MotionProvider from Lenis velocity; decays in the shader loop.
   */
  velocity: 0,
  /**
   * Act-keyed field mood: 0 = narrative morph (progress-driven, Act 1),
   * 1 = calm supporting glow (mid acts), 2 = serene ordered grid (Act 7).
   * The scene maps modes to target progress/energy — one canvas, many states.
   */
  mode: 0,
};
