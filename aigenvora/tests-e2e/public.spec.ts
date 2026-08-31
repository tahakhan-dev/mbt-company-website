import { expect, test } from "@playwright/test";

const routes = [
  ["/", "AI-Powered Software Development"],
  ["/services", "Services"],
  ["/services/ai-agents-automation", "AI Agents"],
  ["/work", "Work"],
  ["/work/zugrow", "Zugrow"],
  ["/mvps", "MVPs"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy"],
] as const;

for (const [path, titlePart] of routes) {
  test(`${path} renders with title, one h1, no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(new RegExp(titlePart, "i"));
    expect(await page.locator("h1").count()).toBe(1);
    // favicon 404s etc. would surface here
    expect(errors).toEqual([]);
  });
}

test("unknown route returns 404", async ({ page }) => {
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
});

test("no horizontal overflow at 390px on home", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});

test("engine persists across a view transition", async ({ page }) => {
  await page.goto("/");
  await page.mouse.move(700, 400);
  await page.waitForFunction(
    () => document.querySelector("canvas[data-engine-canvas]")?.classList.contains("engine-live"),
    undefined,
    { timeout: 10_000 },
  );
  await page.evaluate(() => {
    const c = document.querySelector("canvas[data-engine-canvas]") as HTMLCanvasElement & {
      __marker?: string;
    };
    c.__marker = "original";
  });
  await page.click('a[href="/services"]');
  await page.waitForURL("**/services");
  const persisted = await page.evaluate(() => {
    const c = document.querySelector("canvas[data-engine-canvas]") as HTMLCanvasElement & {
      __marker?: string;
    };
    return { marker: c.__marker, count: document.querySelectorAll("canvas").length };
  });
  expect(persisted.marker).toBe("original");
  expect(persisted.count).toBe(1);
});

test("reduced motion serves Tier C: no engine, posters visible, content intact", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("http://localhost:4321/");
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => document.documentElement.dataset["tier"])).toBe("C");
  expect(await page.locator("[data-poster]").first().isVisible()).toBe(true);
  await expect(page.locator("h1")).toContainText("software that moves");
  await context.close();
});
