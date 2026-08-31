/**
 * Pre-rasterizes the generated cover art for every seeded project into
 * public/covers/{seed}.jpg (1200x800, q80), plus lib/covers/prerendered.json as
 * the lookup manifest. JPEGs decode off the main thread (PNG kept the noise layer incompressible at ~700KB; JPEG lands ~10x smaller); the live data-URI
 * SVG remains the fallback for projects added later through the admin.
 *
 * Run after changing cover seeds or the cover composition:
 *   node --import tsx scripts/render-covers.mts
 * Requires a Playwright Chromium (dev environment; the PNGs are committed,
 * so production builds never need a browser).
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { coverSvgString } from "../lib/covers/cover-svg";
import { projects } from "./seed-content";

const outDir = path.resolve("public/covers");
mkdirSync(outDir, { recursive: true });

const seeds = [...new Set(projects.map((p) => p.cover.seed).filter(Boolean))];

const executablePath = process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium";
const env = { ...process.env } as Record<string, string>;
for (const k of ["HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy"]) delete env[k];

const browser = await chromium.launch({
  executablePath,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  env,
});
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

for (const seed of seeds) {
  const svg = coverSvgString(seed);
  await page.setContent(
    `<!doctype html><style>*{margin:0}</style>${svg.replace("<svg ", '<svg style="display:block;width:1200px;height:800px" ')}`,
    { waitUntil: "load" },
  );
  const buf = await page.locator("svg").screenshot({ type: "jpeg", quality: 80 });
  writeFileSync(path.join(outDir, `${seed}.jpg`), buf);
  console.log("rendered", seed, `${Math.round(buf.length / 1024)}KB`);
}

await browser.close();
writeFileSync(
  path.resolve("lib/covers/prerendered.json"),
  JSON.stringify(seeds.sort(), null, 2) + "\n",
);
console.log(`\n✔ ${seeds.length} covers -> public/covers + lib/covers/prerendered.json`);
