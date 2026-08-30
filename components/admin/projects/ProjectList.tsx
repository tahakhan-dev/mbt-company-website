"use client";

import Link from "next/link";
import type { ProjectDoc } from "@/lib/schemas/project";
import { SortableList } from "@/components/admin/SortableList";
import { Badge } from "@/components/admin/ui";

export function ProjectList({ projects }: { projects: ProjectDoc[] }) {
  return (
    <SortableList
      items={projects}
      collection="projects"
      renderItem={(project) => (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/admin/projects/${project.id}`}
              className="block truncate text-sm font-medium hover:text-aurora-teal"
            >
              {project.title}
            </Link>
            <p className="truncate text-xs text-ink-faint">
              {project.industry} · {project.client}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {project.featured && <Badge tone="amber">featured</Badge>}
            <Badge tone={project.status === "published" ? "green" : "neutral"}>
              {project.status}
            </Badge>
            <Link
              href={`/admin/projects/${project.id}`}
              className="inline-flex h-8 items-center rounded-lg bg-white/8 px-3 text-xs ring-1 ring-white/10 hover:bg-white/12"
            >
              Edit
            </Link>
          </div>
        </div>
      )}
    />
  );
}
