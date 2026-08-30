import { z } from "zod";
import { faqItemSchema } from "./common";

export const metricItemSchema = z.object({
  label: z.string().min(1).max(60),
  value: z.string().min(1).max(20),
  suffix: z.string().max(10).default(""),
});

export const siteSettingsSchema = z.object({
  name: z.string().min(1).max(60).default("MBT"),
  tagline: z.string().min(1).max(140).default("Operational noise → growth."),
  heroEyebrow: z.string().max(80).default("AI systems studio"),
  heroHeadline: z.string().max(160).default("Five minutes to a faster business."),
  heroSubline: z
    .string()
    .max(300)
    .default(
      "Bring your bottleneck. Leave with a plan: which AI systems pay off first, what they cost, what they return.",
    ),
  trustLine: z.string().max(200).default("12+ systems shipped · 9 industries · fintech-grade security"),
  contactEmail: z.email().default("hello@example.com"),
  whatsapp: z.string().max(30).default(""),
  calendlyUrl: z.union([z.url(), z.literal("")]).default(""),
  markets: z.string().max(120).default("Global"),
  responsePromise: z.string().max(120).default("We reply within one business day."),
  socials: z
    .object({
      linkedin: z.union([z.url(), z.literal("")]).default(""),
      github: z.union([z.url(), z.literal("")]).default(""),
      x: z.union([z.url(), z.literal("")]).default(""),
    })
    .default({ linkedin: "", github: "", x: "" }),
  seo: z
    .object({
      titleTemplate: z.string().max(120).default("%s — MBT"),
      description: z
        .string()
        .max(300)
        .default(
          "MBT is an AI-driven software house: LLM applications, data platforms, fintech engineering, and product design — shipped end to end.",
        ),
      ogImage: z.string().max(500).default(""),
    })
    .default({ titleTemplate: "%s — MBT", description: "MBT is an AI-driven software house: LLM applications, data platforms, fintech engineering, and product design — shipped end to end.", ogImage: "" }),
  metrics: z
    .array(metricItemSchema)
    .default([
      { label: "Products shipped", value: "12", suffix: "+" },
      { label: "Years building", value: "6", suffix: "" },
      { label: "Industries served", value: "9", suffix: "" },
      { label: "Client NPS", value: "72", suffix: "" },
    ]),
  homeFaqs: z
    .array(faqItemSchema)
    .default([
      {
        question: "How do AI projects start with you?",
        answer:
          "With a free strategy call, then a short paid discovery sprint (1–2 weeks). You get a scoped roadmap, an architecture proposal, and a fixed quote for the first release — whether or not you build it with us.",
      },
      {
        question: "How do you price work?",
        answer:
          "Fixed-scope releases for well-defined builds, monthly product teams for ongoing work. Every quote names deliverables, timeline, and what happens if scope changes. No surprise invoices.",
      },
      {
        question: "Who owns the code and the models?",
        answer:
          "You do — 100%. Code lives in your repos from day one, infrastructure in your cloud accounts, and any fine-tuned models or prompts are your IP. We keep nothing hostage.",
      },
      {
        question: "How fast can we ship a first version?",
        answer:
          "Most first releases go live in 4–8 weeks. We scope a thin, production-grade slice first — real users, real data, real metrics — then iterate weekly from evidence, not opinions.",
      },
    ]),
  announcement: z
    .object({
      enabled: z.boolean().default(false),
      text: z.string().max(160).default(""),
      href: z.string().max(300).default(""),
    })
    .default({ enabled: false, text: "", href: "" }),
  updatedAt: z.number().int().optional(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export const defaultSiteSettings: SiteSettings = siteSettingsSchema.parse({});
