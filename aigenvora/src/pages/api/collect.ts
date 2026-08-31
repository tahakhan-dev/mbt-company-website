import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import { z } from "zod";

export const prerender = false;

/**
 * First-party pageview collector (ported posture from the legacy app's
 * lawful design): raw IP is used transiently for geo lookup and never
 * stored — only a salted SHA-256 hash truncated to 32 chars. Geo results
 * cache per IP hash for 30 days. DNT/GPC honored client-side in t.js;
 * ANALYTICS_DISABLED=1 is the kill switch.
 */

const beacon = z.object({
  p: z.string().max(300),
  r: z.string().max(500).optional().default(""),
  sid: z.string().max(64),
  us: z.string().max(100).optional().default(""),
  um: z.string().max(100).optional().default(""),
  uc: z.string().max(100).optional().default(""),
});

// ponytail: in-process write budget — 300 views/hour caps Firestore spend.
let windowStart = Date.now();
let windowWrites = 0;
function overBudget(): boolean {
  const now = Date.now();
  if (now - windowStart > 60 * 60 * 1000) {
    windowStart = now;
    windowWrites = 0;
  }
  windowWrites += 1;
  return windowWrites > 300;
}

async function geoFor(ipHash: string, ip: string): Promise<{ country: string; city: string }> {
  const token = process.env["IPINFO_TOKEN"];
  const none = { country: "", city: "" };
  if (!token || !ip) return none;
  try {
    const { adminDb, col } = await import("~/lib/firebase/server");
    const cacheRef = adminDb().collection(col("ip_cache")).doc(ipHash);
    const hit = await cacheRef.get();
    if (hit.exists) {
      const d = hit.data()!;
      const age = Date.now() - new Date(String(d["at"])).getTime();
      if (age < 30 * 24 * 60 * 60 * 1000) {
        return { country: String(d["country"] ?? ""), city: String(d["city"] ?? "") };
      }
    }
    const res = await fetch(`https://ipinfo.io/${ip}?token=${token}`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return none;
    const data = (await res.json()) as { country?: string; city?: string };
    const geo = { country: data.country ?? "", city: data.city ?? "" };
    await cacheRef.set({ ...geo, at: new Date().toISOString() });
    return geo;
  } catch {
    return none;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ok = new Response(null, { status: 204 });
  if (process.env["ANALYTICS_DISABLED"] === "1") return ok;
  if (overBudget()) return ok;

  let parsed;
  try {
    parsed = beacon.safeParse(await request.json());
  } catch {
    return ok;
  }
  if (!parsed.success) return ok;
  const b = parsed.data;

  const ip = clientAddress ?? "";
  const salt = process.env["IP_HASH_SALT"] ?? "aigenvora-v3";
  const ipHash = createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);

  try {
    const geo = await geoFor(ipHash, ip);
    const { adminDb, col } = await import("~/lib/firebase/server");
    await adminDb().collection(col("pageviews")).add({
      path: b.p,
      referrer: b.r.slice(0, 500),
      sid: b.sid,
      utmSource: b.us,
      utmMedium: b.um,
      utmCampaign: b.uc,
      country: geo.country,
      city: geo.city,
      ipHash,
      at: new Date().toISOString(),
      ua: (request.headers.get("user-agent") ?? "").slice(0, 200),
    });
  } catch (err) {
    console.error("collect failed", err instanceof Error ? err.message : "unknown");
  }
  return ok;
};
