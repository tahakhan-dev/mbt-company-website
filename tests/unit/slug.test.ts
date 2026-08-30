import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("AI & Generative AI Solutions")).toBe("ai-generative-ai-solutions");
  });
  it("strips diacritics", () => {
    expect(slugify("Café Über Zürich")).toBe("cafe-uber-zurich");
  });
  it("collapses repeats and trims edges", () => {
    expect(slugify("  --Fintech   Engineering--  ")).toBe("fintech-engineering");
  });
  it("handles numbers and empty input", () => {
    expect(slugify("2M+ transactions / mo")).toBe("2m-transactions-mo");
    expect(slugify("!!!")).toBe("");
  });
  it("caps length at 80 chars without trailing hyphen", () => {
    const s = slugify("a".repeat(70) + " " + "b".repeat(30));
    expect(s.length).toBeLessThanOrEqual(80);
    expect(s.endsWith("-")).toBe(false);
  });
});

describe("uniqueSlug", () => {
  it("returns base when free", async () => {
    expect(await uniqueSlug("rag-platform", async () => false)).toBe("rag-platform");
  });
  it("appends counter until free", async () => {
    const taken = new Set(["rag-platform", "rag-platform-2"]);
    expect(await uniqueSlug("rag-platform", async (s) => taken.has(s))).toBe("rag-platform-3");
  });
  it("ignores the current doc via exclude id", async () => {
    // exists() receives the candidate; caller excludes self before calling.
    expect(await uniqueSlug("about", async (s) => s !== "about")).toBe("about");
  });
});
