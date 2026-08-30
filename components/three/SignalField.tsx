"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { fieldState } from "@/lib/three/field-state";
import { FIELD_PALETTES, type FieldPalette } from "@/lib/three/field-palette";

/**
 * "Signal Field" — a living neural constellation. ~1.4k GPU points with
 * precomputed nearest-neighbor links. Breathes via vertex-shader noise,
 * drifts toward the pointer with inertia, and morphs from an organic cloud
 * into an ordered lattice as the hero is scrolled (fieldState.progress).
 * Points and lines share one displacement function so links stay attached.
 */

const COUNT = 1400;
const MAX_LINKS = 2100;
const LINK_DIST = 2.35;

const DISPLACE = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uPointer;

  vec3 displace(vec3 chaos, vec3 lattice, float seed) {
    vec3 base = mix(chaos, lattice, smoothstep(0.0, 1.0, uProgress));
    float t = uTime * 0.35 + seed * 6.2831;
    float amp = mix(0.55, 0.16, uProgress);
    base.x += sin(t + base.y * 0.35) * amp;
    base.y += cos(t * 0.8 + base.z * 0.4 + seed * 3.0) * amp * 0.8;
    base.z += sin(t * 0.6 + base.x * 0.3) * amp * 0.6;

    vec3 toPointer = uPointer - base;
    float d = length(toPointer);
    float pull = smoothstep(7.0, 0.0, d) * 1.4;
    base += normalize(toPointer + 0.0001) * pull;
    return base;
  }
`;

const POINT_VERT = /* glsl */ `
  ${DISPLACE}
  attribute vec3 aLattice;
  attribute float aSeed;
  varying float vSeed;
  varying float vGlow;
  void main() {
    vSeed = aSeed;
    vec3 p = displace(position, aLattice, aSeed);
    float d = length(uPointer - p);
    vGlow = smoothstep(6.5, 0.0, d);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + aSeed * 2.6 + vGlow * 2.2) * (34.0 / -mv.z);
  }
`;

const POINT_FRAG = /* glsl */ `
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform vec3 uColC;
  uniform float uPointAlpha;
  varying float vSeed;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float alpha = smoothstep(0.5, 0.08, r);
    vec3 col = mix(uColA, uColB, vSeed);
    col = mix(col, uColC, vGlow * 0.7);
    gl_FragColor = vec4(col, alpha * (0.5 + vSeed * 0.35 + vGlow * 0.4) * uPointAlpha);
  }
`;

const LINE_VERT = /* glsl */ `
  ${DISPLACE}
  attribute vec3 aLattice;
  attribute float aSeed;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec3 p = displace(position, aLattice, aSeed);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const LINE_FRAG = /* glsl */ `
  uniform float uProgress;
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform float uLineAlpha;
  varying float vSeed;
  void main() {
    vec3 col = mix(uColA, uColB, vSeed);
    gl_FragColor = vec4(col, uLineAlpha + uProgress * 0.08);
  }
`;

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type FieldData = {
  chaos: Float32Array;
  lattice: Float32Array;
  seeds: Float32Array;
  lineChaos: Float32Array;
  lineLattice: Float32Array;
  lineSeeds: Float32Array;
};

function buildField(): FieldData {
  const rand = mulberry32(20260830);
  const chaos = new Float32Array(COUNT * 3);
  const lattice = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);

  const cols = 50;
  const rows = Math.ceil(COUNT / cols);
  for (let i = 0; i < COUNT; i++) {
    // Chaos: flattened ellipsoid cloud, denser toward the middle.
    const r = Math.pow(rand(), 0.55);
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    chaos[i * 3] = Math.sin(phi) * Math.cos(theta) * 16 * r;
    chaos[i * 3 + 1] = (Math.cos(phi) * 8.5 + Math.sin(theta * 2) * 0.8) * r;
    chaos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * 7 * r;

    // Lattice: ordered plane with a gentle standing wave.
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    const lx = (cx / (cols - 1) - 0.5) * 30;
    const ly = (cy / Math.max(1, rows - 1) - 0.5) * 15;
    lattice[i * 3] = lx;
    lattice[i * 3 + 1] = ly;
    lattice[i * 3 + 2] = Math.sin(lx * 0.45) * Math.cos(ly * 0.5) * 1.6 - 1.5;

    seeds[i] = rand();
  }

  // Nearest-neighbor links in chaos space (one-time O(n²) at init).
  const pairs: number[] = [];
  const maxD2 = LINK_DIST * LINK_DIST;
  for (let i = 0; i < COUNT && pairs.length < MAX_LINKS * 2; i++) {
    let linked = 0;
    for (let j = i + 1; j < COUNT && linked < 2; j++) {
      const dx = chaos[i * 3]! - chaos[j * 3]!;
      const dy = chaos[i * 3 + 1]! - chaos[j * 3 + 1]!;
      const dz = chaos[i * 3 + 2]! - chaos[j * 3 + 2]!;
      if (dx * dx + dy * dy + dz * dz < maxD2) {
        pairs.push(i, j);
        linked++;
      }
    }
  }

  const segCount = pairs.length;
  const lineChaos = new Float32Array(segCount * 3);
  const lineLattice = new Float32Array(segCount * 3);
  const lineSeeds = new Float32Array(segCount);
  for (let k = 0; k < segCount; k++) {
    const idx = pairs[k]!;
    lineChaos.set(chaos.subarray(idx * 3, idx * 3 + 3), k * 3);
    lineLattice.set(lattice.subarray(idx * 3, idx * 3 + 3), k * 3);
    lineSeeds[k] = seeds[idx]!;
  }

  return { chaos, lattice, seeds, lineChaos, lineLattice, lineSeeds };
}

