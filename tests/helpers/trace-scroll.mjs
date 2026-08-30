/**
 * V1 audit: Chrome performance trace of a full home-page scroll at 4× CPU
 * throttle against the local prod build, plus an in-page rAF frame-delta
 * sampler for dropped-frame %. Parses the trace for long tasks (>50ms) on the
 * renderer main thread and attributes each to its dominant child event.
 *
 * Usage: node scratchpad/trace-home.mjs <traceOut.json> <summaryOut.json> [url] [theme]
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const traceOut = process.argv[2];
const summaryOut = process.argv[3];
const url = process.argv[4] ?? "http://localhost:3111/";
const theme = process.argv[5] ?? "dark";

const env = { ...process.env };
for (const k of ["HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy", "NO_PROXY", "no_proxy"]) delete env[k];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  env,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: theme === "light" ? "light" : "dark",
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(3500); // fonts + hydration + lazy 3D mount settle

// In-page frame sampler (runs through the whole traced scroll)
await page.evaluate(() => {
  const w = /** @type {any} */ (window);
  w.__frames = [];
  let last = performance.now();
  const loop = (t) => {
    w.__frames.push(t - last);
    last = t;
    w.__frameRaf = requestAnimationFrame(loop);
  };
  w.__frameRaf = requestAnimationFrame(loop);
});

await browser.startTracing(page, {
  path: traceOut,
  screenshots: false,
  categories: [
    "toplevel",
    "devtools.timeline",
    "disabled-by-default-devtools.timeline",
    "blink.user_timing",
    "v8.execute",
  ],
});

// Drive a real wheel-based scroll (Lenis listens to wheel) across the full page.
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const steps = 100;
const perStep = Math.ceil((total * 1.15) / steps);
for (let i = 0; i < steps; i++) {
  await page.mouse.wheel(0, perStep);
  await page.waitForTimeout(100); // ~10s total scroll
}
await page.waitForTimeout(1200); // settle at bottom

await browser.stopTracing();

const frames = await page.evaluate(() => {
  const w = /** @type {any} */ (window);
  cancelAnimationFrame(w.__frameRaf);
  return w.__frames;
});
const scrolledTo = await page.evaluate(() => Math.round(scrollY));
await browser.close();

// ---- Parse the trace ----
const trace = JSON.parse(readFileSync(traceOut, "utf8"));
const events = trace.traceEvents ?? trace;

// Find the renderer main thread (thread named CrRendererMain)
const threadNames = events.filter((e) => e.name === "thread_name" && e.ph === "M");
const main = threadNames.find((e) => e.args?.name === "CrRendererMain");
const mainPid = main?.pid;
const mainTid = main?.tid;

const onMain = (e) => e.pid === mainPid && e.tid === mainTid;
const complete = events.filter((e) => e.ph === "X" && onMain(e) && typeof e.dur === "number");

// Top-level tasks (RunTask nests inside ThreadControllerImpl::RunTask — dedupe
// by keeping only tasks not contained within another kept task)
const rawTasks = complete
  .filter((e) => e.name === "RunTask" || e.name === "ThreadControllerImpl::RunTask")
  .sort((a, b) => a.ts - b.ts || b.dur - a.dur);
const tasks = [];
let lastEnd = -1;
for (const t of rawTasks) {
  if (t.ts + t.dur <= lastEnd) continue; // fully nested in the previous kept task
  tasks.push(t);
  lastEnd = t.ts + t.dur;
}

const t0 = tasks.length ? tasks[0].ts : 0;
const ATTRIB = new Set([
  "FunctionCall", "EventDispatch", "V8.Execute", "EvaluateScript", "v8.run",
  "Layout", "UpdateLayoutTree", "PrePaint", "Paint", "Layerize", "Commit",
  "FireAnimationFrame", "HitTest", "ParseHTML", "UpdateLayerTree", "CompositeLayers",
  "TimerFire", "XHRReadyStateChange", "MajorGC", "MinorGC", "GCEvent", "BlinkGC.AtomicPhase",
]);

const longTasks = [];
for (const task of tasks) {
  const ms = task.dur / 1000;
  if (ms < 50) continue;
  const end = task.ts + task.dur;
  // dominant children by name
  const byName = new Map();
  for (const e of complete) {
    if (e === task || e.ts < task.ts || e.ts + (e.dur ?? 0) > end + 1000) continue;
    if (!ATTRIB.has(e.name)) continue;
    byName.set(e.name, (byName.get(e.name) ?? 0) + e.dur / 1000);
  }
  const top = [...byName.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([n, d]) => `${n} ${d.toFixed(0)}ms`);
  longTasks.push({ atMs: Math.round((task.ts - t0) / 1000), durMs: Math.round(ms), breakdown: top });
}
longTasks.sort((a, b) => b.durMs - a.durMs);

// Frame stats: interval > 26ms at 60Hz means at least one dropped frame
const scrollFrames = frames.slice(5); // skip settle-in
const over26 = scrollFrames.filter((d) => d > 26).length;
const over50 = scrollFrames.filter((d) => d > 50).length;
const avg = scrollFrames.reduce((a, b) => a + b, 0) / Math.max(1, scrollFrames.length);

const summary = {
  url, theme, cpuThrottle: "4x", viewport: "1440x900",
  scrolledToPx: scrolledTo,
  longTaskCount: longTasks.length,
  longTasksTotalMs: Math.round(longTasks.reduce((a, t) => a + t.durMs, 0)),
  worst: longTasks.slice(0, 15),
  frames: {
    sampled: scrollFrames.length,
    avgIntervalMs: +avg.toFixed(1),
    droppedPct: +((over26 / Math.max(1, scrollFrames.length)) * 100).toFixed(1),
    severePct: +((over50 / Math.max(1, scrollFrames.length)) * 100).toFixed(1),
  },
};
writeFileSync(summaryOut, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
