"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createContent, deleteContent, updateContent } from "@/lib/admin/actions";
import { projectSchema, type ProjectDoc, type Project } from "@/lib/schemas/project";
import type { RichText } from "@/lib/schemas/common";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
  AdminSelect,
  FieldRow,
  Modal,
} from "@/components/admin/ui";
import { ArrayEditor, ChipsInput } from "@/components/admin/ArrayEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type Draft = Omit<Project, "createdAt" | "updatedAt">;

const emptyDraft: Draft = {
  title: "",
  slug: "",
  client: "",
  industry: "",
  timeline: "",
  serviceSlugs: [],
  summary: "",
  challenge: { type: "doc", content: [] },
  solution: { type: "doc", content: [] },
  results: { type: "doc", content: [] },
  metrics: [],
  stack: [],
  cover: { kind: "generated", seed: "", url: "", alt: "" },
  gallery: [],
  featured: false,
  status: "draft",
  order: 0,
};

export function ProjectForm({
  project,
  services,
}: {
  project: ProjectDoc | null;
  services: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(
    project ? { ...emptyDraft, ...project } : { ...emptyDraft },
  );
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save(nextStatus?: "draft" | "published") {
    if (busy) return;
    const candidate = { ...draft, status: nextStatus ?? draft.status };
    const parsed = projectSchema.safeParse(candidate);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      toast.error(`${issue?.path.join(".") || "field"}: ${issue?.message ?? "invalid"}`);
      return;
    }
    setBusy(true);
    const result = project
      ? await updateContent("projects", project.id, parsed.data)
      : await createContent("projects", parsed.data);
    setBusy(false);
    if (result.ok) {
      toast.success(project ? "Project saved — live site updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    } else toast.error(result.error);
  }

  async function remove() {
    if (!project) return;
    const result = await deleteContent("projects", project.id);
    if (result.ok) {
      toast.success("Project deleted");
      router.push("/admin/projects");
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
              <AdminLabel htmlFor="p-title">Title</AdminLabel>
              <AdminInput id="p-title" required value={draft.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div>
              <AdminLabel htmlFor="p-slug" hint="auto-generated; editable">Slug</AdminLabel>
              <AdminInput id="p-slug" value={draft.slug} placeholder="from title" onChange={(e) => set("slug", e.target.value)} />
            </div>
          </FieldRow>
          <FieldRow cols={3}>
            <div>
              <AdminLabel htmlFor="p-client">Client</AdminLabel>
              <AdminInput id="p-client" value={draft.client} onChange={(e) => set("client", e.target.value)} />
            </div>
            <div>
              <AdminLabel htmlFor="p-industry">Industry</AdminLabel>
              <AdminInput id="p-industry" value={draft.industry} onChange={(e) => set("industry", e.target.value)} />
            </div>
            <div>
              <AdminLabel htmlFor="p-timeline">Timeline</AdminLabel>
              <AdminInput id="p-timeline" placeholder="8 weeks to production" value={draft.timeline} onChange={(e) => set("timeline", e.target.value)} />
            </div>
          </FieldRow>
          <div>
            <AdminLabel htmlFor="p-summary">Summary (cards + meta description)</AdminLabel>
            <AdminInput id="p-summary" required value={draft.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>
          <FieldRow>
            <div>
              <AdminLabel>Service tags</AdminLabel>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => {
                  const active = draft.serviceSlugs.includes(s.slug);
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        set(
                          "serviceSlugs",
                          active
                            ? draft.serviceSlugs.filter((x) => x !== s.slug)
                            : [...draft.serviceSlugs, s.slug],
                        )
                      }
                      className={
                        active
                          ? "rounded-full bg-aurora-teal/15 px-3 py-1.5 text-xs text-aurora-teal ring-1 ring-aurora-teal/40"
                          : "rounded-full px-3 py-1.5 text-xs text-ink-muted ring-1 ring-white/12 hover:bg-white/5"
                      }
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <AdminLabel htmlFor="p-stack">Tech stack</AdminLabel>
              <ChipsInput id="p-stack" value={draft.stack} onChange={(v) => set("stack", v)} placeholder="Next.js, PostgreSQL…" />
            </div>
          </FieldRow>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="size-4 accent-[#f5b14c]"
              />
              Featured on home page
            </label>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              Status:
              <AdminSelect
                aria-label="Status"
                className="h-8 w-36"
                value={draft.status}
                onChange={(e) => set("status", e.target.value as Draft["status"])}
              >
                <option value="draft">draft (hidden)</option>
                <option value="published">published</option>
              </AdminSelect>
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Story">
        <div className="space-y-5">
          <div>
            <AdminLabel>Challenge</AdminLabel>
            <RichTextEditor value={draft.challenge as RichText} onChange={(doc) => set("challenge", doc)} />
          </div>
          <div>
            <AdminLabel>Solution</AdminLabel>
            <RichTextEditor value={draft.solution as RichText} onChange={(doc) => set("solution", doc)} />
          </div>
          <div>
            <AdminLabel>Results</AdminLabel>
            <RichTextEditor value={draft.results as RichText} onChange={(doc) => set("results", doc)} minHeight={110} />
          </div>
          <div>
            <AdminLabel>Metrics (shown as gradient stat cards)</AdminLabel>
            <ArrayEditor
              addLabel="Add metric"
              max={6}
              columns={[
                { key: "value", label: "Value (e.g. -38%)", width: "160px" },
                { key: "label", label: "Label (e.g. ops cost)" },
              ]}
              value={draft.metrics}
              onChange={(rows) => set("metrics", rows as Draft["metrics"])}
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Media">
        <div className="space-y-4">
          <FieldRow>
            <div>
              <AdminLabel htmlFor="p-cover-kind">Cover</AdminLabel>
              <AdminSelect
                id="p-cover-kind"
                value={draft.cover.kind}
                onChange={(e) => set("cover", { ...draft.cover, kind: e.target.value as "generated" | "cloudinary" })}
              >
                <option value="generated">Generated aurora art (automatic)</option>
                <option value="cloudinary">Uploaded image (Cloudinary URL)</option>
              </AdminSelect>
            </div>
            {draft.cover.kind === "cloudinary" ? (
              <div>
                <AdminLabel htmlFor="p-cover-url">Image URL</AdminLabel>
                <AdminInput
                  id="p-cover-url"
                  type="url"
                  placeholder="https://res.cloudinary.com/…"
                  value={draft.cover.url}
                  onChange={(e) => set("cover", { ...draft.cover, url: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <AdminLabel htmlFor="p-cover-seed" hint="defaults to the title">Art seed</AdminLabel>
                <AdminInput
                  id="p-cover-seed"
                  value={draft.cover.seed}
                  onChange={(e) => set("cover", { ...draft.cover, seed: e.target.value })}
                />
              </div>
            )}
          </FieldRow>
          <div>
            <AdminLabel htmlFor="p-cover-alt">Cover alt text</AdminLabel>
            <AdminInput
              id="p-cover-alt"
              value={draft.cover.alt}
              onChange={(e) => set("cover", { ...draft.cover, alt: e.target.value })}
            />
          </div>
          <div>
            <AdminLabel>Gallery images</AdminLabel>
            <ArrayEditor
              addLabel="Add image"
              columns={[
                { key: "url", label: "https://res.cloudinary.com/… URL" },
                { key: "alt", label: "Alt text", width: "220px" },
              ]}
              value={draft.gallery}
              onChange={(rows) => set("gallery", rows as Draft["gallery"])}
            />
          </div>
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
          <AdminButton type="button" variant="ghost" onClick={() => router.push("/admin/projects")}>
            Cancel
          </AdminButton>
        </div>
        {project && (
          <AdminButton type="button" variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete project
          </AdminButton>
        )}
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Confirm deletion">
        <p className="text-sm text-ink-muted">
          Delete <strong className="text-ink">{draft.title || "this project"}</strong> permanently?
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
