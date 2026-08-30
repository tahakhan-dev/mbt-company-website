"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { createContent, deleteContent, updateContent } from "@/lib/admin/actions";
import { SortableList } from "@/components/admin/SortableList";
import {
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
  Badge,
  EmptyState,
  Modal,
} from "@/components/admin/ui";

export type FieldSpec = {
  key: string; // dot-path into the document (e.g. "socials.linkedin")
  label: string;
  type: "text" | "textarea" | "url" | "checkbox" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
};

type Item = { id: string } & Record<string, unknown>;

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let cursor = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    if (typeof cursor[key] !== "object" || cursor[key] === null) cursor[key] = {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]!] = value;
}

/**
 * List + modal editor + drag reorder for the simple content types
 * (team, testimonials, logos). Field specs drive the form.
 */
export function SimpleCrud({
  collection,
  items,
  fields,
  titleKey,
  subtitleKey,
  addLabel,
  emptyTitle,
  emptyDetail,
  base,
}: {
  collection: string;
  items: Item[];
  fields: FieldSpec[];
  titleKey: string;
  subtitleKey?: string;
  addLabel: string;
  emptyTitle: string;
  emptyDetail: string;
  /** Default values for a new item (arrays/objects the schema expects). */
  base: Record<string, unknown>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});

  function openEditor(item: Item | "new") {
    const source = item === "new" ? { ...base } : structuredClone(item);
    const flat: Record<string, unknown> = {};
    for (const field of fields) flat[field.key] = getPath(source, field.key) ?? (field.type === "checkbox" ? true : "");
    setDraft(flat);
    setEditing(item);
  }

  async function save() {
    if (busy || !editing) return;
    setBusy(true);
    const doc: Record<string, unknown> =
      editing === "new" ? structuredClone(base) : structuredClone(editing);
    delete doc.id;
    for (const field of fields) setPath(doc, field.key, draft[field.key]);
    const result =
      editing === "new"
        ? await createContent(collection, doc)
        : await updateContent(collection, editing.id, doc);
    setBusy(false);
    if (result.ok) {
      toast.success(editing === "new" ? "Created" : "Saved");
      setEditing(null);
      router.refresh();
    } else toast.error(result.error);
  }

  async function remove() {
    if (!confirmDelete) return;
    const result = await deleteContent(collection, confirmDelete.id);
    if (result.ok) {
      toast.success("Deleted");
      setConfirmDelete(null);
      router.refresh();
    } else toast.error(result.error);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AdminButton variant="primary" onClick={() => openEditor("new")}>
          <Plus className="size-4" aria-hidden="true" /> {addLabel}
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          detail={emptyDetail}
          action={<AdminButton onClick={() => openEditor("new")}>{addLabel}</AdminButton>}
        />
      ) : (
        <SortableList
          items={items}
          collection={collection}
          renderItem={(item) => (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{String(item[titleKey] ?? "")}</p>
                {subtitleKey && (
                  <p className="truncate text-xs text-ink-faint">{String(item[subtitleKey] ?? "")}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {"visible" in item && !item.visible && <Badge tone="red">hidden</Badge>}
                {"kind" in item && <Badge>{String(item.kind)}</Badge>}
                <AdminButton size="sm" onClick={() => openEditor(item)}>
                  Edit
                </AdminButton>
                <AdminButton size="sm" variant="ghost" onClick={() => setConfirmDelete(item)}>
                  Delete
                </AdminButton>
              </div>
            </div>
          )}
        />
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? addLabel : `Edit ${String((editing as Item | null)?.[titleKey] ?? "")}`}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          {fields.map((field) => (
            <div key={field.key}>
              {field.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm text-ink-muted">
                  <input
                    type="checkbox"
                    checked={Boolean(draft[field.key])}
                    onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.checked }))}
                    className="size-4 accent-[#22d3ee]"
                  />
                  {field.label}
                </label>
              ) : (
                <>
                  <AdminLabel htmlFor={`f-${field.key}`}>{field.label}</AdminLabel>
                  {field.type === "textarea" ? (
                    <AdminTextarea
                      id={`f-${field.key}`}
                      rows={4}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={String(draft[field.key] ?? "")}
                      onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    />
                  ) : field.type === "select" ? (
                    <AdminSelect
                      id={`f-${field.key}`}
                      value={String(draft[field.key] ?? "")}
                      onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    >
                      {field.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </AdminSelect>
                  ) : (
                    <AdminInput
                      id={`f-${field.key}`}
                      type={field.type === "url" ? "url" : "text"}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={String(draft[field.key] ?? "")}
                      onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    />
                  )}
                </>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <AdminButton type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </AdminButton>
          </div>
        </form>
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Confirm deletion"
      >
        <p className="text-sm text-ink-muted">
          Delete <strong className="text-ink">{String(confirmDelete?.[titleKey] ?? "")}</strong>{" "}
          permanently? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <AdminButton variant="ghost" onClick={() => setConfirmDelete(null)}>
            Cancel
          </AdminButton>
          <AdminButton variant="danger" onClick={() => void remove()}>
            Delete
          </AdminButton>
        </div>
      </Modal>
    </div>
  );
}
