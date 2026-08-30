import { cn } from "@/lib/utils/format";

/**
 * Layered aurora orbs — the ambient light system behind hero/CTA sections.
 * Pure CSS (blur + slow drift), aria-hidden, clipped by the parent.
 */
export function AuroraBackdrop({
  className,
  intensity = "default",
}: {
  className?: string;
  intensity?: "default" | "soft" | "cta";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {intensity === "cta" ? (
        <>
          <div
            className="aurora-orb animate-orb left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(circle, rgba(34,211,238,0.16) 0%, rgba(129,140,248,0.10) 45%, transparent 70%)",
            }}
          />
          <div
            className="aurora-orb animate-aurora left-[12%] top-[70%] h-96 w-96"
            style={{ background: "radial-gradient(circle, rgba(94,234,212,0.10), transparent 65%)" }}
          />
        </>
      ) : (
        <>
          <div
            className={cn(
              "aurora-orb animate-aurora -top-40 left-[8%] h-[36rem] w-[36rem]",
              intensity === "soft" && "opacity-60",
            )}
            style={{ background: "radial-gradient(circle, rgba(34,211,238,0.13), transparent 66%)" }}
          />
          <div
            className={cn(
              "aurora-orb animate-orb right-[4%] top-[16%] h-[30rem] w-[30rem]",
              intensity === "soft" && "opacity-60",
            )}
            style={{ background: "radial-gradient(circle, rgba(129,140,248,0.12), transparent 66%)" }}
          />
          <div
            className="aurora-orb left-[42%] top-[52%] h-80 w-80 opacity-70"
            style={{ background: "radial-gradient(circle, rgba(94,234,212,0.08), transparent 62%)" }}
          />
        </>
      )}
    </div>
  );
}
