/**
 * Sandbox-only helper: the test container's browser cannot reach Google
 * directly (egress proxy), so identitytoolkit requests are intercepted in
 * Playwright and relayed through Node (which can). Responses are Google's
 * real, unmodified payloads — real deployments need none of this.
 */
export async function relayGoogleAuth(page) {
  await page.route("**identitytoolkit.googleapis.com/**", async (route) => {
    const request = route.request();
    try {
      const res = await fetch(request.url(), {
        method: request.method(),
        headers: { "content-type": "application/json" },
        body: request.method() === "POST" ? request.postData() : undefined,
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
