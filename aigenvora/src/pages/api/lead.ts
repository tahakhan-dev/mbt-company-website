import type { APIRoute } from "astro";
import { countLinks, leadInputSchema, spamVerdict, type LeadRecord } from "~/lib/schemas/lead";
import { env } from "~/env";

export const prerender = false;

/**
 * Public lead intake. Defenses (spec §19.5): origin check, honeypot,
 * min-fill-time, in-process rate limit, zod validation, generic public
 * errors, safe logging (never the message body). A notification failure can
 * never lose the lead — storage happens first, extras after.
 */

// ponytail: in-process rate limit — per-instance, resets on cold start;
// upgrade to Firestore counters if serverless fan-out makes it toothless.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

const generic = (status: number, error: string): Response =>
  new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const origin = request.headers.get("origin");
  const allowed = [env.PUBLIC_SITE_URL, "http://localhost:4321"];
  if (origin && !allowed.some((a) => origin.startsWith(a))) {
    return generic(403, "Request not accepted.");
  }

  const ip = clientAddress ?? "unknown";
  if (rateLimited(ip)) return generic(429, "Too many requests. Please try again later.");

  let body: Record<string, unknown>;
  const contentType = request.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      body = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return generic(400, "That submission didn't come through. Please try again.");
  }

  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    return generic(400, "Please check the name, email and message fields and try again.");
  }
  const input = parsed.data;

  const fillMs = Date.now() - input.startedAt;
  const verdict = spamVerdict({
    honeypotFilled: typeof body["website"] === "string" && body["website"] !== "",
    fillMs,
    linkCount: countLinks(input.message),
  });

  const now = new Date().toISOString();
  const record: LeadRecord = {
    name: input.name,
    email: input.email,
    company: input.company ?? "",
    role: input.role ?? "",
    projectType: input.projectType ?? "",
    budget: input.budget ?? "",
    message: input.message,
    productUrl: input.productUrl ?? "",
    status: verdict.spam ? "spam" : "new",
    notes: verdict.spam ? `auto: ${verdict.reason}` : "",
    createdAt: now,
    updatedAt: now,
    fillSeconds: Math.round(fillMs / 1000),
    attribution: {
      page: request.headers.get("referer") ?? "",
      referrer: typeof body["referrer"] === "string" ? (body["referrer"] as string).slice(0, 500) : "",
      utmSource: typeof body["utm_source"] === "string" ? (body["utm_source"] as string).slice(0, 100) : undefined,
      utmMedium: typeof body["utm_medium"] === "string" ? (body["utm_medium"] as string).slice(0, 100) : undefined,
      utmCampaign:
        typeof body["utm_campaign"] === "string" ? (body["utm_campaign"] as string).slice(0, 100) : undefined,
    },
  };

  try {
    const { adminDb, col } = await import("~/lib/firebase/server");
    await adminDb().collection(col("leads")).add(record);
  } catch (err) {
    console.error("lead: storage failed", err instanceof Error ? err.message : "unknown");
    return generic(500, "Something went wrong on our side. Email us at hello@aigenvora.com.");
  }

  // Spam is stored (admin can review) but the bot gets a success — no oracle.
  if (contentType.includes("application/json")) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(null, { status: 303, headers: { Location: "/contact?sent=1" } });
};
