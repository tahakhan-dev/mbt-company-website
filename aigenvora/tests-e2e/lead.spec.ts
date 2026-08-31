import { expect, test } from "@playwright/test";

test("valid lead submits ok", async ({ request }) => {
  const res = await request.post("/api/lead", {
    data: {
      name: "E2E Suite",
      email: "e2e@aigenvora.com",
      message: "Automated e2e submission — safe to delete.",
      startedAt: Date.now() - 20_000,
    },
  });
  expect(res.status()).toBe(200);
  expect((await res.json()).ok).toBe(true);
});

test("too-fast submission is swallowed as spam (still 200 — no bot oracle)", async ({
  request,
}) => {
  const res = await request.post("/api/lead", {
    data: {
      name: "E2E Fast Bot",
      email: "bot@example.com",
      message: "instant submit",
      startedAt: Date.now(),
    },
  });
  expect(res.status()).toBe(200);
});

test("garbage input gets a generic 400", async ({ request }) => {
  const res = await request.post("/api/lead", {
    data: { name: "", email: "not-an-email", message: "", startedAt: 1 },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.ok).toBe(false);
  expect(String(body.error)).not.toMatch(/zod|schema|path/i);
});
