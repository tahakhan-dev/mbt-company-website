import type { Metadata } from "next";
import { adminListLeads } from "@/lib/admin/queries";
import { budgetLabels } from "@/lib/schemas/lead";
import {
  LeadDangerZone,
  LeadNotes,
  LeadStatusBadge,
  LeadsTable,
} from "@/components/admin/leads/LeadsClient";
import { AdminCard, EmptyState } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/utils/format";
import { VisitorJourney } from "@/components/admin/analytics/VisitorJourney";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const leads = await adminListLeads();
  const selected = id ? (leads.find((l) => l.id === id) ?? null) : null;
  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Leads</h1>
          <p className="text-sm text-ink-faint">
            {leads.length} total · {newCount} new
          </p>
        </div>
      </header>

      {leads.length === 0 ? (
        <EmptyState
          title="No leads yet"
          detail="Submissions from the contact form land here with their full visitor journey attached."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <LeadsTable leads={leads} selectedId={selected?.id} />

          {selected ? (
            <div className="space-y-4">
              <AdminCard title={selected.name} actions={<LeadStatusBadge status={selected.status} />}>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">Email</dt>
                    <dd className="mt-1 break-all">
                      <a href={`mailto:${selected.email}`} className="text-aurora-teal hover:underline">
                        {selected.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">Received</dt>
                    <dd className="mt-1">{formatDateTime(selected.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">Services</dt>
                    <dd className="mt-1">{selected.services.join(", ") || "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">Budget</dt>
                    <dd className="mt-1">{selected.budget ? budgetLabels[selected.budget] : "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">Location</dt>
                    <dd className="mt-1">
                      {[selected.attribution.city, selected.attribution.country].filter(Boolean).join(", ") || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">Source</dt>
                    <dd className="mt-1 break-all">
                      {selected.attribution.utm?.source ??
                        (selected.attribution.referrer ? new URL(selected.attribution.referrer).hostname : "direct")}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 border-t border-white/8 pt-4">
                  <h3 className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                    Message
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                    {selected.message}
                  </p>
                </div>
              </AdminCard>

              <AdminCard title="Visitor journey">
                <VisitorJourney
                  sessionId={selected.attribution.sessionId}
                  visitorId={selected.attribution.visitorId}
                />
              </AdminCard>

              <AdminCard>
                <LeadNotes lead={selected} />
                <div className="mt-5 border-t border-white/8 pt-4">
                  <LeadDangerZone lead={selected} />
                </div>
              </AdminCard>
            </div>
          ) : (
            <EmptyState title="Select a lead" detail="Click a row to see the full message, journey, and notes." />
          )}
        </div>
      )}
    </div>
  );
}
