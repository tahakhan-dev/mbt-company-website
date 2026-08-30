import { z } from "zod";

/**
 * Trust-bar / tech-marquee items. Rendered as styled wordmarks by default
 * (premium, always crisp); an optional image URL overrides.
 */
export const logoSchema = z.object({
  name: z.string().min(1).max(60),
  kind: z.enum(["client", "tech"]).default("tech"),
  imageUrl: z.string().max(600).default(""),
  visible: z.boolean().default(true),
  order: z.number().default(0),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export type Logo = z.infer<typeof logoSchema>;
export type LogoDoc = Logo & { id: string };
