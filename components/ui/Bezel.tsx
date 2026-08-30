import type { ReactNode } from "react";
import { cn } from "@/lib/utils/format";

/**
 * Double-bezel card: outer shell (white/5 + hairline ring) wrapping an inner
 * core with its own surface, inset top highlight, and concentric radius.
 * The only card pattern used on the public site — no flat cards on Void.
 */
export function Bezel({
  children,
  className,
  innerClassName,
  radius = "2rem",
  glow = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  radius?: string;
  /** Adds an aurora hover glow on the inner core (group-hover). */
  glow?: boolean;
  as?: "div" | "article" | "li" | "section";
}) {
  const TagName = Tag as "div";
  return (
    <TagName
      className={cn("group/bezel bg-white/5 p-1.5 ring-1 ring-white/10", className)}
      style={{ borderRadius: radius }}
    >
      <div
        className={cn(
          "relative h-full overflow-hidden bg-surface inner-glow",
          glow &&
            "transition-shadow duration-500 ease-swift group-hover/bezel:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),inset_0_0_60px_-24px_rgba(34,211,238,0.35)]",
          innerClassName,
        )}
        style={{ borderRadius: `calc(${radius} - 0.375rem)` }}
      >
        {children}
      </div>
    </TagName>
  );
}
