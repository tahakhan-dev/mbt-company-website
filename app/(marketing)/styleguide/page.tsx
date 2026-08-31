import type { Metadata } from "next";
import { Bezel } from "@/components/ui/Bezel";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { Accordion } from "@/components/ui/Accordion";
import { AuroraBackdrop } from "@/components/ui/AuroraBackdrop";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { GeneratedCover } from "@/lib/covers/GeneratedCover";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

/** Hidden development surface for the design system. Not linked anywhere. */
export default function StyleguidePage() {
  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop intensity="soft" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 pb-32 pt-40 md:px-8">
        <SectionHeading
          eyebrow="Styleguide"
          title="Aurora Obsidian design system"
          lede="Every primitive on the public site, in one place. This route is unlisted and noindexed."
        />

        <section className="space-y-6">
          <Eyebrow>Buttons</Eyebrow>
          <div className="flex flex-wrap items-center gap-6">
            <Button cta="styleguide">Book a free AI strategy call</Button>
            <Button variant="ghost">See our work</Button>
            <Button variant="surface" size="lg">
              Surface large
            </Button>
            <Button size="sm" variant="ghost" plain>
              Plain small
            </Button>
          </div>
        </section>

        <section className="space-y-6">
          <Eyebrow>Double-bezel cards</Eyebrow>
          <div className="grid gap-6 md:grid-cols-3">
            <Bezel glow innerClassName="p-8">
              <ServiceIcon iconKey="sparkle" />
              <h3 className="mt-5 font-display text-xl font-medium">AI &amp; GenAI</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                LLM apps, agents, RAG systems. Shipped with evals from day one.
              </p>
            </Bezel>
            <Bezel glow innerClassName="p-8">
              <ServiceIcon iconKey="bank" />
              <h3 className="mt-5 font-display text-xl font-medium">Fintech</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Ledgers that reconcile to the fils, apps regulators approve.
              </p>
            </Bezel>
            <Bezel innerClassName="p-0" glow>
              <GeneratedCover seed="styleguide-demo" className="h-full w-full" title="Generated cover sample" />
            </Bezel>
          </div>
        </section>

        <section className="space-y-6">
          <Eyebrow>Counters</Eyebrow>
          <div className="flex flex-wrap gap-12 font-mono text-5xl">
            <Counter value={12} suffix="+" className="text-gradient-aurora" />
            <Counter value={98} suffix="%" />
            <Counter value={2000000} className="text-ink-muted" />
          </div>
        </section>

        <section className="space-y-6">
          <Eyebrow>Marquee</Eyebrow>
          <Marquee className="border-y border-hairline py-6">
            {["Claude", "Next.js", "PostgreSQL", "Terraform", "Flutter", "BigQuery"].map((n) => (
              <span key={n} className="font-display text-2xl font-medium text-ink-faint">
                {n}
              </span>
            ))}
          </Marquee>
        </section>

        <section className="space-y-6">
          <Eyebrow>Accordion</Eyebrow>
          <Accordion
            items={[
              { question: "Who owns the IP?", answer: "You do: code, models, and prompts, from day one." },
              { question: "How fast to v1?", answer: "Most first releases ship in 4-8 weeks." },
            ]}
          />
        </section>

        <section className="space-y-6">
          <Eyebrow>Reveal grammar</Eyebrow>
          <Reveal stagger={0.12} className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Bezel key={n} innerClassName="p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                  Block {n}
                </p>
                <p className="mt-2 text-sm text-ink-muted">Rises with stagger + de-blur.</p>
              </Bezel>
            ))}
          </Reveal>
        </section>
      </div>
    </div>
  );
}
