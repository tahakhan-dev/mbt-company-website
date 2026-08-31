import { z } from "zod";

/** Shared lead contract: contact form ⇄ endpoint ⇄ admin pipeline. */
export const leadInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  projectType: z
    .enum(["mvp", "automation", "ai-product", "platform", "modernization", "other", ""])
    .optional(),
  budget: z.enum(["lt10k", "10-25k", "25-75k", "75k+", "undisclosed", ""]).optional(),
  message: z.string().trim().min(1).max(5000),
  productUrl: z.union([z.url().max(500), z.literal("")]).optional(),
  // Spam traps (server-enforced): honeypot content is accepted by the schema
  // so bots get no validation oracle — spamVerdict() flags it downstream.
  website: z.string().max(500).optional(),
  startedAt: z.coerce.number().int().positive(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const LEAD_STATUSES = [
  "new",
  "qualified",
  "discovery",
  "proposal",
  "won",
  "lost",
  "spam",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadRecord extends Omit<LeadInput, "website" | "startedAt"> {
  status: LeadStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  attribution: {
    page: string;
    referrer: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
  fillSeconds: number;
}

const MIN_FILL_MS = 3000;

/** Pure spam heuristics — unit-tested; the endpoint feeds it request facts. */
export function spamVerdict(input: {
  honeypotFilled: boolean;
  fillMs: number;
  linkCount: number;
}): { spam: boolean; reason?: string } {
  if (input.honeypotFilled) return { spam: true, reason: "honeypot" };
  if (input.fillMs < MIN_FILL_MS) return { spam: true, reason: "too-fast" };
  if (input.linkCount > 4) return { spam: true, reason: "link-stuffing" };
  return { spam: false };
}

export function countLinks(text: string): number {
  return (text.match(/https?:\/\//gi) ?? []).length;
}
