import type { ReactNode } from "react";
import { cn } from "@/lib/utils/format";

/**
 * Double-bezel card: outer shell (bezel tint + hairline ring) wrapping an inner
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
      className={cn("group/bezel bg-bezel p-1.5 ring-1 ring-hairline soft-shadow", className)}
      style={{ borderRadius: radius }}
    >
      <div
        className={cn(
          "relative h-full overflow-hidden bg-surface inner-glow",
          glow &&
            "transition-shadow duration-500 ease-swift group-hover/bezel:shadow-[var(--bezel-glow-shadow)]",
          innerClassName,
        )}
        style={{ borderRadius: `calc(${radius} - 0.375rem)` }}
      >
        {children}
      </div>
    </TagName>
  );
}
