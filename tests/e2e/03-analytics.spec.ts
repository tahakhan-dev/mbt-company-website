import { expect, test } from "@playwright/test";
import { fsGetDoc, fsListSubcollection } from "./firestore-rest";
import { adminLogin } from "./helpers";

test.describe("first-party analytics", () => {
  test("a scripted visit produces session, events, and dashboard numbers", async ({ page }) => {
    test.setTimeout(120_000);
    const collectStatuses: number[] = [];
    page.on("response", (res) => {
      if (res.url().includes("/api/collect")) collectStatuses.push(res.status());
    });

    await page.goto("/");
    await page.waitForTimeout(1500);
    const sessionId = await page.evaluate(() => sessionStorage.getItem("mbt_sid"));
    expect(sessionId).toBeTruthy();

    // Scroll (depth milestones), SPA-navigate, click a tracked CTA.
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 1400);
      await page.waitForTimeout(300);
    }
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Work" }).click();
    await page.waitForURL("**/work");
    await page.waitForTimeout(600);
    // Flush via visibility change (sendBeacon path).
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(1500);

    expect(collectStatuses.length).toBeGreaterThanOrEqual(2);
    expect(collectStatuses.every((s) => s === 204)).toBe(true);

    const session = await fsGetDoc(`e2e_sessions/${sessionId}`);
    expect(session).not.toBeNull();
    expect(session!.pageCount as number).toBeGreaterThanOrEqual(2);
    expect(session!.maxScroll as number).toBeGreaterThanOrEqual(50);
    expect(Object.keys((session!.paths as Record<string, number>) ?? {})).toEqual(
      expect.arrayContaining(["/", "/work"]),
    );
    const events = await fsListSubcollection(`e2e_sessions/${sessionId}`, "events");
    const types = events.map((e) => e.t);
    expect(types).toContain("page_view");
    expect(types).toContain("scroll_depth");

    // Dashboard shows the traffic (today range).
    await adminLogin(page);
    await page.goto("/admin?range=1");
    await expect(page.getByText("Recent sessions")).toBeVisible();
    await expect(page.getByRole("link", { name: "View" }).first()).toBeVisible();
    // Journey page renders the timeline for this session.
    await page.goto(`/admin/visitors/${sessionId}`);
    await expect(page.getByText("Viewed", { exact: false }).first()).toBeVisible();
  });

  test("tracker respects DNT", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "doNotTrack", { get: () => "1" });
    });
    const calls: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/collect")) calls.push(req.url());
    });
    await page.goto("http://localhost:3111/");
    await page.waitForTimeout(2500);
    expect(calls).toEqual([]);
    expect(await page.evaluate(() => localStorage.getItem("mbt_vid"))).toBeNull();
    await ctx.close();
  });
});
