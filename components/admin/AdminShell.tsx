"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChartLineUp,
  Tray,
  SquaresFour,
  Stack,
  UsersThree,
  Quotes,
  Tag,
  GearSix,
  Images,
  ArrowSquareOut,
  SignOut,
  List,
} from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/marketing/Wordmark";
import { cn } from "@/lib/utils/format";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: ChartLineUp, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Tray },
  { href: "/admin/projects", label: "Projects", icon: SquaresFour },
  { href: "/admin/services", label: "Services", icon: Stack },
  { href: "/admin/team", label: "Team", icon: UsersThree },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quotes },
  { href: "/admin/logos", label: "Logos & Tech", icon: Tag },
  { href: "/admin/settings", label: "Site Settings", icon: GearSix },
  { href: "/admin/media", label: "Media", icon: Images },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-1 px-3 py-4">
      {NAV.map((item) => {
        const active =
          "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active ? "bg-white/8 text-ink" : "text-ink-muted hover:bg-white/5 hover:text-ink",
            )}
          >
            <item.icon weight={active ? "fill" : "light"} className="size-4.5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-[100dvh] w-60 shrink-0 flex-col border-r border-white/8 bg-surface lg:flex">
        <div className="flex items-center gap-2 border-b border-white/8 px-6 py-5">
          <Wordmark name="MBT" asLink={false} className="text-lg" />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-faint">
            Admin
          </span>
        </div>
        {nav}
        <p className="mt-auto px-6 py-4 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint">
          IP data by{" "}
          <a href="https://ipinfo.io" target="_blank" rel="noopener noreferrer" className="underline">
            IPinfo
          </a>
        </p>
      </aside>

      {/* Mobile drawer */}
      <div className="lg:hidden">
        <button
          type="button"
          aria-label="Open admin menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="fixed bottom-4 left-4 z-50 grid size-12 place-items-center rounded-full bg-raised ring-1 ring-white/15"
        >
          <List className="size-5" aria-hidden="true" />
        </button>
        {open && (
          <div className="fixed inset-0 z-40 bg-void/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
            <div
              className="absolute bottom-20 left-4 w-64 rounded-2xl bg-raised ring-1 ring-white/12"
              onClick={(e) => e.stopPropagation()}
            >
              {nav}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function AdminTopBar({ email }: { email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/8 bg-void/85 px-5 py-3 backdrop-blur-md md:px-8">
      <p className="truncate font-mono text-xs text-ink-faint">{email}</p>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs text-ink-muted ring-1 ring-white/10 transition-colors hover:bg-white/5 hover:text-ink"
        >
          <ArrowSquareOut className="size-3.5" aria-hidden="true" /> View site
        </Link>
        <button
          type="button"
          onClick={logout}
          disabled={busy}
          className="inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs text-ink-muted ring-1 ring-white/10 transition-colors hover:bg-white/5 hover:text-ink disabled:opacity-50"
        >
          <SignOut className="size-3.5" aria-hidden="true" /> {busy ? "Signing out…" : "Log out"}
        </button>
      </div>
    </header>
  );
}
