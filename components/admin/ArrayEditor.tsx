"use client";

import { Plus, TrashSimple } from "@phosphor-icons/react/dist/ssr";
import { AdminButton, AdminInput, AdminTextarea } from "@/components/admin/ui";

type Column = { key: string; label: string; type?: "text" | "textarea"; width?: string };

/** Compact editor for arrays of small records (metrics, offerings, FAQs…). */
export function ArrayEditor({
  columns,
  value,
  onChange,
  addLabel,
  max = 12,
}: {
  columns: Column[];
  value: Record<string, string>[];
  onChange: (next: Record<string, string>[]) => void;
  addLabel: string;
  max?: number;
}) {
  function update(index: number, key: string, next: string) {
    onChange(value.map((row, i) => (i === index ? { ...row, [key]: next } : row)));
  }
  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...value, Object.fromEntries(columns.map((c) => [c.key, ""]))]);
  }

  return (
    <div className="space-y-2">
      {value.map((row, index) => (
        <div key={index} className="flex items-start gap-2 rounded-lg bg-white/[0.03] p-2 ring-1 ring-white/8">
          <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: columns.map((c) => c.width ?? "1fr").join(" ") }}>
            {columns.map((colDef) =>
              colDef.type === "textarea" ? (
                <AdminTextarea
                  key={colDef.key}
                  rows={2}
                  aria-label={colDef.label}
                  placeholder={colDef.label}
                  value={row[colDef.key] ?? ""}
                  onChange={(e) => update(index, colDef.key, e.target.value)}
                />
              ) : (
                <AdminInput
                  key={colDef.key}
                  aria-label={colDef.label}
                  placeholder={colDef.label}
                  value={row[colDef.key] ?? ""}
                  onChange={(e) => update(index, colDef.key, e.target.value)}
                />
              ),
            )}
          </div>
          <AdminButton type="button" size="icon" variant="ghost" aria-label="Remove row" onClick={() => remove(index)}>
            <TrashSimple className="size-4" aria-hidden="true" />
          </AdminButton>
        </div>
      ))}
      {value.length < max && (
        <AdminButton type="button" size="sm" variant="ghost" onClick={add}>
          <Plus className="size-3.5" aria-hidden="true" /> {addLabel}
        </AdminButton>
      )}
    </div>
  );
}

/** Comma/enter chip input for string arrays (stack, tags…). */
export function ChipsInput({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  id?: string;
}) {
  function commit(raw: string) {
    const parts = raw
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) onChange([...value, ...parts.filter((p) => !value.includes(p))]);
  }
  return (
    <div className="rounded-lg bg-white/[0.05] p-2 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-aurora-cyan/60">
      <div className="flex flex-wrap gap-1.5">
        {value.map((chip) => (
          <span key={chip} className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-xs">
            {chip}
            <button
              type="button"
              aria-label={`Remove ${chip}`}
              className="text-ink-faint hover:text-ink"
              onClick={() => onChange(value.filter((c) => c !== chip))}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          className="min-w-28 flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-ink-faint"
          placeholder={placeholder ?? "Type and press Enter"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
          onBlur={(e) => {
            commit(e.target.value);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
