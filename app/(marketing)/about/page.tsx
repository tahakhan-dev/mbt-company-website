import type { Metadata } from "next";
import { LinkedinLogo, GithubLogo, XLogo, Crosshair, Handshake, Lightning } from "@phosphor-icons/react/dist/ssr";
import { getSiteSettings, getTeam } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Bezel } from "@/components/ui/Bezel";
import { Avatar } from "@/components/marketing/Avatar";
import { AuroraBackdrop } from "@/components/ui/AuroraBackdrop";
import { FinalCta } from "@/components/marketing/home/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "MBT is a senior AI software house: engineers, designers, and data specialists who ship production systems — not decks.",
};

const VALUES = [
  {
    icon: Crosshair,
    title: "Outcomes over output",
    detail:
      "Every sprint is judged by the metric it moves — resolution rate, cost per ticket, conversion — never by story points burned.",
  },
  {
    icon: Handshake,
    title: "Radical ownership",
    detail:
      "Your repos, your cloud, your IP, from day one. We earn the next engagement by making ourselves easy to replace — so nobody wants to.",
  },
  {
    icon: Lightning,
    title: "Speed with receipts",
    detail:
      "Weekly shippable demos, evals and tests in CI, honest trade-off memos. Fast because it's disciplined, not because it's reckless.",
  },
];

export default async function AboutPage() {
  const [settings, team] = await Promise.all([getSiteSettings(), getTeam()]);

  return (
    <>
      <div className="relative overflow-hidden">
        <AuroraBackdrop intensity="soft" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-36 md:px-8 md:pt-44">
          <Reveal y={20}>
            <Eyebrow>About {settings.name}</Eyebrow>
          </Reveal>
          <SplitReveal
            as="h1"
            mode="load"
            className="mt-6 max-w-4xl font-display text-display font-medium text-balance"
          >
            A software house built for the AI era — by people who ship.
          </SplitReveal>
          <Reveal y={30} delay={0.3}>
            <div className="mt-10 grid max-w-4xl gap-8 text-lg leading-relaxed text-ink-muted md:grid-cols-2">
              <p>
                {settings.name} started with a simple observation: most companies don’t need a
                bigger vendor — they need a smaller, sharper one. A team senior enough to make
                architecture calls on Monday and be shipping them by Friday.
              </p>
              <p>
                Today we design and engineer AI products, data platforms, and fintech-grade
                systems for founders and product leaders across {settings.markets}. Same
                promise every time: production quality, measurable outcomes, zero drama.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8" aria-label="Values">
        <SectionHeading eyebrow="How we operate" title="Three rules we never trade away." />
        <Reveal stagger={0.1} className="mt-12 grid gap-5 md:grid-cols-3">
          {VALUES.map((value) => (
            <Bezel key={value.title} glow innerClassName="h-full p-8">
              <span className="grid size-11 place-items-center rounded-xl bg-white/[0.05] ring-1 ring-hairline">
                <value.icon weight="light" className="size-5 text-aurora-teal" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-medium">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{value.detail}</p>
            </Bezel>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8" aria-label="Team">
        <SectionHeading
          eyebrow="Team"
          title="The people on your project."
          lede="Small by design. Everyone here builds; nobody just 'manages the relationship'."
        />
        <Reveal stagger={0.08} className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {team.map((member) => (
            <Bezel key={member.id} glow innerClassName="flex h-full flex-col p-6">
              <Avatar
                name={member.name}
                photoUrl={member.photoUrl}
                className="aspect-square w-full rounded-[1.2rem] text-4xl"
                sizes="(max-width: 1024px) 45vw, 280px"
              />
              <h3 className="mt-5 font-display text-lg font-medium">{member.name}</h3>
              <p className="mt-1 text-sm text-ink-faint">{member.role}</p>
              {member.bio && (
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{member.bio}</p>
              )}
              {(member.socials.linkedin || member.socials.github || member.socials.x) && (
                <ul className="mt-auto flex gap-2 pt-4" aria-label={`${member.name} on social media`}>
                  {member.socials.linkedin && (
                    <li>
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        data-track-outbound
                        className="grid size-8 place-items-center rounded-full ring-1 ring-hairline-strong transition-colors hover:text-aurora-teal"
                      >
                        <LinkedinLogo weight="light" className="size-4" />
                      </a>
                    </li>
                  )}
                  {member.socials.github && (
                    <li>
                      <a
                        href={member.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on GitHub`}
                        data-track-outbound
                        className="grid size-8 place-items-center rounded-full ring-1 ring-hairline-strong transition-colors hover:text-aurora-teal"
                      >
                        <GithubLogo weight="light" className="size-4" />
                      </a>
                    </li>
                  )}
                  {member.socials.x && (
                    <li>
                      <a
                        href={member.socials.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on X`}
                        data-track-outbound
                        className="grid size-8 place-items-center rounded-full ring-1 ring-hairline-strong transition-colors hover:text-aurora-teal"
                      >
                        <XLogo weight="light" className="size-4" />
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </Bezel>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8" aria-label="Culture">
        <Reveal>
          <div className="rounded-[2rem] bg-gradient-to-br from-bezel via-transparent to-transparent p-10 ring-1 ring-hairline md:p-16">
            <p className="max-w-3xl font-display text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              “We run {settings.name} the way we build products: small autonomous teams, written
              decisions, evals over opinions, and demos every Friday. Clients feel it as
              momentum.”
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-ink-faint">
              The operating principle
            </p>
          </div>
        </Reveal>
      </section>

      <FinalCta
        ctaHref={settings.calendlyUrl || "/contact"}
        contactEmail={settings.contactEmail}
        responsePromise={settings.responsePromise}
        title="Work with a team that ships."
      />
    </>
  );
}
