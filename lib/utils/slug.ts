/** URL-safe slug: lowercase ASCII, hyphen-separated, ≤80 chars. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Returns `base` if free, otherwise `base-2`, `base-3`, … The caller supplies
 * an existence check (already excluding the doc being edited, if any).
 */
export async function uniqueSlug(
  base: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  if (!(await exists(base))) return base;
  for (let n = 2; n < 1000; n++) {
    const candidate = `${base}-${n}`;
    if (!(await exists(candidate))) return candidate;
  }
  return `${base}-${Date.now()}`;
}
