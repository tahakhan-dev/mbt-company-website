import { z } from "zod";

/**
 * Shared content contracts (forms ⇄ endpoints ⇄ admin ⇄ seed scripts).
 * Phase 2 scope: the records the prototype routes render. The full model
 * (homepageChapters, testimonials, team, faqs, mediaAssets, redirects,
 * leads, adminAudit) lands in Phases 5–6 and extends this file.
 */
export const publicationStatus = z.enum(["draft", "published", "archived"]);

export const sceneAccent = z.enum(["electric", "lime", "violet", "warm"]);

export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().min(1).max(12),
  name: z.string().min(1),
  outcome: z.string().min(1),
  description: z.string().min(1),
  accent: sceneAccent,
  status: publicationStatus,
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});

export const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  sourceUrl: z.url(),
  sourceLabel: z.string().min(1),
  verifiedAt: z.iso.datetime(),
  hidden: z.boolean().default(false),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  outcome: z.string().min(1),
  category: z.string().min(1),
  year: z.number().int().optional(),
  clientName: z.string().optional(),
  clientVisible: z.boolean().default(false),
  engagementModel: z.string().optional(),
  role: z.string().optional(),
  // Publication integrity gates — publishing is blocked unless both are true.
  ownershipVerified: z.boolean().default(false),
  clientPermission: z.boolean().default(false),
  status: publicationStatus,
  problem: z.string().optional(),
  approach: z.string().optional(),
  solution: z.string().optional(),
  metrics: z.array(metricSchema).default([]),
  accent: sceneAccent.default("electric"),
  heroMediaId: z.string().optional(),
  officialUrl: z.url().optional(),
  updatedAt: z.iso.datetime().optional(),
  verifiedAt: z.iso.datetime().optional(),
});

export type Service = z.infer<typeof serviceSchema>;
export type Project = z.infer<typeof projectSchema>;

/** The only path to a publicly visible project. Never bypass. */
export function isPubliclyVisible(project: Project): boolean {
  return (
    project.status === "published" && project.ownershipVerified && project.clientPermission
  );
}
