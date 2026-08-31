import {
  getFeaturedProjects,
  getLogos,
  getServices,
  getSiteSettings,
  getTeam,
  getTestimonials,
} from "@/lib/data/content";
import { FieldStage } from "@/components/marketing/home/acts/FieldStage";
import { Act1Signal } from "@/components/marketing/home/acts/Act1Signal";
import { Act2Manifesto } from "@/components/marketing/home/acts/Act2Manifesto";
import { Act3System, type Act3Service } from "@/components/marketing/home/acts/Act3System";
import { Act4Transformation } from "@/components/marketing/home/acts/Act4Transformation";
import { Act5Proof } from "@/components/marketing/home/acts/Act5Proof";
import { Act6People } from "@/components/marketing/home/acts/Act6People";
import { Act7Finale } from "@/components/marketing/home/acts/Act7Finale";
import { ActIndicator } from "@/components/marketing/home/acts/ActIndicator";
import { FaqJsonLd } from "@/components/marketing/JsonLd";

export const metadata = { alternates: { canonical: "/" } };

/**
 * The seven-act narrative home (DESIGN-SPEC-V2 §5): one scroll spine over a
 * persistent Signal Field. Each act answers the next visitor question —
 * what is this → why do they exist → what do they do → what changes for me →
 * can I trust it → who are they → what's the next step.
 */
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

  // Lean act-3 payload — the deck never needs full service docs.
  const deckServices: Act3Service[] = services.map((s) => ({
    slug: s.slug,
    name: s.name,
    short: s.short,
    iconKey: s.iconKey,
    metric: s.transformation.metric || s.stack.slice(0, 2).join(" · "),
    chips: s.offerings.slice(0, 3).map((o) => o.title),
  }));

  return (
    <>
      <FieldStage />
      <ActIndicator />
      <Act1Signal
        eyebrow={settings.heroEyebrow}
        headline={settings.heroHeadline}
        subline={settings.heroSubline}
        ctaHref={ctaHref}
      />
      <Act2Manifesto />
      <Act3System services={deckServices} />
      <Act4Transformation />
      <Act5Proof
        projects={projects}
        testimonials={testimonials}
        logos={logos}
        settings={settings}
      />
      <Act6People team={team} />
      <Act7Finale settings={settings} ctaHref={ctaHref} />
      <FaqJsonLd faqs={settings.homeFaqs} />
    </>
  );
}
