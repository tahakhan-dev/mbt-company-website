"use client";

import { useId, useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils/format";

export type AccordionItem = { question: string; answer: string };

/**
 * Elegant accessible accordion (grid-rows height animation — transform-free
 * layout, no jank). One item open at a time.
 */
export function Accordion({
  items,
  className,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-hairline border-y border-hairline", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 ease-swift hover:text-aurora-teal"
              >
                <span className="font-display text-lg font-medium tracking-tight md:text-xl">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-hairline-strong",
                    "transition-transform duration-400 ease-swift",
                    isOpen && "rotate-45 bg-bezel",
                  )}
                  aria-hidden="true"
                >
                  <Plus weight="light" className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-swift",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 leading-relaxed text-ink-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
