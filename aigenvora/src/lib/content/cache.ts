/**
 * In-process TTL cache for CMS reads. Replaces Next's unstable_cache/bustTag.
 * Why it exists: Astro SSR with no cache would read ~6 Firestore collections
 * per page render and blow the Spark free-tier read quota (CURRENT-SITE-AUDIT
 * risk #2). Admin mutations call bust() — same process on Netlify functions,
 * so a stale window equals at most `ttlMs` on other instances.
 */
type Entry<T> = { value: T; expires: number };

const store = new Map<string, Entry<unknown>>();
const DEFAULT_TTL_MS = 5 * 60 * 1000;

export async function cached<T>(
  key: string,
  load: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS,
): Promise<T> {
  const hit = store.get(key) as Entry<T> | undefined;
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await load();
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

export function bust(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/** Test hook. */
export function cacheSize(): number {
  return store.size;
}
