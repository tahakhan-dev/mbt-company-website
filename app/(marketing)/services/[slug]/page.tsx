import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getService, getServices, getSiteSettings } from "@/lib/data/content";
import { richTextToHtml } from "@/lib/richtext";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Bezel } from "@/components/ui/Bezel";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCover } from "@/components/marketing/ProjectCover";
import { FinalCta } from "@/components/marketing/home/FinalCta";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/marketing/JsonLd";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.name,
    description: service.short,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, settings, allProjects] = await Promise.all([
    getService(slug),
    getSiteSettings(),
    getProjects(),
  ]);
  if (!service) notFound();

  const ctaHref = settings.calendlyUrl || "/contact";
  const related = allProjects
    .filter(
      (p) =>
        service.relatedProjectSlugs.includes(p.slug) || p.serviceSlugs.includes(service.slug),
    )
    .slice(0, 2);
  const longHtml = richTextToHtml(service.long);

  return (
    <>
      <ServiceJsonLd
        name={service.name}
        description={service.short}
        slug={service.slug}
        providerName={settings.name}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
      />
      <FaqJsonLd faqs={service.faqs} />
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-36 md:px-8 md:pt-44">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal y={20}>
              <Eyebrow>Service</Eyebrow>
            </Reveal>
            <SplitReveal
              as="h1"
              mode="load"
              className="mt-6 font-display text-display font-medium text-balance"
            >
              {service.name}
            </SplitReveal>
            <Reveal y={30} delay={0.3}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                {service.short}
              </p>
            </Reveal>
          </div>
          <Reveal y={40} delay={0.25} className="lg:col-span-5">
            {service.problem && (
              <Bezel innerClassName="p-7">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink-faint">
                  The problem we solve
                </p>
                <p className="mt-4 leading-relaxed text-ink-muted">{service.problem}</p>
              </Bezel>
            )}
          </Reveal>
        </div>

        {longHtml && (
          <Reveal className="mt-20 max-w-3xl">
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: longHtml }} />
          </Reveal>
        )}

        {service.offerings.length > 0 && (
          <section className="mt-24" aria-label="What we build">
            <SectionHeading eyebrow="What we build" title="Concrete deliverables, not decks." />
            <Reveal stagger={0.08} className="mt-12 grid gap-5 md:grid-cols-2">
              {service.offerings.map((offering) => (
                <Bezel key={offering.title} glow innerClassName="h-full p-7">
                  <span className="grid size-10 place-items-center rounded-xl bg-white/[0.05] ring-1 ring-hairline">
                    <ServiceIcon iconKey={service.iconKey} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-medium">{offering.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{offering.detail}</p>
                </Bezel>
              ))}
            </Reveal>
          </section>
        )}

        {service.process.length > 0 && (
          <section className="mt-24" aria-label="How this engagement runs">
            <SectionHeading eyebrow="How it runs" title="From first call to production." />
            <Reveal stagger={0.1} className="mt-12 grid gap-5 md:grid-cols-3">
              {service.process.map((step, i) => (
                <div key={step.title} className="rounded-[1.6rem] bg-white/[0.03] p-7 ring-1 ring-hairline">
                  <p
                    className="font-mono text-3xl"
                    style={{ color: "rgba(129,140,248,0.55)" }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display text-lg font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.detail}</p>
                </div>
              ))}
            </Reveal>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-24" aria-label="Related case studies">
            <SectionHeading eyebrow="Proof" title="Where we've done this before." />
            <Reveal stagger={0.1} className="mt-12 grid gap-5 md:grid-cols-2">
              {related.map((project) => (
                <Bezel key={project.id} as="article" glow innerClassName="p-0">
                  <Link href={`/work/${project.slug}`} className="group block">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <ProjectCover
                        project={project}
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-swift group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-7">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink-faint">
                        {project.industry}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-medium transition-colors duration-300 group-hover:text-aurora-teal">
                        {project.title}
                      </h3>
                      {project.metrics[0] && (
                        <p className="mt-3 font-mono text-2xl text-gradient-aurora">
                          {project.metrics[0].value}{" "}
                          <span className="text-sm text-ink-faint">{project.metrics[0].label}</span>
                        </p>
                      )}
                    </div>
                  </Link>
                </Bezel>
              ))}
            </Reveal>
          </section>
        )}

        {service.stack.length > 0 && (
          <section className="mt-24" aria-label="Technology">
            <Reveal>
              <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
                Tech we reach for
              </p>
              <ul className="flex flex-wrap gap-2">
                {service.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-white/[0.04] px-4 py-2 text-sm text-ink-muted ring-1 ring-hairline"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
        )}

        {service.faqs.length > 0 && (
          <section className="mt-24 max-w-3xl" aria-label="FAQ">
            <SectionHeading eyebrow="FAQ" title="Asked on most first calls." />
            <Reveal className="mt-10">
              <Accordion items={service.faqs} />
            </Reveal>
          </section>
        )}
      </div>

      <FinalCta
        ctaHref={ctaHref}
        contactEmail={settings.contactEmail}
        responsePromise={settings.responsePromise}
        title={`Ready to scope your ${service.name.toLowerCase()} project?`}
        lede="Bring the problem to a free strategy call — you'll leave with an honest feasibility read and a rough budget."
      />
    </>
  );
}
