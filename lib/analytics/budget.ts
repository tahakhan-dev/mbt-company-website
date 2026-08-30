/**
 * Firestore Spark free tier allows 20k writes/day. The collector keeps an
 * (amortized) daily counter and degrades gracefully well before the cliff:
 *
 *   normal   → full fidelity
 *   sampling → ≥ soft limit (15k): event docs are dropped, sessions stay alive
 *   halted   → ≥ hard limit (19k): collector becomes a no-op for the day
 */
export const DAILY_WRITE_SOFT_LIMIT = 15_000;
export const DAILY_WRITE_HARD_LIMIT = 19_000;

export type BudgetMode = "normal" | "sampling" | "halted";

export function budgetMode(todayWrites: number): BudgetMode {
  if (todayWrites >= DAILY_WRITE_HARD_LIMIT) return "halted";
  if (todayWrites >= DAILY_WRITE_SOFT_LIMIT) return "sampling";
  return "normal";
}

/**
 * Client-side flush cadence: 15s for the first minute on a page, 30s until
 * three minutes, then 60s. Long reads cost ~1 write/minute instead of 4.
 */
export function heartbeatFlushDelay(secondsOnPage: number): number {
  if (secondsOnPage >= 180) return 60_000;
  if (secondsOnPage >= 60) return 30_000;
  return 15_000;
}

/** Write accounting for one collect batch (mirrors what the collector does). */
export function writesForBatch(batch: {
  events: { t: string }[];
  isNewSession: boolean;
}): number {
  const eventDocs = batch.events.filter((e) => e.t !== "heartbeat").length;
  const sessionWrite = 1;
  const visitorWrite = batch.isNewSession ? 1 : 0;
  return sessionWrite + visitorWrite + eventDocs;
}

/** UTC day key, e.g. "2026-08-30" (rollups + counters are UTC-based). */
export function dayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
