import { adminDb } from "@/lib/firebase/admin";
import { col } from "@/lib/firebase/collections";
import {
  serviceSchema,
  projectSchema,
  teamMemberSchema,
  testimonialSchema,
  logoSchema,
  leadSchema,
  type ServiceDoc,
  type ProjectDoc,
  type TeamMemberDoc,
  type TestimonialDoc,
  type LogoDoc,
  type LeadDoc,
} from "@/lib/schemas";
import type { ZodType } from "zod";

/**
 * Admin reads: always fresh (no data cache) — the panel must reflect writes
 * instantly. Small collections, so full reads are cheap.
 */
async function listAll<T>(name: Parameters<typeof col>[0], schema: ZodType<T>) {
  const snap = await adminDb().collection(col(name)).get();
  const rows: (T & { id: string })[] = [];
  for (const doc of snap.docs) {
    const parsed = schema.safeParse(doc.data());
    if (parsed.success) rows.push({ ...(parsed.data as T), id: doc.id });
  }
  return rows;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function adminListServices(): Promise<ServiceDoc[]> {
  return (await listAll("services", serviceSchema)).sort(byOrder);
}
export async function adminListProjects(): Promise<ProjectDoc[]> {
  return (await listAll("projects", projectSchema)).sort(byOrder);
}
export async function adminListTeam(): Promise<TeamMemberDoc[]> {
  return (await listAll("team", teamMemberSchema)).sort(byOrder);
}
export async function adminListTestimonials(): Promise<TestimonialDoc[]> {
  return (await listAll("testimonials", testimonialSchema)).sort(byOrder);
}
export async function adminListLogos(): Promise<LogoDoc[]> {
  return (await listAll("logos", logoSchema)).sort(byOrder);
}

export async function adminGetDoc<T>(
  name: Parameters<typeof col>[0],
  id: string,
  schema: ZodType<T>,
): Promise<(T & { id: string }) | null> {
  const snap = await adminDb().collection(col(name)).doc(id).get();
  if (!snap.exists) return null;
  const parsed = schema.safeParse(snap.data());
  return parsed.success ? { ...(parsed.data as T), id: snap.id } : null;
}

export async function adminListLeads(limit = 200): Promise<LeadDoc[]> {
  const snap = await adminDb()
    .collection(col("leads"))
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  const rows: LeadDoc[] = [];
  for (const doc of snap.docs) {
    const parsed = leadSchema.safeParse(doc.data());
    if (parsed.success) rows.push({ ...parsed.data, id: doc.id });
  }
  return rows;
}

export async function adminCounts(): Promise<Record<string, number>> {
  const names = ["services", "projects", "team", "testimonials", "logos", "leads"] as const;
  const out: Record<string, number> = {};
  await Promise.all(
    names.map(async (name) => {
      const agg = await adminDb().collection(col(name)).count().get();
      out[name] = agg.data().count;
    }),
  );
  return out;
}
