import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Vector3,
} from "three";
import type { MasterState, SceneContext, SceneModule } from "../types";
import { buildEngine, type EngineModel } from "../engine-model";
import { clearColor } from "../color";
import { easeMech, track, track3 } from "../timeline";

/**
 * Home — Chapters 1–2 (Arrival → Problem).
 * Narrative state: Unresolved. Scroll pulls modules from scattered drift onto
 * the ring; the camera leaves the establishing frame and dollies into the gap
 * between module groups as the chamber darkens (DOM owns the background —
 * the scene answers with light).
 */

// Assembly completes late in the Problem chapter; conduits wake after seat.
const assembleTrack = track([
  { t: 0.0, v: 0 },
  { t: 0.25, v: 0.06, ease: easeMech },
  { t: 1.0, v: 1, ease: easeMech },
]);

const cameraPos = track3([
  { t: 0.0, v: [0.4, 0.6, 6.4] },
  { t: 0.5, v: [1.6, 0.2, 4.6] },
  { t: 1.0, v: [0.2, 0.9, 5.2], ease: easeMech },
]);

/** Arrival composition: the engine occupies the framed right stage while the
 *  hero copy owns the left columns; entering the chamber it takes the center. */
const rigX = track([
  { t: 0.0, v: 2.5 },
  { t: 0.45, v: 0, ease: easeMech },
]);

const keyIntensity = track([
  { t: 0.0, v: 2.6 },
  { t: 0.5, v: 1.5 },
  { t: 1.0, v: 0.9 },
]);

const fillIntensity = track([
  { t: 0.0, v: 1.5 },
  { t: 0.5, v: 0.6 },
  { t: 1.0, v: 0.25 },
]);

const coreGlow = track([
  { t: 0.0, v: 0 },
  { t: 0.8, v: 0.1 },
  { t: 1.0, v: 2.2, ease: easeMech },
]);

/** Chamber entry: the scene paints its own darkness so the paper page stays
 *  transparent underneath (index.astro relies on this). */
const chamberAlpha = track([
  { t: 0.3, v: 0 },
  { t: 0.55, v: 1, ease: easeMech },
]);

export class ArrivalScene implements SceneModule {
  route = "/";

  private engine!: EngineModel;
  private rig = new Group();
  private key!: DirectionalLight;
  private fill!: DirectionalLight;
  private ambient!: AmbientLight;
  private ctx!: SceneContext;
  private lookTarget = new Vector3();
  private posOut: [number, number, number] = [0, 0, 0];
  private voidColor!: Color;

  init(ctx: SceneContext): void {
    this.ctx = ctx;
    this.engine = buildEngine(ctx.capabilities.tier === "A");
    this.rig.add(this.engine.root);
    this.rig.scale.setScalar(0.72);
    ctx.scene.add(this.rig);
    this.voidColor = clearColor("#030407", ctx.capabilities.tier === "A");

    // Cold split key from off-frame right; soft fill; low ambient floor.
    this.key = new DirectionalLight("#dfe6ff", 2.6);
    this.key.position.set(4, 3, 2);
    this.fill = new DirectionalLight("#f2f3f8", 1.1);
    this.fill.position.set(-3, 1, 4);
    this.ambient = new AmbientLight("#c8ccdb", 0.35);
    ctx.scene.add(this.key, this.fill, this.ambient);

    ctx.camera.position.set(0.4, 0.6, 6.4);
    ctx.camera.lookAt(0, 0, 0);
  }

  update(state: MasterState, _dt: number): void {
    // Two-chapter master progress: arrival feeds the first half, problem the second.
    const p = Math.min(
      1,
      (state.progress["arrival"] ?? 0) * 0.5 + (state.progress["problem"] ?? 0) * 0.5,
    );
    const assembly = assembleTrack(p);
    const t = state.elapsed;

    for (const mod of this.engine.modules) {
      const { group, scattered, aligned, index } = mod;
      // Controlled disorder: slow noise drift that dies as assembly wins.
      const driftAmp = (1 - assembly) * 0.18;
      const dx = Math.sin(t * 0.4 + index * 1.7) * driftAmp;
      const dy = Math.cos(t * 0.31 + index * 2.3) * driftAmp;
      const dz = Math.sin(t * 0.23 + index * 3.1) * driftAmp;

      group.position.set(
        MathUtils.lerp(scattered.x, aligned.x, assembly) + dx,
        MathUtils.lerp(scattered.y, aligned.y, assembly) + dy,
        MathUtils.lerp(scattered.z, aligned.z, assembly) + dz,
      );
      // Misaligned by a few degrees until seated.
      const wobble = (1 - assembly) * 0.5;
      group.rotation.set(
        Math.sin(index * 1.3) * wobble,
        Math.cos(index * 2.1) * wobble + assembly * ((index / 12) * Math.PI * 2),
        Math.sin(index * 0.7) * wobble,
      );

      // Conduits wake in sequence once their module has seated.
      const seatPoint = 0.75 + (index / 12) * 0.2;
      const activation = MathUtils.clamp((assembly - seatPoint) / 0.08, 0, 1);
      mod.conduitUniforms.uActivation.value = activation;
      mod.conduitUniforms.uTime.value = t;
    }

    // Chamber: the frame "expands past the viewport" as rendered darkness.
    this.ctx.renderer.setClearColor(this.voidColor, chamberAlpha(p));

    // Lighting arc: cold split → dimmer chamber; core warms as the system nears.
    this.key.intensity = keyIntensity(p);
    this.fill.intensity = fillIntensity(p);
    this.ambient.intensity = 0.35 - p * 0.22;
    this.engine.coreLight.intensity = coreGlow(p);

    // Camera: establish → gap dolly. Pointer parallax ≤ ~1.5°, inertial.
    cameraPos(p, this.posOut);
    const cam = this.ctx.camera;
    cam.position.set(this.posOut[0], this.posOut[1], this.posOut[2]);
    // Look between origin and the rig: the engine reads right-of-center in the
    // arrival frame and recenters as it takes the chamber.
    this.lookTarget.set(this.rig.position.x * 0.35, 0, 0);
    cam.lookAt(this.lookTarget);
    cam.rotation.x += state.pointer.y * 0.02;
    cam.rotation.y += state.pointer.x * -0.026;

    // Whole engine breathes very slightly at rest.
    this.rig.rotation.y = Math.sin(t * 0.05) * 0.03;
    // Portrait viewports recompose: the engine centers above the copy instead
    // of holding the right column (index.astro moves the stage above the fold).
    const portrait = state.viewport.w < 700;
    this.rig.position.x = rigX(p) * (portrait ? 0.1 : 1);
    this.ctx.camera.position.z += portrait ? 1.1 : 0;
  }

  resize(): void {
    /* camera aspect handled by runtime */
  }

  dispose(): void {
    this.ctx.renderer.setClearColor(0x000000, 0);
    this.ctx.scene.remove(this.rig, this.key, this.fill, this.ambient);
    this.engine.dispose();
    this.key.dispose();
    this.fill.dispose();
    this.ambient.dispose();
  }
}
