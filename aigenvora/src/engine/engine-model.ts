import {
  CatmullRomCurve3,
  CylinderGeometry,
  Group,
  Mesh,
  PointLight,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
  type ShaderMaterial,
} from "three";
import {
  ceramicMaterial,
  conduitMaterial,
  conduitUniformsOf,
  glassMaterial,
  titaniumMaterial,
  type ConduitUniforms,
} from "./materials";

/**
 * The Aigenvora Engine v2 — machined hex nodes, not cubes. Each module:
 * a beveled hexagonal titanium body, a ceramic crown, a glass lens, an
 * emissive channel around the waist (the conduit shader), and a thin tilted
 * gyro ring. All parametric, all original, no downloads.
 */

/** Service accents (blue/violet/lime rotation; warm reserved for the core). */
export const MODULE_ACCENTS = [
  "#4a63ff", "#a18aff", "#d2ff65", "#4a63ff", "#a18aff", "#d2ff65",
  "#4a63ff", "#a18aff", "#d2ff65", "#4a63ff", "#a18aff", "#d2ff65",
] as const;

const RING_RADIUS = 1.7;

function scatterOffset(i: number): Vector3 {
  const a = Math.sin(i * 127.1) * 43758.5453;
  const b = Math.sin(i * 269.5) * 12543.853;
  const c = Math.sin(i * 419.2) * 32654.221;
  const f = (n: number) => (n - Math.floor(n)) * 2 - 1;
  return new Vector3(f(a) * 0.75, f(b) * 0.6, f(c) * 0.5);
}

export interface EngineModule {
  group: Group;
  gyro: Mesh;
  conduitUniforms: ConduitUniforms;
  channelUniforms: ConduitUniforms;
  aligned: Vector3;
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
  const seg = tierA ? 1 : 0.6;

  // Shared module geometry
  const bodyGeo = new CylinderGeometry(0.3, 0.36, 0.2, 6, 1);
  const crownGeo = new CylinderGeometry(0.24, 0.28, 0.07, 6, 1);
  const lensGeo = new SphereGeometry(0.15, Math.round(24 * seg) + 8, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const channelGeo = new TorusGeometry(0.315, 0.02, 8, Math.round(40 * seg) + 8);
  const gyroGeo = new TorusGeometry(0.37, 0.006, 6, Math.round(56 * seg) + 8);
  geometries.push(bodyGeo, crownGeo, lensGeo, channelGeo, gyroGeo);

  const ceramic = ceramicMaterial();
  const titanium = titaniumMaterial();
  const glass = glassMaterial(tierA);
  const shaderMats: ShaderMaterial[] = [];

  // Core: a machined reactor — titanium drum, ceramic discs, glass dome.
  const core = new Group();
  const drumGeo = new CylinderGeometry(0.3, 0.34, 0.34, 12);
  const discGeo = new CylinderGeometry(0.42, 0.42, 0.06, 24);
  const domeGeo = new SphereGeometry(0.22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  geometries.push(drumGeo, discGeo, domeGeo);
  const drum = new Mesh(drumGeo, titanium);
  const discTop = new Mesh(discGeo, ceramic);
  const discBottom = new Mesh(discGeo, ceramic);
  const dome = new Mesh(domeGeo, glass);
  discTop.position.y = 0.2;
  discBottom.position.y = -0.2;
  dome.position.y = 0.23;
  const coreChannelMat = conduitMaterial("#ffb84d");
  shaderMats.push(coreChannelMat);
  const coreChannel = new Mesh(channelGeo, coreChannelMat);
  coreChannel.rotation.x = Math.PI / 2;
  conduitUniformsOf(coreChannelMat).uActivation.value = 1;
  core.add(drum, discTop, discBottom, dome, coreChannel);
  root.add(core);

  const coreLight = new PointLight("#ffb84d", 0, 6);
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
    const accent = MODULE_ACCENTS[i] ?? "#4a63ff";

    const group = new Group();
    group.name = `module-${i}`;

    const body = new Mesh(bodyGeo, titanium);
    const crown = new Mesh(crownGeo, ceramic);
    crown.position.y = 0.135;
    const lens = new Mesh(lensGeo, glass);
    lens.position.y = 0.17;
    lens.scale.setScalar(0.9);

    const channelMat = conduitMaterial(accent);
    shaderMats.push(channelMat);
    const channel = new Mesh(channelGeo, channelMat);
    channel.rotation.x = Math.PI / 2;

    const gyro = new Mesh(gyroGeo, titanium);
    gyro.rotation.set(Math.sin(i * 2.3) * 0.45, 0, Math.cos(i * 1.7) * 0.45);

    group.add(body, crown, lens, channel, gyro);

    // Conduit cable toward the core.
    const dir = aligned.clone().normalize();
    const curve = new CatmullRomCurve3([
      new Vector3(0, -0.08, 0),
      dir.clone().multiplyScalar(-RING_RADIUS * 0.35).add(new Vector3(0, 0.22, 0)),
      dir.clone().multiplyScalar(-RING_RADIUS * 0.82),
    ]);
    const tubeGeo = new TubeGeometry(curve, 20, 0.011, 6, false);
    geometries.push(tubeGeo);
    const conduitMat = conduitMaterial(accent);
    shaderMats.push(conduitMat);
    group.add(new Mesh(tubeGeo, conduitMat));

    group.position.copy(scattered);
    root.add(group);

    modules.push({
      group,
      gyro,
      conduitUniforms: conduitUniformsOf(conduitMat),
      channelUniforms: conduitUniformsOf(channelMat),
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
      shaderMats.forEach((m) => m.dispose());
    },
  };
}
