import { cached } from "./cache";
import { SERVICES, SITE, type ServiceDetail } from "./defaults";
import { serviceSchema } from "~/lib/schemas/content";

/**
 * Public content getters. Firestore overlays the seeded defaults; any read
 * failure (missing credentials in dev, quota, outage) falls back to the
 * defaults so public routes always render (error-handling contract §30).
 * Admin mutations bust the cache via ~/lib/content/cache.
 */

async function loadServiceOverlays(): Promise<Map<string, Partial<ServiceDetail>>> {
  try {
    const { adminDb, col } = await import("~/lib/firebase/server");
    const snap = await adminDb().collection(col("services")).get();
    const map = new Map<string, Partial<ServiceDetail>>();
    for (const doc of snap.docs) {
      const parsed = serviceSchema.partial().safeParse(doc.data());
      if (parsed.success) map.set(doc.id, parsed.data as Partial<ServiceDetail>);
    }
    return map;
  } catch {
    return new Map();
  }
}

export function getServices(): Promise<ServiceDetail[]> {
  return cached("content:services", async () => {
    const overlays = await loadServiceOverlays();
    return SERVICES.map((s) => ({ ...s, ...overlays.get(s.slug) }))
      .filter((s) => s.status === "published")
      .sort((a, b) => a.order - b.order);
  });
}

export async function getService(slug: string): Promise<ServiceDetail | undefined> {
  const all = await getServices();
  return all.find((s) => s.slug === slug);
}

export function getSettings(): Promise<typeof SITE> {
  return cached("content:settings", async () => {
    try {
      const { adminDb, col } = await import("~/lib/firebase/server");
      const doc = await adminDb().collection(col("settings")).doc("site").get();
      return doc.exists ? { ...SITE, ...(doc.data() as Partial<typeof SITE>) } : SITE;
    } catch {
      return SITE;
    }
  });
}
