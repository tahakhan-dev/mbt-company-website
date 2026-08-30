import {
  Sparkle,
  Database,
  Bank,
  Devices,
  Cloud,
  PenNib,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { serviceIconKeys } from "@/lib/schemas/service";
import { cn } from "@/lib/utils/format";

const ICONS: Record<(typeof serviceIconKeys)[number], Icon> = {
  sparkle: Sparkle,
  database: Database,
  bank: Bank,
  devices: Devices,
  cloud: Cloud,
  "pen-nib": PenNib,
};

/** One icon family sitewide: Phosphor, light strokes, aurora tint. */
export function ServiceIcon({
  iconKey,
  className,
}: {
  iconKey: string;
  className?: string;
}) {
  const IconComponent = ICONS[iconKey as keyof typeof ICONS] ?? Sparkle;
  return (
    <IconComponent
      weight="light"
      aria-hidden="true"
      className={cn("size-7 text-aurora-teal", className)}
    />
  );
}
