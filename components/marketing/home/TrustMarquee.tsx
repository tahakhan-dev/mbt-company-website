import type { LogoDoc } from "@/lib/schemas";
import { Marquee } from "@/components/ui/Marquee";
import { LOGO_GLYPHS } from "@/lib/marketing/logo-glyphs";
import Image from "next/image";

/**
 * Trust bar: real brand marks (vendored Simple Icons paths, currentColor so
 * they follow the theme). Per item: an uploaded image wins, then the vendored
 * glyph + name, then a styled wordmark as the last fallback. Logos only — no
 * category labels (taste-skill logo-wall law).
 */
export function TrustMarquee({ logos, label }: { logos: LogoDoc[]; label: string }) {
  if (logos.length === 0) return null;
  return (
    <section className="relative border-y border-hairline py-10" aria-label="Technologies and clients">
      <p className="mb-7 text-center font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ink-faint">
        {label}
      </p>
      <Marquee duration={46}>
        {logos.map((logo) => {
          const glyph = LOGO_GLYPHS[logo.name];
          return (
            <span key={logo.id} className="flex items-center" title={logo.name}>
              {logo.imageUrl ? (
                <Image
                  src={logo.imageUrl}
                  alt={logo.name}
                  width={120}
                  height={36}
                  className="h-8 w-auto opacity-60 transition-opacity duration-300 hover:opacity-100"
                />
              ) : glyph ? (
                <span className="flex items-center gap-2.5 text-ink-faint transition-colors duration-300 hover:text-ink-muted">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-6 fill-current"
                    role="img"
                    aria-label={glyph.title}
                  >
                    <path d={glyph.path} />
                  </svg>
                  <span className="font-display text-lg font-medium tracking-tight">
                    {logo.name}
                  </span>
                </span>
              ) : (
                <span className="font-display text-xl font-medium tracking-tight text-ink-faint transition-colors duration-300 hover:text-ink-muted">
                  {logo.name}
                </span>
              )}
            </span>
          );
        })}
      </Marquee>
    </section>
  );
}
