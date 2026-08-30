"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addLeadNote, deleteLead, updateLeadStatus } from "@/lib/admin/actions";
import { budgetLabels, leadStatusOptions, type LeadDoc, type LeadStatus } from "@/lib/schemas/lead";
import { AdminButton, AdminSelect, AdminTextarea, Badge } from "@/components/admin/ui";
import { formatDateTime, timeAgo, cn } from "@/lib/utils/format";

const STATUS_TONE: Record<LeadStatus, "amber" | "teal" | "violet" | "green" | "red"> = {
  new: "amber",
  contacted: "teal",
  qualified: "violet",
  won: "green",
  lost: "red",
};

export function LeadStatusSelect({ lead }: { lead: LeadDoc }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const router = useRouter();

  async function change(next: LeadStatus) {
    const prev = status;
    setStatus(next); // optimistic
    const result = await updateLeadStatus(lead.id, next);
    if (!result.ok) {
      setStatus(prev);
      toast.error(result.error);
    } else {
      toast.success(`Marked ${next}`);
      router.refresh();
    }
  }

  return (
    <AdminSelect
      aria-label={`Status for ${lead.name}`}
      value={status}
      onChange={(e) => change(e.target.value as LeadStatus)}
      className="h-8 w-32 text-xs"
      onClick={(e) => e.stopPropagation()}
    >
      {leadStatusOptions.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </AdminSelect>
  );
}

export function LeadsTable({ leads, selectedId }: { leads: LeadDoc[]; selectedId?: string }) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-white/8">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/8 bg-white/[0.03] font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
            <th className="px-4 py-3 font-normal">Lead</th>
            <th className="px-4 py-3 font-normal">Interest</th>
            <th className="px-4 py-3 font-normal">From</th>
            <th className="px-4 py-3 font-normal">Received</th>
            <th className="px-4 py-3 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => router.push(`/admin/leads?id=${lead.id}`)}
              className={cn(
                "cursor-pointer border-b border-white/6 transition-colors last:border-0 hover:bg-white/[0.04]",
                selectedId === lead.id && "bg-white/[0.05]",
              )}
            >
              <td className="px-4 py-3">
                <p className={cn("truncate", lead.status === "new" ? "font-semibold" : "font-medium")}>
                  {lead.status === "new" && (
                    <span className="mr-2 inline-block size-1.5 rounded-full bg-cta align-middle" aria-label="unread" />
                  )}
                  {lead.name}
                </p>
                <p className="truncate text-xs text-ink-faint">{lead.email}</p>
              </td>
              <td className="px-4 py-3 text-xs text-ink-muted">
                {lead.services.length > 0 ? lead.services.slice(0, 2).join(", ") : "—"}
                {lead.budget && (
                  <span className="block text-ink-faint">{budgetLabels[lead.budget]}</span>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-ink-muted">
                {[lead.attribution.city, lead.attribution.country].filter(Boolean).join(", ") || "—"}
                {lead.attribution.utm?.source && (
                  <span className="block text-ink-faint">utm: {lead.attribution.utm.source}</span>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-ink-muted" title={formatDateTime(lead.createdAt)}>
                {timeAgo(lead.createdAt)}
              </td>
              <td className="px-4 py-3">
                <LeadStatusSelect lead={lead} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LeadNotes({ lead }: { lead: LeadDoc }) {
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    if (!text.trim()) return;
    startTransition(async () => {
      const result = await addLeadNote(lead.id, text);
      if (result.ok) {
        setText("");
        toast.success("Note added");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  return (
    <div>
      <h3 className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
        Private notes
      </h3>
      <ul className="space-y-2">
        {lead.notes.map((note, i) => (
          <li key={i} className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm ring-1 ring-white/8">
            <p className="whitespace-pre-wrap text-ink-muted">{note.text}</p>
            <p className="mt-1 text-[0.65rem] text-ink-faint">{formatDateTime(note.at)}</p>
          </li>
        ))}
        {lead.notes.length === 0 && <li className="text-sm text-ink-faint">No notes yet.</li>}
      </ul>
      <div className="mt-3 flex flex-col gap-2">
        <AdminTextarea
          rows={2}
          placeholder="Add a note…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="New note"
        />
        <AdminButton size="sm" onClick={submit} disabled={pending || !text.trim()} className="self-end">
          {pending ? "Saving…" : "Add note"}
        </AdminButton>
      </div>
    </div>
  );
}

export function LeadDangerZone({ lead }: { lead: LeadDoc }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function remove() {
    const result = await deleteLead(lead.id);
    if (result.ok) {
      toast.success("Lead deleted");
      router.push("/admin/leads");
      router.refresh();
    } else toast.error(result.error);
  }

  return confirming ? (
    <div className="flex items-center gap-2">
      <p className="text-xs text-ink-faint">Delete “{lead.name}” permanently?</p>
      <AdminButton size="sm" variant="danger" onClick={remove}>
        Delete
      </AdminButton>
      <AdminButton size="sm" variant="ghost" onClick={() => setConfirming(false)}>
        Cancel
      </AdminButton>
    </div>
  ) : (
    <AdminButton size="sm" variant="ghost" onClick={() => setConfirming(true)}>
      Delete lead
    </AdminButton>
  );
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{status}</Badge>;
}
