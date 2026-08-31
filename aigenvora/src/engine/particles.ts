import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Points,
  ShaderMaterial,
} from "three";

/**
 * The signal stream — a field of light particles flowing around the module
 * ring. Original GLSL; energy and exposure are scene-driven uniforms so the
 * stream whispers on paper and burns in the chamber.
 */

export interface StreamField {
  points: Points;
  uniforms: {
    uTime: { value: number };
    uEnergy: { value: number };
    uRadius: { value: number };
  };
  dispose(): void;
}

export function buildStreamField(count = 1600, radius = 1.75): StreamField {
  const geo = new BufferGeometry();
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    seeds[i * 3] = Math.random(); // angle seed
    seeds[i * 3 + 1] = Math.random(); // radial/vertical jitter
    seeds[i * 3 + 2] = Math.random(); // speed/size/hue seed
  }
  // Position attribute is required by three; real placement happens in GLSL.
  geo.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute("aSeed", new BufferAttribute(seeds, 3));

  const uniforms = {
    uTime: { value: 0 },
    uEnergy: { value: 0 },
    uRadius: { value: radius },
  };

  const mat = new ShaderMaterial({
    uniforms: uniforms as unknown as ShaderMaterial["uniforms"],
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec3 aSeed;
      uniform float uTime;
      uniform float uRadius;
      varying float vSeed;
      varying float vPulse;
      void main() {
        vSeed = aSeed.z;
        float speed = 0.05 + aSeed.z * 0.12;
        float angle = aSeed.x * 6.28318 + uTime * speed;
        float rad = uRadius + (aSeed.y - 0.5) * 0.55;
        float y = sin(angle * 3.0 + aSeed.y * 6.28318) * 0.22 + (aSeed.y - 0.5) * 0.3;
        vec3 p = vec3(cos(angle) * rad, y, sin(angle) * rad);
        vPulse = 0.5 + 0.5 * sin(uTime * (1.0 + aSeed.z * 2.0) + aSeed.x * 40.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.0 + aSeed.z * 1.8) * (46.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uEnergy;
      varying float vSeed;
      varying float vPulse;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float disc = smoothstep(0.5, 0.08, d);
        vec3 electric = vec3(0.29, 0.39, 1.0);
        vec3 violet = vec3(0.63, 0.54, 1.0);
        vec3 lime = vec3(0.82, 1.0, 0.4);
        vec3 color = vSeed < 0.33 ? electric : (vSeed < 0.66 ? violet : lime);
        float a = disc * uEnergy * (0.35 + 0.65 * vPulse) * 0.32;
        gl_FragColor = vec4(color * (0.7 + 0.6 * vPulse), a);
      }
    `,
  });

  const points = new Points(geo, mat);
  points.frustumCulled = false;

  return {
    points,
    uniforms,
    dispose(): void {
      geo.dispose();
      mat.dispose();
    },
  };
}
