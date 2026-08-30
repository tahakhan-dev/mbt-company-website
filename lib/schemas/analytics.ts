import { z } from "zod";

export const eventTypes = [
  "page_view",
  "heartbeat",
  "scroll_depth",
  "cta_click",
  "form_start",
  "form_submit",
  "outbound_click",
] as const;
export type EventType = (typeof eventTypes)[number];

const uuid = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

const metaValue = z.union([z.string().max(500), z.number(), z.boolean()]);

export const trackerEventSchema = z.object({
  t: z.enum(eventTypes),
  ts: z.number().int().positive(),
  path: z.string().max(300),
  meta: z.record(z.string().max(40), metaValue).optional(),
});
export type TrackerEvent = z.infer<typeof trackerEventSchema>;

export const deviceClasses = ["mobile", "tablet", "desktop"] as const;

export const collectPayloadSchema = z.object({
  v: z.literal(1),
  visitorId: uuid,
  sessionId: uuid,
  startedAt: z.number().int().positive(),
  context: z
    .object({
      referrer: z.string().max(600).default(""),
      language: z.string().max(20).default(""),
      viewport: z.object({ w: z.number().int().min(0).max(20000), h: z.number().int().min(0).max(20000) }),
      device: z.enum(deviceClasses),
      utm: z.record(z.string().max(40), z.string().max(200)).optional(),
    })
    .optional(),
  state: z.object({
    durationSec: z.number().int().min(0).max(86_400),
    maxScroll: z.number().int().min(0).max(100),
    pageCount: z.number().int().min(0).max(10_000),
    path: z.string().max(300),
  }),
  events: z.array(trackerEventSchema).max(50).default([]),
});
export type CollectPayload = z.infer<typeof collectPayloadSchema>;

/** Session document (analytics). */
export const sessionDocSchema = z.object({
  visitorId: z.string(),
  startedAt: z.number().int(),
  lastSeenAt: z.number().int(),
  durationSec: z.number().int().default(0),
  pageCount: z.number().int().default(0),
  maxScroll: z.number().int().default(0),
  entryPath: z.string().default("/"),
  exitPath: z.string().default("/"),
  referrer: z.string().default(""),
  utm: z.record(z.string(), z.string()).default({}),
  device: z.enum(deviceClasses).default("desktop"),
  language: z.string().default(""),
  country: z.string().default(""),
  city: z.string().default(""),
  region: z.string().default(""),
  ipHash: z.string().default(""),
  asn: z.string().default(""),
  asnOrg: z.string().default(""),
  /** "isp" | "hosting" | "business" | "" — business = warm-lead hint. */
  asnType: z.string().default(""),
  isLead: z.boolean().default(false),
  leadId: z.string().default(""),
  dayKey: z.string().default(""),
});
export type SessionDoc = z.infer<typeof sessionDocSchema>;

export type DailyStats = {
  date: string;
  visitors: number;
  sessions: number;
  pageviews: number;
  avgDurationSec: number;
  leads: number;
  topPages: { path: string; views: number }[];
  topReferrers: { source: string; sessions: number }[];
  utmSources: { source: string; sessions: number }[];
  countries: { country: string; sessions: number }[];
  devices: Record<string, number>;
  companies: { org: string; sessions: number }[];
  ctaClicks: number;
  formStarts: number;
  formSubmits: number;
  scrollDepth: { p25: number; p50: number; p75: number; p100: number };
  computedAt: number;
};
