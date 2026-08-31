import {
  ACESFilmicToneMapping,
  Clock,
  HalfFloatType,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { EffectComposer, EffectPass, RenderPass, SMAAEffect } from "postprocessing";
import type { Capabilities, MasterState, SceneModule } from "./types";
import { chapterProgress, measureChapters, pageProgress, type ChapterRange } from "./scroll";
import { damp } from "./timeline";
import { HomeScene } from "./scenes/home";
import { ServiceDetailScene } from "./scenes/service-detail";
import { CaseStudyScene } from "./scenes/case-study";
import { AmbientScene } from "./scenes/ambient";

/**
 * EngineRuntime — one persistent renderer for the whole public site
 * (SCENE-ARCHITECTURE.md). The canvas survives Astro view transitions;
 * routes swap scenes. Pauses when hidden; recovers one context loss, then
 * falls back to posters permanently. Console-zero in production.
 */

const SCENE_REGISTRY: Array<{ match: (path: string) => boolean; create: () => SceneModule }> = [
  { match: (p) => p.startsWith("/services/"), create: () => new ServiceDetailScene() },
  { match: (p) => p.startsWith("/work/") && p !== "/work/", create: () => new CaseStudyScene() },
  { match: (p) => p === "/", create: () => new HomeScene() },
  {
    match: (p) => ["/services", "/work", "/mvps", "/about", "/contact"].includes(p.replace(/\/$/, "")),
    create: () => new AmbientScene(),
  },
];

export class EngineRuntime {
  private renderer: WebGLRenderer;
  private composer: EffectComposer | null = null;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private clock = new Clock();
  private active: SceneModule | null = null;
  private chapters: ChapterRange[] = [];
  private state: MasterState;
  private rafId = 0;
  private running = false;
  private contextLosses = 0;
  private pointerTarget = { x: 0, y: 0 };
  private progressTargets: Record<string, number> = {};
  private pageTarget = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private capabilities: Capabilities,
  ) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: capabilities.tier !== "A", // Tier A gets SMAA via composer instead
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new PerspectiveCamera(38, 1, 0.1, 60);

    if (capabilities.tier === "A") {
      // HalfFloat buffers keep the r152+ color pipeline linear until the final
      // blit — without this the composer double-encodes and lifts the blacks.
      this.composer = new EffectComposer(this.renderer, { frameBufferType: HalfFloatType });
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.composer.addPass(new EffectPass(this.camera, new SMAAEffect()));
    }

    this.state = {
      route: window.location.pathname,
      progress: {},
      pageProgress: 0,
      pointer: { x: 0, y: 0 },
      viewport: { w: window.innerWidth, h: window.innerHeight },
      visible: !document.hidden,
      elapsed: 0,
    };

    this.onResize();
    this.bindEvents();
    this.setRoute(window.location.pathname);

    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>)["__aigenvora"] = {
        tier: capabilities.tier,
        state: this.state,
        runtime: this,
      };
    }
  }

  private bindEvents(): void {
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    this.canvas.addEventListener("webglcontextlost", this.onContextLost, false);
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored, false);
    document.addEventListener("astro:after-swap", this.onRouteSwap);
    // Chapter geometry moves when fonts land.
    document.fonts?.ready.then(() => this.measure()).catch(() => {});
  }

  private onResize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.capabilities.dprCap);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h);
    this.composer?.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.state.viewport = { w, h };
    this.active?.resize(w, h);
    this.measure();
  };

  private onPointerMove = (e: PointerEvent): void => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    // A malformed/synthetic event without coordinates must never poison the
    // damping chain (NaN propagates into the camera matrix and blanks the frame).
    if (Number.isFinite(x) && Number.isFinite(y)) {
      this.pointerTarget.x = x;
      this.pointerTarget.y = y;
    }
  };

  private onVisibility = (): void => {
    this.state.visible = !document.hidden;
    if (this.state.visible) this.start();
    else this.stop();
  };

  private onContextLost = (e: Event): void => {
    e.preventDefault();
    this.contextLosses += 1;
    this.stop();
    if (this.contextLosses > 1) this.fail();
  };

  private onContextRestored = (): void => {
    if (this.contextLosses > 1) return;
    // Rebuild the active scene against the restored context.
    this.setRoute(this.state.route);
    this.start();
  };

  private onRouteSwap = (): void => {
    this.setRoute(window.location.pathname);
  };

  /** Permanent fallback: posters take over via CSS, engine tears down. */
  private fail(): void {
    document.documentElement.dataset["engine"] = "failed";
    this.dispose();
  }

  setRoute(pathname: string): void {
    this.state.route = pathname;
    this.active?.dispose();
    this.active = null;
    this.scene.clear();

    const entry = SCENE_REGISTRY.find((s) => s.match(pathname));
    this.canvas.classList.toggle("engine-idle", !entry);
    if (!entry) {
      this.measure();
      return;
    }
    this.active = entry.create();
    this.active.init({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      capabilities: this.capabilities,
    });
    this.measure();
  }

  private measure(): void {
    this.chapters = measureChapters();
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    const loop = (): void => {
      if (!this.running) return;
      this.rafId = requestAnimationFrame(loop);
      this.tick();
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private tick(): void {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.state.elapsed += dt;

    // Scroll targets (cheap reads) → damped visual state.
    const scrollY = window.scrollY;
    const vh = this.state.viewport.h;
    for (const ch of this.chapters) {
      this.progressTargets[ch.name] = chapterProgress(ch, scrollY, vh);
    }
    this.pageTarget = pageProgress(scrollY, document.documentElement.scrollHeight, vh);

    const smooth = 9; // damping response — MOTION-MATRIX "damped interpolation"
    for (const [name, target] of Object.entries(this.progressTargets)) {
      this.state.progress[name] = damp(this.state.progress[name] ?? target, target, smooth, dt);
    }
    this.state.pageProgress = damp(this.state.pageProgress, this.pageTarget, smooth, dt);
    this.state.pointer.x = damp(this.state.pointer.x, this.pointerTarget.x, 5, dt);
    this.state.pointer.y = damp(this.state.pointer.y, this.pointerTarget.y, 5, dt);

    this.active?.update(this.state, dt);

    if (this.composer) this.composer.render(dt);
    else this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.stop();
    this.active?.dispose();
    this.active = null;
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("visibilitychange", this.onVisibility);
    document.removeEventListener("astro:after-swap", this.onRouteSwap);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.composer?.dispose();
    this.renderer.dispose();
  }
}
