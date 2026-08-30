import { chromium } from "@playwright/test";
import { relayGoogleAuth } from "./google-relay.mjs";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(https?_proxy|no_proxy|all_proxy)$/i.test(k)));
const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  env: cleanEnv,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  // Sandbox egress goes through the agent proxy; keep localhost direct.
  proxy: process.env.HTTPS_PROXY
    ? { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" }
    : undefined,
});
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await relayGoogleAuth(page);

// 1) Deep link redirects to login
await page.goto("http://localhost:3000/admin/leads", { waitUntil: "load" });
console.log("deep-link redirect:", page.url().includes("/admin/login") ? "OK" : `FAIL ${page.url()}`);

// 2) Wrong password rejected
await page.getByLabel("Email").fill(ADMIN_EMAIL);
await page.getByLabel("Password").fill("wrong-password-123");
await page.getByRole("button", { name: "Sign in" }).click();
await page.getByText("Sign-in failed").waitFor({ timeout: 15000 });
console.log("wrong password rejected: OK");

// 3) Correct login → dashboard
await page.getByLabel("Password").fill(ADMIN_PASSWORD);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL("**/admin/leads", { timeout: 20000 });
console.log("login lands on deep link: OK");

// 4) Settings edit → public site reflects (revalidation proof)
const stamp = `rev-${Date.now().toString(36)}`;
await page.goto("http://localhost:3000/admin/settings", { waitUntil: "load" });
const tag = page.locator("#st-tagline");
const original = await tag.inputValue();
await tag.fill(`We build AI products that ship. [${stamp}]`);
await page.getByRole("button", { name: "Save settings" }).click();
await page.getByText("Settings saved").waitFor({ timeout: 15000 });
const pub = await ctx.newPage();
pub.on("pageerror", (e) => console.log("[pub pageerror]", e.message.slice(0,200)));
const pubRes = await pub.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 30000 });
console.log("pub status:", pubRes && pubRes.status());
await pub.waitForTimeout(1500);
console.log("pub footer count:", await pub.locator("footer").count());
const bodyText = await pub.evaluate(() => document.body.innerText);
console.log("public site shows edit:", bodyText.includes(stamp) ? "OK" : "FAIL");
// restore
await tag.fill(original);
await page.getByRole("button", { name: "Save settings" }).click();
await page.getByText("Settings saved").waitFor({ timeout: 15000 });
await pub.close();

// 5) Logout kills the session
await page.getByRole("button", { name: "Log out" }).click();
await page.waitForURL("**/admin/login", { timeout: 15000 });
await page.goto("http://localhost:3000/admin/leads", { waitUntil: "load" });
console.log("post-logout deep link blocked:", page.url().includes("/admin/login") ? "OK" : "FAIL");

await browser.close();
