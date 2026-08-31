import { expect, test } from "@playwright/test";
import { adminLogin, relayGoogleAuth } from "./helpers";

test.describe("admin panel", () => {
  test("auth: deep-link guard, wrong password, login, logout", async ({ page }) => {
    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/login/);

    await relayGoogleAuth(page);
    await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL ?? "");
    await page.getByLabel("Password").fill("definitely-wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Sign-in failed")).toBeVisible({ timeout: 15_000 });

    await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD ?? "");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/admin/leads", { timeout: 20_000 });

    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("**/admin/login", { timeout: 15_000 });
    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("testimonial CRUD round-trips to the public site", async ({ page }) => {
    await adminLogin(page);
    const stamp = `E2E quote ${Date.now().toString(36)}`;

    // Create
    await page.goto("/admin/testimonials");
    await page.getByRole("button", { name: "Add testimonial" }).click();
    await page.getByLabel("Quote").fill(`${stamp} — they shipped in record time and it worked.`);
    await page.getByLabel("Author").fill("E2E Author");
    await page.getByLabel("Company").fill("E2E Corp");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByText("Created")).toBeVisible();
    await expect(page.getByText("E2E Author")).toBeVisible();

    // The V2 home renders only the top TWO testimonials (act 5), so move the
    // new one from the bottom (4th) into the top pair before asserting.
    const item = page.getByRole("listitem").filter({ hasText: "E2E Author" });
    await item.getByRole("button", { name: "Move up" }).click();
    await item.getByRole("button", { name: "Move up" }).click();
    await page.waitForTimeout(600);

    // Public site reflects immediately (tag revalidation)
    const pub = await page.context().newPage();
    await expect(async () => {
      await pub.goto("/");
      expect(await pub.locator("body").innerText()).toContain(stamp);
    }).toPass({ timeout: 15_000 });

    // Edit
    await page.getByRole("listitem").filter({ hasText: "E2E Author" }).getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Author").fill("E2E Author Edited");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByText("Saved", { exact: true })).toBeVisible();
    await expect(async () => {
      await pub.reload();
      // The act-5 attribution renders uppercase (text-transform reaches
      // innerText), so compare case-insensitively.
      expect((await pub.locator("body").innerText()).toLowerCase()).toContain(
        "e2e author edited",
      );
    }).toPass({ timeout: 15_000 });

    // Delete (confirm dialog names the item)
    await page
      .getByRole("listitem")
      .filter({ hasText: "E2E Author Edited" })
      .getByRole("button", { name: "Delete" })
      .click();
    await expect(page.getByText("Confirm deletion")).toBeVisible();
    await expect(page.getByText("E2E Author Edited").nth(1)).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Deleted")).toBeVisible();
    await expect(async () => {
      await pub.reload();
      expect(await pub.locator("body").innerText()).not.toContain(stamp);
    }).toPass({ timeout: 15_000 });
    await pub.close();
  });

  test("draft projects are hidden from the public site", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/projects");
    await page.getByRole("link", { name: "Demand forecasting for a retail chain" }).click();
    await page.getByRole("button", { name: "Unpublish" }).click();
    await page.waitForURL("**/admin/projects");

    const pub = await page.context().newPage();
    await expect(async () => {
      await pub.goto("/work");
      expect(await pub.locator("body").innerText()).not.toContain("Demand forecasting for a retail chain");
    }).toPass({ timeout: 15_000 });
    const direct = await pub.goto("/work/demand-forecasting-retail");
    expect(direct?.status()).toBe(404);

    // Restore
    await page.getByRole("link", { name: "Demand forecasting for a retail chain" }).click();
    await page.getByRole("button", { name: "Save & publish" }).click();
    await page.waitForURL("**/admin/projects");
    await expect(async () => {
      await pub.goto("/work");
      expect(await pub.locator("body").innerText()).toContain("Demand forecasting for a retail chain");
    }).toPass({ timeout: 15_000 });
    await pub.close();
  });

  test("reorder persists (keyboard-accessible buttons)", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/logos");
    const list = page.getByTestId("sortable-logos");
    const before = await list.getByRole("listitem").first().innerText();
    await list.getByRole("listitem").first().getByRole("button", { name: "Move down" }).click();
    await expect(page.getByText("Order saved")).toBeVisible();
    await page.reload();
    const afterFirst = await page.getByTestId("sortable-logos").getByRole("listitem").first().innerText();
    expect(afterFirst).not.toBe(before);
    // Restore original order
    await page
      .getByTestId("sortable-logos")
      .getByRole("listitem")
      .nth(1)
      .getByRole("button", { name: "Move up" })
      .click();
    await expect(page.getByText("Order saved")).toBeVisible();
  });

  test("settings edit updates the live site, then reverts", async ({ page }) => {
    await adminLogin(page);
    const stamp = `rev-${Date.now().toString(36)}`;
    await page.goto("/admin/settings");
    const field = page.locator("#st-tagline");
    const original = await field.inputValue();
    await field.fill(`${original} [${stamp}]`);
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Settings saved")).toBeVisible();

    const pub = await page.context().newPage();
    await expect(async () => {
      await pub.goto("/");
      expect(await pub.locator("body").innerText()).toContain(stamp);
    }).toPass({ timeout: 15_000 });
    await pub.close();

    await field.fill(original);
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Settings saved")).toBeVisible();
  });

  test("lead status + notes update", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/leads");
    const row = page.getByRole("row").filter({ hasText: "Gate B Lead" });
    await expect(row).toBeVisible();
    await row.getByRole("combobox").selectOption("contacted");
    await expect(page.getByText("Marked contacted")).toBeVisible();

    await row.click();
    await expect(page.getByText("Gate B end-to-end lead submission test.")).toBeVisible();
    await page.getByLabel("New note").fill("Called them — demo booked.");
    await page.getByRole("button", { name: "Add note" }).click();
    await expect(page.getByText("Note added")).toBeVisible();
    await expect(page.getByText("Called them — demo booked.")).toBeVisible();
    // Journey attached to the lead
    await expect(page.getByText("Visitor journey")).toBeVisible();
    await expect(page.getByText("Submitted form")).toBeVisible();
  });
});
