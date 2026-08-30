import Link from "next/link";
import { LinkedinLogo, GithubLogo, XLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { SiteSettings } from "@/lib/schemas";
import { Wordmark } from "@/components/marketing/Wordmark";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.socials.linkedin, label: "LinkedIn", Icon: LinkedinLogo },
    { href: settings.socials.github, label: "GitHub", Icon: GithubLogo },
    { href: settings.socials.x, label: "X", Icon: XLogo },
    ...(settings.whatsapp
      ? [{ href: `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`, label: "WhatsApp", Icon: WhatsappLogo }]
      : []),
  ].filter((s) => s.href);

  return (
    <footer className="relative mt-32 border-t border-white/8">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-4">
            <Wordmark name={settings.name} />
            <p className="text-sm leading-relaxed text-ink-muted">{settings.tagline}</p>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="inline-block font-mono text-sm text-aurora-teal underline-offset-4 hover:underline"
              data-track-outbound
            >
              {settings.contactEmail}
            </a>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
              {settings.markets} · {settings.responsePromise}
            </p>
          </div>

          <div className="flex gap-16">
            <nav aria-label="Footer">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                Explore
              </p>
              <ul className="space-y-2.5">
                {NAV.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-muted transition-colors duration-300 ease-swift hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                Legal
              </p>
              <ul className="space-y-2.5">
                {LEGAL.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-muted transition-colors duration-300 ease-swift hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {socials.length > 0 && (
                <ul className="mt-6 flex gap-3" aria-label="Social links">
                  {socials.map(({ href, label, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        data-track-outbound
                        className="grid size-9 place-items-center rounded-full ring-1 ring-white/12 transition-colors duration-300 ease-swift hover:bg-white/5 hover:text-aurora-teal"
                      >
                        <Icon weight="light" className="size-4.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-8 text-xs text-ink-faint md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.18em]">
            Built by {settings.name} — the way we build for clients.
          </p>
        </div>
      </div>
    </footer>
  );
}
