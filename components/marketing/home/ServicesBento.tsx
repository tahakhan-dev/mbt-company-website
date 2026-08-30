import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ServiceDoc } from "@/lib/schemas";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Bezel } from "@/components/ui/Bezel";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn } from "@/lib/utils/format";

/** Asymmetric bento of the service lines — the first cell leads. */
export function ServicesBento({ services }: { services: ServiceDoc[] }) {
  return (
    <section className="relative py-28 md:py-40" aria-label="Services">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="What we build"
          title="Six disciplines. One senior team."
          lede="Every engagement pairs strategy with hands-on engineering — no handoffs between a sales office and a delivery floor."
        />
        <Reveal stagger={0.09} className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Bezel
              key={service.id}
              as="article"
              glow
              className={cn(i === 0 && "md:col-span-2 md:row-span-2")}
              innerClassName={cn("h-full", i === 0 ? "p-8 md:p-12" : "p-7")}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group/card flex h-full flex-col justify-between gap-8"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-2xl bg-white/[0.05] ring-1 ring-white/10">
                      <ServiceIcon iconKey={service.iconKey} />
                    </span>
                    <span
                      className="grid size-9 place-items-center rounded-full ring-1 ring-white/12 opacity-0 transition-all duration-400 ease-swift group-hover/card:opacity-100"
                      aria-hidden="true"
                    >
                      <ArrowUpRight weight="light" className="size-4" />
                    </span>
                  </div>
                  <h3
                    className={cn(
                      "mt-6 font-display font-medium tracking-tight",
                      i === 0 ? "text-3xl md:text-4xl" : "text-xl",
                    )}
                  >
                    {service.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 leading-relaxed text-ink-muted",
                      i === 0 ? "max-w-md text-base md:text-lg" : "text-sm",
                    )}
                  >
                    {service.short}
                  </p>
                </div>
                {i === 0 && service.offerings.length > 0 && (
                  <ul className="flex flex-wrap gap-2" aria-label="Included capabilities">
                    {service.offerings.slice(0, 5).map((o) => (
                      <li
                        key={o.title}
                        className="rounded-full bg-white/[0.04] px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-muted ring-1 ring-white/10"
                      >
                        {o.title}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300 group-hover/card:text-aurora-teal">
                  Explore service
                </span>
              </Link>
            </Bezel>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
