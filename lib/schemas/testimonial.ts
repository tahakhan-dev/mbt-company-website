import { z } from "zod";

export const testimonialSchema = z.object({
  quote: z.string().min(10).max(600),
  author: z.string().min(2).max(80),
  role: z.string().max(80).default(""),
  company: z.string().max(80).default(""),
  avatarUrl: z.string().max(600).default(""),
  visible: z.boolean().default(true),
  order: z.number().default(0),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;
export type TestimonialDoc = Testimonial & { id: string };
