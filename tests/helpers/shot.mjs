// Screenshot + console-error harness. Usage:
//   node shot.mjs <url> <outPrefix> [--width=1440] [--full] [--reduced] [--wait=1200] [--scroll]
import { chromium } from "@playwright/test";

const [, , url, prefix, ...flags] = process.argv;
const get = (name, dflt) => {
  const f = flags.find((f) => f.startsWith(`--${name}=`));
  return f ? f.split("=")[1] : dflt;
};
const width = parseInt(get("width", "1440"), 10);
const height = parseInt(get("height", "900"), 10);
const wait = parseInt(get("wait", "1400"), 10);
const full = flags.includes("--full");
const reduced = flags.includes("--reduced");
const doScroll = flags.includes("--scroll");

// The sandbox exports HTTP(S)_PROXY for external egress; strip them so the
// browser reaches the local server directly (localhost must not be proxied).
const cleanEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    ([k]) => !/^(https?_proxy|no_proxy|all_proxy)$/i.test(k),
  ),
);

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
  env: cleanEnv,
  // Container runs as root — Chromium's own sandbox cannot be used there.
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const ctx = await browser.newContext({
  viewport: { width, height },
  reducedMotion: reduced ? "reduce" : "no-preference",
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") errors.push(`[${msg.type()}] ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
page.on("response", (res) => {
  if (res.status() >= 400) errors.push(`[http ${res.status()}] ${res.url()}`);
});

await page.goto(url, { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(wait);

if (doScroll) {
  // Coarse scroll through the page to trigger reveals, capturing frames.
  const total = await page.evaluate(() => document.body.scrollHeight);
  const steps = Math.min(16, Math.ceil(total / height));
  for (let i = 1; i <= steps; i++) {
    await page.mouse.wheel(0, height * 0.9);
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${prefix}-s${i}.png` });
  }
} else {
  if (flags.includes("--bottom")) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: `${prefix}.png`, fullPage: full });
}

const hscroll = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
console.log(JSON.stringify({ url, width, hscroll, consoleIssues: errors }, null, 2));
await browser.close();
