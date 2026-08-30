import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { cacheTag, type CollectionName } from "@/lib/firebase/collections";

/**
 * Expire the public cache after an admin mutation.
 *
 * Gate B verified empirically that on Next 16.3 neither updateTag() nor
 * revalidateTag(tag, {expire: 0}) expires unstable_cache entries, while
 * revalidatePath("/", "layout") does. So: tag calls first (they will take
 * over when tagged expiry lands for unstable_cache), then the layout-wide
 * purge that actually guarantees "edit → visible on next request". With a
 * single admin editing occasionally, re-rendering public pages from
 * Firestore costs milliseconds.
 */
export function bustTag(name: CollectionName): void {
  const tag = cacheTag(name);
  try {
    updateTag(tag);
  } catch {
    // Not in a server-action context.
  }
  try {
    revalidateTag(tag, { expire: 0 });
  } catch {
    // Static generation context.
  }
  try {
    revalidatePath("/", "layout");
  } catch {
    // Static generation context.
  }
}
