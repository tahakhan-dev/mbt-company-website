import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { adminListServices } from "@/lib/admin/queries";
import { ServiceList } from "@/components/admin/services/ServiceList";
import { EmptyState } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await adminListServices();

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Services</h1>
        <Link
          href="/admin/services/new"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-cta px-4 text-sm font-medium text-void hover:bg-cta-bright"
        >
          <Plus className="size-4" aria-hidden="true" /> New service
        </Link>
      </header>

      {services.length === 0 ? (
        <EmptyState title="No services yet" detail="Each service gets its own detail page." />
      ) : (
        <ServiceList services={services} />
      )}
    </div>
  );
}
