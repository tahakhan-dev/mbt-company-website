import { expect, test } from "@playwright/test";
import { fsDeleteDoc, fsGetDoc, fsQuery } from "./firestore-rest";

const EMAIL = "gate-b-lead@example.com";

test.describe("lead pipeline", () => {
  test.beforeAll(async () => {
    const existing = await fsQuery("e2e_leads", "email", EMAIL);
    for (const doc of existing) await fsDeleteDoc(`e2e_leads/${doc.id}`);
  });

  test("inline validation blocks bad input", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("A");
    await page.getByLabel("Work email").fill("not-an-email");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Please tell us your name.")).toBeVisible();
    await expect(page.getByText("That email doesn't look right.")).toBeVisible();
  });

  test("honeypot-filled submit is rejected", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("Bot Nine");
    await page.getByLabel("Work email").fill("bot@example.com");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("About the project").fill("Beep boop spam message.");
    await page.evaluate(() => {
      (document.querySelector('input[name="website"]') as HTMLInputElement).value = "http://spam.example";
    });
    await page.waitForTimeout(2300);
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByText("Please check the highlighted fields")).toBeVisible();
  });

  test("time-trap blocks instant submits", async ({ page }) => {
    await page.goto("/contact");
    // Rewind the trap: pretend the form was opened 1 second ago is not
    // possible from outside, so instead submit immediately (< 2s).
    await page.getByLabel("Your name").fill("Speed Bot");
    await page.getByLabel("Work email").fill("fast@example.com");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("About the project").fill("Instant submit attempt");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(
      page.getByText("Something went wrong — please try again or email us directly."),
    ).toBeVisible();
  });

  test("valid submit stores an attributed lead and shows success", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1200); // let the tracker mint ids
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("Gate B Lead");
    await page.getByLabel("Work email").fill(EMAIL);
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Fintech Engineering" }).click();
    await page.getByLabel("Budget range (optional)").selectOption("25k-50k");
    await page.getByLabel("About the project").fill("Gate B end-to-end lead submission test.");
    await page.waitForTimeout(2300);
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByText("Got it — thank you.")).toBeVisible({ timeout: 15_000 });

    const found = await fsQuery("e2e_leads", "email", EMAIL);
    expect(found.length).toBe(1);
    const lead = found[0]!.data as { name: string; services: string[]; budget: string; status: string; attribution: Record<string, string> };
    expect(lead.name).toBe("Gate B Lead");
    expect(lead.services).toContain("fintech-engineering");
    expect(lead.budget).toBe("25k-50k");
    expect(lead.status).toBe("new");
    expect(lead.attribution.path).toContain("/contact");
    expect(typeof lead.attribution.sessionId).toBe("string");
    // Attribution link-back: the analytics session is flagged as converted.
    const session = await fsGetDoc(`e2e_sessions/${lead.attribution.sessionId as string}`);
    expect(session).not.toBeNull();
    expect(session?.isLead).toBe(true);
  });
});