function makeUniforms(palette: FieldPalette) {
  return {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPointer: { value: new THREE.Vector3(0, 0, 40) },
    uColA: { value: new THREE.Vector3(...palette.a) },
    uColB: { value: new THREE.Vector3(...palette.b) },
    uColC: { value: new THREE.Vector3(...palette.c) },
    uPointAlpha: { value: palette.pointAlpha },
    uLineAlpha: { value: palette.lineAlpha },
  };
}

function FieldScene({ palette }: { palette: FieldPalette }) {
  const data = useMemo(() => buildField(), []);
  const pointsMat = useRef<THREE.ShaderMaterial>(null);
  const linesMat = useRef<THREE.ShaderMaterial>(null);
  const pointer3 = useRef(new THREE.Vector3(0, 0, 40));
  const target = useRef(new THREE.Vector3(0, 0, 40));
  const progress = useRef(0);
  const { camera, pointer } = useThree();

  // Re-grade materials when the theme flips (uniform + blending mutation via
  // refs — no geometry rebuild, no per-frame cost).
  useEffect(() => {
    const blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    for (const mat of [pointsMat.current, linesMat.current]) {
      if (!mat) continue;
      (mat.uniforms.uColA!.value as THREE.Vector3).set(...palette.a);
      (mat.uniforms.uColB!.value as THREE.Vector3).set(...palette.b);
      (mat.uniforms.uColC?.value as THREE.Vector3 | undefined)?.set(...palette.c);
      if (mat.uniforms.uPointAlpha) mat.uniforms.uPointAlpha.value = palette.pointAlpha;
      if (mat.uniforms.uLineAlpha) mat.uniforms.uLineAlpha.value = palette.lineAlpha;
      if (mat.blending !== blending) {
        mat.blending = blending;
        mat.needsUpdate = true;
      }
    }
  }, [palette]);

  useFrame((_, delta) => {
    // Scroll morph with easing lag.
    progress.current += (fieldState.progress - progress.current) * Math.min(1, delta * 4);

    // Pointer: NDC ray → z=0 plane, with inertia.
    const ndc = new THREE.Vector3(pointer.x, pointer.y, 0.5).unproject(camera);
    const dir = ndc.sub(camera.position).normalize();
    const t = -camera.position.z / (dir.z || -1);
    target.current.copy(camera.position).addScaledVector(dir, t);
    pointer3.current.lerp(target.current, Math.min(1, delta * 3.2));

    for (const mat of [pointsMat.current, linesMat.current]) {
      if (!mat) continue;
      mat.uniforms.uTime!.value += delta;
      mat.uniforms.uProgress!.value = progress.current;
      (mat.uniforms.uPointer!.value as THREE.Vector3).copy(pointer3.current);
    }
  });

  return (
    <group rotation={[-0.12, 0, 0]}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.chaos, 3]} />
          <bufferAttribute attach="attributes-aLattice" args={[data.lattice, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={pointsMat}
          vertexShader={POINT_VERT}
          fragmentShader={POINT_FRAG}
          uniforms={makeUniforms(palette)}
          transparent
          depthWrite={false}
          blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.lineChaos, 3]} />
          <bufferAttribute attach="attributes-aLattice" args={[data.lineLattice, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.lineSeeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={linesMat}
          vertexShader={LINE_VERT}
          fragmentShader={LINE_FRAG}
          uniforms={makeUniforms(palette)}
          transparent
          depthWrite={false}
          blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function SignalField({
  active,
  onReady,
}: {
  active: boolean;
  onReady?: () => void;
}) {
  // Theme is read OUTSIDE the Canvas (R3F runs its own reconciler root, so
  // outer context isn't bridged) and passed down as a prop.
  const { resolvedTheme } = useTheme();
  const palette = FIELD_PALETTES[resolvedTheme === "light" ? "light" : "dark"];
  return (
    <Canvas
      aria-hidden="true"
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 26], fov: 55, near: 0.1, far: 120 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={() => onReady?.()}
    >
      <FieldScene palette={palette} />
    </Canvas>
  );
}
