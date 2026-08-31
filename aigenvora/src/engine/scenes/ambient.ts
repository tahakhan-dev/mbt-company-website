import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from "three";
import type { MasterState, SceneContext, SceneModule } from "../types";
import { buildEngine, type EngineModel } from "../engine-model";
import { buildStreamField, type StreamField } from "../particles";
import { clearColor } from "../color";

type Mode = "atlas" | "dormant" | "build" | "decompose" | "rest";

/**
 * Route-tuned ambient scenes sharing one implementation: the engine in a
 * mode-specific state, driven by page progress. Modes map to routes via
 * data-scene-mode on [data-engine-root] (route continuity map, storyboard §3):
 *  atlas     Services index — seated ring under studio light, slow inspection
 *  dormant   Work index — dim supporting presence; DOM media leads
 *  build     MVPs — ring assembles around the founder's seed as the page tells it
 *  decompose About — opens dark and seated; scatters into parts as people arrive
 *  rest      Contact — resolved, warm, almost still (HF-02 plate)
 */
export class AmbientScene implements SceneModule {
  route = "*";

  private engine!: EngineModel;
  private rig = new Group();
  private key!: DirectionalLight;
  private ambient!: AmbientLight;
  private ctx!: SceneContext;
  private mode: Mode = "dormant";
  private stream!: StreamField;
  private ground!: Color;
  private warm!: Color;
  private plate: Mesh | null = null;
  private plateMat: MeshBasicMaterial | null = null;
  private plateGeo: PlaneGeometry | null = null;
  private plateTex: Texture | null = null;

