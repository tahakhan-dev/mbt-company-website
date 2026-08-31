import {
  Color,
  DoubleSide,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  ShaderMaterial,
  type Material,
} from "three";

/**
 * The Engine's material language (storyboard §1): machined ceramic, dark
 * titanium, optical glass, illuminated conduits. Standard PBR bases carry
 * lighting; the custom GLSL lives in the conduit shader and the ceramic
 * fresnel injection. All shaders original — nothing derived from any
 * third-party site.
 */

export function ceramicMaterial(): MeshStandardMaterial {
  const mat = new MeshStandardMaterial({
    color: new Color("#e8e6df"), // faintly warm machined ceramic
    roughness: 0.38,
    metalness: 0.02,
  });
  mat.envMapIntensity = 0.55;
  mat.onBeforeCompile = (shader) => {
    // Soft fresnel sheen so ceramic edges catch the key light like glaze.
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <lights_fragment_end>",
      /* glsl */ `
      #include <lights_fragment_end>
      {
        vec3 viewDir = normalize(vViewPosition);
        float fres = pow(1.0 - abs(dot(normalize(normal), viewDir)), 3.0);
        reflectedLight.indirectDiffuse += fres * 0.18 * vec3(1.0, 0.98, 0.94);
      }
      `,
    );
  };
  return mat;
}

export function titaniumMaterial(): MeshStandardMaterial {
  const mat = new MeshStandardMaterial({
    color: new Color("#2b303c"),
    roughness: 0.34,
    metalness: 0.95,
  });
  mat.envMapIntensity = 1.15;
  return mat;
}

export function glassMaterial(_tierA: boolean): MeshPhysicalMaterial {
  // Transmission renders black over a transparent clear color (no backdrop to
  // sample), so optical glass is faked with low-opacity dielectric + clearcoat.
  return new MeshPhysicalMaterial({
    color: new Color("#aab6d8"),
    roughness: 0.08,
    metalness: 0,
    transparent: true,
    opacity: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    depthWrite: false,
    side: DoubleSide,
  });
}

export interface ConduitUniforms {
  uActivation: { value: number };
  uAccent: { value: Color };
  uTime: { value: number };
}

/** Original GLSL: light travelling along a conduit, driven by uActivation 0..1. */
export function conduitMaterial(accent: string): ShaderMaterial {
  const uniforms: ConduitUniforms = {
    uActivation: { value: 0 },
    uAccent: { value: new Color(accent) },
    uTime: { value: 0 },
  };
  return new ShaderMaterial({
    uniforms: uniforms as unknown as ShaderMaterial["uniforms"],
    transparent: true,
    vertexShader: /* glsl */ `
      varying float vAlong;
      void main() {
        vAlong = uv.x;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uActivation;
      uniform float uTime;
      uniform vec3 uAccent;
      varying float vAlong;
      void main() {
        // Graphite conduit base — visible but never scribble-black on paper.
        vec3 base = vec3(0.16, 0.17, 0.2);
        // Activation front sweeps from module (uv 0) toward the core (uv 1).
        float front = smoothstep(vAlong - 0.08, vAlong + 0.02, uActivation);
        // Travelling pulse once the conduit is live.
        float pulse = 0.5 + 0.5 * sin((vAlong * 14.0) - uTime * 3.0);
        float glow = front * (0.55 + 0.45 * pulse * step(0.999, uActivation));
        vec3 color = base + uAccent * glow;
        gl_FragColor = vec4(color, 0.92);
      }
    `,
  });
}

export function conduitUniformsOf(mat: ShaderMaterial): ConduitUniforms {
  return mat.uniforms as unknown as ConduitUniforms;
}

export function disposeMaterial(mat: Material | Material[]): void {
  (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose());
}
