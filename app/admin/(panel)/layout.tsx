import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { requireAdminPage } from "@/lib/admin/auth";
import { AdminNav, AdminTopBar } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const identity = await requireAdminPage();

  return (
    // Hard `dark` scope: the admin never theme-switches (DESIGN-SPEC-V2 §2)
    <div className="dark flex min-h-[100dvh] bg-void text-ink">
      <AdminNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar email={identity.email} />
        <main className="min-w-0 flex-1 px-5 py-6 md:px-8">{children}</main>
      </div>
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#111624", border: "1px solid rgba(255,255,255,0.1)", color: "#EEF2F8" } }} />
    </div>
  );
}
