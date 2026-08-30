import Link from "next/link";
import {
  getLiveSessions,
  getRangeStats,
  getRecentSessions,
  getWriteBudget,
} from "@/lib/analytics/dashboard";
import { AdminCard, Badge } from "@/components/admin/ui";
import { TrafficChart, BarsChart } from "@/components/admin/analytics/Charts";
import { AutoRefresh } from "@/components/admin/analytics/AutoRefresh";
import { formatDuration, formatNumber, timeAgo } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";

const RANGES = [
  { key: "1", label: "Today", days: 1 },
  { key: "7", label: "7d", days: 7 },
  { key: "30", label: "30d", days: 30 },
  { key: "90", label: "90d", days: 90 },
] as const;

/**
 * First-party visitor intelligence: live sessions, traffic, sources, geo,
 * companies (IPinfo ASN), engagement funnels, and session explorer — all
 * from our own Firestore data, engineered inside the free daily quotas.
 */
export async function AnalyticsDashboard({ range = "7" }: { range?: string }) {
  const rangeDef = RANGES.find((r) => r.key === range) ?? RANGES[1];
  const [live, { days, totals }, recent, budget] = await Promise.all([
    getLiveSessions(),
    getRangeStats(rangeDef.days),
    getRecentSessions(20),
    getWriteBudget(),
  ]);

  const kpis = [
    { label: "Visitors", value: formatNumber(totals.visitors) },
    { label: "Pageviews", value: formatNumber(totals.pageviews) },
    { label: "Avg. session", value: formatDuration(totals.avgDurationSec) },
    { label: "Leads", value: formatNumber(totals.leads) },
  ];

  const funnel = [
    { name: "Sessions", value: totals.sessions },
    { name: "CTA clicks", value: totals.ctaClicks },
    { name: "Form starts", value: totals.formStarts },
    { name: "Form submits", value: totals.formSubmits },
  ];
  const scroll = [
    { name: "25%", value: totals.scrollDepth.p25 },
    { name: "50%", value: totals.scrollDepth.p50 },
    { name: "75%", value: totals.scrollDepth.p75 },
    { name: "100%", value: totals.scrollDepth.p100 },
  ];
  const devices = Object.entries(totals.devices).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-5">
      <AutoRefresh seconds={60} />
      {/* Range picker + budget state */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1 ring-1 ring-white/8" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <Link
              key={r.key}
              href={`/admin?range=${r.key}`}
              aria-current={r.key === rangeDef.key ? "true" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                r.key === rangeDef.key ? "bg-white/10 text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {r.label}
            </Link>
          ))}
        </div>
        <Badge tone={budget.mode === "normal" ? "teal" : budget.mode === "sampling" ? "amber" : "red"}>
          write budget: {formatNumber(budget.count)}/20k · {budget.mode}
        </Badge>
      </div>

      {/* Live now + KPIs */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <AdminCard
          title="Live now"
          actions={
            <span className="inline-flex items-center gap-2 font-mono text-xs text-aurora-teal">
              <span className="size-2 animate-pulse-dot rounded-full bg-aurora-teal" aria-hidden="true" />
              {live.length} active
            </span>
          }
        >
          {live.length === 0 ? (
            <p className="text-sm text-ink-faint">Nobody on the site right now.</p>
          ) : (
            <ul className="max-h-44 space-y-2 overflow-y-auto">
              {live.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link href={`/admin/visitors/${s.id}`} className="truncate font-mono text-xs text-ink hover:text-aurora-teal">
                    {s.path}
                  </Link>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-ink-faint">
                    {[s.city, s.country].filter(Boolean).join(", ") || "unknown"} · {s.device}
                    {s.isLead && <Badge tone="amber">lead</Badge>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl bg-surface p-4 ring-1 ring-white/8">
              <p className="font-mono text-2xl tracking-tight text-gradient-aurora">{kpi.value}</p>
              <p className="mt-1 text-xs text-ink-faint">{kpi.label}</p>
            </div>
          ))}
          <div className="col-span-2 rounded-xl bg-surface p-4 ring-1 ring-white/8 sm:col-span-4">
            <p className="text-xs text-ink-faint">
              Form conversion:{" "}
              <span className="font-mono text-ink">
                {totals.formStarts > 0
                  ? `${Math.round((totals.formSubmits / totals.formStarts) * 100)}%`
                  : "—"}
              </span>{" "}
              of started forms submitted · CTA click-through:{" "}
              <span className="font-mono text-ink">
                {totals.sessions > 0 ? `${Math.round((totals.ctaClicks / totals.sessions) * 100)}%` : "—"}
              </span>{" "}
              of sessions
            </p>
          </div>
        </div>
      </div>

      {/* Traffic chart */}
      {rangeDef.days > 1 && (
        <AdminCard title={`Traffic — last ${rangeDef.days} days`}>
          <TrafficChart
            data={days.map((d) => ({ date: d.date, visitors: d.visitors, pageviews: d.pageviews }))}
          />
        </AdminCard>
      )}

      {/* Pages / sources / countries */}
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard title="Top pages">
          {totals.topPages.length === 0 ? (
            <p className="text-sm text-ink-faint">No pageviews in range.</p>
          ) : (
            <BarsChart label="Views" data={totals.topPages.slice(0, 7).map((p) => ({ name: p.path, value: p.views }))} />
          )}
        </AdminCard>
        <AdminCard title="Sources">
          {totals.topReferrers.length === 0 ? (
            <p className="text-sm text-ink-faint">No referrer data in range.</p>
          ) : (
            <BarsChart label="Sessions" color="#818cf8" data={totals.topReferrers.slice(0, 7).map((r) => ({ name: r.source, value: r.sessions }))} />
          )}
        </AdminCard>
        <AdminCard title="Countries">
          {totals.countries.length === 0 ? (
            <p className="text-sm text-ink-faint">No geo data in range.</p>
          ) : (
            <BarsChart label="Sessions" color="#f5b14c" data={totals.countries.slice(0, 7).map((c) => ({ name: c.country, value: c.sessions }))} />
          )}
        </AdminCard>
      </div>

      {/* Funnels + devices */}
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard title="Conversion funnel">
          <BarsChart label="Count" data={funnel} />
        </AdminCard>
        <AdminCard title="Scroll depth (sessions reaching)">
          <BarsChart label="Sessions" color="#818cf8" data={scroll} />
        </AdminCard>
        <AdminCard title="Devices">
          {devices.length === 0 ? (
            <p className="text-sm text-ink-faint">No device data in range.</p>
          ) : (
            <BarsChart label="Sessions" color="#5eead4" data={devices} />
          )}
        </AdminCard>
      </div>

      {/* Companies */}
      <AdminCard title="Companies visiting (non-ISP networks)">
        {totals.companies.length === 0 ? (
          <p className="text-sm text-ink-faint">
            No corporate networks identified in range — appears once business ASNs visit.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/8 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
                <th className="py-2 font-normal">Organization</th>
                <th className="py-2 text-right font-normal">Sessions</th>
              </tr>
            </thead>
            <tbody>
              {totals.companies.map((c) => (
                <tr key={c.org} className="border-b border-white/6 last:border-0">
                  <td className="py-2">{c.org}</td>
                  <td className="py-2 text-right font-mono">{c.sessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">
          IP data by{" "}
          <a href="https://ipinfo.io" target="_blank" rel="noopener noreferrer" className="underline">
            IPinfo
          </a>
        </p>
      </AdminCard>

      {/* Session explorer */}
      <AdminCard title="Recent sessions">
        {recent.length === 0 ? (
          <p className="text-sm text-ink-faint">Sessions appear as soon as the tracker sees traffic.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/8 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
                  <th className="py-2 pr-3 font-normal">Started</th>
                  <th className="py-2 pr-3 font-normal">Entry</th>
                  <th className="py-2 pr-3 font-normal">From</th>
                  <th className="py-2 pr-3 font-normal">Pages</th>
                  <th className="py-2 pr-3 font-normal">Time</th>
                  <th className="py-2 font-normal">Journey</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id} className="border-b border-white/6 last:border-0">
                    <td className="py-2 pr-3 text-xs text-ink-faint">{timeAgo(s.startedAt)}</td>
                    <td className="max-w-40 truncate py-2 pr-3 font-mono text-xs">{s.path}</td>
                    <td className="py-2 pr-3 text-xs text-ink-muted">
                      {s.utmSource ? `utm:${s.utmSource}` : s.referrer ? new URL(s.referrer).hostname : "direct"}
                      {" · "}
                      {[s.city, s.country].filter(Boolean).join(", ") || "unknown"}
                      {s.asnOrg && s.asnType === "business" && (
                        <span className="ml-1 text-cta">({s.asnOrg})</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">{s.pageCount}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{formatDuration(s.durationSec)}</td>
                    <td className="py-2">
                      <span className="inline-flex items-center gap-2">
                        <Link href={`/admin/visitors/${s.id}`} className="text-xs text-aurora-teal hover:underline">
                          View
                        </Link>
                        {s.isLead && <Badge tone="amber">lead</Badge>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
