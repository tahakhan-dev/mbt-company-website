import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getServices, getSiteSettings } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Bezel } from "@/components/ui/Bezel";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { FinalCta } from "@/components/marketing/home/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Services",
  description:
    "AI & generative AI, data engineering, fintech engineering, product engineering, cloud & DevOps, and product design — end to end, by one senior team.",
};

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);
  const ctaHref = settings.calendlyUrl || "/contact";

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-36 md:px-8 md:pt-44">
        <SectionHeading
          as="h1"
          eyebrow="Services"
          title="Everything an AI product needs to ship."
          lede="Strategy, design, engineering, data, and infrastructure — six disciplines that usually take four vendors, delivered by one accountable team."
        />
        <div className="mt-16 flex flex-col gap-5">
          {services.map((service, i) => (
            <Reveal key={service.id}>
              <Bezel as="article" glow innerClassName="p-7 md:p-10">
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid items-start gap-6 md:grid-cols-12"
                >
                  <div className="flex items-center gap-5 md:col-span-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[0.05] ring-1 ring-white/10">
                      <ServiceIcon iconKey={service.iconKey} />
                    </span>
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink-faint">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-aurora-teal">
                        {service.name}
                      </h2>
                    </div>
                  </div>
                  <p className="leading-relaxed text-ink-muted md:col-span-5">{service.short}</p>
                  <div className="flex items-center gap-3 md:col-span-2 md:justify-end">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300 group-hover:text-aurora-teal">
                      Explore
                    </span>
                    <span className="grid size-9 place-items-center rounded-full ring-1 ring-white/12 transition-all duration-400 ease-swift group-hover:bg-white/5">
                      <ArrowUpRight weight="light" className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Bezel>
            </Reveal>
          ))}
        </div>
      </div>
      <FinalCta
        ctaHref={ctaHref}
        contactEmail={settings.contactEmail}
        responsePromise={settings.responsePromise}
        title="Not sure which service you need?"
        lede="That's normal — most projects span two or three. Bring the problem; we'll bring the shape of the solution."
      />
    </>
  );
}
