import { AmbientLight, DirectionalLight, Group, Vector3 } from "three";
import type { MasterState, SceneContext, SceneModule } from "../types";
import { buildEngine, type EngineModel } from "../engine-model";
import { easeDrift, track } from "../timeline";

/**
 * Service detail — one module isolated under studio light (storyboard §3
 * route map: "camera locks onto the relevant module; module opens").
 * The rest of the engine sits dim in the background, out of focus by
 * distance and light rather than by postprocessing.
 */

/** Macro pass: the camera closes on the focused module as the page scrolls. */
const camDistance = track([
  { t: 0, v: 3.6 },
  { t: 1, v: 2.4, ease: easeDrift },
]);

export class ServiceDetailScene implements SceneModule {
  route = "/services/";

  private engine!: EngineModel;
  private rig = new Group();
  private key!: DirectionalLight;
  private ambient!: AmbientLight;
  private ctx!: SceneContext;
  private focusIndex = 0;
  private focusPos = new Vector3();
  private outward = new Vector3();
  private camPos = new Vector3();
  private lookTarget = new Vector3();
  private rightAxis = new Vector3();
  private viewDir = new Vector3();
  private static UP = new Vector3(0, 1, 0);

  init(ctx: SceneContext): void {
    this.ctx = ctx;
    const rootEl = document.querySelector<HTMLElement>("[data-engine-root]");
    this.focusIndex = Number(rootEl?.dataset.moduleIndex ?? "0");

    this.engine = buildEngine(ctx.capabilities.tier === "A");
    this.rig.add(this.engine.root);
    ctx.scene.add(this.rig);

    // Studio key on the camera's side of the focused module (set after focus
    // is known); cool ambient floor.
    this.key = new DirectionalLight("#ffffff", 2.2);
    this.ambient = new AmbientLight("#dfe3f0", 0.5);
    ctx.scene.add(this.key, this.ambient);

    // Seat everything immediately: this route enters at the "System" state.
    for (const mod of this.engine.modules) {
      mod.group.position.copy(mod.aligned);
      mod.group.rotation.set(0, (mod.index / 12) * Math.PI * 2, 0);
      mod.conduitUniforms.uActivation.value = mod.index === this.focusIndex ? 1 : 0.12;
      mod.channelUniforms.uActivation.value = mod.index === this.focusIndex ? 1 : 0.2;
    }

    const focused = this.engine.modules[this.focusIndex];
    if (focused) {
      this.focusPos.copy(focused.aligned);
      this.outward.copy(this.focusPos).setY(0).normalize();
    }
    // Isolation: only the focused module and its ring neighbors stay; the
    // neighbors recede as supporting cast, the rest of the engine sits out.
    for (const mod of this.engine.modules) {
      const ringDist = Math.min(
        Math.abs(mod.index - this.focusIndex),
        12 - Math.abs(mod.index - this.focusIndex),
      );
      if (ringDist === 0) continue;
      if (ringDist === 1) {
        mod.group.scale.setScalar(0.72);
      } else {
        mod.group.visible = false;
      }
    }
    this.key.position.copy(this.outward).multiplyScalar(4).add(new Vector3(1.5, 5, 2));
  }

  update(state: MasterState, _dt: number): void {
    const p = state.pageProgress;
    const focused = this.engine.modules[this.focusIndex];
    const t = state.elapsed;

    // Micro-behavior loop at ~0.2 intensity: the module slowly opens/turns.
    if (focused) {
      focused.group.rotation.y += Math.sin(t * 0.6) * 0.0006;
      focused.conduitUniforms.uTime.value = t;
      focused.channelUniforms.uTime.value = t;
    }
    for (const mod of this.engine.modules) {
      if (mod.index !== this.focusIndex) {
        mod.conduitUniforms.uTime.value = t * 0.3;
        mod.channelUniforms.uTime.value = t * 0.3;
      }
      mod.gyro.rotation.z = t * (0.15 + mod.index * 0.012);
    }

    // Camera locks outside the focused module and closes in on scroll; the
    // look target is biased screen-left so the module reads right-of-center
    // beside the copy column.
    const cam = this.ctx.camera;
    this.camPos.copy(this.focusPos).addScaledVector(this.outward, camDistance(p));
    this.camPos.x += state.pointer.x * 0.06;
    this.camPos.y += 0.3 - p * 0.2 + state.pointer.y * 0.05;
    cam.position.copy(this.camPos);

    this.viewDir.copy(this.focusPos).sub(this.camPos).normalize();
    this.rightAxis.crossVectors(this.viewDir, ServiceDetailScene.UP).normalize();
    // Target left of the module → the module reads right-of-center.
    this.lookTarget.copy(this.focusPos).addScaledVector(this.rightAxis, -0.85);
    cam.lookAt(this.lookTarget);
  }

  resize(): void {}

  dispose(): void {
    this.ctx.scene.remove(this.rig, this.key, this.ambient);
    this.engine.dispose();
    this.key.dispose();
    this.ambient.dispose();
  }
}
