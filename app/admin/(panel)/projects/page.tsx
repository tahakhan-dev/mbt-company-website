import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { adminListProjects } from "@/lib/admin/queries";
import { ProjectList } from "@/components/admin/projects/ProjectList";
import { EmptyState } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const projects = await adminListProjects();

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-cta px-4 text-sm font-medium text-void hover:bg-cta-bright"
        >
          <Plus className="size-4" aria-hidden="true" /> New project
        </Link>
      </header>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          detail="Case studies power the Work section — the sales engine of the site."
        />
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
