"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { col, type CollectionName } from "@/lib/firebase/collections";
import { bustTag } from "@/lib/data/revalidate";
import { requireAdmin } from "@/lib/admin/auth";
import { slugify, uniqueSlug } from "@/lib/utils/slug";
import {
  serviceSchema,
  projectSchema,
  teamMemberSchema,
  testimonialSchema,
  logoSchema,
  siteSettingsSchema,
  leadStatusOptions,
} from "@/lib/schemas";
import type { ZodType } from "zod";

type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

/** Content collections the generic CRUD may touch — nothing else. */
const CONTENT: Record<string, { schema: ZodType<Record<string, unknown>>; hasSlug: boolean }> = {
  services: { schema: serviceSchema as unknown as ZodType<Record<string, unknown>>, hasSlug: true },
  projects: { schema: projectSchema as unknown as ZodType<Record<string, unknown>>, hasSlug: true },
  team: { schema: teamMemberSchema as unknown as ZodType<Record<string, unknown>>, hasSlug: false },
  testimonials: { schema: testimonialSchema as unknown as ZodType<Record<string, unknown>>, hasSlug: false },
  logos: { schema: logoSchema as unknown as ZodType<Record<string, unknown>>, hasSlug: false },
};

type ContentCollection = keyof typeof CONTENT & CollectionName;

function contentDef(collection: string) {
  const def = CONTENT[collection];
  if (!def) throw new Error("INVALID_COLLECTION");
  return { def, name: collection as ContentCollection };
}

async function guard<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    await requireAdmin();
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "UNKNOWN";
    if (message === "UNAUTHORIZED") return { ok: false, error: "Session expired — sign in again." };
    if (message === "INVALID_COLLECTION") return { ok: false, error: "Unknown collection." };
    if (message.startsWith("VALIDATION:")) return { ok: false, error: message.slice(11) };
    console.error("[admin action]", err);
    return { ok: false, error: "Something went wrong. Try again." };
  }
}

function parseOrThrow<T>(schema: ZodType<T>, raw: unknown): T {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new Error(`VALIDATION:${first?.path.join(".") ?? "field"}: ${first?.message ?? "invalid"}`);
  }
  return parsed.data;
}

async function ensureSlug(name: ContentCollection, desired: string, excludeId?: string) {
  const base = slugify(desired);
  if (!base) throw new Error("VALIDATION:slug: cannot be empty");
  const db = adminDb();
  return uniqueSlug(base, async (candidate) => {
    const snap = await db.collection(col(name)).where("slug", "==", candidate).limit(1).get();
    const hit = snap.docs[0];
    return Boolean(hit && hit.id !== excludeId);
  });
}

// ---------------------------------------------------------------------------
// Generic content CRUD
// ---------------------------------------------------------------------------
export async function createContent(
  collection: string,
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  return guard(async () => {
    const { def, name } = contentDef(collection);
    const data = parseOrThrow(def.schema, raw) as Record<string, unknown>;
    if (def.hasSlug) {
      data.slug = await ensureSlug(name, String(data.slug || data.name || data.title || ""));
    }
    const now = Date.now();
    const ref = await adminDb()
      .collection(col(name))
      .add({ ...data, createdAt: now, updatedAt: now });
    bustTag(name);
    return { id: ref.id };
  });
}

export async function updateContent(
  collection: string,
  id: string,
  raw: unknown,
): Promise<ActionResult> {
  return guard(async () => {
    const { def, name } = contentDef(collection);
    const data = parseOrThrow(def.schema, raw) as Record<string, unknown>;
    if (def.hasSlug) {
      data.slug = await ensureSlug(name, String(data.slug || data.name || data.title || ""), id);
    }
    await adminDb()
      .collection(col(name))
      .doc(id)
      .set({ ...data, updatedAt: Date.now() }, { merge: true });
    bustTag(name);
    return undefined;
  });
}

export async function deleteContent(collection: string, id: string): Promise<ActionResult> {
  return guard(async () => {
    const { name } = contentDef(collection);
    await adminDb().collection(col(name)).doc(id).delete();
    bustTag(name);
    return undefined;
  });
}

/** Persist a drag-reorder: order = index * 10. */
export async function reorderContent(
  collection: string,
  orderedIds: string[],
): Promise<ActionResult> {
  return guard(async () => {
    const { name } = contentDef(collection);
    if (!Array.isArray(orderedIds) || orderedIds.length > 500) {
      throw new Error("VALIDATION:order: invalid payload");
    }
    const db = adminDb();
    const batch = db.batch();
    orderedIds.forEach((id, index) => {
      batch.update(db.collection(col(name)).doc(id), { order: index * 10, updatedAt: Date.now() });
    });
    await batch.commit();
    bustTag(name);
    return undefined;
  });
}

// ---------------------------------------------------------------------------
// Site settings (singleton)
// ---------------------------------------------------------------------------
export async function updateSettings(raw: unknown): Promise<ActionResult> {
  return guard(async () => {
    const data = parseOrThrow(siteSettingsSchema, raw);
    await adminDb()
      .collection(col("settings"))
      .doc("site")
      .set({ ...data, updatedAt: Date.now() }, { merge: false });
    bustTag("settings");
    revalidatePath("/", "layout");
    return undefined;
  });
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------
export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  return guard(async () => {
    if (!(leadStatusOptions as readonly string[]).includes(status)) {
      throw new Error("VALIDATION:status: unknown status");
    }
    await adminDb()
      .collection(col("leads"))
      .doc(id)
      .set({ status, updatedAt: Date.now() }, { merge: true });
    return undefined;
  });
}

export async function addLeadNote(id: string, text: string): Promise<ActionResult> {
  return guard(async () => {
    const trimmed = text.trim().slice(0, 2000);
    if (!trimmed) throw new Error("VALIDATION:note: empty");
    const ref = adminDb().collection(col("leads")).doc(id);
    await adminDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error("VALIDATION:lead: not found");
      const notes = (snap.data()?.notes ?? []) as { text: string; at: number }[];
      tx.update(ref, {
        notes: [...notes, { text: trimmed, at: Date.now() }],
        updatedAt: Date.now(),
      });
    });
    return undefined;
  });
}

export async function deleteLead(id: string): Promise<ActionResult> {
  return guard(async () => {
    await adminDb().collection(col("leads")).doc(id).delete();
    return undefined;
  });
}
