import Link from "next/link";
import type { TeamMemberDoc } from "@/lib/schemas/team";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Avatar } from "@/components/marketing/Avatar";
import { cn } from "@/lib/utils/format";

/**
 * ACT 6 — THE PEOPLE (06/07): editorial split — a manifesto-scale claim and
 * the founder's line on the left, duotone portrait tiles with differential
 * parallax on the right (T10). Server component.
 */
export function Act6People({ team }: { team: TeamMemberDoc[] }) {
  const members = team.slice(0, 4);

  return (
    <section
      data-act="6"
      data-act-label="The people"
      aria-label="The team"
      className="relative z-10 px-5 py-28 md:px-10 md:py-40 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col justify-center">
          <Reveal>
            <Eyebrow>The people</Eyebrow>
            <h2 className="mt-6 max-w-[14ch] font-display text-display font-medium text-ink">
              Small team. Senior hands. No handoffs.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-ink-muted">
              The people on this page are the people in your repos, your calls, and your
              corner. Nothing is delegated downward — there is no downward.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12 border-l border-hairline-strong pl-6">
            <p className="font-sans text-lg italic leading-relaxed text-ink">
              &ldquo;Every system we ship has one job: give a team its hours back — then turn
              those hours into growth.&rdquo;
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
              Taha Khan — Founder
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <Link
              href="/about"
              className="font-mono text-[0.8125rem] uppercase tracking-[0.16em] text-ink underline decoration-hairline-strong underline-offset-8 transition-colors duration-300 ease-swift hover:text-aurora-teal"
            >
              About the studio
            </Link>
          </Reveal>
        </div>

        <RevealGroup className="grid grid-cols-2 gap-4 md:gap-6">
          {members.map((member, i) => (
            <div key={member.id} data-reveal-item>
              <ParallaxMedia amount={i % 2 === 0 ? 8 : 16}>
                <div
                  className={cn(
                    "bg-bezel rounded-[1.75rem] p-1.5 ring-1 ring-hairline soft-shadow",
                    i % 2 === 1 && "md:mt-10",
                  )}
                >
                  <div className="flex h-full flex-col items-start gap-5 rounded-[calc(1.75rem-0.375rem)] bg-surface inner-glow p-6 md:p-7">
                    <Avatar
                      name={member.name}
                      photoUrl={member.photoUrl}
                      className="size-16 rounded-2xl md:size-20"
                    />
                    <div>
                      <h3 className="font-display text-lg font-medium text-ink">{member.name}</h3>
                      <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              </ParallaxMedia>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
