import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(2).max(80),
  role: z.string().min(2).max(80),
  bio: z.string().max(400).default(""),
  /** Cloudinary URL, or empty → generated monogram portrait. */
  photoUrl: z.string().max(600).default(""),
  socials: z
    .object({
      linkedin: z.union([z.url(), z.literal("")]).default(""),
      github: z.union([z.url(), z.literal("")]).default(""),
      x: z.union([z.url(), z.literal("")]).default(""),
    })
    .default({ linkedin: "", github: "", x: "" }),
  visible: z.boolean().default(true),
  order: z.number().default(0),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberDoc = TeamMember & { id: string };
