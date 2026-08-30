import { adminDb } from "@/lib/firebase/admin";
import { col } from "@/lib/firebase/collections";
import { dayKey } from "@/lib/analytics/budget";
import type { DailyStats } from "@/lib/schemas/analytics";

const RETENTION_DAYS = 90;
const DELETE_BUDGET_PER_RUN = 3800; // well under the 20k/day free delete quota

export type SessionRow = {
  visitorId: string;
  durationSec: number;
  pageCount: number;
  maxScroll: number;
  referrer: string;
  utm: Record<string, string>;
  device: string;
  country: string;
  asnOrg: string;
  asnType: string;
  isLead: boolean;
  paths?: Record<string, number>;
  ctaClicks?: number;
  formStarts?: number;
  formSubmits?: number;
  startedAt: number;
};

function top(map: Map<string, number>, n: number): { key: string; count: number }[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

function hostnameOf(referrer: string): string {
  if (!referrer) return "direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "other";
  }
}

/** Pure aggregation over session rows — shared by rollup and the live "today" view. */
export function aggregateSessions(sessions: SessionRow[], date: string): DailyStats {
  const visitors = new Set(sessions.map((s) => s.visitorId)).size;
  const pageviews = sessions.reduce((sum, s) => sum + (s.pageCount || 0), 0);
  const durations = sessions.map((s) => s.durationSec || 0);
  const avgDurationSec =
    durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const pages = new Map<string, number>();
  const referrers = new Map<string, number>();
  const utms = new Map<string, number>();
  const countries = new Map<string, number>();
  const companies = new Map<string, number>();
  const devices: Record<string, number> = {};
  const scroll = { p25: 0, p50: 0, p75: 0, p100: 0 };
  let ctaClicks = 0;
  let formStarts = 0;
  let formSubmits = 0;
  let leads = 0;

  for (const s of sessions) {
    for (const [path, views] of Object.entries(s.paths ?? {})) {
      pages.set(path, (pages.get(path) ?? 0) + views);
    }
    const ref = s.utm?.source ? `utm:${s.utm.source}` : hostnameOf(s.referrer);
    referrers.set(ref, (referrers.get(ref) ?? 0) + 1);
    if (s.utm?.source) utms.set(s.utm.source, (utms.get(s.utm.source) ?? 0) + 1);
    if (s.country) countries.set(s.country, (countries.get(s.country) ?? 0) + 1);
    if (s.asnOrg && s.asnType === "business") {
      companies.set(s.asnOrg, (companies.get(s.asnOrg) ?? 0) + 1);
    }
    devices[s.device || "desktop"] = (devices[s.device || "desktop"] ?? 0) + 1;
    if ((s.maxScroll ?? 0) >= 25) scroll.p25++;
    if ((s.maxScroll ?? 0) >= 50) scroll.p50++;
    if ((s.maxScroll ?? 0) >= 75) scroll.p75++;
    if ((s.maxScroll ?? 0) >= 100) scroll.p100++;
    ctaClicks += s.ctaClicks ?? 0;
    formStarts += s.formStarts ?? 0;
    formSubmits += s.formSubmits ?? 0;
    if (s.isLead) leads++;
  }

  const stats: DailyStats = {
    date,
    visitors,
    sessions: sessions.length,
    pageviews,
    avgDurationSec,
    leads,
    topPages: top(pages, 10).map(({ key, count }) => ({ path: key.replace(/·/g, "."), views: count })),
    topReferrers: top(referrers, 10).map(({ key, count }) => ({ source: key, sessions: count })),
    utmSources: top(utms, 10).map(({ key, count }) => ({ source: key, sessions: count })),
    countries: top(countries, 12).map(({ key, count }) => ({ country: key, sessions: count })),
    devices,
    companies: top(companies, 15).map(({ key, count }) => ({ org: key, sessions: count })),
    ctaClicks,
    formStarts,
    formSubmits,
    scrollDepth: scroll,
    computedAt: Date.now(),
  };
  return stats;
}

/** Aggregate one UTC day of sessions (default: yesterday) into daily_stats. */
export async function rollupDay(day?: string): Promise<DailyStats> {
  const target = day ?? dayKey(new Date(Date.now() - 24 * 3600 * 1000));
  const snap = await adminDb().collection(col("sessions")).where("dayKey", "==", target).get();
  const sessions = snap.docs.map((d) => d.data() as SessionRow);
  const stats = aggregateSessions(sessions, target);
  await adminDb().collection(col("daily_stats")).doc(target).set(stats);
  return stats;
}

/**
 * Retention purge: delete raw sessions (+ their event subcollections) older
 * than 90 days, chunked far below the daily delete quota. Firestore TTL
 * needs the paid plan, so this replaces it.
 */
export async function purgeOldSessions(): Promise<{ deletedSessions: number; deletedEvents: number }> {
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 3600 * 1000;
  const db = adminDb();
  let deletedSessions = 0;
  let deletedEvents = 0;

  while (deletedSessions + deletedEvents < DELETE_BUDGET_PER_RUN) {
    const snap = await db
      .collection(col("sessions"))
      .where("startedAt", "<", cutoff)
      .limit(60)
      .get();
    if (snap.empty) break;

    for (const doc of snap.docs) {
      const events = await doc.ref.collection("events").limit(200).get();
      if (!events.empty) {
        const batch = db.batch();
        for (const ev of events.docs) batch.delete(ev.ref);
        await batch.commit();
        deletedEvents += events.size;
      }
      // Only remove the session once its subcollection is drained.
      if (events.size < 200) {
        await doc.ref.delete();
        deletedSessions++;
      }
      if (deletedSessions + deletedEvents >= DELETE_BUDGET_PER_RUN) break;
    }
  }
  return { deletedSessions, deletedEvents };
}

export async function runNightlyRollup(day?: string) {
  const stats = await rollupDay(day);
  const purge = await purgeOldSessions();
  return { stats, purge };
}
