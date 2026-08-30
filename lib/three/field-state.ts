/**
 * Tiny cross-component channel: the hero's ScrollTrigger writes scroll
 * progress here; the WebGL scene reads it every frame. No React re-renders.
 */
export const fieldState = {
  /** 0 = organic chaos cloud, 1 = ordered lattice ("we ship systems"). */
  progress: 0,
};
