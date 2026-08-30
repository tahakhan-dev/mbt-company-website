import type { SiteSettings } from "@/lib/schemas/settings";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Accordion } from "@/components/ui/Accordion";

/**
 * ACT 7 — FIVE MINUTES (07/07): the payoff. The field re-brightens to its
 * serene grid behind (FieldStage owns that), the promise lands at hero
 * scale, and the single warm CTA arrives with the risk-reversal microcopy
 * (COPY-V2 §7). Three objection-killer FAQ rows close the argument.
 */
export function Act7Finale({
  settings,
  ctaHref,
}: {
  settings: SiteSettings;
  ctaHref: string;
}) {
  const faqs = settings.homeFaqs.slice(0, 3);

  return (
    <section
      data-act="7"
      data-act-label="Five minutes"
      aria-label="Book a 5-minute growth call"
      className="relative z-10 px-5 pb-28 pt-32 md:px-10 md:pb-36 md:pt-48 lg:px-16"
    >
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">The next step</Eyebrow>
          <h2 className="mt-7 font-display text-hero font-medium text-ink">
            Five minutes. Bring your worst bottleneck.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Tell us where the hours go. We&rsquo;ll tell you which system gets them back, what
            it costs, and what it returns — before the call ends.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-11 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href={ctaHref} size="lg" cta="act7">
              Book a 5-minute growth call
            </Button>
            <Button
              href={`mailto:${settings.contactEmail}`}
              variant="ghost"
              size="lg"
              cta="act7-email"
            >
              Or write to us
            </Button>
          </div>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
            <span>No pitch — you leave with a plan.</span>
            <span aria-hidden="true" className="max-sm:hidden">·</span>
            <span>{settings.responsePromise}</span>
          </p>
        </Reveal>

        {faqs.length > 0 && (
          <Reveal delay={0.15} className="mx-auto mt-20 max-w-2xl text-left md:mt-24">
            <Accordion items={faqs} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
