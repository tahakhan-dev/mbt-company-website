import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { col } from "@/lib/firebase/collections";
import { collectPayloadSchema, type CollectPayload } from "@/lib/schemas/analytics";
import { budgetMode, dayKey, writesForBatch, type BudgetMode } from "@/lib/analytics/budget";

export type GeoHint = {
  country?: string;
  city?: string;
  region?: string;
};

export type CollectInput = {
  payload: unknown;
  ip: string;
  origin: string | null;
  geo?: GeoHint;
};

export type CollectResult = { status: number; body?: string };

// ---------------------------------------------------------------------------
// Per-instance state (serverless-friendly approximations)
// ---------------------------------------------------------------------------
const rateBuckets = new Map<string, { tokens: number; ts: number }>();
let pendingCounter = 0;
let counterFlushedAt = 0;
let cachedMode: { mode: BudgetMode; at: number } = { mode: "normal", at: 0 };

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip) ?? { tokens: 60, ts: now };
  bucket.tokens = Math.min(60, bucket.tokens + ((now - bucket.ts) / 60_000) * 60);
  bucket.ts = now;
  if (bucket.tokens < 1) {
    rateBuckets.set(ip, bucket);
    return true;
  }
  bucket.tokens -= 1;
  rateBuckets.set(ip, bucket);
  if (rateBuckets.size > 10_000) rateBuckets.clear();
  return false;
}

function ipHashOf(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "mbt-default-salt";
  return createHash("sha256").update(`${ip}|${salt}`).digest("hex").slice(0, 32);
}

/** Amortized write counter: one Firestore increment per ~8 writes. */
async function countWrites(n: number): Promise<void> {
  pendingCounter += n;
  const due = pendingCounter >= 8 || Date.now() - counterFlushedAt > 60_000;
  if (!due) return;
  const flush = pendingCounter;
  pendingCounter = 0;
  counterFlushedAt = Date.now();
  await adminDb()
    .collection(col("counters"))
    .doc(`writes-${dayKey().replace(/-/g, "")}`)
    .set({ count: FieldValue.increment(flush), day: dayKey() }, { merge: true })
    .catch(() => {});
}

/** Kill-switch mode, cached 30s per instance (≈2 reads/min). */
async function currentMode(): Promise<BudgetMode> {
  if (Date.now() - cachedMode.at < 30_000) return cachedMode.mode;
  try {
    const snap = await adminDb()
      .collection(col("counters"))
      .doc(`writes-${dayKey().replace(/-/g, "")}`)
      .get();
    const count = (snap.data()?.count as number | undefined) ?? 0;
    cachedMode = { mode: budgetMode(count), at: Date.now() };
  } catch {
    cachedMode = { mode: "normal", at: Date.now() };
  }
  return cachedMode.mode;
}

// ---------------------------------------------------------------------------
// IP enrichment: Netlify geo (free) + IPinfo Lite (country + ASN/org),
// cached forever per hashed IP.
// ---------------------------------------------------------------------------
type Enrichment = {
  country: string;
  city: string;
  region: string;
  asn: string;
  asnOrg: string;
  asnType: string;
};

function classifyAsn(asnOrgRaw: string, asnType?: string): string {
  if (asnType) return asnType; // ipinfo lite sometimes includes as_type
  const org = asnOrgRaw.toLowerCase();
  if (!org) return "";
  if (/(telecom|mobile|broadband|communications|cable|wireless|isp|telefon|vodafone|verizon|comcast|at&t|orange|du |etisalat|jazz|ptcl)/.test(org)) return "isp";
  if (/(amazon|aws|google cloud|microsoft|azure|digitalocean|hetzner|ovh|cloudflare|linode|vultr|hosting|datacenter|data center|server)/.test(org)) return "hosting";
  return "business";
}

