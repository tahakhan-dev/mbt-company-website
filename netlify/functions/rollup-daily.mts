import { runNightlyRollup } from "../../lib/analytics/rollup-core";

/**
 * Scheduled nightly (netlify.toml: 03:10 UTC): aggregates yesterday into
 * daily_stats and purges raw analytics older than 90 days — keeping
 * dashboard reads tiny and storage inside the Spark free tier.
 */
export default async function handler(): Promise<Response> {
  const { stats, purge } = await runNightlyRollup();
  console.log(
    `[rollup] ${stats.date}: ${stats.sessions} sessions / ${stats.visitors} visitors / ${stats.pageviews} pageviews; purged ${purge.deletedSessions} sessions + ${purge.deletedEvents} events`,
  );
  return new Response("ok");
}
