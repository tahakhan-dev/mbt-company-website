import type { FaqItem } from "@/lib/schemas/common";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Accordion } from "@/components/ui/Accordion";

/** Objection-killers before the final CTA. */
export function FaqStrip({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="relative py-28 md:py-36" aria-label="Frequently asked questions">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <SectionHeading
          eyebrow="Before you ask"
          title="The questions every founder asks first."
          lede="Straight answers on money, ownership, and speed — the rest is a call away."
        />
        <Reveal>
          <Accordion items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}
