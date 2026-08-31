// Capture marketing screenshots of portfolio product sites.
// Run from aigenvora/: node scripts/capture-portfolio.mjs
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { statSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("@playwright/test");
const sharp = require("sharp");

const RAW = "../docs/evidence/v3/portfolio-raw";
const OUT = "public/media/portfolio";
const REAL_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

// Optional: pass slugs as args to capture a subset, e.g. node scripts/capture-portfolio.mjs zugrow nat
const ONLY = process.argv.slice(2);
const SITES = [
  ["zugrow", "https://zugrow.com"],
  ["userdesk", "https://userdesk.io"],
  ["pdfdata", "https://pdfdata.co"],
  ["helpkit", "https://www.helpkit.so"],
  ["photoinvoice", "https://www.photoinvoice.com"],
  ["holaolas", "https://holaolas.app"],
  ["nat", "https://www.nat.app"],
  ["bizzey", "https://www.bizzey.com/en"],
  ["webhookrelay", "https://webhookrelay.com"],
  ["phare", "https://phare.io"],
  ["securevibing", "https://securevibing.com"],
  ["rotateproduct", "https://rotateproduct.com"],
];

const COOKIE_SELECTORS = [
  "button:has-text('Accept all')",
  "button:has-text('Accept All')",
  "button:has-text('Accept')",
  "button:has-text('Agree')",
  "button:has-text('Allow all')",
  "button:has-text('Got it')",
  "button:has-text('OK')",
  "[id*='cookie'] button",
  "[class*='cookie'] button",
];

async function settle(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 25000 });
  } catch {
    try {
      await page.goto(url, { waitUntil: "load", timeout: 25000 });
    } catch {
      // proceed with whatever rendered
    }
    await page.waitForTimeout(3000);
  }
}

async function dismissCookies(page) {
  for (const sel of COOKIE_SELECTORS) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 300 })) {
        await btn.click({ timeout: 1000 });
        await page.waitForTimeout(500);
        return;
      }
    } catch {
      // best effort
    }
  }
}

// Heuristic: a blank/bot-walled page paints almost nothing.
async function looksBlank(page) {
  try {
    const len = await page.evaluate(() => document.body?.innerText?.trim().length ?? 0);
    return len < 40;
  } catch {
    return true;
  }
}

async function capture(browser, slug, url, ua) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...(ua ? { userAgent: ua } : {}),
  });
  const page = await context.newPage();
  try {
    await settle(page, url);
    await dismissCookies(page);
    if (await looksBlank(page)) return { ok: false, context };
    await page.screenshot({ path: `${RAW}/${slug}-hero.png` });
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(1500); // let scroll animations run
    await page.screenshot({ path: `${RAW}/${slug}-mid.png` });
    return { ok: true, context };
  } catch (err) {
    console.error(`  ${slug}: ${err.message.split("\n")[0]}`);
    return { ok: false, context };
  }
}

await mkdir(RAW, { recursive: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const [slug, url] of SITES.filter(([s]) => !ONLY.length || ONLY.includes(s))) {
  console.log(`[${slug}] ${url}`);
  let { ok, context } = await capture(browser, slug, url);
  await context.close();
  if (!ok) {
    console.log(`  retrying with real UA...`);
    ({ ok, context } = await capture(browser, slug, url, REAL_UA));
    await context.close();
  }
  const row = { slug, hero: false, mid: false, sizes: [], blocker: ok ? "" : "blank/blocked after UA retry" };
  if (ok) {
    for (const kind of ["hero", "mid"]) {
      try {
        await sharp(`${RAW}/${slug}-${kind}.png`)
          .resize({ width: 1200 })
          .webp({ quality: 74 })
          .toFile(`${OUT}/${slug}-${kind}.webp`);
        row[kind] = true;
        row.sizes.push(`${kind}: ${(statSync(`${OUT}/${slug}-${kind}.webp`).size / 1024).toFixed(0)}KB`);
      } catch (err) {
        row.blocker = `webp ${kind} failed: ${err.message}`;
      }
    }
  }
  results.push(row);
  console.log(`  ${ok ? "ok" : "SKIPPED"} ${row.sizes.join(", ")}`);
}

await browser.close();

console.log("\nslug | hero | mid | webp sizes | blockers");
for (const r of results) {
  console.log(`${r.slug} | ${r.hero} | ${r.mid} | ${r.sizes.join(", ") || "-"} | ${r.blocker || "-"}`);
}
