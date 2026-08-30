import { z } from "zod";
import { baseDocSchema, faqItemSchema, richTextSchema } from "./common";

export const serviceIconKeys = [
  "sparkle",
  "database",
  "bank",
  "devices",
  "cloud",
  "pen-nib",
] as const;

export const offeringSchema = z.object({
  title: z.string().min(1).max(80),
  detail: z.string().min(1).max(300),
});

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
});

export type Service = z.infer<typeof serviceSchema>;
export type ServiceDoc = Service & { id: string };
