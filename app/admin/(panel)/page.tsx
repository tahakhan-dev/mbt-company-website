import type { Metadata } from "next";
import Link from "next/link";
import { adminCounts, adminListLeads } from "@/lib/admin/queries";
import { AdminCard, Badge } from "@/components/admin/ui";
import { LeadStatusBadge } from "@/components/admin/leads/LeadsClient";
import { timeAgo } from "@/lib/utils/format";
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [counts, leads] = await Promise.all([adminCounts(), adminListLeads(6)]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          {(["projects", "services", "team", "testimonials"] as const).map((k) => (
            <Badge key={k}>
              {counts[k] ?? 0} {k}
            </Badge>
          ))}
        </div>
      </header>

      <AnalyticsDashboard />

      <AdminCard
        title="Latest leads"
        actions={
          <Link href="/admin/leads" className="text-xs text-aurora-teal hover:underline">
            All leads →
          </Link>
        }
      >
        {leads.length === 0 ? (
          <p className="text-sm text-ink-faint">No leads yet — they land here with journeys attached.</p>
        ) : (
          <ul className="divide-y divide-white/6">
            {leads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads?id=${lead.id}`}
                  className="flex items-center justify-between gap-3 py-2.5 hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{lead.name}</p>
                    <p className="truncate text-xs text-ink-faint">
                      {lead.services.slice(0, 2).join(", ") || lead.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-ink-faint">{timeAgo(lead.createdAt)}</span>
                    <LeadStatusBadge status={lead.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
