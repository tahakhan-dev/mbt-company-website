import { revalidateTag, updateTag } from "next/cache";
import { cacheTag, type CollectionName } from "@/lib/firebase/collections";

/**
 * Expire the public cache for a collection after an admin mutation.
 * updateTag() gives read-your-own-writes inside Server Actions; the
 * revalidateTag fallback covers route-handler callers.
 */
export function bustTag(name: CollectionName): void {
  const tag = cacheTag(name);
  try {
    updateTag(tag);
  } catch {
    revalidateTag(tag, "max");
  }
}
