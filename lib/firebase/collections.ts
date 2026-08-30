/**
 * Every Firestore collection name flows through col(); the optional
 * FIRESTORE_COLLECTION_PREFIX (e.g. "e2e_") isolates test runs from real
 * content in the same project. Cache tags carry the prefix too so the
 * Next data cache never leaks between modes.
 */
export const COLLECTIONS = [
  "settings",
  "services",
  "projects",
  "team",
  "testimonials",
  "logos",
  "leads",
  "visitors",
  "sessions",
  "ip_cache",
  "daily_stats",
  "counters",
] as const;

export type CollectionName = (typeof COLLECTIONS)[number];

function prefix(): string {
  return process.env.FIRESTORE_COLLECTION_PREFIX ?? "";
}

export function col(name: CollectionName): string {
  return `${prefix()}${name}`;
}

export function cacheTag(name: CollectionName): string {
  return `${prefix()}${name}`;
}
