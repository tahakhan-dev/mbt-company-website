import type { Metadata } from "next";
import { EnvelopeSimple, WhatsappLogo, CalendarCheck } from "@phosphor-icons/react/dist/ssr";
import { getServices, getSiteSettings } from "@/lib/data/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Bezel } from "@/components/ui/Bezel";
import { AuroraBackdrop } from "@/components/ui/AuroraBackdrop";
import { LeadForm } from "@/components/marketing/contact/LeadForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free AI strategy call or send us your project. A senior engineer replies within one business day.",
};

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);
  const wa = settings.whatsapp.replace(/[^0-9]/g, "");

  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop intensity="soft" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-36 md:px-8 md:pt-44">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <Reveal y={20}>
              <Eyebrow>Contact</Eyebrow>
            </Reveal>
            <SplitReveal
              as="h1"
              mode="load"
              className="mt-6 font-display text-display font-medium text-balance"
            >
              Tell us what you’re building.
            </SplitReveal>
            <Reveal y={30} delay={0.3}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
                Two quick steps. No qualification gauntlet, no SDR follow-up sequence — a senior
                engineer reads every inquiry. {settings.responsePromise}
              </p>
            </Reveal>

            <Reveal y={30} delay={0.4} className="mt-10 space-y-4">
              {settings.calendlyUrl && (
                <a
                  href={settings.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="contact-calendly"
                  className="flex items-center gap-4 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.07]"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-cta/15 ring-1 ring-cta/30">
                    <CalendarCheck weight="light" className="size-5 text-cta" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-medium">Book the strategy call directly</span>
                    <span className="text-sm text-ink-faint">30 minutes, free, no obligation</span>
                  </span>
                </a>
              )}
              <a
                href={`mailto:${settings.contactEmail}`}
                data-track-outbound
                className="flex items-center gap-4 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.07]"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-aurora-teal/10 ring-1 ring-aurora-teal/25">
                  <EnvelopeSimple weight="light" className="size-5 text-aurora-teal" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium">{settings.contactEmail}</span>
                  <span className="text-sm text-ink-faint">Straight to the founders’ inbox</span>
                </span>
              </a>
              {wa && (
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track-outbound
                  className="flex items-center gap-4 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.07]"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-aurora-teal/10 ring-1 ring-aurora-teal/25">
                    <WhatsappLogo weight="light" className="size-5 text-aurora-teal" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-medium">WhatsApp us</span>
                    <span className="text-sm text-ink-faint">For quick questions</span>
                  </span>
                </a>
              )}
            </Reveal>
          </div>

          <Reveal y={40} delay={0.2}>
            <Bezel innerClassName="relative p-7 md:p-10">
              <LeadForm
                services={services.map((s) => ({ slug: s.slug, name: s.name }))}
                calendlyUrl={settings.calendlyUrl}
              />
            </Bezel>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
