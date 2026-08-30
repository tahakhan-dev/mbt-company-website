import { z } from "zod";
import { baseDocSchema, faqItemSchema, richTextSchema } from "./common";

export const serviceIconKeys = [
  "sparkle",
  "database",
  "bank",
  "devices",
  "cloud",
  "pen-nib",
  "chat",
  "flow",
  "storefront",
  "browser",
] as const;

export const offeringSchema = z.object({
  title: z.string().min(1).max(80),
  detail: z.string().min(1).max(300),
});

/** Before→After framing rendered on every service page (V2 mandate). */
export const transformationSchema = z
  .object({
    before: z.array(z.string().max(160)).max(4).default([]),
    after: z.array(z.string().max(160)).max(4).default([]),
    metric: z.string().max(80).default(""),
  })
  .default({ before: [], after: [], metric: "" });

export const serviceSchema = baseDocSchema.extend({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(80),
  iconKey: z.enum(serviceIconKeys).default("sparkle"),
  short: z.string().min(2).max(240),
  problem: z.string().max(600).default(""),
  long: richTextSchema,
  offerings: z.array(offeringSchema).max(12).default([]),
  process: z
    .array(z.object({ title: z.string().max(80), detail: z.string().max(300) }))
    .max(8)
    .default([]),
  stack: z.array(z.string().max(40)).max(24).default([]),
  faqs: z.array(faqItemSchema).max(10).default([]),
  relatedProjectSlugs: z.array(z.string().max(80)).max(6).default([]),
  transformation: transformationSchema,
});

export type Service = z.infer<typeof serviceSchema>;
export type ServiceDoc = Service & { id: string };
