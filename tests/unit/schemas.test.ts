import { describe, expect, it } from "vitest";
import { leadInputSchema } from "@/lib/schemas/lead";
import { collectPayloadSchema } from "@/lib/schemas/analytics";
import { serviceSchema } from "@/lib/schemas/service";
import { projectSchema } from "@/lib/schemas/project";

const validLead = {
  name: "Ada Lovelace",
  email: "ada@company.com",
  services: ["ai-generative-ai"],
  budget: "25k-50k",
  message: "We need an internal RAG copilot for our ops team.",
  website: "",
  startedAt: Date.now() - 30_000,
  attribution: {
    visitorId: "3f2b9c34-6d1a-4b8e-9f21-aaaaaaaaaaaa",
    sessionId: "9a1b2c3d-1111-4222-8333-bbbbbbbbbbbb",
    path: "/contact",
    referrer: "https://www.google.com/",
    utm: { source: "linkedin", campaign: "q3" },
  },
};

describe("leadInputSchema", () => {
  it("accepts a valid submission", () => {
    const parsed = leadInputSchema.parse(validLead);
    expect(parsed.email).toBe("ada@company.com");
    expect(parsed.budget).toBe("25k-50k");
  });
  it("rejects bad emails and empty names", () => {
    expect(leadInputSchema.safeParse({ ...validLead, email: "nope" }).success).toBe(false);
    expect(leadInputSchema.safeParse({ ...validLead, name: "A" }).success).toBe(false);
  });
  it("rejects a filled honeypot", () => {
    expect(leadInputSchema.safeParse({ ...validLead, website: "http://spam.example" }).success).toBe(false);
  });
  it("tolerates missing optional attribution", () => {
    const { attribution: _attribution, ...rest } = validLead;
    expect(leadInputSchema.safeParse({ ...rest, budget: undefined }).success).toBe(true);
  });
});

describe("collectPayloadSchema", () => {
  const payload = {
    v: 1,
    visitorId: "3f2b9c34-6d1a-4b8e-9f21-aaaaaaaaaaaa",
    sessionId: "9a1b2c3d-1111-4222-8333-bbbbbbbbbbbb",
    startedAt: Date.now() - 5000,
    context: {
      referrer: "https://news.ycombinator.com/",
      language: "en-US",
      viewport: { w: 1440, h: 900 },
      device: "desktop",
      utm: { source: "hn" },
    },
    state: { durationSec: 42, maxScroll: 75, pageCount: 2, path: "/work" },
    events: [
      { t: "page_view", ts: Date.now(), path: "/", meta: { ref: "direct" } },
      { t: "scroll_depth", ts: Date.now(), path: "/", meta: { depth: 50 } },
    ],
  };
  it("accepts a valid batch", () => {
    expect(collectPayloadSchema.parse(payload).events).toHaveLength(2);
  });
  it("rejects unknown event types and oversized batches", () => {
    expect(
      collectPayloadSchema.safeParse({
        ...payload,
        events: [{ t: "evil", ts: 1, path: "/" }],
      }).success,
    ).toBe(false);
    expect(
      collectPayloadSchema.safeParse({
        ...payload,
        events: Array.from({ length: 60 }, () => payload.events[0]),
      }).success,
    ).toBe(false);
  });
  it("rejects non-UUID ids (no arbitrary doc paths)", () => {
    expect(
      collectPayloadSchema.safeParse({ ...payload, sessionId: "../../etc" }).success,
    ).toBe(false);
  });
});

describe("content schemas", () => {
  it("service requires slug + name and defaults status/order", () => {
    const s = serviceSchema.parse({
      name: "Cloud & DevOps",
      slug: "cloud-devops",
      iconKey: "cloud",
      short: "Architecture, CI/CD, observability.",
      offerings: [{ title: "CI/CD", detail: "Pipelines that ship." }],
    });
    expect(s.status).toBe("draft");
    expect(s.order).toBe(0);
  });
  it("project metrics are label/value pairs", () => {
    const p = projectSchema.parse({
      title: "Ledger Copilot",
      slug: "ledger-copilot",
      client: "Confidential fintech",
      industry: "Fintech",
      serviceSlugs: ["ai-generative-ai"],
      summary: "An AI copilot for reconciliation teams.",
      metrics: [{ label: "ops cost", value: "-38%" }],
    });
    expect(p.metrics[0]?.value).toBe("-38%");
    expect(p.status).toBe("draft");
  });
});
