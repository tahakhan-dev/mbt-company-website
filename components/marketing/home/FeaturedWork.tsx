import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ProjectDoc } from "@/lib/schemas";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { ProjectCover } from "@/components/marketing/ProjectCover";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/format";

/** Alternating editorial rows with parallax covers and a headline metric. */
export function FeaturedWork({ projects }: { projects: ProjectDoc[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="relative py-28 md:py-40" aria-label="Featured work">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title="Proof, not promises."
            lede="Every engagement ships with a measurable outcome. A few recent ones:"
          />
          <Reveal y={24}>
            <Button href="/work" variant="ghost" cta="work-index">
              All case studies
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {projects.map((project, i) => {
            const headlineMetric = project.metrics[0];
            return (
              <Reveal key={project.id}>
                <article
                  className={cn(
                    "group grid items-center gap-8 md:grid-cols-12",
                  )}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    aria-label={`${project.title} — view case study`}
                    className={cn(
                      "relative block md:col-span-7",
                      i % 2 === 1 && "md:order-2",
                    )}
                  >
                    <div className="rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10">
                      <ParallaxMedia className="aspect-[16/10] rounded-[calc(2rem-0.375rem)]">
                        <ProjectCover
                          project={project}
                          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-swift group-hover:scale-[1.03]"
                        />
                      </ParallaxMedia>
                    </div>
                    <span
                      className={cn(
                        "pointer-events-none absolute bottom-6 left-6 inline-flex translate-y-3 items-center gap-2 rounded-full",
                        "bg-void/80 px-4 py-2 text-sm opacity-0 ring-1 ring-white/15 backdrop-blur-md",
                        "transition-all duration-400 ease-swift group-hover:translate-y-0 group-hover:opacity-100",
                      )}
                    >
                      View case <ArrowUpRight weight="bold" className="size-3.5" />
                    </span>
                  </Link>

                  <div className={cn("md:col-span-5", i % 2 === 1 && "md:order-1")}>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
                      {project.industry} · {project.client}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-medium tracking-tight md:text-3xl">
                      <Link
                        href={`/work/${project.slug}`}
                        className="transition-colors duration-300 hover:text-aurora-teal"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    <p className="mt-4 max-w-md leading-relaxed text-ink-muted">
                      {project.summary}
                    </p>
                    {headlineMetric && (
                      <p className="mt-6 flex items-baseline gap-3">
                        <span className="font-mono text-4xl text-gradient-aurora">
                          {headlineMetric.value}
                        </span>
                        <span className="text-sm text-ink-faint">{headlineMetric.label}</span>
                      </p>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
