import { chromium } from "@playwright/test";
import { relayGoogleAuth } from "./google-relay.mjs";
const SHOTS = process.argv[2];
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(https?_proxy|no_proxy|all_proxy)$/i.test(k)));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", env: cleanEnv, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await relayGoogleAuth(page);
const issues = [];
page.on("console", (m) => { if (["error","warning"].includes(m.type())) issues.push(m.text().slice(0,150)); });
await page.goto("http://localhost:3000/admin/login", { waitUntil: "load" });
await page.screenshot({ path: `${SHOTS}/adm-login.png` });
await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL);
await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL("**/admin", { timeout: 20000 });
for (const [route, name] of [["/admin","dash"],["/admin/leads","leads"],["/admin/projects","projects"],["/admin/services/ai-generative-ai","service-edit"],["/admin/settings","settings"],["/admin/media","media"]]) {
  await page.goto(`http://localhost:3000${route}`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${SHOTS}/adm-${name}.png` });
}
console.log("console issues:", JSON.stringify(issues.filter(t => !t.includes("404")).slice(0,6)));
await browser.close();
