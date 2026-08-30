import { chromium } from "@playwright/test";
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(https?_proxy|no_proxy|all_proxy)$/i.test(k)));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", env: cleanEnv, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

// 1) Valid submit
await page.goto("http://localhost:3000/contact", { waitUntil: "load" });
await page.waitForTimeout(1200);
await page.getByLabel("Your name").fill("E2E Probe");
await page.getByLabel("Work email").fill("e2e-probe@example.com");
await page.getByRole("button", { name: "Continue" }).click();
await page.getByRole("button", { name: "AI & Generative AI Solutions" }).click();
await page.getByLabel("About the project").fill("Probe message: verifying the lead pipeline end to end.");
await page.waitForTimeout(2300); // human-speed: pass the 2s time trap
await page.getByRole("button", { name: "Send inquiry" }).click();
await page.getByText("Got it — thank you.").waitFor({ timeout: 15000 });
console.log("valid submit -> success state OK");

// 2) Honeypot-filled submit must fail
await page.goto("http://localhost:3000/contact", { waitUntil: "load" });
await page.waitForTimeout(800);
await page.getByLabel("Your name").fill("Bot Probe");
await page.getByLabel("Work email").fill("bot@example.com");
await page.getByRole("button", { name: "Continue" }).click();
await page.getByLabel("About the project").fill("Bot message here.");
await page.evaluate(() => { document.querySelector('input[name="website"]').value = "http://spam.example"; });
await page.waitForTimeout(2300);
await page.getByRole("button", { name: "Send inquiry" }).click();
await page.getByText("Please check the highlighted fields").waitFor({ timeout: 10000 });
console.log("honeypot submit -> rejected OK");

console.log("pageerrors:", JSON.stringify(errors));
await browser.close();
