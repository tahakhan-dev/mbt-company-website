import { unstable_cache } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { cacheTag, col, type CollectionName } from "@/lib/firebase/collections";
import {
  defaultSiteSettings,
  siteSettingsSchema,
  serviceSchema,
  projectSchema,
  teamMemberSchema,
  testimonialSchema,
  logoSchema,
  type SiteSettings,
  type ServiceDoc,
  type ProjectDoc,
  type TeamMemberDoc,
  type TestimonialDoc,
  type LogoDoc,
} from "@/lib/schemas";
import type { ZodType } from "zod";

/**
 * Public-site data layer. Every read is cached in the Next data cache and
 * tagged per collection; admin mutations call updateTag() so edits appear
 * on the very next request — no redeploys. A 1h revalidate is a safety net
 * for out-of-band edits (e.g. direct console changes).
 */
const REVALIDATE_SECONDS = 3600;

function cached<T>(name: CollectionName, fn: () => Promise<T>): () => Promise<T> {
  return unstable_cache(fn, ["data", cacheTag(name)], {
    tags: [cacheTag(name)],
    revalidate: REVALIDATE_SECONDS,
  });
}

async function readCollection<T>(
  name: CollectionName,
  schema: ZodType<T>,
): Promise<(T & { id: string })[]> {
  const snap = await adminDb().collection(col(name)).get();
  const rows: (T & { id: string })[] = [];
  for (const doc of snap.docs) {
    const parsed = schema.safeParse(doc.data());
    if (parsed.success) rows.push({ ...(parsed.data as T), id: doc.id });
    else console.warn(`[data] skipping invalid ${name}/${doc.id}: ${parsed.error.message}`);
  }
  return rows;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export const getSiteSettings = cached("settings", async (): Promise<SiteSettings> => {
  const doc = await adminDb().collection(col("settings")).doc("site").get();
  if (!doc.exists) return defaultSiteSettings;
  const parsed = siteSettingsSchema.safeParse(doc.data());
  return parsed.success ? parsed.data : defaultSiteSettings;
});

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
const getAllServices = cached("services", () => readCollection("services", serviceSchema));

export async function getServices(): Promise<ServiceDoc[]> {
  const all = await getAllServices();
  return all.filter((s) => s.status === "published").sort(byOrder);
}

export async function getService(slug: string): Promise<ServiceDoc | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const getAllProjects = cached("projects", () => readCollection("projects", projectSchema));

export async function getProjects(): Promise<ProjectDoc[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.status === "published").sort(byOrder);
}

export async function getFeaturedProjects(limit = 3): Promise<ProjectDoc[]> {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  return (featured.length > 0 ? featured : projects).slice(0, limit);
}

export async function getProject(slug: string): Promise<ProjectDoc | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getAdjacentProject(slug: string): Promise<ProjectDoc | null> {
  const projects = await getProjects();
  if (projects.length === 0) return null;
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return projects[0] ?? null;
  return projects[(idx + 1) % projects.length] ?? null;
}

// ---------------------------------------------------------------------------
// Team / testimonials / logos
// ---------------------------------------------------------------------------
const getAllTeam = cached("team", () => readCollection("team", teamMemberSchema));
export async function getTeam(): Promise<TeamMemberDoc[]> {
  const all = await getAllTeam();
  return all.filter((m) => m.visible).sort(byOrder);
}

const getAllTestimonials = cached("testimonials", () => readCollection("testimonials", testimonialSchema));
export async function getTestimonials(): Promise<TestimonialDoc[]> {
  const all = await getAllTestimonials();
  return all.filter((t) => t.visible).sort(byOrder);
}

const getAllLogos = cached("logos", () => readCollection("logos", logoSchema));
export async function getLogos(kind?: "client" | "tech"): Promise<LogoDoc[]> {
  const all = await getAllLogos();
  return all.filter((l) => l.visible && (!kind || l.kind === kind)).sort(byOrder);
}
