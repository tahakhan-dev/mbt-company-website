import { z } from "zod";
import { baseDocSchema, richTextSchema } from "./common";

/** Cover art: generated aurora field (default) or a Cloudinary image. */
export const coverSchema = z
  .object({
    kind: z.enum(["generated", "cloudinary"]).default("generated"),
    /** Seed for the deterministic generated cover. */
    seed: z.string().max(80).default(""),
    /** Full https://res.cloudinary.com/... URL when kind = cloudinary. */
    url: z.string().max(600).default(""),
    alt: z.string().max(200).default(""),
  })
  .default({ kind: "generated", seed: "", url: "", alt: "" });

export const projectMetricSchema = z.object({
  label: z.string().min(1).max(60),
  value: z.string().min(1).max(24),
});

export const projectSchema = baseDocSchema.extend({
  title: z.string().min(2).max(120),
  slug: z.string().min(2).max(80),
  client: z.string().max(80).default(""),
  industry: z.string().max(60).default(""),
  timeline: z.string().max(60).default(""),
  serviceSlugs: z.array(z.string().max(80)).max(6).default([]),
  summary: z.string().min(2).max(400),
  challenge: richTextSchema,
  solution: richTextSchema,
  results: richTextSchema,
  metrics: z.array(projectMetricSchema).max(6).default([]),
  stack: z.array(z.string().max(40)).max(24).default([]),
  cover: coverSchema,
  gallery: z
    .array(z.object({ url: z.string().max(600), alt: z.string().max(200).default("") }))
    .max(12)
    .default([]),
  featured: z.boolean().default(false),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectDoc = Project & { id: string };
