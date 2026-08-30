"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";

const SEEN_KEY = "mbt_exit_seen";
const MIN_TIME_MS = 20_000;
const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Gentle exit-intent prompt: desktop only, never within the first 20s,
 * once per session, fully dismissible. The single permitted overlay.
 */
export function ExitIntent({ ctaHref }: { ctaHref: string }) {
  const [open, setOpen] = useState(false);
  const armedAt = useRef(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    armedAt.current = Date.now();
    function onLeave(e: MouseEvent) {
      if (e.clientY > 8) return;
      if (Date.now() - armedAt.current < MIN_TIME_MS) return;
      try {
        if (window.sessionStorage.getItem(SEEN_KEY)) return;
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        return;
      }
      setOpen(true);
    }
    // Desktop pointers only.
    if (window.matchMedia("(pointer: fine)").matches) {
      document.documentElement.addEventListener("mouseleave", onLeave);
      return () => document.documentElement.removeEventListener("mouseleave", onLeave);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-0 z-[80] grid place-items-center bg-void/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-title"
            initial={{ y: 28, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[2rem] bg-bezel p-1.5 ring-1 ring-hairline-strong"
          >
            <div className="rounded-[calc(2rem-0.375rem)] bg-surface p-8 inner-glow">
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-5 top-5 grid size-9 place-items-center rounded-full ring-1 ring-hairline-strong transition-colors hover:bg-bezel"
              >
                <X weight="light" className="size-4" aria-hidden="true" />
              </button>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink-faint">
                Before you go
              </p>
              <h2 id="exit-title" className="mt-3 font-display text-2xl font-medium">
                Leave with a plan, not a tab.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                30 minutes with a senior engineer: feasibility, rough budget, and a suggested
                first release for your AI project. Free, no follow-up sequence.
              </p>
              <div className="mt-6">
                <Button href={ctaHref} magnetic={false} cta="exit-intent" onClick={() => setOpen(false)}>
                  Book the strategy call
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
