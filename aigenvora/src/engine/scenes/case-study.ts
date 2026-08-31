import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  TorusGeometry,
} from "three";
import type { MasterState, SceneContext, SceneModule } from "../types";
import { clearColor } from "../color";
import { easeDrift, track } from "../timeline";

/**
 * Case study — the portal motif without the full engine: a single machined
 * portal ring, lit in the project's accent, that the camera passes toward as
 * the reader enters the story. Project media itself is DOM (crisp,
 * selectable); the scene provides the approach and the reflected color.
 */

const camZ = track([
  { t: 0, v: 5.2 },
  { t: 0.35, v: 2.6, ease: easeDrift },
  { t: 1, v: 1.6, ease: easeDrift },
]);

const accentIntensity = track([
  { t: 0, v: 0.6 },
  { t: 0.3, v: 2.4 },
  { t: 1, v: 1.4 },
]);

/** Cinematic dark opening rendered by the scene; hands back to paper as the
 *  reader enters the written chapters (mirrors index.astro's chamber trick). */
const openingAlpha = track([
  { t: 0, v: 1 },
  { t: 0.18, v: 1 },
  { t: 0.34, v: 0, ease: easeDrift },
]);

export class CaseStudyScene implements SceneModule {
  route = "/work/";

  private rig = new Group();
  private ring!: Mesh;
  private ringGeo!: TorusGeometry;
  private ringMat!: MeshStandardMaterial;
  private key!: DirectionalLight;
  private ambient!: AmbientLight;
  private accent!: PointLight;
  private ctx!: SceneContext;
  private ground!: Color;

  init(ctx: SceneContext): void {
    this.ctx = ctx;
    const rootEl = document.querySelector<HTMLElement>("[data-engine-root]");
    const accentHex = rootEl?.dataset.accent ?? "#7957ff";

    this.ringGeo = new TorusGeometry(1.4, 0.16, 24, 64);
    this.ringMat = new MeshStandardMaterial({
      color: new Color("#262a33"),
      roughness: 0.35,
      metalness: 0.9,
    });
    this.ring = new Mesh(this.ringGeo, this.ringMat);
    this.rig.add(this.ring);
    ctx.scene.add(this.rig);

    this.key = new DirectionalLight("#dfe6ff", 1.2);
    this.key.position.set(3, 4, 2);
    this.ambient = new AmbientLight("#9da4b3", 0.25);
    this.accent = new PointLight(accentHex, 0.6, 10);
    this.accent.position.set(0, 0, 0.6);
    ctx.scene.add(this.key, this.ambient, this.accent);

    ctx.camera.position.set(0, 0, 5.2);
    ctx.camera.lookAt(0, 0, 0);
    this.ground = clearColor("#0a0714", ctx.capabilities.tier === "A");
    ctx.renderer.setClearColor(this.ground, 1);
  }

  update(state: MasterState, _dt: number): void {
    const p = state.pageProgress;
    const t = state.elapsed;

    this.ring.rotation.z = t * 0.08;
    this.ring.rotation.x = Math.sin(t * 0.15) * 0.08 + state.pointer.y * 0.05;
    this.ring.rotation.y = state.pointer.x * 0.08;

    this.accent.intensity = accentIntensity(p);
    this.ctx.renderer.setClearColor(this.ground, openingAlpha(p));

    const cam = this.ctx.camera;
    cam.position.set(state.pointer.x * 0.08, state.pointer.y * 0.06, camZ(p));
    cam.lookAt(0, 0, 0);

    // The portal recedes upward once the reader is inside the story.
    this.rig.position.y = MathUtils.lerp(0, 1.6, MathUtils.clamp((p - 0.5) * 2, 0, 1));
  }

  resize(): void {}

  dispose(): void {
    this.ctx.renderer.setClearColor(0x000000, 0);
    this.ctx.scene.remove(this.rig, this.key, this.ambient, this.accent);
    this.ringGeo.dispose();
    this.ringMat.dispose();
    this.key.dispose();
    this.ambient.dispose();
    this.accent.dispose();
  }
}
