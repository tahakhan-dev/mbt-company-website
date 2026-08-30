import type { ReactNode } from "react";
import Link from "next/link";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { StickyCta } from "@/components/marketing/StickyCta";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { Analytics } from "@/components/marketing/Analytics";
import { getSiteSettings } from "@/lib/data/content";

/**
 * Marketing shell: island nav + smooth-scroll/motion system + footer.
 * The admin lives outside this group and stays plain and fast.
 */
export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const ctaHref = settings.calendlyUrl || "/contact";

  return (
    <MotionProvider>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-raised px-4 py-2 text-sm ring-1 ring-white/15 transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteNav siteName={settings.name} ctaHref={ctaHref} />
      {settings.announcement.enabled && settings.announcement.text && (
        <div className="fixed inset-x-0 bottom-0 z-30 hidden justify-center pb-3 md:flex">
          <Link
            href={settings.announcement.href || "/contact"}
            className="pointer-events-auto rounded-full bg-raised px-5 py-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted ring-1 ring-white/12 transition-colors hover:text-ink"
          >
            {settings.announcement.text}
          </Link>
        </div>
      )}
      <main id="main">{children}</main>
      <SiteFooter settings={settings} />
      <StickyCta ctaHref={ctaHref} />
      <ExitIntent ctaHref={ctaHref} />
      <Analytics />
    </MotionProvider>
  );
}
