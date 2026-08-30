import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import {
  getAdjacentProject,
  getProject,
  getProjects,
  getServices,
  getSiteSettings,
} from "@/lib/data/content";
import { richTextToHtml } from "@/lib/richtext";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { ProjectCover } from "@/components/marketing/ProjectCover";
import { FinalCta } from "@/components/marketing/home/FinalCta";
import { cn } from "@/lib/utils/format";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Case study not found" };
  return { title: `${project.title} — Case study`, description: project.summary };
}

function Chapter({
  eyebrow,
  html,
}: {
  eyebrow: string;
  html: string;
}) {
  if (!html) return null;
  return (
    <Reveal className="grid gap-6 md:grid-cols-12">
      <div className="md:col-span-3">
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <div
        className="rich-text md:col-span-8 md:col-start-5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Reveal>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, settings, services] = await Promise.all([
    getProject(slug),
    getSiteSettings(),
    getServices(),
  ]);
  if (!project) notFound();
  const next = await getAdjacentProject(slug);
  const serviceNames = services
    .filter((s) => project.serviceSlugs.includes(s.slug))
    .map((s) => s.name);

  const facts: { label: string; value: string }[] = [
    { label: "Client", value: project.client || "Confidential" },
    { label: "Industry", value: project.industry || "—" },
    { label: "Timeline", value: project.timeline || "—" },
    { label: "Services", value: serviceNames.join(", ") || "—" },
  ];

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-36 md:px-8 md:pt-44">
        <Reveal y={20}>
          <Eyebrow>Case study</Eyebrow>
        </Reveal>
        <SplitReveal
          as="h1"
          mode="load"
          className="mt-6 max-w-4xl font-display text-display font-medium text-balance"
        >
          {project.title}
        </SplitReveal>
        <Reveal y={30} delay={0.3}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {project.summary}
          </p>
        </Reveal>

        <Reveal y={40} delay={0.25} className="mt-14">
          <div className="rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10">
            <ParallaxMedia className="aspect-[16/8] rounded-[calc(2rem-0.375rem)]">
              <ProjectCover
                project={project}
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="absolute inset-0 h-full w-full"
              />
            </ParallaxMedia>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-2 gap-6 rounded-[1.6rem] bg-white/[0.03] p-7 ring-1 ring-white/8 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-ink-faint">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm leading-snug text-ink">{fact.value}</dd>
            </div>
          ))}
        </Reveal>

        <div className="mt-24 flex flex-col gap-20">
          <Chapter eyebrow="Challenge" html={richTextToHtml(project.challenge)} />
          <Chapter eyebrow="Solution" html={richTextToHtml(project.solution)} />

          {project.metrics.length > 0 && (
            <Reveal stagger={0.1} className="grid gap-5 md:grid-cols-3">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.6rem] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 ring-1 ring-white/10"
                >
                  <p className="font-mono text-4xl tracking-tight text-gradient-aurora">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">{metric.label}</p>
                </div>
              ))}
            </Reveal>
          )}

          <Chapter eyebrow="Results" html={richTextToHtml(project.results)} />
        </div>

        {project.gallery.length > 0 && (
          <Reveal stagger={0.1} className="mt-20 grid gap-5 md:grid-cols-2">
            {project.gallery.map((item) => (
              <div key={item.url} className="rounded-[1.6rem] bg-white/5 p-1.5 ring-1 ring-white/10">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(1.6rem-0.375rem)]">
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </Reveal>
        )}

        {project.stack.length > 0 && (
          <Reveal className="mt-20">
            <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
              Stack
            </p>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-white/[0.04] px-4 py-2 text-sm text-ink-muted ring-1 ring-white/10"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {next && next.slug !== project.slug && (
          <Reveal className="mt-24">
            <Link
              href={`/work/${next.slug}`}
              className={cn(
                "group flex items-center justify-between gap-6 rounded-[2rem] bg-white/[0.03] p-8",
                "ring-1 ring-white/8 transition-colors duration-400 ease-swift hover:bg-white/[0.06] md:p-12",
              )}
            >
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink-faint">
                  Next case study
                </p>
                <p className="mt-3 font-display text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-aurora-teal md:text-4xl">
                  {next.title}
                </p>
              </div>
              <span className="grid size-14 shrink-0 place-items-center rounded-full ring-1 ring-white/12 transition-all duration-400 ease-swift group-hover:bg-white/5">
                <ArrowUpRight weight="light" className="size-6" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        )}
      </div>

      <FinalCta
        ctaHref={settings.calendlyUrl || "/contact"}
        contactEmail={settings.contactEmail}
        responsePromise={settings.responsePromise}
        title="Your product could be the next case study."
      />
    </>
  );
}