async function enrich(ip: string, ipHash: string, geo?: GeoHint): Promise<Enrichment> {
  const base: Enrichment = {
    country: geo?.country ?? "",
    city: geo?.city ?? "",
    region: geo?.region ?? "",
    asn: "",
    asnOrg: "",
    asnType: "",
  };
  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1") return base;

  const cacheRef = adminDb().collection(col("ip_cache")).doc(ipHash);
  try {
    const cached = await cacheRef.get();
    if (cached.exists) {
      const d = cached.data() as Partial<Enrichment>;
      return {
        country: base.country || d.country || "",
        city: base.city || d.city || "",
        region: base.region || d.region || "",
        asn: d.asn ?? "",
        asnOrg: d.asnOrg ?? "",
        asnType: d.asnType ?? "",
      };
    }
  } catch {
    return base;
  }

  const token = process.env.IPINFO_TOKEN;
  if (!token) return base;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(`https://api.ipinfo.io/lite/${encodeURIComponent(ip)}?token=${token}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return base;
    const json = (await res.json()) as {
      country_code?: string;
      country?: string;
      asn?: string;
      as_name?: string;
      as_domain?: string;
      as_type?: string;
    };
    const enriched: Enrichment = {
      country: base.country || json.country_code || json.country || "",
      city: base.city,
      region: base.region,
      asn: json.asn ?? "",
      asnOrg: json.as_name ?? json.as_domain ?? "",
      asnType: classifyAsn(json.as_name ?? "", json.as_type),
    };
    // Cache forever — one lookup per unique IP, and this write is worth it.
    cacheRef.set({ ...enriched, cachedAt: Date.now() }).catch(() => {});
    void countWrites(1);
    return enriched;
  } catch {
    return base;
  }
}

// ---------------------------------------------------------------------------
// Main handler — shared by the Next route (dev/tests) and the Netlify
// function (production, with context.geo).
// ---------------------------------------------------------------------------
export async function handleCollect(input: CollectInput): Promise<CollectResult> {
  const { ip, origin, geo } = input;

  // Origin check: same-site beacons only (no cross-site data injection).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (origin && siteUrl) {
    try {
      const allowed = new URL(siteUrl).host;
      const got = new URL(origin).host;
      const isLocal = got.startsWith("localhost") || got.startsWith("127.0.0.1");
      const isDeployPreview = got.endsWith(".netlify.app");
      if (got !== allowed && !isLocal && !isDeployPreview) return { status: 403 };
    } catch {
      return { status: 403 };
    }
  }

  if (rateLimited(ip)) return { status: 429 };

  const parsed = collectPayloadSchema.safeParse(input.payload);
  if (!parsed.success) return { status: 400 };
  const payload: CollectPayload = parsed.data;

  const mode = await currentMode();
  if (mode === "halted") return { status: 204 };

  const db = adminDb();
  const sessionRef = db.collection(col("sessions")).doc(payload.sessionId);
  const existing = await sessionRef.get();
  const isNewSession = !existing.exists;
  const now = Date.now();

  // In sampling mode granular event docs are dropped; sessions stay alive.
  const events = payload.events.filter((e) => e.t !== "heartbeat");
  const storedEvents = mode === "sampling" ? [] : events.slice(0, 30);

  const ipHash = ipHashOf(ip);
  const enrichment = isNewSession
    ? await enrich(ip, ipHash, geo)
    : null;

  const pageViews = events.filter((e) => e.t === "page_view");
  // Per-path view counters live as a nested map on the session doc so the
  // nightly rollup never has to read event subcollections. Dots are the only
  // unsafe map-key char here; slashes are fine.
  const pathIncrements: Record<string, FieldValue> = {};
  for (const pv of pageViews) {
    const key = (pv.path || "/").replace(/\./g, "·").slice(0, 120);
    pathIncrements[key] = FieldValue.increment(1);
  }
  const counterUpdates: Record<string, FieldValue | Record<string, FieldValue>> = {};
  if (Object.keys(pathIncrements).length > 0) counterUpdates.paths = pathIncrements;
  const bump = (field: string, n: number) => {
    if (n > 0) counterUpdates[field] = FieldValue.increment(n);
  };
  bump("ctaClicks", events.filter((e) => e.t === "cta_click").length);
  bump("formStarts", events.filter((e) => e.t === "form_start").length);
  bump("formSubmits", events.filter((e) => e.t === "form_submit").length);
  bump("outboundClicks", events.filter((e) => e.t === "outbound_click").length);

  const batch = db.batch();
  batch.set(
    sessionRef,
    {
      visitorId: payload.visitorId,
      startedAt: payload.startedAt,
      lastSeenAt: now,
      durationSec: payload.state.durationSec,
      pageCount: payload.state.pageCount,
      maxScroll: payload.state.maxScroll,
      exitPath: payload.state.path,
      dayKey: dayKey(new Date(payload.startedAt)),
      ...(isNewSession
        ? {
            entryPath: pageViews[0]?.path ?? payload.state.path,
            referrer: payload.context?.referrer ?? "",
            utm: payload.context?.utm ?? {},
            device: payload.context?.device ?? "desktop",
            language: payload.context?.language ?? "",
            viewport: payload.context?.viewport ?? { w: 0, h: 0 },
            ipHash,
            country: enrichment?.country ?? "",
            city: enrichment?.city ?? "",
            region: enrichment?.region ?? "",
            asn: enrichment?.asn ?? "",
            asnOrg: enrichment?.asnOrg ?? "",
            asnType: enrichment?.asnType ?? "",
            isLead: false,
            leadId: "",
          }
        : {}),
      ...counterUpdates,
    },
    { merge: true },
  );

  for (const event of storedEvents) {
    batch.set(sessionRef.collection("events").doc(), {
      t: event.t,
      ts: event.ts,
      path: event.path,
      meta: event.meta ?? {},
    });
  }

  try {
    await batch.commit();
  } catch (err) {
    console.error("[collect] write failed:", err);
    return { status: 500 };
  }

  // Visitor upsert (create keeps firstSeenAt immutable; update bumps counters).
  if (isNewSession) {
    const visitorRef = db.collection(col("visitors")).doc(payload.visitorId);
    const visitorData = {
      lastSeenAt: now,
      sessionCount: FieldValue.increment(1),
      country: enrichment?.country ?? "",
    };
    try {
      await visitorRef.create({ ...visitorData, sessionCount: 1, firstSeenAt: now });
    } catch {
      await visitorRef.set(visitorData, { merge: true }).catch(() => {});
    }
  }

  await countWrites(writesForBatch({ events: payload.events, isNewSession }));
  return { status: 204 };
}
