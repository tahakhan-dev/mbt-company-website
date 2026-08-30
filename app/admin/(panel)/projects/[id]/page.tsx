import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminGetDoc, adminListServices } from "@/lib/admin/queries";
import { projectSchema } from "@/lib/schemas/project";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export const metadata: Metadata = { title: "Edit project" };

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const services = await adminListServices();
  const project = id === "new" ? null : await adminGetDoc("projects", id, projectSchema);
  if (id !== "new" && !project) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-lg font-semibold">{project ? `Edit: ${project.title}` : "New project"}</h1>
      <ProjectForm
        project={project}
        services={services.map((s) => ({ slug: s.slug, name: s.name }))}
      />
    </div>
  );
}
