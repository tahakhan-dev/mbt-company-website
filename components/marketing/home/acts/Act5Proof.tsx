import Link from "next/link";
import type { ProjectDoc } from "@/lib/schemas/project";
import type { TestimonialDoc } from "@/lib/schemas/testimonial";
import type { LogoDoc } from "@/lib/schemas/logo";
import type { SiteSettings } from "@/lib/schemas/settings";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { TiltCard } from "@/components/motion/TiltCard";
import { Counter } from "@/components/motion/Counter";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Bezel } from "@/components/ui/Bezel";
import { ProjectCover } from "@/components/marketing/ProjectCover";
import { TrustMarquee } from "@/components/marketing/home/TrustMarquee";
import { cn } from "@/lib/utils/format";

/**
 * ACT 5 — PROOF (05/07): three case rows with parallaxed, tilting cover
 * artifacts (T10/T3), inline metric counters, a testimonial pair, and the
 * technology strip. Server component — motion comes from the shared client
 * primitives. Ends on a skewed seam (T28).
 */
export function Act5Proof({
  projects,
  testimonials,
  logos,
  settings,
}: {
  projects: ProjectDoc[];
  testimonials: TestimonialDoc[];
  logos: LogoDoc[];
  settings: SiteSettings;
}) {
  const quotes = testimonials.slice(0, 2);
  const stats = settings.metrics.slice(0, 3);

  return (
    <section
      data-act="5"
      data-act-label="Proof"
      aria-label="Proof: recent case studies"
      className="relative z-10 px-5 py-28 md:px-10 md:py-40 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Signals from the field</Eyebrow>
            <h2 className="mt-5 font-display text-display font-medium text-ink">
              Proof, not promises.
            </h2>
            <p className="mt-4 max-w-xl text-ink-muted">
              Every engagement ships with a measurable outcome. Three recent signals:
            </p>
          </div>
          <Button href="/work" variant="ghost" cta="act5-all">
            See the work
          </Button>
        </Reveal>

        <div className="mt-16 space-y-24 md:mt-24 md:space-y-32">
          {projects.map((project, i) => {
            const lead = project.metrics[0];
            const meta = (
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                {[project.industry, project.client].filter(Boolean).join(" · ")}
              </p>
            );
            const titleEl = (
              <h3 className="mt-4 text-balance font-display text-title font-medium text-ink">
                <Link
                  href={`/work/${project.slug}`}
                  className="transition-colors duration-300 ease-swift hover:text-aurora-teal"
                >
                  {project.title}
                </Link>
              </h3>
            );
            const metricEl = lead && (
              <p className="mt-6 flex items-baseline gap-3">
                <span className="text-gradient-aurora font-mono text-stat font-medium">
                  {lead.value}
                </span>
                <span className="text-sm text-ink-faint">{lead.label}</span>
              </p>
            );
            const readLink = (
              <Link
                href={`/work/${project.slug}`}
                className="mt-6 inline-block font-mono text-[0.8125rem] uppercase tracking-[0.16em] text-ink underline decoration-hairline-strong underline-offset-8 transition-colors duration-300 ease-swift hover:text-aurora-teal"
              >
                Read the case
              </Link>
            );
            const coverEl = (
              <Link href={`/work/${project.slug}`} aria-label={`Case study: ${project.title}`}>
                <TiltCard>
                  <Bezel radius="1.9rem" glow>
                    {/* ParallaxMedia's outer carries the size; its inner layer
                        is absolute and oversized for the drift range. */}
                    <ParallaxMedia
                      amount={12}
                      className={i === 2 ? "aspect-[21/9]" : "aspect-[16/10]"}
                    >
                      <ProjectCover project={project} className="h-full w-full" />
                    </ParallaxMedia>
                  </Bezel>
                </TiltCard>
              </Link>
            );

            // Third row breaks the zigzag: full-bleed cover, text row beneath.
            if (i === 2) {
              return (
                <Reveal key={project.id} y={60} className="will-change-transform">
                  {coverEl}
                  <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
                    <div>
                      {meta}
                      {titleEl}
                      <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
                        {project.summary}
                      </p>
                      {readLink}
                    </div>
                    <div className="md:text-right">{metricEl}</div>
                  </div>
                </Reveal>
              );
            }

            const flip = i % 2 === 1;
            return (
              <Reveal
                key={project.id}
                className="grid items-center gap-8 will-change-transform md:grid-cols-12 md:gap-10"
                y={60}
              >
                <div className={cn("md:col-span-7", flip && "md:order-2")}>{coverEl}</div>
                <div className={cn("md:col-span-5", flip && "md:order-1")}>
                  {meta}
                  {titleEl}
                  <p className="mt-4 leading-relaxed text-ink-muted">{project.summary}</p>
                  {metricEl}
                  {readLink}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Inline metrics — folded into the rhythm, not a counter band */}
        <Reveal className="mt-24 grid gap-6 border-y border-hairline py-10 sm:grid-cols-3 md:mt-32" stagger={0.08}>
          {stats.map((m) => {
            const numeric = Number.parseFloat(m.value);
            return (
              <div key={m.label} className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-medium text-ink md:text-4xl">
                  {Number.isFinite(numeric) ? <Counter value={numeric} /> : m.value}
                  {m.suffix}
                </span>
                <span className="text-sm text-ink-faint">{m.label}</span>
              </div>
            );
          })}
        </Reveal>

        {/* Testimonial pair */}
        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-2">
          {quotes.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.12} y={44}>
              <Bezel radius="1.75rem" innerClassName="p-8 md:p-10">
                <p className="text-lg leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
                  {[t.author, t.company].filter(Boolean).join(" · ")}
                </p>
              </Bezel>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Technology strip */}
      <div className="mt-24 md:mt-28">
        <TrustMarquee logos={logos} label="Technology we ship with" />
      </div>

      {/* Skewed seam into Act 6 (T28) — bleeds exactly the section padding
          (a viewport-relative negative margin caused horizontal overflow) */}
      <div
        className="-mx-5 mt-20 h-14 -skew-y-2 border-y border-hairline bg-surface/50 md:-mx-10 md:mt-24 lg:-mx-16"
        aria-hidden="true"
      />
    </section>
  );
}
