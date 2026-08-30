"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Wordmark } from "@/components/marketing/Wordmark";
import { Button } from "@/components/ui/Button";
import { useScrollLock } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils/format";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Floating island nav: detached glass pill, morphing hamburger, full-screen
 * glass menu with staggered masked link reveals. Fully keyboard operable.
 */
export function SiteNav({ siteName, ctaHref }: { siteName: string; ctaHref: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { stopScroll, startScroll } = useScrollLock();

  // Scrolled style via a sentinel — no raw scroll listeners.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry!.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Close on route change (state reset during render — no effect cascade).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  // Scroll lock + escape + focus trap while open.
  useEffect(() => {
    if (!open) return;
    stopScroll();
    const menu = menuRef.current;
    const focusables = () =>
      Array.from(
        menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
    focusables()[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
        if (items.length === 0) return;
        const first = items[0]!;
        const last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      startScroll();
    };
  }, [open, startScroll, stopScroll]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute inset-x-0 top-0 h-8" />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
        <nav
          aria-label="Main"
          className={cn(
            "pointer-events-auto flex w-max items-center gap-1 rounded-full py-2 pl-5 pr-2",
            "ring-1 backdrop-blur-xl transition-[background-color,box-shadow] duration-500 ease-swift",
            scrolled || open
              ? "bg-void/80 ring-white/12 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.8)]"
              : "bg-void/45 ring-white/8",
          )}
        >
          <Wordmark name={siteName} />

          <ul className="mx-4 hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm transition-colors duration-300 ease-swift",
                      active ? "bg-white/8 text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:block">
            <Button href={ctaHref} size="sm" magnetic={false} cta="nav">
              Book a call
            </Button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="ml-2 grid size-10 place-items-center rounded-full ring-1 ring-white/12 transition-colors duration-300 ease-swift hover:bg-white/5 md:hidden"
          >
            <span className="relative block h-3 w-4.5" aria-hidden="true">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-400 ease-swift",
                  open && "translate-y-[5.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-px w-full bg-ink transition-opacity duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-400 ease-swift",
                  open && "-translate-y-[5.5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: EASE } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-void/90 px-6 pb-10 pt-32 backdrop-blur-2xl"
          >
            <nav aria-label="Menu">
              <ul className="flex flex-col gap-2">
                {LINKS.map((link, i) => (
                  <li key={link.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0, transition: { delay: 0.08 + i * 0.07, duration: 0.6, ease: EASE } }}
                      exit={{ y: "110%", transition: { duration: 0.25, ease: EASE } }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "block font-display text-5xl font-medium tracking-tight transition-colors duration-300",
                          pathname.startsWith(link.href) ? "text-gradient-aurora" : "text-ink hover:text-aurora-teal",
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.5, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <Button href={ctaHref} size="lg" magnetic={false} className="w-full justify-between" cta="menu">
                Book a free AI strategy call
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
