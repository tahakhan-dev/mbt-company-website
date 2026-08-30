import Image from "next/image";
import { coverPalette } from "@/lib/covers/palette";
import { cn } from "@/lib/utils/format";

/**
 * Person avatar: photo when provided, otherwise a generated monogram
 * portrait on an aurora gradient (never a broken image or grey silhouette).
 */
export function Avatar({
  name,
  photoUrl,
  className,
  sizes = "96px",
}: {
  name: string;
  photoUrl?: string;
  className?: string;
  sizes?: string;
}) {
  if (photoUrl) {
    return (
      <span className={cn("relative block overflow-hidden", className)}>
        <Image src={photoUrl} alt={name} fill sizes={sizes} className="object-cover" />
      </span>
    );
  }
  const p = coverPalette(name);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "grid select-none place-items-center font-display font-semibold text-void",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${p.orbA}, ${p.orbB})`,
      }}
    >
      {initials}
    </span>
  );
}
