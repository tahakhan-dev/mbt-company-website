import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  PointLight,
  SRGBColorSpace,
  TetrahedronGeometry,
  TextureLoader,
  Vector3,
  type Texture,
} from "three";
import type { MasterState, SceneContext, SceneModule } from "../types";
import { buildEngine, type EngineModel } from "../engine-model";
import { clearColor } from "../color";
import { easeMech, track, track3 } from "../timeline";

/**
 * Home — the full nine-chapter arc (storyboard §2). One engine, one camera,
 * seven narrative states. Chapter progresses come from [data-chapter]
 * sections; every visual property is a pure function of them.
 *
 * Tonal plan (§6.1): paper → chamber → studio → studio → split dark → media
 * accent → paper → warm paper → warm dark resolution.
 */

const assembleTrack = track([
  { t: 0.0, v: 0 },
  { t: 0.25, v: 0.06, ease: easeMech },
  { t: 1.0, v: 1, ease: easeMech },
]);

const cameraArrival = track3([
  { t: 0.0, v: [0.4, 0.6, 6.4] },
  { t: 0.5, v: [1.6, 0.2, 4.6] },
  { t: 1.0, v: [0.2, 0.9, 5.2], ease: easeMech },
]);

const rigXTrack = track([
  { t: 0.0, v: 2.5 },
  { t: 0.45, v: 0, ease: easeMech },
]);

/** Chamber alpha over the arrival+problem phase; falls as the studio arrives. */
const chamberRise = track([
  { t: 0.3, v: 0 },
  { t: 0.55, v: 1, ease: easeMech },
]);

export class HomeScene implements SceneModule {
  route = "/";

  private engine!: EngineModel;
  private rig = new Group();
  private key!: DirectionalLight;
  private fill!: DirectionalLight;
  private ambient!: AmbientLight;
  private portal!: PointLight;
  private ctx!: SceneContext;
  private lookTarget = new Vector3();
  private posOut: [number, number, number] = [0, 0, 0];
  private voidColor!: Color;
  private warmColor!: Color;
  private groundColor = new Color();
  private keyCool = new Color("#dfe6ff");
  private keyStudio = new Color("#ffffff");
  private keyWarm = new Color("#ffd9a0");
  private keyColor = new Color();
  private seed!: Mesh;
  private seedGeo!: TetrahedronGeometry;
  private seedMat!: MeshPhysicalMaterial;
  private orbitCurrent = 0;
  private plates: {
    mesh: Mesh | null;
    mat: MeshBasicMaterial | null;
    geo: PlaneGeometry | null;
    tex: Texture | null;
  }[] = [];

  init(ctx: SceneContext): void {
    this.ctx = ctx;
    this.engine = buildEngine(ctx.capabilities.tier === "A");
    this.rig.add(this.engine.root);
    this.rig.scale.setScalar(0.72);
    ctx.scene.add(this.rig);
    this.voidColor = clearColor("#030407", ctx.capabilities.tier === "A");
    this.warmColor = clearColor("#160e05", ctx.capabilities.tier === "A");

    this.key = new DirectionalLight("#dfe6ff", 2.6);
    this.key.position.set(4, 3, 2);
    this.fill = new DirectionalLight("#f2f3f8", 1.5);
    this.fill.position.set(-3, 1, 4);
    this.ambient = new AmbientLight("#c8ccdb", 0.35);
    this.portal = new PointLight("#7957ff", 0, 12);
    this.portal.position.set(0, 0.5, 1.5);
    ctx.scene.add(this.key, this.fill, this.ambient, this.portal);

    // The founder's seed — a glass tetrahedron that grows in Chapter 4.
    this.seedGeo = new TetrahedronGeometry(0.34);
    this.seedMat = new MeshPhysicalMaterial({
      color: new Color("#aab6d8"),
      roughness: 0.05,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1,
    });
    this.seed = new Mesh(this.seedGeo, this.seedMat);
    this.seed.scale.setScalar(0.001);
    this.rig.add(this.seed);

    ctx.camera.position.set(0.4, 0.6, 6.4);
    ctx.camera.lookAt(0, 0, 0);

    this.loadPlate("/media/hf01-chamber.webp", -9);
    this.loadPlate("/media/hf02-resolution.webp", -10);
  }

