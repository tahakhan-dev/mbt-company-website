import {
  BoxGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  Group,
  Mesh,
  PointLight,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
  type ShaderMaterial,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  ceramicMaterial,
  conduitMaterial,
  conduitUniformsOf,
  glassMaterial,
  titaniumMaterial,
  type ConduitUniforms,
} from "./materials";

/**
 * The Aigenvora Engine — parametric original geometry. Twelve modules around
 * a machined core; each module: ceramic shell, titanium chassis, glass face,
 * one conduit reaching toward the core. Geometry is generated, not loaded —
 * no GLB download, nothing derived from any external asset.
 */

/** Service accents (storyboard: blue/violet/lime family rotation; warm reserved). */
export const MODULE_ACCENTS = [
  "#4a63ff", "#a18aff", "#d2ff65", "#4a63ff", "#a18aff", "#d2ff65",
  "#4a63ff", "#a18aff", "#d2ff65", "#4a63ff", "#a18aff", "#d2ff65",
] as const;

const RING_RADIUS = 1.7;

/** Deterministic scatter so the unresolved state is art-directable and stable. */
function scatterOffset(i: number): Vector3 {
  const a = Math.sin(i * 127.1) * 43758.5453;
  const b = Math.sin(i * 269.5) * 12543.853;
  const c = Math.sin(i * 419.2) * 32654.221;
  const f = (n: number) => (n - Math.floor(n)) * 2 - 1;
  return new Vector3(f(a) * 0.75, f(b) * 0.6, f(c) * 0.5);
}

export interface EngineModule {
  group: Group;
  conduitUniforms: ConduitUniforms;
  /** Aligned ring position (the "system" state). */
  aligned: Vector3;
  /** Unresolved drift origin. */
  scattered: Vector3;
  index: number;
}

export interface EngineModel {
  root: Group;
  modules: EngineModule[];
  coreLight: PointLight;
  dispose(): void;
}

export function buildEngine(tierA: boolean): EngineModel {
  const root = new Group();
  root.name = "aigenvora-engine";

  const geometries: BufferGeometry[] = [];
  const shellGeo = new RoundedBoxGeometry(0.62, 0.62, 0.62, 3, 0.09);
  const chassisGeo = new BoxGeometry(0.5, 0.5, 0.5);
  const faceGeo = new BoxGeometry(0.4, 0.4, 0.06);
  geometries.push(shellGeo, chassisGeo, faceGeo);

  const ceramic = ceramicMaterial();
  const titanium = titaniumMaterial();
  const glass = glassMaterial(tierA);
  const conduitMats: ShaderMaterial[] = [];

  // Core: machined stack — two ceramic discs around a titanium drum.
  const core = new Group();
  const drumGeo = new CylinderGeometry(0.3, 0.3, 0.38, 32);
  const discGeo = new CylinderGeometry(0.42, 0.42, 0.08, 32);
  geometries.push(drumGeo, discGeo);
  const drum = new Mesh(drumGeo, titanium);
  const discTop = new Mesh(discGeo, ceramic);
  const discBottom = new Mesh(discGeo, ceramic);
  discTop.position.y = 0.26;
  discBottom.position.y = -0.26;
  core.add(drum, discTop, discBottom);
  root.add(core);

  const coreLight = new PointLight("#ffb84d", 0, 6);
  coreLight.position.set(0, 0, 0);
  root.add(coreLight);

  const modules: EngineModule[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const aligned = new Vector3(
      Math.cos(angle) * RING_RADIUS,
      Math.sin(angle * 2) * 0.12,
      Math.sin(angle) * RING_RADIUS,
    );
    const scattered = aligned.clone().add(scatterOffset(i));

    const group = new Group();
    group.name = `module-${i}`;

    const shell = new Mesh(shellGeo, ceramic);
    const chassis = new Mesh(chassisGeo, titanium);
    chassis.scale.setScalar(0.94);
    chassis.rotation.set(0.16, 0.22, 0);
    const face = new Mesh(faceGeo, glass);
    face.position.z = 0.33;
    group.add(shell, chassis, face);

    // Conduit: curve from the module inward to the core.
    const dir = aligned.clone().normalize();
    const curve = new CatmullRomCurve3([
      new Vector3(0, 0, 0),
      dir.clone().multiplyScalar(-RING_RADIUS * 0.35).add(new Vector3(0, 0.25, 0)),
      dir.clone().multiplyScalar(-RING_RADIUS * 0.8),
    ]);
    const tubeGeo = new TubeGeometry(curve, 20, 0.016, 6, false);
    geometries.push(tubeGeo);
    const conduitMat = conduitMaterial(MODULE_ACCENTS[i] ?? "#4a63ff");
    conduitMats.push(conduitMat);
    const conduit = new Mesh(tubeGeo, conduitMat);
    group.add(conduit);

    group.position.copy(scattered);
    root.add(group);

    modules.push({
      group,
      conduitUniforms: conduitUniformsOf(conduitMat),
      aligned,
      scattered,
      index: i,
    });
  }

  return {
    root,
    modules,
    coreLight,
    dispose(): void {
      geometries.forEach((g) => g.dispose());
      ceramic.dispose();
      titanium.dispose();
      glass.dispose();
      conduitMats.forEach((m) => m.dispose());
    },
  };
}
