import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";

/** Capability tiers — docs/design/SCENE-ARCHITECTURE.md §5.
 *  A: full scene · B: conservative DPR/effects · C: static posters, no engine boot. */
export type Tier = "A" | "B" | "C";

export interface Capabilities {
  tier: Tier;
  webgl2: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  dprCap: number;
}

/** The one input scenes read. Written only by the runtime. */
export interface MasterState {
  route: string;
  /** Normalized progress per named chapter section, 0..1, damped. */
  progress: Record<string, number>;
  /** Overall page progress 0..1, damped. */
  pageProgress: number;
  pointer: { x: number; y: number };
  viewport: { w: number; h: number };
  visible: boolean;
  elapsed: number;
}

export interface SceneContext {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  capabilities: Capabilities;
}

export interface SceneModule {
  /** Route pattern this scene serves, e.g. "/" or "/services/". */
  route: string;
  init(ctx: SceneContext): void;
  update(state: MasterState, dt: number): void;
  resize(w: number, h: number): void;
  /** Must free every geometry, material, texture and listener it created. */
  dispose(): void;
}
