import { z } from "zod";

export const statusSchema = z.enum(["draft", "published"]);
export type Status = z.infer<typeof statusSchema>;

/** Epoch milliseconds — the app stores all timestamps as numbers. */
export const millis = z.number().int().nonnegative();

export const baseDocSchema = z.object({
  order: z.number().default(0),
  status: statusSchema.default("draft"),
  createdAt: millis.optional(),
  updatedAt: millis.optional(),
});

/**
 * Tiptap document JSON (rendered server-side through generateHTML + sanitize).
 * Loose on purpose: the editor owns the inner structure; rendering sanitizes.
 */
export const richTextSchema = z
  .looseObject({ type: z.literal("doc") })
  .nullable()
  .optional();
export type RichText = z.infer<typeof richTextSchema>;

/** Helper: plain-paragraph rich text (used by the seed + fallbacks). */
export function richTextFromParagraphs(paragraphs: string[]): NonNullable<RichText> {
  return {
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  };
}

export const idSchema = z.string().min(1).max(120);

export const faqItemSchema = z.object({
  question: z.string().min(1).max(200),
  answer: z.string().min(1).max(1200),
});
export type FaqItem = z.infer<typeof faqItemSchema>;
