import { expect, test } from "@playwright/test";

test("admin pages redirect to login without a session", async ({ page }) => {
  for (const path of ["/admin", "/admin/leads", "/admin/projects", "/admin/settings"]) {
    await page.goto(path);
    expect(page.url()).toContain("/admin/login");
  }
});

test("admin api rejects without a session", async ({ request }) => {
  const res = await request.post("/api/admin/leads", { form: { id: "x" } });
  expect([401, 403]).toContain(res.status());
});

test("admin responses carry noindex", async ({ request }) => {
  const res = await request.get("/admin/login");
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
});

test("wrong login is rejected generically", async ({ page }) => {
  await page.goto("/admin/login");
  await page.fill("input[name=email]", "nobody@example.com");
  await page.fill("input[name=password]", "wrong-password");
  await page.click("button[type=submit]");
  await page.waitForURL("**/admin/login?error=1");
  await expect(page.locator(".flash.error")).toContainText("didn't work");
});
