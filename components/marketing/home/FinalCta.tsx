import { AuroraBackdrop } from "@/components/ui/AuroraBackdrop";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

/** The warmest, calmest section: breathing orb + one giant ask. */
export function FinalCta({
  ctaHref,
  contactEmail,
  responsePromise,
  title = "Let’s build the thing your users are waiting for.",
  lede = "A 30-minute strategy call. You leave with an honest read on feasibility, a rough budget, and a suggested first release — whether or not we work together.",
}: {
  ctaHref: string;
  contactEmail: string;
  responsePromise: string;
  title?: string;
  lede?: string;
}) {
  return (
    <section className="relative overflow-hidden py-32 md:py-44" aria-label="Get in touch">
      <AuroraBackdrop intensity="cta" />
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center md:px-8">
        <Reveal y={20}>
          <Eyebrow>Start a project</Eyebrow>
        </Reveal>
        <SplitReveal
          as="h2"
          className="mt-6 font-display text-hero font-medium text-balance"
        >
          {title}
        </SplitReveal>
        <Reveal y={32} delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">{lede}</p>
        </Reveal>
        <Reveal y={32} delay={0.35}>
          <div className="mt-10 flex flex-col items-center gap-5">
            <Button href={ctaHref} size="lg" cta="final-cta">
              Book a free AI strategy call
            </Button>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
              or write to{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-aurora-teal underline-offset-4 hover:underline"
                data-track-outbound
              >
                {contactEmail}
              </a>{" "}
              · {responsePromise}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
