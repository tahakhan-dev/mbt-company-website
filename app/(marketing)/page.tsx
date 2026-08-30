import {
  getFeaturedProjects,
  getLogos,
  getServices,
  getSiteSettings,
  getTeam,
  getTestimonials,
} from "@/lib/data/content";
import { Hero } from "@/components/marketing/home/Hero";
import { TrustMarquee } from "@/components/marketing/home/TrustMarquee";
import { ServicesBento } from "@/components/marketing/home/ServicesBento";
import { ProcessStory } from "@/components/marketing/home/ProcessStory";
import { FeaturedWork } from "@/components/marketing/home/FeaturedWork";
import { MetricsBand } from "@/components/marketing/home/MetricsBand";
import { Testimonials } from "@/components/marketing/home/Testimonials";
import { TeamPreview } from "@/components/marketing/home/TeamPreview";
import { FaqStrip } from "@/components/marketing/home/FaqStrip";
import { FinalCta } from "@/components/marketing/home/FinalCta";

export default async function HomePage() {
  const [settings, services, projects, team, testimonials, logos] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getFeaturedProjects(3),
    getTeam(),
    getTestimonials(),
    getLogos(),
  ]);
  const ctaHref = settings.calendlyUrl || "/contact";

  return (
    <>
      <Hero
        eyebrow={settings.heroEyebrow}
        headline={settings.heroHeadline}
        subline={settings.heroSubline}
        trustLine={settings.trustLine}
        ctaHref={ctaHref}
      />
      <TrustMarquee logos={logos} label="Technology we ship with" />
      <ServicesBento services={services} />
      <ProcessStory />
      <FeaturedWork projects={projects} />
      <MetricsBand metrics={settings.metrics} />
      <Testimonials testimonials={testimonials} />
      <TeamPreview team={team} />
      <FaqStrip faqs={settings.homeFaqs} />
      <FinalCta
        ctaHref={ctaHref}
        contactEmail={settings.contactEmail}
        responsePromise={settings.responsePromise}
      />
    </>
  );
}
