import { chapterProgress, measureChapters, type ChapterRange } from "./scroll";
import { damp, easeOutFast } from "./timeline";

/**
 * Scroll-bound text choreography — copy moves on the same chapter progress
 * the engine reads, so type and 3D are one directed piece (motion v2).
 *
 * Markup contract (inside a [data-chapter] section):
 *   data-choreo              → masked block reveal, auto-staggered
 *   data-choreo="words"      → per-word stagger (hero-scale headlines)
 *   data-choreo-start="0.2"  → progress where the reveal begins (optional)
 *   data-choreo-end="0.35"   → progress where it completes (optional)
 *   data-choreo-out="0.8"    → progress where it exits upward (optional)
 *
 * Reduced motion / no-JS: elements simply render static (CSS default is
 * visible; the module only runs when motion is allowed).
 */

interface ChoreoItem {
  el: HTMLElement;
  parts: HTMLElement[];
  chapter: string;
  start: number;
  end: number;
  out: number | null;
  current: number;
}

const AUTO_STAGGER = 0.06;

function splitWords(el: HTMLElement): HTMLElement[] {
  const words = (el.textContent ?? "").split(/\s+/).filter(Boolean);
  el.textContent = "";
  return words.map((w, i) => {
    const outer = document.createElement("span");
    outer.className = "choreo-mask";
    const inner = document.createElement("span");
    inner.className = "choreo-part";
    inner.textContent = w;
    inner.style.transitionDelay = `${i * 0.03}s`;
    outer.appendChild(inner);
    el.appendChild(outer);
    el.appendChild(document.createTextNode(" "));
    return inner;
  });
}

function wrapBlock(el: HTMLElement): HTMLElement[] {
  const outer = document.createElement("span");
  outer.className = "choreo-mask choreo-mask--block";
  const inner = document.createElement("span");
  inner.className = "choreo-part";
  while (el.firstChild) inner.appendChild(el.firstChild);
  outer.appendChild(inner);
  el.appendChild(outer);
  return [inner];
}

export function armChoreo(): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return () => {};

  const items: ChoreoItem[] = [];
  const sections = document.querySelectorAll<HTMLElement>("[data-chapter]");
  sections.forEach((section) => {
    const chapter = section.dataset["chapter"] ?? "";
    const els = section.querySelectorAll<HTMLElement>("[data-choreo]");
    els.forEach((el, i) => {
      if (el.dataset["choreoArmed"]) return;
      el.dataset["choreoArmed"] = "1";
      const mode = el.dataset["choreo"];
      const parts = mode === "words" ? splitWords(el) : wrapBlock(el);
      const start = el.dataset["choreoStart"]
        ? parseFloat(el.dataset["choreoStart"]!)
        : 0.08 + i * AUTO_STAGGER;
      const end = el.dataset["choreoEnd"] ? parseFloat(el.dataset["choreoEnd"]!) : start + 0.1;
      const out = el.dataset["choreoOut"] ? parseFloat(el.dataset["choreoOut"]!) : null;
      items.push({ el, parts, chapter, start, end, out, current: 0 });
    });
  });
  if (items.length === 0) return () => {};

  let chapters: ChapterRange[] = measureChapters();
  const remeasure = (): void => {
    chapters = measureChapters();
  };
  window.addEventListener("resize", remeasure, { passive: true });
  document.fonts?.ready.then(remeasure).catch(() => {});

  let raf = 0;
  let last = performance.now();
  const tick = (): void => {
    raf = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    for (const item of items) {
      const range = chapters.find((c) => c.name === item.chapter);
      if (!range) continue;
      const p = chapterProgress(range, scrollY, vh);
      let target =
        p <= item.start ? 0 : p >= item.end ? 1 : (p - item.start) / (item.end - item.start);
      if (item.out !== null && p > item.out) {
        target = Math.max(0, 1 - (p - item.out) / 0.08) * 1; // exit collapses toward 0 shift upward
      }
      // Damped, then eased — crisp arrival, no IO pop-in.
      item.current = damp(item.current, target, 14, dt);
      const v = easeOutFast(Math.min(1, Math.max(0, item.current)));
      const shift = (1 - v) * 108;
      const exiting = item.out !== null && p > item.out;
      for (const part of item.parts) {
        part.style.transform = `translateY(${exiting ? -shift : shift}%)`;
        part.style.opacity = v < 0.02 ? "0" : "1";
      }
    }
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", remeasure);
  };
}
