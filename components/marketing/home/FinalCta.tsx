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
  title = "Five minutes. Bring your worst bottleneck.",
  lede = "Tell us where the hours go. Before the call ends, you’ll know which system gets them back, what it costs, and what it returns.",
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
          <Eyebrow>The next step</Eyebrow>
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
              Book a 5-minute growth call
            </Button>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
              No pitch. You leave with a plan. · {responsePromise}
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
              or write to{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-aurora-teal underline-offset-4 hover:underline"
                data-track-outbound
              >
                {contactEmail}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
