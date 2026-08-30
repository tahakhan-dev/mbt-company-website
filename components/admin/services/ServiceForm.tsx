"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createContent, deleteContent, updateContent } from "@/lib/admin/actions";
import { serviceSchema, serviceIconKeys, type Service, type ServiceDoc } from "@/lib/schemas/service";
import type { RichText } from "@/lib/schemas/common";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
  FieldRow,
  Modal,
} from "@/components/admin/ui";
import { ArrayEditor, ChipsInput } from "@/components/admin/ArrayEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

type Draft = Omit<Service, "createdAt" | "updatedAt">;

const emptyDraft: Draft = {
  name: "",
  slug: "",
  iconKey: "sparkle",
  short: "",
  problem: "",
  long: { type: "doc", content: [] },
  offerings: [],
  process: [],
  stack: [],
  faqs: [],
  relatedProjectSlugs: [],
  transformation: { before: [], after: [], metric: "" },
  status: "draft",
  order: 0,
};

export function ServiceForm({
  service,
  projectSlugs,
}: {
  service: ServiceDoc | null;
  projectSlugs: string[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(service ? { ...emptyDraft, ...service } : { ...emptyDraft });
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save(nextStatus?: "draft" | "published") {
    if (busy) return;
    const parsed = serviceSchema.safeParse({ ...draft, status: nextStatus ?? draft.status });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      toast.error(`${issue?.path.join(".") || "field"}: ${issue?.message ?? "invalid"}`);
      return;
    }
    setBusy(true);
    const result = service
      ? await updateContent("services", service.id, parsed.data)
      : await createContent("services", parsed.data);
    setBusy(false);
    if (result.ok) {
      toast.success(service ? "Service saved — live site updated" : "Service created");
      router.push("/admin/services");
      router.refresh();
    } else toast.error(result.error);
  }

  async function remove() {
    if (!service) return;
    const result = await deleteContent("services", service.id);
    if (result.ok) {
      toast.success("Service deleted");
      router.push("/admin/services");
      router.refresh();
    } else toast.error(result.error);
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <AdminCard title="Basics">
        <div className="space-y-4">
          <FieldRow>
            <div>
              <AdminLabel htmlFor="s-name">Name</AdminLabel>
              <AdminInput id="s-name" required value={draft.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <AdminLabel htmlFor="s-slug" hint="auto-generated; editable">Slug</AdminLabel>
              <AdminInput id="s-slug" value={draft.slug} placeholder="from name" onChange={(e) => set("slug", e.target.value)} />
            </div>
          </FieldRow>
          <FieldRow>
            <div>
              <AdminLabel htmlFor="s-icon">Icon</AdminLabel>
              <div className="flex items-center gap-3">
                <AdminSelect
                  id="s-icon"
                  className="flex-1"
                  value={draft.iconKey}
                  onChange={(e) => set("iconKey", e.target.value as Draft["iconKey"])}
                >
                  {serviceIconKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </AdminSelect>
                <span className="grid size-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <ServiceIcon iconKey={draft.iconKey} className="size-4.5" />
                </span>
              </div>
            </div>
            <div className="flex items-end gap-2 text-sm text-ink-muted">
              Status:
              <AdminSelect
                aria-label="Status"
                className="h-9 w-40"
                value={draft.status}
                onChange={(e) => set("status", e.target.value as Draft["status"])}
              >
                <option value="draft">draft (hidden)</option>
                <option value="published">published</option>
              </AdminSelect>
            </div>
          </FieldRow>
          <div>
            <AdminLabel htmlFor="s-short">Short description (cards + meta)</AdminLabel>
            <AdminInput id="s-short" required value={draft.short} onChange={(e) => set("short", e.target.value)} />
          </div>
          <div>
            <AdminLabel htmlFor="s-problem">Problem framing (detail page intro card)</AdminLabel>
            <AdminTextarea id="s-problem" rows={3} value={draft.problem} onChange={(e) => set("problem", e.target.value)} />
          </div>
          <div>
            <AdminLabel>Long description</AdminLabel>
            <RichTextEditor value={draft.long as RichText} onChange={(doc) => set("long", doc)} />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Offerings & process">
        <div className="space-y-5">
          <div>
            <AdminLabel>Offerings (what we build)</AdminLabel>
            <ArrayEditor
              addLabel="Add offering"
              columns={[
                { key: "title", label: "Title", width: "220px" },
                { key: "detail", label: "Detail", type: "textarea" },
              ]}
              value={draft.offerings}
              onChange={(rows) => set("offerings", rows as Draft["offerings"])}
            />
          </div>
          <div>
            <AdminLabel>Mini-process steps</AdminLabel>
            <ArrayEditor
              addLabel="Add step"
              max={8}
              columns={[
                { key: "title", label: "Title", width: "220px" },
                { key: "detail", label: "Detail", type: "textarea" },
              ]}
              value={draft.process}
              onChange={(rows) => set("process", rows as Draft["process"])}
            />
          </div>
          <div>
            <AdminLabel>FAQ items</AdminLabel>
            <ArrayEditor
              addLabel="Add FAQ"
              max={10}
              columns={[
                { key: "question", label: "Question", width: "280px" },
                { key: "answer", label: "Answer", type: "textarea" },
              ]}
              value={draft.faqs}
              onChange={(rows) => set("faqs", rows as Draft["faqs"])}
            />
          </div>
          <div>
            <AdminLabel hint="rendered as the Before → After block on the service page">
              Transformation — life before
            </AdminLabel>
            <ChipsInput
              id="s-before"
              value={draft.transformation.before}
              onChange={(v) => set("transformation", { ...draft.transformation, before: v })}
              placeholder="Orders copy-pasted between systems…"
            />
            <div className="mt-3">
              <AdminLabel>Transformation — life after</AdminLabel>
              <ChipsInput
                id="s-after"
                value={draft.transformation.after}
                onChange={(v) => set("transformation", { ...draft.transformation, after: v })}
                placeholder="Order → invoice → ledger, untouched…"
              />
            </div>
            <div className="mt-3">
              <AdminLabel htmlFor="s-metric">Transformation headline metric</AdminLabel>
              <AdminInput
                id="s-metric"
                value={draft.transformation.metric}
                onChange={(e) => set("transformation", { ...draft.transformation, metric: e.target.value })}
                placeholder="Invoice run: 2 days → 20 minutes"
              />
            </div>
          </div>
          <FieldRow>
            <div>
              <AdminLabel htmlFor="s-stack">Tech we use</AdminLabel>
              <ChipsInput id="s-stack" value={draft.stack} onChange={(v) => set("stack", v)} />
            </div>
            <div>
              <AdminLabel htmlFor="s-related" hint={`existing: ${projectSlugs.slice(0, 3).join(", ")}…`}>
                Related project slugs
              </AdminLabel>
              <ChipsInput
                id="s-related"
                value={draft.relatedProjectSlugs}
                onChange={(v) => set("relatedProjectSlugs", v)}
                placeholder="support-copilot-fintech"
              />
            </div>
          </FieldRow>
        </div>
      </AdminCard>

      <div className="flex flex-wrap items-center justify-between gap-3 pb-8">
        <div className="flex gap-2">
          <AdminButton type="submit" variant="primary" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </AdminButton>
          {draft.status === "draft" ? (
            <AdminButton type="button" disabled={busy} onClick={() => void save("published")}>
              Save & publish
            </AdminButton>
          ) : (
            <AdminButton type="button" disabled={busy} onClick={() => void save("draft")}>
              Unpublish
            </AdminButton>
          )}
          <AdminButton type="button" variant="ghost" onClick={() => router.push("/admin/services")}>
            Cancel
          </AdminButton>
        </div>
        {service && (
          <AdminButton type="button" variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete service
          </AdminButton>
        )}
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Confirm deletion">
        <p className="text-sm text-ink-muted">
          Delete <strong className="text-ink">{draft.name || "this service"}</strong> permanently?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <AdminButton variant="ghost" onClick={() => setConfirmDelete(false)}>
            Cancel
          </AdminButton>
          <AdminButton variant="danger" onClick={() => void remove()}>
            Delete
          </AdminButton>
        </div>
      </Modal>
    </form>
  );
}
