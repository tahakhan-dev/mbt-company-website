import prerendered from "./prerendered.json";
import { coverSvgString } from "./cover-svg";

const PRERENDERED = new Set<string>(prerendered as string[]);

/**
 * Deterministic cover art (T26 product-artifact windows in the aurora
 * atmosphere; obsidian in both themes). Seeded projects ship as committed
 * JPEGs (public/covers, rendered by scripts/render-covers.mts) so raster
 * happens on the image-decode path; anything created later in the admin
 * falls back to the same art as an SVG data URI. Intrinsic 1200x800 keeps
 * CLS at zero.
 */
export function GeneratedCover({
  seed,
  className,
  title,
}: {
  seed: string;
  className?: string;
  title?: string;
}) {
  const src = PRERENDERED.has(seed)
    ? `/covers/${seed}.jpg`
    : `data:image/svg+xml,${encodeURIComponent(coverSvgString(seed))}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static asset/data URI; next/image adds nothing here
    <img
      src={src}
      width={1200}
      height={800}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}
