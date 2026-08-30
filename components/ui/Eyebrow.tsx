import type { ReactNode } from "react";
import { cn } from "@/lib/utils/format";

/** Mono, uppercase, tracked eyebrow pill — sits above every H2. */
export function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3.5 py-1.5",
        "font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink-muted ring-1 ring-hairline",
        className,
      )}
    >
      {dot && (
        <span
          className="size-1.5 rounded-full bg-aurora-teal shadow-[0_0_8px_rgba(94,234,212,0.8)]"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
