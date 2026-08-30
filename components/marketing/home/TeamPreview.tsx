import type { TeamMemberDoc } from "@/lib/schemas";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Bezel } from "@/components/ui/Bezel";
import { Avatar } from "@/components/marketing/Avatar";
import { Button } from "@/components/ui/Button";

/** Buyers hire people — faces before the final CTA. */
export function TeamPreview({ team }: { team: TeamMemberDoc[] }) {
  if (team.length === 0) return null;
  return (
    <section className="relative py-28 md:py-40" aria-label="Team">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The team"
            title="Senior people, hands on keyboards."
            lede="No account managers between you and the people building your product."
          />
          <Reveal y={24}>
            <Button href="/about" variant="ghost" cta="about-team">
              About us
            </Button>
          </Reveal>
        </div>
        <Reveal stagger={0.08} className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {team.slice(0, 4).map((member) => (
            <Bezel key={member.id} glow innerClassName="p-6">
              <Avatar
                name={member.name}
                photoUrl={member.photoUrl}
                className="aspect-square w-full rounded-[1.2rem] text-4xl"
                sizes="(max-width: 1024px) 45vw, 280px"
              />
              <h3 className="mt-5 font-display text-lg font-medium">{member.name}</h3>
              <p className="mt-1 text-sm text-ink-faint">{member.role}</p>
            </Bezel>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
