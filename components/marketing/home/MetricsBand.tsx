import type { SiteSettings } from "@/lib/schemas";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";

/** Count-up metrics band (admin-editable via Site Settings). */
export function MetricsBand({ metrics }: { metrics: SiteSettings["metrics"] }) {
  if (metrics.length === 0) return null;
  return (
    <section className="relative border-y border-white/8 bg-surface/60 py-16 md:py-20" aria-label="Key numbers">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <Reveal stagger={0.1} className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {metrics.map((m) => {
            const numeric = parseInt(m.value.replace(/[^0-9]/g, ""), 10);
            return (
              <div key={m.label}>
                <p className="font-mono text-4xl tracking-tight md:text-5xl">
                  {Number.isFinite(numeric) ? (
                    <Counter value={numeric} suffix={m.suffix} className="text-gradient-aurora" />
                  ) : (
                    <span className="text-gradient-aurora">
                      {m.value}
                      {m.suffix}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-sm text-ink-muted">{m.label}</p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
