import { brandOgImage, OG_SIZE } from "@/lib/og/template";
import { getProject, getSiteSettings } from "@/lib/data/content";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProject(slug), getSiteSettings()]);
  const metric = project?.metrics[0];
  return brandOgImage({
    title: project?.title ?? "Case study",
    eyebrow: project?.industry || "Case study",
    metric: metric ? `${metric.value} ${metric.label}` : undefined,
    siteName: settings.name,
  });
}
