import type { Page } from "@playwright/test";

/** Console/pageerror collector that ignores environment-only noise. */
export function collectConsoleIssues(page: Page): string[] {
  const issues: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    const text = msg.text();
    // Headless-GL screenshot readback noise — not produced by the page.
    if (text.includes("ReadPixels")) return;
    if (text.includes("GL Driver Message")) return;
    issues.push(`[${msg.type()}] ${text.slice(0, 200)}`);
  });
  page.on("pageerror", (err) => issues.push(`[pageerror] ${err.message.slice(0, 200)}`));
  return issues;
}

/**
 * Sandbox-only: this container's browser cannot reach Google directly, so
 * identitytoolkit calls are relayed through Node (which goes via the egress
 * proxy). Responses are Google's genuine payloads.
 */
export async function relayGoogleAuth(page: Page): Promise<void> {
  await page.route("**identitytoolkit.googleapis.com/**", async (route) => {
    const request = route.request();
    try {
      const res = await fetch(request.url(), {
        method: request.method(),
        headers: { "content-type": "application/json" },
        body: request.method() === "POST" ? (request.postData() ?? undefined) : undefined,
      });
      const body = await res.text();
      await route.fulfill({
        status: res.status,
        contentType: res.headers.get("content-type") ?? "application/json",
        body,
      });
    } catch {
      await route.abort();
    }
  });
}

export async function adminLogin(page: Page): Promise<void> {
  await relayGoogleAuth(page);
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL ?? "");
  await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/admin", { timeout: 20_000 });
}