  private loadPlate(url: string, z: number): void {
    const slot: (typeof this.plates)[number] = { mesh: null, mat: null, geo: null, tex: null };
    this.plates.push(slot);
    new TextureLoader().load(url, (tex) => {
      tex.colorSpace = SRGBColorSpace;
      slot.tex = tex;
      slot.geo = new PlaneGeometry(32, 13.5);
      slot.mat = new MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
      });
      slot.mesh = new Mesh(slot.geo, slot.mat);
      slot.mesh.position.set(0, 0, z);
      this.ctx.scene.add(slot.mesh);
    });
  }

  update(state: MasterState, dt: number): void {
    const t = state.elapsed;
    const P = state.progress;
    const p1 = P["arrival"] ?? 0;
    const p2 = P["problem"] ?? 0;
    const p3 = P["system"] ?? 0;
    const p4 = P["founders"] ?? 0;
    const p5 = P["transformation"] ?? 0;
    const p6 = P["work"] ?? 0;
    const p8 = P["people"] ?? 0;
    const p9 = P["resolution"] ?? 0;

    // ---- State: Unresolved → Alignment (Ch.1–2) ----
    const pIntro = Math.min(1, p1 * 0.5 + p2 * 0.5);
    const assembly = Math.max(assembleTrack(pIntro), MathUtils.clamp(p3 * 4, 0, 1));

    // ---- Ch.4: the ring parts for the founder's seed ----
    const retract = MathUtils.smoothstep(p4, 0.05, 0.5) * (1 - MathUtils.smoothstep(p4, 0.85, 1));

    for (const mod of this.engine.modules) {
      const { group, scattered, aligned, index } = mod;
      const driftAmp = (1 - assembly) * 0.18;
      const spread = 1 + retract * 0.9;
      group.position.set(
        MathUtils.lerp(scattered.x, aligned.x * spread, assembly) +
          Math.sin(t * 0.4 + index * 1.7) * driftAmp,
        MathUtils.lerp(scattered.y, aligned.y, assembly) +
          Math.cos(t * 0.31 + index * 2.3) * driftAmp,
        MathUtils.lerp(scattered.z, aligned.z * spread, assembly) +
          Math.sin(t * 0.23 + index * 3.1) * driftAmp,
      );
      const wobble = (1 - assembly) * 0.5;
      group.rotation.set(
        Math.sin(index * 1.3) * wobble,
        Math.cos(index * 2.1) * wobble + assembly * ((index / 12) * Math.PI * 2),
        Math.sin(index * 0.7) * wobble,
      );
      const seatPoint = 0.75 + (index / 12) * 0.2;
      const activation = MathUtils.clamp((assembly - seatPoint) / 0.08, 0, 1);
      // Ch.3 highlights the active service module; the rest idle at 0.35.
      const activeIdx = Math.min(11, Math.floor(p3 * 12));
      const focusBoost = p3 > 0.02 && p3 < 0.98 && index === activeIdx ? 1 : 0;
      mod.conduitUniforms.uActivation.value = Math.max(activation * 0.35, focusBoost);
      mod.conduitUniforms.uTime.value = t;
    }

    // ---- Ch.3: orbit steps through the atlas ----
    const activeIdx = Math.min(11, Math.floor(p3 * 12));
    const orbitTarget = p3 > 0 ? -(activeIdx / 12) * Math.PI * 2 : 0;
    this.orbitCurrent += (orbitTarget - this.orbitCurrent) * (1 - Math.exp(-6 * dt));

    // ---- Ch.4: seed grows into a small product ----
    const seedScale = MathUtils.smoothstep(p4, 0.1, 0.7) * (1 - MathUtils.smoothstep(p9, 0.6, 1));
    this.seed.scale.setScalar(Math.max(0.001, seedScale));
    this.seed.rotation.y = t * 0.3;
    this.seed.rotation.x = t * 0.17;

    // ---- Lighting arc across the page ----
    const chamber = chamberRise(pIntro) * (1 - MathUtils.smoothstep(p3, 0, 0.25));
    const splitDark = MathUtils.smoothstep(p5, 0.05, 0.35) * (1 - MathUtils.smoothstep(p5, 0.75, 1));
    const human = MathUtils.smoothstep(p8, 0.1, 0.6);
    const resolution = MathUtils.smoothstep(p9, 0.15, 0.7);

    // Key: cool → studio white → warm (people/resolution).
    this.keyColor
      .copy(this.keyCool)
      .lerp(this.keyStudio, MathUtils.clamp(p3 * 2 + p4, 0, 1))
      .lerp(this.keyWarm, Math.max(human, resolution));
    this.key.color.copy(this.keyColor);
    this.key.intensity =
      2.6 - pIntro * 1.7 + MathUtils.smoothstep(p3, 0, 0.3) * 1.4 - splitDark * 1.2 - resolution * 0.8;
    this.fill.intensity = 1.5 - pIntro * 0.9 + MathUtils.smoothstep(p3, 0, 0.3) * 0.4 - splitDark * 0.5;
    this.ambient.intensity = 0.35 - chamber * 0.22 + human * 0.15;
    this.engine.coreLight.intensity =
      assembly * 0.8 + resolution * 2.2 + MathUtils.smoothstep(p4, 0.2, 0.8) * 0.8;

    // Ch.6: project accent reflects onto the engine.
    this.portal.intensity = MathUtils.smoothstep(p6, 0.1, 0.4) * (1 - MathUtils.smoothstep(p6, 0.8, 1)) * 2.2;

    // ---- Rendered ground: chamber void / split dark / warm resolution ----
    const groundAlpha = Math.max(chamber, splitDark * 0.85, resolution);
    this.groundColor.copy(resolution > Math.max(chamber, splitDark) ? this.warmColor : this.voidColor);
    this.ctx.renderer.setClearColor(this.groundColor, groundAlpha);

    // ---- Plates ----
    const plate1 = this.plates[0];
    if (plate1?.mat && plate1.mesh) {
      plate1.mat.opacity = Math.max(chamber, splitDark * 0.6) * 0.55;
      plate1.mesh.position.x = Math.sin(t * 0.02) * 0.5 + state.pointer.x * -0.4;
      plate1.mesh.position.y = Math.cos(t * 0.016) * 0.25 + state.pointer.y * 0.25;
    }
    const plate2 = this.plates[1];
    if (plate2?.mat && plate2.mesh) {
      plate2.mat.opacity = resolution * 0.6;
      plate2.mesh.position.x = Math.sin(t * 0.013) * 0.35 + state.pointer.x * -0.3;
    }

    // ---- Rig placement ----
    const portrait = state.viewport.w < 700;
    const inspectShift = MathUtils.smoothstep(p3, 0, 0.2) * (1 - MathUtils.smoothstep(p4, 0, 0.3));
    // Atlas chapter: the list owns the right column, the engine moves left-low.
    this.rig.position.x =
      rigXTrack(pIntro) * (portrait ? 0.1 : 1) - inspectShift * (portrait ? 0 : 1.7);
    // People: the engine recedes upward and shrinks; Resolution: settles back.
    const recede = human * (1 - resolution);
    this.rig.scale.setScalar(0.72 * (1 - recede * 0.45) * (1 - resolution * 0.12));
    this.rig.position.y = recede * 1.6 - resolution * 0.2 - inspectShift * 0.5;
    this.rig.rotation.y = Math.sin(t * 0.05) * 0.03 + this.orbitCurrent;

    // ---- Camera ----
    const cam = this.ctx.camera;
    cameraArrival(pIntro, this.posOut);
    let cx = this.posOut[0];
    let cy = this.posOut[1];
    let cz = this.posOut[2] + (portrait ? 1.1 : 0);
    // Ch.3 inspection: settle to a steady atlas frame.
    const inspect = MathUtils.smoothstep(p3, 0, 0.2);
    cx = MathUtils.lerp(cx, 0.6, inspect);
    cy = MathUtils.lerp(cy, 0.7, inspect);
    cz = MathUtils.lerp(cz, portrait ? 6.2 : 5.0, inspect);
    // Ch.4 push-in on the seed.
    const push = MathUtils.smoothstep(p4, 0.15, 0.75) * (1 - MathUtils.smoothstep(p5, 0.1, 0.4));
    cz -= push * 1.6;
    cy -= push * 0.5;
    // Ch.5 lateral truck.
    cx += (MathUtils.smoothstep(p5, 0.1, 0.9) - 0.5) * splitDark * 2.2;
    // Ch.9 settle.
    cz += resolution * 0.8;
    cy += resolution * 0.3;
    cam.position.set(cx, cy, cz);
    this.lookTarget.set(this.rig.position.x * 0.35, this.rig.position.y * 0.6, 0);
    cam.lookAt(this.lookTarget);
    cam.rotation.x += state.pointer.y * 0.02;
    cam.rotation.y += state.pointer.x * -0.026;
  }

  resize(): void {}

  dispose(): void {
    this.ctx.renderer.setClearColor(0x000000, 0);
    this.ctx.scene.remove(this.rig, this.key, this.fill, this.ambient, this.portal);
    for (const p of this.plates) {
      if (p.mesh) this.ctx.scene.remove(p.mesh);
      p.geo?.dispose();
      p.mat?.dispose();
      p.tex?.dispose();
    }
    this.seedGeo.dispose();
    this.seedMat.dispose();
    this.engine.dispose();
    this.key.dispose();
    this.fill.dispose();
    this.ambient.dispose();
    this.portal.dispose();
  }
}
