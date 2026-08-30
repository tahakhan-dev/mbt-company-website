import { adminDb } from "@/lib/firebase/admin";
import { col } from "@/lib/firebase/collections";
import { dayKey } from "@/lib/analytics/budget";
import { aggregateSessions, type SessionRow } from "@/lib/analytics/rollup-core";
import type { DailyStats } from "@/lib/schemas/analytics";

export type LiveSession = {
  id: string;
  path: string;
  country: string;
  city: string;
  device: string;
  durationSec: number;
  isLead: boolean;
};

/** Sessions with a heartbeat in the last 3 minutes = "on the site right now". */
export async function getLiveSessions(): Promise<LiveSession[]> {
  const snap = await adminDb()
    .collection(col("sessions"))
    .where("lastSeenAt", ">", Date.now() - 3 * 60_000)
    .limit(50)
    .get();
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      path: (d.exitPath as string) || "/",
      country: (d.country as string) || "",
      city: (d.city as string) || "",
      device: (d.device as string) || "desktop",
      durationSec: (d.durationSec as number) || 0,
      isLead: Boolean(d.isLead),
    };
  });
}

/** Live aggregate for today (raw sessions — the only day not in rollups). */
export async function getTodayStats(): Promise<DailyStats> {
  const today = dayKey();
  const snap = await adminDb().collection(col("sessions")).where("dayKey", "==", today).get();
  return aggregateSessions(snap.docs.map((d) => d.data() as SessionRow), today);
}

/**
 * Range = precomputed daily_stats for past days + today's live aggregate.
 * Dashboard reads stay tiny against the 50k/day quota (≤ ~90 doc reads +
 * today's sessions).
 */
export async function getRangeStats(days: number): Promise<{ days: DailyStats[]; totals: DailyStats }> {
  const today = await getTodayStats();
  const list: DailyStats[] = [];
  if (days > 1) {
    const keys: string[] = [];
    for (let i = days - 1; i >= 1; i--) {
      keys.push(dayKey(new Date(Date.now() - i * 24 * 3600 * 1000)));
    }
    const refs = keys.map((k) => adminDb().collection(col("daily_stats")).doc(k));
    const snaps = await adminDb().getAll(...refs);
    for (const snap of snaps) {
      if (snap.exists) list.push(snap.data() as DailyStats);
      else
        list.push({
          date: snap.id,
          visitors: 0,
          sessions: 0,
          pageviews: 0,
          avgDurationSec: 0,
          leads: 0,
          topPages: [],
          topReferrers: [],
          utmSources: [],
          countries: [],
          devices: {},
          companies: [],
          ctaClicks: 0,
          formStarts: 0,
          formSubmits: 0,
          scrollDepth: { p25: 0, p50: 0, p75: 0, p100: 0 },
          computedAt: 0,
        });
    }
  }
  list.push(today);
  return { days: list, totals: mergeStats(list) };
}

function mergeTop<T extends Record<string, unknown>>(
  lists: T[][],
  keyField: keyof T,
  countField: keyof T,
  limit: number,
): T[] {
  const map = new Map<string, number>();
  for (const list of lists) {
    for (const item of list) {
      const key = String(item[keyField]);
      map.set(key, (map.get(key) ?? 0) + Number(item[countField] ?? 0));
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ [keyField]: key, [countField]: count }) as T);
}

export function mergeStats(days: DailyStats[]): DailyStats {
  const weightedDuration = days.reduce((sum, d) => sum + d.avgDurationSec * d.sessions, 0);
  const sessions = days.reduce((sum, d) => sum + d.sessions, 0);
  const devices: Record<string, number> = {};
  for (const d of days) {
    for (const [k, v] of Object.entries(d.devices)) devices[k] = (devices[k] ?? 0) + v;
  }
  return {
    date: `${days[0]?.date ?? ""}…${days[days.length - 1]?.date ?? ""}`,
    visitors: days.reduce((sum, d) => sum + d.visitors, 0),
    sessions,
    pageviews: days.reduce((sum, d) => sum + d.pageviews, 0),
    avgDurationSec: sessions > 0 ? Math.round(weightedDuration / sessions) : 0,
    leads: days.reduce((sum, d) => sum + d.leads, 0),
    topPages: mergeTop(days.map((d) => d.topPages), "path", "views", 10),
    topReferrers: mergeTop(days.map((d) => d.topReferrers), "source", "sessions", 10),
    utmSources: mergeTop(days.map((d) => d.utmSources), "source", "sessions", 10),
    countries: mergeTop(days.map((d) => d.countries), "country", "sessions", 12),
    companies: mergeTop(days.map((d) => d.companies), "org", "sessions", 15),
    devices,
    ctaClicks: days.reduce((sum, d) => sum + d.ctaClicks, 0),
    formStarts: days.reduce((sum, d) => sum + d.formStarts, 0),
    formSubmits: days.reduce((sum, d) => sum + d.formSubmits, 0),
    scrollDepth: {
      p25: days.reduce((sum, d) => sum + d.scrollDepth.p25, 0),
      p50: days.reduce((sum, d) => sum + d.scrollDepth.p50, 0),
      p75: days.reduce((sum, d) => sum + d.scrollDepth.p75, 0),
      p100: days.reduce((sum, d) => sum + d.scrollDepth.p100, 0),
    },
    computedAt: Date.now(),
  };
}

export type RecentSession = LiveSession & {
  startedAt: number;
  pageCount: number;
  referrer: string;
  utmSource: string;
  asnOrg: string;
  asnType: string;
  visitorId: string;
};

export async function getRecentSessions(limit = 30): Promise<RecentSession[]> {
  const snap = await adminDb()
    .collection(col("sessions"))
    .orderBy("startedAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      path: (d.entryPath as string) || "/",
      country: (d.country as string) || "",
      city: (d.city as string) || "",
      device: (d.device as string) || "desktop",
      durationSec: (d.durationSec as number) || 0,
      isLead: Boolean(d.isLead),
      startedAt: (d.startedAt as number) || 0,
      pageCount: (d.pageCount as number) || 0,
      referrer: (d.referrer as string) || "",
      utmSource: ((d.utm as Record<string, string>) ?? {}).source ?? "",
      asnOrg: (d.asnOrg as string) || "",
      asnType: (d.asnType as string) || "",
      visitorId: (d.visitorId as string) || "",
    };
  });
}

/** Current day's write counter (kill-switch status for the dashboard). */
export async function getWriteBudget(): Promise<{ count: number; mode: string }> {
  const snap = await adminDb()
    .collection(col("counters"))
    .doc(`writes-${dayKey().replace(/-/g, "")}`)
    .get();
  const count = (snap.data()?.count as number | undefined) ?? 0;
  const mode = count >= 19_000 ? "halted" : count >= 15_000 ? "sampling" : "normal";
  return { count, mode };
}
