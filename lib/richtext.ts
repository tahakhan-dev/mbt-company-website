import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import sanitizeHtml from "sanitize-html";
import type { RichText } from "@/lib/schemas/common";

/**
 * Server-side renderer for Tiptap JSON: generateHTML + a strict sanitize
 * allowlist. All rich text is authored in the admin, but sanitizing on
 * render keeps stored-content injection off the table entirely.
 */
const ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "s",
  "a",
  "blockquote",
  "code",
  "pre",
  "br",
  "hr",
];

export function richTextToHtml(doc: RichText): string {
  if (!doc || typeof doc !== "object") return "";
  let html = "";
  try {
    html = generateHTML(doc as Parameters<typeof generateHTML>[0], [StarterKit]);
  } catch {
    return "";
  }
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href", "target", "rel"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
    allowedSchemes: ["https", "http", "mailto"],
  });
}

/** Plain-text preview (for admin lists / meta descriptions). */
export function richTextToPlain(doc: RichText, maxLength = 220): string {
  const html = richTextToHtml(doc);
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
