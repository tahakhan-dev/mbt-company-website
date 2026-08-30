import Image from "next/image";
import type { Project } from "@/lib/schemas";
import { GeneratedCover } from "@/lib/covers/GeneratedCover";

/**
 * Case-study cover: Cloudinary image when one is set, otherwise the
 * deterministic generated aurora field. Never a broken image.
 */
export function ProjectCover({
  project,
  sizes = "(max-width: 768px) 100vw, 60vw",
  priority = false,
  className,
}: {
  project: Pick<Project, "cover" | "title">;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const { cover, title } = project;
  if (cover.kind === "cloudinary" && cover.url) {
    return (
      <Image
        src={cover.url}
        alt={cover.alt || title}
        fill
        sizes={sizes}
        priority={priority}
        className={className ?? "object-cover"}
      />
    );
  }
  return (
    <GeneratedCover
      seed={cover.seed || title}
      title={cover.alt || `${title} — cover art`}
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}
