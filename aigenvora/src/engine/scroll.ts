/**
 * Native-scroll → normalized chapter progress. Never hijacks input; the
 * damping happens on the visual side (runtime update loop), not on the wheel.
 */

export interface ChapterRange {
  name: string;
  top: number;
  height: number;
}

export function measureChapters(root: ParentNode = document): ChapterRange[] {
  const els = root.querySelectorAll<HTMLElement>("[data-chapter]");
  const ranges: ChapterRange[] = [];
  els.forEach((el) => {
    const rect = el.getBoundingClientRect();
    ranges.push({
      name: el.dataset.chapter ?? "",
      top: rect.top + window.scrollY,
      height: rect.height,
    });
  });
  return ranges;
}

/**
 * Progress of one chapter: 0 when its top enters the viewport bottom,
 * 1 when its bottom leaves the viewport top.
 */
export function chapterProgress(range: ChapterRange, scrollY: number, viewportH: number): number {
  const start = range.top - viewportH;
  const end = range.top + range.height;
  const span = end - start;
  if (span <= 0) return 0;
  const p = (scrollY - start) / span;
  return Math.min(1, Math.max(0, p));
}

export function pageProgress(scrollY: number, docHeight: number, viewportH: number): number {
  const span = docHeight - viewportH;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / span));
}
