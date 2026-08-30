import { NextResponse, type NextRequest } from "next/server";
import { handleCollect, type GeoHint } from "@/lib/analytics/collect-core";

/**
 * Collector — Next route flavor. Serves local dev and the Playwright suite;
 * in production netlify.toml force-rewrites /api/collect to the native
 * function (netlify/functions/collect.mts) so enrichment gets context.geo.
 * If the rewrite were ever removed the site still degrades gracefully to
 * this route (IPinfo-only geo).
 */
export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  // Netlify exposes geo to SSR as an x-nf-geo header (base64/JSON) when present.
  let geo: GeoHint | undefined;
  const nfGeo = request.headers.get("x-nf-geo");
  if (nfGeo) {
    try {
      const decoded = JSON.parse(
        nfGeo.trim().startsWith("{") ? nfGeo : Buffer.from(nfGeo, "base64").toString("utf8"),
      ) as { country?: { code?: string }; city?: string; subdivision?: { name?: string } };
      geo = {
        country: decoded.country?.code,
        city: decoded.city,
        region: decoded.subdivision?.name,
      };
    } catch {
      // best-effort
    }
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  const result = await handleCollect({
    payload,
    ip,
    origin: request.headers.get("origin"),
    geo,
  });
  return new NextResponse(result.body ?? null, { status: result.status });
}
