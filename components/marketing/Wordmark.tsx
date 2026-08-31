import Link from "next/link";
import { cn } from "@/lib/utils/format";

/** Brand wordmark: display face, tight tracking, aurora signal dot. */
export function Wordmark({
  name,
  className,
  asLink = true,
}: {
  name: string;
  className?: string;
  asLink?: boolean;
}) {
  const mark = (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 font-display text-xl font-semibold tracking-[-0.03em] text-ink",
        className,
      )}
    >
      {name}
      <span
        className="size-1.5 translate-y-[-1px] rounded-full bg-gradient-to-tr from-aurora-cyan to-aurora-violet"
        aria-hidden="true"
      />
    </span>
  );
  if (!asLink) return mark;
  return (
    <Link href="/" aria-label={`${name} home`} className="rounded-sm">
      {mark}
    </Link>
  );
}
