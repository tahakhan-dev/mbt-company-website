/**
 * Manual rollup runner (same core as the scheduled Netlify function).
 * Usage: npm run rollup            → yesterday (UTC)
 *        npm run rollup 2026-08-30 → a specific day
 */
import { runNightlyRollup } from "@/lib/analytics/rollup-core";

const day = process.argv[2];
const { stats, purge } = await runNightlyRollup(day);
console.log(`Rollup for ${stats.date}`);
console.log(`  sessions=${stats.sessions} visitors=${stats.visitors} pageviews=${stats.pageviews}`);
console.log(`  avgDuration=${stats.avgDurationSec}s leads=${stats.leads} cta=${stats.ctaClicks} formSubmits=${stats.formSubmits}`);
console.log(`  topPages=${JSON.stringify(stats.topPages.slice(0, 5))}`);
console.log(`  purge: ${purge.deletedSessions} sessions, ${purge.deletedEvents} events`);
