import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminGetDoc, adminListProjects } from "@/lib/admin/queries";
import { serviceSchema } from "@/lib/schemas/service";
import { ServiceForm } from "@/components/admin/services/ServiceForm";

export const metadata: Metadata = { title: "Edit service" };

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projects = await adminListProjects();
  const service = id === "new" ? null : await adminGetDoc("services", id, serviceSchema);
  if (id !== "new" && !service) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-lg font-semibold">{service ? `Edit: ${service.name}` : "New service"}</h1>
      <ServiceForm service={service} projectSlugs={projects.map((p) => p.slug)} />
    </div>
  );
}
