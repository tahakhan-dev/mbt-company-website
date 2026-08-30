import type { LogoDoc } from "@/lib/schemas";
import { Marquee } from "@/components/ui/Marquee";
import Image from "next/image";

/**
 * Trust bar: technology/client marks as styled wordmarks (crisp at any DPR);
 * an uploaded image overrides per item.
 */
export function TrustMarquee({ logos, label }: { logos: LogoDoc[]; label: string }) {
  if (logos.length === 0) return null;
  return (
    <section className="relative border-y border-hairline py-10" aria-label="Technologies and clients">
      <p className="mb-7 text-center font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ink-faint">
        {label}
      </p>
      <Marquee duration={46}>
        {logos.map((logo) => (
          <span key={logo.id} className="flex items-center" title={logo.name}>
            {logo.imageUrl ? (
              <Image
                src={logo.imageUrl}
                alt={logo.name}
                width={120}
                height={36}
                className="h-8 w-auto opacity-60 transition-opacity duration-300 hover:opacity-100"
              />
            ) : (
              <span className="font-display text-xl font-medium tracking-tight text-ink-faint transition-colors duration-300 hover:text-ink-muted">
                {logo.name}
              </span>
            )}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