  init(ctx: SceneContext): void {
    this.ctx = ctx;
    const rootEl = document.querySelector<HTMLElement>("[data-engine-root]");
    this.mode = (rootEl?.dataset["sceneMode"] as Mode) ?? "dormant";

    this.engine = buildEngine(ctx.capabilities.tier === "A");
    this.rig.add(this.engine.root);
    this.rig.scale.setScalar(0.72);
    ctx.scene.add(this.rig);
    this.stream = buildStreamField(ctx.capabilities.tier === "A" ? 1200 : 500);
    this.rig.add(this.stream.points);
    this.ground = clearColor("#030407", ctx.capabilities.tier === "A");
    this.warm = clearColor("#160e05", ctx.capabilities.tier === "A");

    const cool = this.mode === "decompose";
    this.key = new DirectionalLight(cool ? "#dfe6ff" : this.mode === "rest" ? "#ffd9a0" : "#ffffff", 2.0);
    this.key.position.set(3, 5, 3);
    this.ambient = new AmbientLight("#dfe3f0", this.mode === "decompose" ? 0.2 : 0.5);
    ctx.scene.add(this.key, this.ambient);

    const seated = this.mode !== "build";
    for (const mod of this.engine.modules) {
      if (seated) {
        mod.group.position.copy(mod.aligned);
        mod.group.rotation.set(0, (mod.index / 12) * Math.PI * 2, 0);
      } else {
        mod.group.position.copy(mod.scattered).multiplyScalar(1.6);
      }
      mod.conduitUniforms.uActivation.value =
        this.mode === "rest" ? 1 : this.mode === "atlas" ? 0.4 : 0.15;
    }

    if (this.mode === "dormant") {
      this.rig.position.set(2.6, 0.4, -1.5);
      this.rig.scale.setScalar(0.45);
    }
    if (this.mode === "build") {
      new TextureLoader().load("/media/hf06-blueprint.webp", (tex) => {
        tex.colorSpace = SRGBColorSpace;
        this.plateTex = tex;
        this.plateGeo = new PlaneGeometry(32, 13.5);
        this.plateMat = new MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
          toneMapped: false,
        });
        this.plate = new Mesh(this.plateGeo, this.plateMat);
        this.plate.position.set(0, 0, -10);
        this.ctx.scene.add(this.plate);
      });
    }
    if (this.mode === "rest") {
      new TextureLoader().load("/media/hf02-resolution.webp", (tex) => {
        tex.colorSpace = SRGBColorSpace;
        this.plateTex = tex;
        this.plateGeo = new PlaneGeometry(32, 13.5);
        this.plateMat = new MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          toneMapped: false,
        });
        this.plate = new Mesh(this.plateGeo, this.plateMat);
        this.plate.position.set(0, 0, -10);
        this.ctx.scene.add(this.plate);
      });
    }

    ctx.camera.position.set(0.4, 0.8, this.mode === "dormant" ? 7 : 5.4);
    ctx.camera.lookAt(this.mode === "dormant" ? 1.4 : 0, 0, 0);
  }

  update(state: MasterState, _dt: number): void {
    const t = state.elapsed;
    const p = state.pageProgress;
    const portrait = state.viewport.w < 700;
    const cam = this.ctx.camera;

    this.stream.uniforms.uTime.value = t;
    const energyByMode: Record<Mode, number> = {
      atlas: 0.55,
      dormant: 0.25,
      build: 0.25 + MathUtils.smoothstep(p, 0.05, 0.8) * 0.6,
      decompose: 0.8 * (1 - MathUtils.smoothstep(p, 0.55, 0.9)) + 0.2,
      rest: 0.7,
    };
    this.stream.uniforms.uEnergy.value = energyByMode[this.mode];
    for (const mod of this.engine.modules) {
      mod.gyro.rotation.z = t * (0.15 + mod.index * 0.012);
      mod.channelUniforms.uTime.value = t * 0.7;
      mod.channelUniforms.uActivation.value = Math.max(
        mod.conduitUniforms.uActivation.value,
        0.3,
      );
    }

    switch (this.mode) {
      case "atlas": {
        this.rig.rotation.y = t * 0.04 + p * Math.PI * 2;
        const active = Math.min(11, Math.floor(p * 12));
        for (const mod of this.engine.modules) {
          mod.conduitUniforms.uActivation.value = mod.index === active ? 1 : 0.35;
          mod.conduitUniforms.uTime.value = t;
        }
        cam.position.set(0.4 + state.pointer.x * 0.1, 0.8, (portrait ? 6.6 : 5.4) - p * 0.8);
        cam.lookAt(0, 0, 0);
        break;
      }
      case "build": {
        const assemble = MathUtils.smoothstep(p, 0.05, 0.8);
        // Blueprint dark holds through the hero and the pinned build story,
        // then hands back to paper for the reading sections.
        this.ctx.renderer.setClearColor(this.ground, 1 - MathUtils.smoothstep(p, 0.68, 0.8));
        if (this.plateMat) this.plateMat.opacity = 0.6 * (1 - MathUtils.smoothstep(p, 0.6, 0.78));
        for (const mod of this.engine.modules) {
          const from = mod.scattered.clone().multiplyScalar(1.6);
          mod.group.position.lerpVectors(from, mod.aligned, assemble);
          mod.group.rotation.y = (mod.index / 12) * Math.PI * 2 * assemble;
          mod.conduitUniforms.uActivation.value = MathUtils.clamp((assemble - 0.8) * 5, 0, 1);
          mod.conduitUniforms.uTime.value = t;
        }
        this.engine.coreLight.intensity = assemble * 1.8;
        cam.position.set(0.3 + state.pointer.x * 0.08, 0.6, (portrait ? 7 : 5.8) - assemble * 1.2);
        cam.lookAt(0, 0, 0);
        break;
      }
      case "decompose": {
        const scatter = MathUtils.smoothstep(p, 0.1, 0.6);
        const human = MathUtils.smoothstep(p, 0.55, 0.9);
        for (const mod of this.engine.modules) {
          const out = mod.aligned.clone().multiplyScalar(1 + scatter * 1.4);
          out.y += Math.sin(mod.index * 2.1) * scatter * 0.8;
          mod.group.position.copy(out);
          mod.group.rotation.y = (mod.index / 12) * Math.PI * 2 + scatter * Math.sin(mod.index);
          mod.conduitUniforms.uActivation.value = 0.15 * (1 - scatter);
          mod.conduitUniforms.uTime.value = t;
        }
        // Opens dark; hands back to paper as people arrive; key warms.
        this.ctx.renderer.setClearColor(this.ground, 1 - human);
        this.key.color.lerpColors(new Color("#dfe6ff"), new Color("#ffd9a0"), human);
        this.key.intensity = 2.0 + human * 0.4;
        cam.position.set(state.pointer.x * 0.1, 0.6 - human * 0.4, 5.4 + scatter * 1.4);
        cam.lookAt(0, 0, 0);
        break;
      }
      case "rest": {
        this.ctx.renderer.setClearColor(this.warm, 1);
        this.engine.coreLight.intensity = 2.0 + Math.sin(t * 0.4) * 0.15;
        this.rig.rotation.y = t * 0.02;
        for (const mod of this.engine.modules) mod.conduitUniforms.uTime.value = t * 0.4;
        cam.position.set(state.pointer.x * 0.06, 0.5 + state.pointer.y * 0.04, portrait ? 6.8 : 5.6);
        cam.lookAt(0, 0, 0);
        break;
      }
      case "dormant": {
        this.rig.rotation.y = t * 0.03;
        for (const mod of this.engine.modules) mod.conduitUniforms.uTime.value = t * 0.3;
        cam.position.set(0.4 + state.pointer.x * 0.05, 0.8, 7);
        cam.lookAt(1.4, 0, 0);
        break;
      }
    }
  }

  resize(): void {}

  dispose(): void {
    this.ctx.renderer.setClearColor(0x000000, 0);
    this.ctx.scene.remove(this.rig, this.key, this.ambient);
    if (this.plate) this.ctx.scene.remove(this.plate);
    this.plateGeo?.dispose();
    this.plateMat?.dispose();
    this.plateTex?.dispose();
    this.stream.dispose();
    this.engine.dispose();
    this.key.dispose();
    this.ambient.dispose();
  }
}
