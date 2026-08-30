import type { Context } from "@netlify/functions";
import { handleCollect } from "../../lib/analytics/collect-core";

/**
 * Production collector (native Netlify function): /api/collect is
 * force-rewritten here by netlify.toml. Uses Netlify's free request
 * geolocation (context.geo) as the primary geo source; IPinfo Lite fills
 * ASN/company (and geo if context.geo is ever unavailable).
 */
export default async function handler(request: Request, context: Context): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const result = await handleCollect({
    payload,
    ip: context.ip || "unknown",
    origin: request.headers.get("origin"),
    geo: {
      country: context.geo?.country?.code,
      city: context.geo?.city,
      region: context.geo?.subdivision?.name,
    },
  });
  return new Response(result.body ?? null, { status: result.status });
}
