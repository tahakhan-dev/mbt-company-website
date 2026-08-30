import { expect, test } from "@playwright/test";
import { collectConsoleIssues } from "./helpers";

const ROUTES = [
  { path: "/", title: /MBT/ },
  { path: "/services", title: /Services/ },
  { path: "/services/ai-generative-ai", title: /AI & Generative AI/ },
  { path: "/work", title: /Work/ },
  { path: "/work/digital-wallet-platform", title: /Digital wallet/ },
  { path: "/about", title: /About/ },
  { path: "/contact", title: /Contact/ },
  { path: "/privacy", title: /Privacy/ },
  { path: "/terms", title: /Terms/ },
];

test.describe("public routes", () => {
  for (const route of ROUTES) {
    test(`${route.path} renders clean`, async ({ page }) => {
      const issues = collectConsoleIssues(page);
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(route.title);
      await page.waitForTimeout(1200);
      expect(issues, `console issues on ${route.path}`).toEqual([]);
      const hscroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(hscroll, `horizontal scroll on ${route.path}`).toBe(false);
    });
  }

  test("custom 404 renders inside the marketing shell", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("This page shipped to another universe.")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  });

  test("viewports: no horizontal scroll, sticky CTA behaves", async ({ page }) => {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.waitForTimeout(800);
      const hscroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(hscroll, `h-scroll at ${width}`).toBe(false);
    }
    // Sticky mobile CTA: hidden at top, appears after the hero.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(600);
    const stickyWrap = page.locator("div").filter({ has: page.locator("[data-cta='sticky-mobile']") }).last();
    await expect(stickyWrap).toHaveAttribute("inert", "");
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(900);
    await expect(stickyWrap).not.toHaveAttribute("inert", "");
  });

  test("overlay menu: mouse + keyboard", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    const menu = page.locator("#site-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Services" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-hidden", "true");
    // Keyboard open
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Work" }).click();
    await page.waitForURL("**/work");
  });

  test("prefers-reduced-motion: readable, no canvas, content visible", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("http://localhost:3111/");
    await page.waitForTimeout(1500);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.locator("canvas").count()).toBe(0);
    // Below-fold content must be instantly visible (no waiting on reveals).
    await page.mouse.wheel(0, 6000);
    await page.waitForTimeout(400);
    await expect(page.getByText("Proof, not promises.")).toBeVisible();
    await ctx.close();
  });

  test("sitemap, robots, OG image endpoints", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    expect(xml).toContain("/services/ai-generative-ai");
    expect(xml).toContain("/work/digital-wallet-platform");

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Disallow: /admin");

    const og = await request.get("/opengraph-image-pwu6ef");
    // Hashed route name varies; resolve from the home page instead.
    if (og.status() === 404) {
      const home = await request.get("/");
      const html = await home.text();
      const match = html.match(/property="og:image" content="([^"]+)"/);
      expect(match, "og:image meta present").toBeTruthy();
      const ogRes = await request.get(match![1]!);
      expect(ogRes.status()).toBe(200);
      expect(ogRes.headers()["content-type"]).toContain("image/png");
    } else {
      expect(og.headers()["content-type"]).toContain("image/png");
    }
  });
});
