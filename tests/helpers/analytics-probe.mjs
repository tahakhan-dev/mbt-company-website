import { chromium } from "@playwright/test";
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(https?_proxy|no_proxy|all_proxy)$/i.test(k)));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", env: cleanEnv, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage();
const collectCalls = [];
page.on("response", (r) => { if (r.url().includes("/api/collect")) collectCalls.push(r.status()); });

await page.goto("http://localhost:3000/", { waitUntil: "load" });
await page.waitForTimeout(1500);
const ids = await page.evaluate(() => ({ vid: localStorage.getItem("mbt_vid"), sid: sessionStorage.getItem("mbt_sid") }));
console.log("ids:", JSON.stringify(ids));
// scroll to trigger depth milestones
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(350); }
// navigate (SPA) to work + click tracked CTA
await page.getByLabel("Main").getByRole("link", { name: "Work" }).click();
await page.waitForURL("**/work");
await page.waitForTimeout(800);
await page.goto("http://localhost:3000/contact", { waitUntil: "load" });
await page.getByLabel("Your name").click(); // form_start
await page.waitForTimeout(400);
// force a flush via visibility hidden
await page.evaluate(() => { Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
await page.waitForTimeout(1200);
console.log("collect responses:", JSON.stringify(collectCalls));
console.log("SESSION_ID=" + ids.sid);
await browser.close();
