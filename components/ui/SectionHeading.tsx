import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/format";

/** Eyebrow → display headline (masked reveal) → optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  as = "h2",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal y={24}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <SplitReveal
        as={as}
        className="max-w-3xl font-display text-display font-medium text-balance"
      >
        {title}
      </SplitReveal>
      {lede && (
        <Reveal y={32} delay={0.15}>
          <p
            className={cn(
              "max-w-xl text-lg leading-relaxed text-ink-muted",
              align === "center" && "mx-auto",
            )}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}
