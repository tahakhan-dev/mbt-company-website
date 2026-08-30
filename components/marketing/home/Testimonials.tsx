import type { TestimonialDoc } from "@/lib/schemas";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Bezel } from "@/components/ui/Bezel";
import { Avatar } from "@/components/marketing/Avatar";

/** Two cards + one wide quote. No carousels, no fake volume. */
export function Testimonials({ testimonials }: { testimonials: TestimonialDoc[] }) {
  if (testimonials.length === 0) return null;
  const [wide, ...rest] = testimonials;
  return (
    <section className="relative py-28 md:py-40" aria-label="Testimonials">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="What clients say"
          title="Trusted by the people who sign off."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {wide && (
            <Reveal className="lg:col-span-2">
              <Bezel innerClassName="p-8 md:p-12">
                <blockquote>
                  <p className="max-w-3xl font-display text-2xl font-medium leading-snug tracking-tight md:text-3xl">
                    “{wide.quote}”
                  </p>
                  <footer className="mt-8 flex items-center gap-4">
                    <Avatar
                      name={wide.author}
                      photoUrl={wide.avatarUrl}
                      className="size-12 rounded-full text-sm"
                    />
                    <div>
                      <p className="text-sm font-medium">{wide.author}</p>
                      <p className="text-sm text-ink-faint">
                        {[wide.role, wide.company].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </Bezel>
            </Reveal>
          )}
          {rest.map((t) => (
            <Reveal key={t.id}>
              <Bezel innerClassName="flex h-full flex-col justify-between gap-8 p-8">
                <blockquote className="flex h-full flex-col justify-between gap-8">
                  <p className="leading-relaxed text-ink-muted">“{t.quote}”</p>
                  <footer className="flex items-center gap-4">
                    <Avatar
                      name={t.author}
                      photoUrl={t.avatarUrl}
                      className="size-10 rounded-full text-xs"
                    />
                    <div>
                      <p className="text-sm font-medium">{t.author}</p>
                      <p className="text-sm text-ink-faint">
                        {[t.role, t.company].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </Bezel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
