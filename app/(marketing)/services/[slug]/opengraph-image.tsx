import { brandOgImage, OG_SIZE } from "@/lib/og/template";
import { getService, getSiteSettings } from "@/lib/data/content";

export const alt = "Service";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getService(slug), getSiteSettings()]);
  return brandOgImage({
    title: service?.name ?? "Service",
    eyebrow: "Service",
    metric: undefined,
    siteName: settings.name,
  });
}
