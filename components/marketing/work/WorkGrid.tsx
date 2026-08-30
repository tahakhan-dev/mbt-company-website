"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ProjectDoc } from "@/lib/schemas";
import { ProjectCover } from "@/components/marketing/ProjectCover";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/format";

type Filter = { slug: string; name: string };

/** Filterable case-study grid (service + industry chips, no page reloads). */
export function WorkGrid({
  projects,
  services,
}: {
  projects: ProjectDoc[];
  services: Filter[];
}) {
  const [service, setService] = useState<string>("all");
  const industries = useMemo(
    () => Array.from(new Set(projects.map((p) => p.industry).filter(Boolean))),
    [projects],
  );
  const [industry, setIndustry] = useState<string>("all");

  const visible = projects.filter(
    (p) =>
      (service === "all" || p.serviceSlugs.includes(service)) &&
      (industry === "all" || p.industry === industry),
  );

  const chip = (active: boolean) =>
    cn(
      "rounded-full px-4 py-2 text-sm ring-1 transition-all duration-300 ease-swift",
      active
        ? "bg-aurora-teal/15 text-aurora-teal ring-aurora-teal/50"
        : "text-ink-muted ring-hairline-strong hover:bg-bezel hover:text-ink",
    );

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by service">
          <button className={chip(service === "all")} aria-pressed={service === "all"} onClick={() => setService("all")}>
            All services
          </button>
          {services.map((s) => (
            <button
              key={s.slug}
              className={chip(service === s.slug)}
              aria-pressed={service === s.slug}
              onClick={() => setService(s.slug)}
            >
              {s.name}
            </button>
          ))}
        </div>
        {industries.length > 1 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by industry">
            <button className={chip(industry === "all")} aria-pressed={industry === "all"} onClick={() => setIndustry("all")}>
              All industries
            </button>
            {industries.map((ind) => (
              <button
                key={ind}
                className={chip(industry === ind)}
                aria-pressed={industry === ind}
                onClick={() => setIndustry(ind)}
              >
                {ind}
              </button>
            ))}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-ink-muted">
          Nothing matches that combination yet — try another filter.
        </p>
      ) : (
        <Reveal stagger={0.08} className="mt-12 grid gap-6 md:grid-cols-2">
          {visible.map((project) => (
            <article key={project.id} className="group rounded-[2rem] bg-bezel p-1.5 ring-1 ring-hairline">
              <Link
                href={`/work/${project.slug}`}
                className="block overflow-hidden rounded-[calc(2rem-0.375rem)] bg-surface inner-glow"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ProjectCover
                    project={project}
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="absolute inset-0 h-full w-full transition-transform duration-700 ease-swift group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-7">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink-faint">
                    {project.industry} · {project.client}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-aurora-teal">
                    {project.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                    {project.summary}
                  </p>
                  {project.metrics[0] && (
                    <p className="mt-5 flex items-baseline gap-2">
                      <span className="font-mono text-2xl text-gradient-aurora">
                        {project.metrics[0].value}
                      </span>
                      <span className="text-xs text-ink-faint">{project.metrics[0].label}</span>
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </Reveal>
      )}
    </div>
  );
}
