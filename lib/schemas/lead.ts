import { z } from "zod";

export const budgetOptions = [
  "under-10k",
  "10k-25k",
  "25k-50k",
  "50k-plus",
  "not-sure",
] as const;

export const budgetLabels: Record<(typeof budgetOptions)[number], string> = {
  "under-10k": "Under $10k",
  "10k-25k": "$10k – $25k",
  "25k-50k": "$25k – $50k",
  "50k-plus": "$50k+",
  "not-sure": "Not sure yet",
};

export const leadStatusOptions = ["new", "contacted", "qualified", "won", "lost"] as const;
export type LeadStatus = (typeof leadStatusOptions)[number];

const uuidish = z
  .string()
  .regex(/^[0-9a-fA-F-]{16,40}$/, "invalid id")
  .optional();

export const leadAttributionSchema = z
  .object({
    visitorId: uuidish,
    sessionId: uuidish,
    path: z.string().max(300).optional(),
    referrer: z.string().max(600).optional(),
    utm: z.record(z.string().max(40), z.string().max(200)).optional(),
  })
  .optional();

/** What the multi-step contact form submits (client and server share this). */
export const leadInputSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80),
  email: z.email("That email doesn't look right."),
  services: z.array(z.string().max(80)).max(6).default([]),
  budget: z.enum(budgetOptions).optional(),
  message: z.string().trim().min(4, "Tell us a little about the project.").max(4000),
  /** Honeypot — humans never fill this. */
  website: z.literal(""),
  /** Time-trap — set when the form was first touched. */
  startedAt: z.number().int().positive(),
  turnstileToken: z.string().max(4000).optional(),
  attribution: leadAttributionSchema,
});
export type LeadInput = z.infer<typeof leadInputSchema>;

export const leadNoteSchema = z.object({
  text: z.string().min(1).max(2000),
  at: z.number().int(),
});

export const leadSchema = z.object({
  name: z.string(),
  email: z.string(),
  services: z.array(z.string()).default([]),
  budget: z.enum(budgetOptions).optional(),
  message: z.string(),
  status: z.enum(leadStatusOptions).default("new"),
  notes: z.array(leadNoteSchema).default([]),
  attribution: z
    .object({
      visitorId: z.string().optional(),
      sessionId: z.string().optional(),
      path: z.string().optional(),
      referrer: z.string().optional(),
      utm: z.record(z.string(), z.string()).optional(),
      country: z.string().optional(),
      city: z.string().optional(),
    })
    .default({}),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});
export type Lead = z.infer<typeof leadSchema>;
export type LeadDoc = Lead & { id: string };
