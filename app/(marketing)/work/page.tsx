import type { Metadata } from "next";
import { getProjects, getServices, getSiteSettings } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkGrid } from "@/components/marketing/work/WorkGrid";
import { FinalCta } from "@/components/marketing/home/FinalCta";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies across AI, data, fintech, and product engineering — each with the measurable outcome it shipped.",
};

export default async function WorkPage() {
  const [settings, projects, services] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getServices(),
  ]);
  const usedServiceSlugs = new Set(projects.flatMap((p) => p.serviceSlugs));

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-36 md:px-8 md:pt-44">
        <SectionHeading
          as="h1"
          eyebrow="Work"
          title="Shipped, measured, referenced."
          lede="Sample case studies from engagements across fintech, AI, data, and SaaS. Filter by what you're planning."
        />
        <div className="mt-14">
          <WorkGrid
            projects={projects}
            services={services
              .filter((s) => usedServiceSlugs.has(s.slug))
              .map((s) => ({ slug: s.slug, name: s.name }))}
          />
        </div>
      </div>
      <FinalCta
        ctaHref={settings.calendlyUrl || "/contact"}
        contactEmail={settings.contactEmail}
        responsePromise={settings.responsePromise}
        title="Want a result like these on your P&L?"
      />
    </>
  );
}
