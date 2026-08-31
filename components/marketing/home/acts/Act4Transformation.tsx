"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils/format";

/**
 * ACT 4 — THE TRANSFORMATION (04/07): Apple-grammar pinned stage (T22/T23)
 * with linear-style real-artifact composition (T26): one continuous "your
 * Tuesday" visual where the calm AFTER dashboard sweeps over the chaotic
 * BEFORE wall via a clip-path split, while four claim beats own scrub ranges.
 * Everything scrubbed is transform/opacity/clip-path.
 * Mobile & reduced motion: static before → claims → after stack.
 */

const CLAIMS = [
  { stat: "40+ hrs", line: "back every month, per team we automate" },
  { stat: "< 60 sec", line: "from customer question to accurate answer" },
  { stat: "24/7", line: "orders, bookings, and follow-ups that move themselves" },
  { stat: "1 screen", line: "every number that matters, current and in one place" },
] as const;

function BeforePanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface ring-1 ring-hairline",
        className,
      )}
      aria-hidden="true"
    >
      {/* Overloaded tab strip */}
      <div className="flex items-center gap-1.5 border-b border-hairline px-4 py-2.5">
        <span className="size-2 rounded-full bg-error/50" />
        <span className="size-2 rounded-full bg-cta/40" />
        <span className="size-2 rounded-full bg-ink-faint/30" />
        <div className="ml-3 flex min-w-0 flex-1 gap-1">
          {["Inbox (47)", "Orders.xlsx", "CRM", "Sheet v3 FINAL", "Invoices", "WhatsApp", "ERP", "Sheet v3 FINAL(2)"].map(
            (t, i) => (
              <span
                key={t}
                className={cn(
                  "truncate rounded-md px-2 py-1 font-mono text-[0.5625rem] tracking-wide text-ink-faint ring-1 ring-hairline",
                  i > 4 && "max-lg:hidden",
                )}
              >
                {t}
              </span>
            ),
          )}
        </div>
      </div>
      <div className="grid flex-1 grid-cols-[1.4fr_1fr] gap-3 p-4">
        {/* Ticket queue */}
        <div className="rounded-xl bg-void/40 p-3 ring-1 ring-hairline">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-faint">
            Support queue · unassigned
          </p>
          <ul className="mt-2 space-y-1.5">
            {[
              ["Where is my order?", "waiting 4h"],
              ["Invoice doesn't match PO", "waiting 6h"],
              ["Can I reschedule?", "waiting 2h"],
              ["Refund status??", "waiting 9h"],
              ["Do you ship to Austin?", "waiting 3h"],
            ].map(([q, w], i) => (
              <li
                key={q}
                data-before-ticket={i}
                className="flex items-center justify-between gap-2 rounded-lg bg-surface px-2.5 py-1.5 ring-1 ring-hairline"
              >
                <span className="truncate text-[0.6875rem] text-ink-muted">{q}</span>
                <span className="shrink-0 rounded-full bg-error-surface px-1.5 py-0.5 font-mono text-[0.5625rem] text-error">
                  {w}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          {/* Spreadsheet fragment */}
          <div className="flex-1 rounded-xl bg-void/40 p-3 ring-1 ring-hairline">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-faint">
              Orders.xlsx · edited 11:58 PM
            </p>
            <div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-md bg-hairline font-mono text-[0.5625rem] text-ink-faint">
              {["#4712", "PENDING?", "?", "#4713", "shipped??", "$1,240", "#4714", "", "$86O", "#4715", "dup?", "$412"].map(
                (cell, i) => (
                  <span key={i} className={cn("bg-surface px-1.5 py-1", cell === "" && "bg-error-surface")}>
                    {cell || "!"}
                  </span>
                ),
              )}
            </div>
          </div>
          {/* 2am toasts */}
          <div className="space-y-1.5">
            {[
              ["Payment export failed", "2:04 AM"],
              ["Sync error, retry manually", "2:31 AM"],
            ].map(([msg, t]) => (
              <div
                key={msg}
                className="flex items-center justify-between rounded-lg bg-error-surface px-2.5 py-1.5 ring-1 ring-error/25"
              >
                <span className="truncate text-[0.6875rem] text-error">{msg}</span>
                <span className="ml-2 shrink-0 font-mono text-[0.5625rem] text-error/80">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AfterPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface ring-1 ring-hairline",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-faint">
          Operations · live
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] text-aurora-teal">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-aurora-teal" />
          all systems running
        </span>
      </div>
      <div className="grid flex-1 grid-rows-[auto_1fr] gap-3 p-4">
        {/* KPI tiles */}
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Hours back · month", "42"],
            ["First reply", "8s"],
            ["Orders auto-flowed", "1,284"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-void/40 p-3 ring-1 ring-hairline">
              <p className="truncate font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-ink-faint">
                {label}
              </p>
              <p className="mt-1 font-mono text-lg font-medium tabular-nums text-ink">{value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1.3fr_1fr] gap-3">
          {/* Automation runs */}
          <div className="rounded-xl bg-void/40 p-3 ring-1 ring-hairline">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-faint">
              Automation runs
            </p>
            <ul className="mt-2 space-y-1.5">
              {[
                ["Invoice sync → ledger", "09:00 · ok"],
                ["Order routing", "live · ok"],
                ["Missing-doc chase", "3 sent · ok"],
                ["Daily digest → Slack", "07:30 · ok"],
              ].map(([run, status]) => (
                <li
                  key={run}
                  className="flex items-center justify-between gap-2 rounded-lg bg-surface px-2.5 py-1.5 ring-1 ring-hairline"
                >
                  <span className="inline-flex min-w-0 items-center gap-1.5 text-[0.6875rem] text-ink-muted">
                    <span className="size-1.5 shrink-0 rounded-full bg-aurora-teal" />
                    <span className="truncate">{run}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[0.5625rem] text-aurora-teal">{status}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Calm inbox */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-void/40 p-3 text-center ring-1 ring-hairline">
            <span className="grid size-9 place-items-center rounded-full bg-aurora-teal/10 ring-1 ring-aurora-teal/30">
              <span className="font-mono text-xs text-aurora-teal">0</span>
            </span>
            <p className="mt-2 text-[0.6875rem] text-ink-muted">Inbox zero</p>
            <p className="mt-1 font-mono text-[0.5625rem] text-ink-faint">
              assistant handled 34 overnight
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Act4Transformation() {
  const sectionRef = useRef<HTMLElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const afterInnerRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const captionBeforeRef = useRef<HTMLParagraphElement>(null);
  const captionAfterRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const claims = gsap.utils.toArray<HTMLElement>("[data-claim]", sectionRef.current!);
        // Transform-only sweep: the WINDOW slides open (x 100→0) while the
        // panel inside counter-translates (x -100→0), so the dashboard stays
        // put as the reveal edge travels. A clip-path inset scrub here forced
        // per-frame re-raster of the whole layer in software compositing
        // (Gate S: reproducible 40-55ms Commit cluster).
        gsap.set(afterRef.current, { xPercent: 100 });
        gsap.set(afterInnerRef.current, { xPercent: -100 });
        gsap.set(seamRef.current, { xPercent: 0, autoAlpha: 0 });
        gsap.set(claims, { autoAlpha: 0, y: 26 });
        gsap.set(captionAfterRef.current, { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.75,
          },
        });

        // The sweep (paired transforms) + traveling seam (transform)
        tl.to(seamRef.current, { autoAlpha: 1, duration: 0.03 }, 0.1)
          .to(afterRef.current, { xPercent: 0, duration: 0.62 }, 0.12)
          .to(afterInnerRef.current, { xPercent: 0, duration: 0.62 }, 0.12)
          .to(seamRef.current, { xPercent: 100 * 0.98, duration: 0.62 }, 0.12)
          .to(seamRef.current, { autoAlpha: 0, duration: 0.04 }, 0.74)
          // captions swap
          .to(captionBeforeRef.current, { autoAlpha: 0, y: -12, duration: 0.08 }, 0.38)
          .to(captionAfterRef.current, { autoAlpha: 1, duration: 0.08 }, 0.76);

        // Claim beats — each owns a range; the last one stays.
        const ranges: Array<[number, number | null]> = [
          [0.04, 0.24],
          [0.28, 0.46],
          [0.5, 0.68],
          [0.74, null],
        ];
        claims.forEach((el, i) => {
          const [inAt, outAt] = ranges[i]!;
          tl.to(el, { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, inAt);
          if (outAt !== null) tl.to(el, { autoAlpha: 0, y: -22, duration: 0.05 }, outAt);
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      data-act="4"
      data-act-label="The transformation"
      aria-label="Your Tuesday, before and after"
      className={cn("relative z-10", !reduced && "md:h-[420vh]")}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl flex-col justify-center px-5 py-24 md:px-10",
          !reduced && "md:sticky md:top-0 md:h-[100dvh] md:py-0",
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-balance font-display text-title font-medium text-ink md:text-[2.6rem]">
              Your Tuesday, before and after.
            </h2>
          </div>
          <div className="relative h-6 min-w-[16rem] text-right">
            <p
              ref={captionBeforeRef}
              className="absolute inset-0 text-right font-mono text-[0.8125rem] uppercase tracking-[0.16em] text-ink-faint"
            >
              Tickets. Tabs. Copy-paste. 2am.
            </p>
            <p
              ref={captionAfterRef}
              className="absolute inset-0 text-right font-mono text-[0.8125rem] uppercase tracking-[0.16em] text-aurora-teal max-md:hidden"
            >
              Answered. Routed. Reconciled. Asleep.
            </p>
          </div>
        </div>

        {/* The stage — sized so header + stage + claims fit one viewport */}
        <div className="relative mt-8 md:mx-auto md:mt-6 md:w-[min(84vw,880px)]">
          <div className="relative aspect-[16/10] max-md:hidden">
            <BeforePanel className="absolute inset-0" />
            <div ref={afterRef} className="absolute inset-0 overflow-hidden rounded-[1.75rem]">
              <div ref={afterInnerRef} className="h-full">
                <AfterPanel className="h-full" />
              </div>
            </div>
            {/* Traveling seam — xPercent on a full-width wrapper so the
                transform spans the stage, not the 2px line */}
            <div
              ref={seamRef}
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-aurora-cyan via-aurora-teal to-aurora-violet" />
            </div>
          </div>

          {/* Mobile & reduced motion: honest stack, same story */}
          <div className={cn("space-y-4", reduced ? "md:space-y-6" : "md:hidden")}>
            <BeforePanel className="aspect-[16/11]" />
            <ul className="grid grid-cols-2 gap-3">
              {CLAIMS.map((c) => (
                <li key={c.stat} className="rounded-2xl bg-bezel p-4 ring-1 ring-hairline">
                  <p className="font-mono text-xl font-medium text-ink">{c.stat}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">{c.line}</p>
                </li>
              ))}
            </ul>
            <AfterPanel className="aspect-[16/11]" />
          </div>
        </div>

        {/* Claim beats strip (desktop scrub) */}
        <div className="relative mt-6 h-20 max-md:hidden" aria-live="off">
          {CLAIMS.map((c) => (
            <div key={c.stat} data-claim className="absolute inset-0 flex items-center gap-6">
              <span className="font-mono text-stat font-medium text-ink">{c.stat}</span>
              <span className="max-w-xs text-sm leading-relaxed text-ink-muted">{c.line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
