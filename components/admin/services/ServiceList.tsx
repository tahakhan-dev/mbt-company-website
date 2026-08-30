"use client";

import Link from "next/link";
import type { ServiceDoc } from "@/lib/schemas/service";
import { SortableList } from "@/components/admin/SortableList";
import { Badge } from "@/components/admin/ui";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

export function ServiceList({ services }: { services: ServiceDoc[] }) {
  return (
    <SortableList
      items={services}
      collection="services"
      renderItem={(service) => (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/8">
              <ServiceIcon iconKey={service.iconKey} className="size-4" />
            </span>
            <div className="min-w-0">
              <Link
                href={`/admin/services/${service.id}`}
                className="block truncate text-sm font-medium hover:text-aurora-teal"
              >
                {service.name}
              </Link>
              <p className="truncate text-xs text-ink-faint">/services/{service.slug}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge tone={service.status === "published" ? "green" : "neutral"}>
              {service.status}
            </Badge>
            <Link
              href={`/admin/services/${service.id}`}
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
