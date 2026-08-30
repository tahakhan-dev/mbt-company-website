import { brandOgImage, OG_SIZE } from "@/lib/og/template";
import { getSiteSettings } from "@/lib/data/content";

export const alt = "MBT — AI Software House";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage() {
  const settings = await getSiteSettings();
  return brandOgImage({
    title: settings.heroHeadline,
    eyebrow: settings.heroEyebrow,
    metric: settings.tagline,
    siteName: settings.name,
  });
}
