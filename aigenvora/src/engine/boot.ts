import { detectCapabilities } from "./capabilities";

/**
 * Engine boot — tiny, synchronous-safe entry. Decides the tier, stamps it on
 * <html> for CSS (posters vs canvas), and defers the heavy engine chunk until
 * the page is interactive so first paint never waits on Three.js.
 */
export function bootEngine(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("canvas[data-engine-canvas]");
  if (!canvas) return;

  const caps = detectCapabilities();
  document.documentElement.dataset["tier"] = caps.tier;
  if (caps.tier === "C") return; // designed static mode — no engine download at all

  let started = false;
  const start = (): void => {
    if (started) return;
    started = true;
    void import("./runtime").then(({ EngineRuntime }) => {
      const runtime = new EngineRuntime(canvas, caps);
      runtime.start();
      canvas.classList.add("engine-live");
      // Two frames in, the first render is on screen — posters may crossfade.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (document.documentElement.dataset["engine"] !== "failed") {
            document.documentElement.dataset["engine"] = "live";
          }
        }),
      );
    });
  };

  // The preloader hides the page — boot immediately behind it so the engine
  // is live the moment the curtain lifts.
  if (document.documentElement.dataset["loader"] === "1") {
    start();
    return;
  }

  // After load + idle, or on first intent (scroll/pointer), whichever first.
  const idle = (): void => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => start(), { timeout: 1500 });
    } else {
      setTimeout(start, 400);
    }
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  window.addEventListener("scroll", start, { once: true, passive: true });
  window.addEventListener("pointermove", start, { once: true, passive: true });
}
