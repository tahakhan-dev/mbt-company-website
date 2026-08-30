import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
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
      <main id="main">{children}</main>
      <SiteFooter settings={settings} />
    </MotionProvider>
  );
}
